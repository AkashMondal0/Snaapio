import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StackActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { Avatar } from "@/components/skysolo-ui";
import { useTheme } from "hyper-native-ui";
import { useSelector } from "react-redux";
import { Session } from "@/types";
import { RootState } from "@/redux-stores/store";
import { RTCView } from "react-native-webrtc";
import { SocketContext } from "@/provider/SocketConnections";
import VideoCallCounter from "@/components/calling/videoCallCounter";
import ActionBoxComponent from "@/components/calling/ActionBox";
import { hapticVibrate } from "@/lib/RN-vibration";
import { Socket } from "socket.io-client";
import { IconButtonWithoutThemed } from "@/components/skysolo-ui/Icon";
import DraggableView from "@/components/calling/DraggableView";
import InCallManager from "react-native-incall-manager";
import {
	RTCPeerConnection,
	mediaDevices,
	RTCSessionDescription,
	RTCIceCandidate,
} from "react-native-webrtc";

const configuration = {
	iceServers: [{
		urls: [
			'stun:stun.l.google.com:19302',
			'stun:stun1.l.google.com:19302',
			'stun:stun2.l.google.com:19302',
			'stun:stun3.l.google.com:19302',
			'stun:stun4.l.google.com:19302'
		]
	}],
}

type ChannelData<T> = {
	type: "MICROPHONE" | "CAMERA" | "MESSAGE" | "INITIAL";
	value: T;
	remoteId: string;
};

type SocketRes<T> = {
	userId: string;
	members: string[];
	data: T;
};

const CallScreen = ({
	route
}: {
	route: {
		params: Session["user"] & {
			stream: "video" | "audio";
			userType: "REMOTE" | "LOCAL"
		} | null
	}
}) => {
	const remoteUserData = route?.params;
	const { socket } = useContext(SocketContext);
	const { currentTheme, themeScheme } = useTheme();
	const navigation = useNavigation();
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const [callState, setCallState] = useState<"CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE" | "ERROR">("IDLE");
	const localStream = useRef<MediaStream | null>(null);
	const remoteStream = useRef<MediaStream | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(new RTCPeerConnection(configuration));

	/// ------------- system camera ---------------

	const startLocalUserStream = async () => {
		try {
			const mediaStream = await mediaDevices.getUserMedia({
				audio: true,
				video: remoteUserData?.stream === "video"
			});

			mediaStream.getTracks().forEach((track) =>
				peerConnectionRef.current?.addTrack(track, mediaStream)
			);
			InCallManager.start({ auto: true });
			localStream.current = mediaStream;
			setCallState("PENDING")
		} catch (err) {
			console.error("❌ Error starting local stream:", err);
		}
	};

	// 📌 **Toggle Microphone**
	const toggleMicrophone = () => {
		if (localStream.current) {
			localStream.current?.getAudioTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			// setIsMuted((prev) => !prev);
			socket?.emit("call-action", {
				remoteId: remoteUserData?.id,
				type: "MICROPHONE",
				value: {
					isMuted: true
				},
			});
			hapticVibrate();
			// console.log("📌 Microphone toggled.");
		}
	};

	// 📌 **Toggle Camera**
	const toggleCamera = ({ isCameraOn, isFrontCam }: {
		isCameraOn: boolean;
		isFrontCam: "environment" | "user";
	}) => {
		if (localStream.current) {
			localStream.current?.getVideoTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			socket?.emit("call-action", {
				remoteId: remoteUserData?.id,
				type: "CAMERA",
				value: {
					isCameraOn: !isCameraOn
				},
			});
			// setIsCameraOn((prev) => !prev);
			hapticVibrate();
			// console.log("📌 Camera toggled.");
		}
	};

	// 📌 **Switch Front/Back Camera**
	const switchCamera = ({ isCameraOn, isFrontCam }: {
		isCameraOn: boolean;
		isFrontCam: "environment" | "user";
	}) => {
		if (!localStream || !isFrontCam || !isFrontCam) return console.error("📌 Camera switchCamera.");
		const videoTrack = localStream.current?.getVideoTracks()[0];
		videoTrack?.applyConstraints({ facingMode: isFrontCam });
		// setIsFrontCam((prev) => !prev);
		hapticVibrate()
	};

	//  📌 **AudioToSpeaker**
	const toggleSpeaker = (data: boolean) => {
		InCallManager.setSpeakerphoneOn(data); // Enable loudspeaker
		// setIsSpeakerOn((prev) => !prev);
	};

	// ------------------------ peer -----------------

	// 📌 **Create Offer**
	const createOffer = async () => {
		if (!session || !remoteUserData) return console.error("not found !session | !remoteUser")
		try {
			const offerDescription = await peerConnectionRef.current?.createOffer({
				OfferToReceiveAudio: true,
				OfferToReceiveVideo: true
			});
			if (!offerDescription) return;

			await peerConnectionRef.current?.setLocalDescription(offerDescription);
			socket?.emit("offer", {
				userId: session.id,
				remoteId: remoteUserData?.id,
				data: offerDescription,
			});

			// onCallState?.("PENDING");
			// console.log("📌 Offer created and sent.");
		} catch (err) {
			// onError?.("❌ Error creating offer:", err)
			console.error("❌ Error creating offer:", err);
		}
	};

	// 📌 **Create Answer**
	const createAnswer = async (res: SocketRes<RTCSessionDescription>) => {
		if (!session || !remoteUserData) return console.error("not found !session | !remoteUser")
		try {
			const remoteOffer = new RTCSessionDescription(res.data);
			await peerConnectionRef.current?.setRemoteDescription(remoteOffer);

			const answer = await peerConnectionRef.current?.createAnswer();
			await peerConnectionRef.current?.setLocalDescription(answer);

			socket?.emit("answer", {
				userId: session.id,
				remoteId: remoteUserData?.id,
				data: answer,
			});

			// console.log("📌 Answer created and sent.");
		} catch (err) {
			// onError?.("❌ Error creating answer:", err);
			console.error("❌ Error creating answer:", err);
		}
	};

	// 📌 **Handle Incoming ICE Candidate**
	const handleRemoteICECandidate = async (res: SocketRes<RTCIceCandidate>) => {
		if (!session || !remoteUserData) return console.error("not found !session | !remoteUser")
		try {
			if (!res.data) return;
			await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(res.data));
			setCallState("CONNECTED")
			//   // console.log("📌 Remote ICE candidate added.");
		} catch (err) {
			//   onError?.("❌ Error adding ICE candidate:", err);
			console.error("❌ Error adding ICE candidate:", err);
		}
	};

	// 📌 **Handle ICE Candidate Event**
	const handleICECandidateEvent = (event: any) => {
		if (!session || !remoteUserData) return console.error("not found !session | !remoteUser")
		if (event.candidate) {
			socket?.emit("candidate", {
				userId: session.id,
				remoteId: remoteUserData?.id,
				data: event.candidate,
			});
			// console.log("📌 ICE candidate sent.");
		}
	};

	const handleAnswer = (data: SocketRes<RTCSessionDescription>) => {
		peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.data))
	}

	// 📌 **Handle Remote Stream**
	const handleTrackEvent = (event: any) => {
		if (event.streams && event.streams[0]) {
			remoteStream.current = event.streams[0]
			if (event.streams[0]?.getVideoTracks()[0]?.enabled || event.streams[0]?.getAudioTracks()[0]?.enabled) {
				socket?.emit("call-action", {
					remoteId: remoteUserData?.id,
					type: "INITIAL",
					value: {
						isCameraOn: event.streams[0]?.getVideoTracks()[0]?.enabled,
						isMuted: true
					},
				});
			}
			// console.log("📌 Remote stream received.");
		}
	};

	// 📌 **Stop Stream & Cleanup**
	const stopStream = () => {
		localStream.current?.getTracks().forEach((track) => track.stop());
		remoteStream.current?.getTracks().forEach((track) => track.stop());
		InCallManager.stop();
		peerConnectionRef.current?.close();
		if (!session?.id || !remoteUserData?.id) return;
		socket?.emit("peerLeft", {
			id: session?.id,
			remoteId: remoteUserData?.id,
			data: null,
		});
	};

	const peerLeft = () => {
		navigation.dispatch(StackActions.replace("CallDeclined", { remoteUserData }))
	}

	const InitFunc = async () => {
		if (remoteUserData?.userType === "LOCAL") {
			socket?.emit("send-call", {
				id: session?.id,
				username: session?.username,
				email: session?.email,
				name: session?.name,
				profilePicture: session?.profilePicture,
				status: "CALLING",
				stream: remoteUserData?.stream,
				remoteId: remoteUserData?.id
			})
		}
		if (remoteUserData?.userType === "REMOTE" && session) {
			socket?.emit("answer-call", {
				id: session?.id,
				username: session?.username,
				email: session?.email,
				name: session?.name,
				profilePicture: session?.profilePicture,
				status: "CALLING",
				stream: remoteUserData?.stream,
				call: "ACCEPT",
				remoteId: remoteUserData?.id
			})
		}
	};

	const callAnswer = (data: any) => {
		if (data.call === "ACCEPT") {
			createOffer();
		}
		if (data.call === "DECLINE") {
			peerLeft()
		}
	}

	const hangUp = () => {
		socket?.emit("send-call", {
			...session,
			status: "HANGUP",
			stream: "video",
			remoteId: remoteUserData?.id
		})
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	}

	useEffect(() => {
		// socket
		socket?.on("offer", createAnswer);
		socket?.on("answer", handleAnswer);
		socket?.on("candidate", handleRemoteICECandidate);
		socket?.on("peerLeft", peerLeft);
		socket?.on("answer-call", callAnswer);
		// peerConnection
		peerConnectionRef.current?.addEventListener("track", handleTrackEvent);
		peerConnectionRef.current?.addEventListener("icecandidate", handleICECandidateEvent);

		return () => {
			socket?.off("offer", createAnswer);
			socket?.off("answer", handleAnswer);
			socket?.off("candidate", handleRemoteICECandidate);
			socket?.off("answer-call", callAnswer);
			socket?.off("peerLeft", peerLeft);
			peerConnectionRef.current?.removeEventListener("track", handleTrackEvent);
			peerConnectionRef.current?.removeEventListener("icecandidate", handleICECandidateEvent);
			// 
			stopStream()
		};
	}, []);

	useFocusEffect(
		useCallback(() => {
			InitFunc()
			startLocalUserStream();
			InCallManager.start({ media: "audio" });
			return () => {
				stopStream();
			};
		}, [])
	);

	return (
		<View style={{
			flex: 1,
			backgroundColor: currentTheme.background,
		}}>
			<VideoCallCounter name={remoteUserData?.name} start={callState === "CONNECTED"} />
			<StatusBar translucent backgroundColor={"transparent"}
				barStyle={themeScheme === "dark" ? "light-content" : "dark-content"} />
			<Components
				localStream={localStream.current}
				remoteStream={remoteStream.current}
				session={session}
				remoteUserData={remoteUserData}
				currentTheme={currentTheme}
				isCameraOn={true}
				isMuted={true}
				socket={socket}
				streamType={remoteUserData?.stream || "audio"}
			/>
			<ActionBoxComponent
				currentTheme={currentTheme}
				isCameraOn={true}
				isMuted={true}
				isSpeakerOn={true}
				isFrontCam={true}
				endCall={hangUp}
				toggleSpeaker={toggleSpeaker}
				toggleCamera={toggleCamera}
				switchCamera={switchCamera}
				toggleMicrophone={toggleMicrophone}
				streamType={remoteUserData?.stream || "audio"}
			/>
		</View>
	);
};

export default CallScreen;


const Components = ({
	localStream,
	remoteStream,
	session,
	remoteUserData,
	currentTheme,
	isCameraOn,
	isMuted,
	socket,
	streamType
}: {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	session: Session["user"];
	remoteUserData: Session["user"];
	currentTheme: any;
	isCameraOn: boolean;
	isMuted: boolean;
	socket: Socket | null;
	streamType: "audio" | "video";
}) => {
	const [isSwapped, setIsSwapped] = useState(true);
	const [remoteAction, setRemoteAction] = useState({
		isCameraOn: false,
		isMuted: false
	});

	const screenSwapping = () => {
		hapticVibrate();
		setIsSwapped((prev) => !prev);
	}
	useEffect(() => {
		socket?.on("call-action", (data: ChannelData<{ isCameraOn: boolean, isMuted: boolean }>) => {
			setRemoteAction((prev) => ({ ...prev, ...data.value }));
		});

		return () => {
			socket?.off("call-action");
		};
	}, []);


	return <>
		{
			isSwapped ?
				// local 
				<ScreenComponent
					streamType={streamType}
					StatusBarTop={StatusBar.currentHeight || 0}
					// session is local user
					smallStream={localStream}
					smallStreamUser={session}
					smallStreamActions={{ isCameraOn, isMuted }}
					// remote user
					largeStream={remoteStream}
					largeStreamUser={remoteUserData}
					largeStreamActions={remoteAction}
					currentTheme={currentTheme}
					screenSwapping={screenSwapping}
				/> :
				// remote
				<ScreenComponent StatusBarTop={StatusBar.currentHeight || 0}
					// remote user
					streamType={streamType}
					smallStream={remoteStream}
					smallStreamUser={remoteUserData}
					smallStreamActions={remoteAction}
					// session is local user
					largeStream={localStream}
					largeStreamUser={session}
					currentTheme={currentTheme}
					largeStreamActions={{ isCameraOn, isMuted }}
					screenSwapping={screenSwapping} />
		}
	</>
};

const ScreenComponent = ({
	screenSwapping,
	StatusBarTop,
	currentTheme,
	largeStream,
	largeStreamUser,
	smallStream,
	smallStreamUser,
	smallStreamActions,
	largeStreamActions,
	streamType
}: {
	largeStream: MediaStream | null;
	smallStream: MediaStream | null;
	smallStreamUser: Session["user"];
	largeStreamUser: Session["user"];
	screenSwapping: () => void;
	currentTheme: any;
	StatusBarTop: number;
	smallStreamActions: { isCameraOn: boolean, isMuted: boolean };
	largeStreamActions: { isCameraOn: boolean, isMuted: boolean };
	streamType: "audio" | "video";
}) => {
	return <View style={{
		flex: 1
	}}>
		<TouchableOpacity
			activeOpacity={1}
			// onPress={onPress}
			style={{
				backgroundColor: currentTheme.muted,
				width: "100%",
				height: "100%",
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 10
			}}>
			{largeStream && largeStreamActions.isCameraOn ? <RTCView
				mirror={true}
				objectFit={'cover'}
				style={{
					width: "100%",
					height: "100%",
					flex: 1,
				}}
				// @ts-ignore
				streamURL={largeStream?.toURL()}
			/>
				: <Avatar url={largeStreamUser?.profilePicture} size={220} isBorder borderWidth={2.4} />}
			{largeStreamActions.isMuted ? <View style={{
				backgroundColor: 'rgba(0,0,0,0.5)',
				padding: 10,
				borderRadius: 50,
				position: "absolute",
			}}>
				<IconButtonWithoutThemed
					iconName={"MicOff"}
					size={30}
					color={"#fff"} />
			</View> : <></>}
		</TouchableOpacity>
		{/* small */}
		<DraggableView position="topRight">
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={screenSwapping}
				style={{
					position: "absolute",
					backgroundColor: currentTheme.accent,
					borderRadius: 20,
					overflow: "hidden",
					width: "80%",
					aspectRatio: 3 / 5,
					right: 2,
					borderWidth: 6,
					borderColor: "#fff",
					top: Number(StatusBarTop) + 2,
					display: streamType === "audio" ? "none" : "flex"
				}}>
				{smallStream && smallStreamActions.isCameraOn ? <RTCView
					zOrder={1}
					style={{
						width: "100%",
						height: "100%"
					}}
					mirror={true}
					// @ts-ignore
					streamURL={smallStream?.toURL()}
					objectFit="cover" /> :
					<View style={{
						backgroundColor: currentTheme.accent,
						width: "100%",
						height: "100%",
						flex: 1,
						alignItems: "center",
						justifyContent: "center"
					}} >
						<Avatar
							url={smallStreamUser?.profilePicture}
							size={80} onPress={screenSwapping} />
					</View>
				}
				<View
					style={{
						padding: 10,
						justifyContent: "flex-end",
						alignItems: "center",
						width: "100%",
						height: "100%",
						flex: 1,
						position: "absolute",
					}}>
					{smallStreamActions.isMuted ?
						<IconButtonWithoutThemed
							iconName={"MicOff"}
							size={30}
							color={"#fff"} />
						: <></>}
				</View>
			</TouchableOpacity>
		</DraggableView>

	</View>
};