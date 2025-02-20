import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, StatusBar, ToastAndroid, TouchableOpacity } from "react-native";
import { Avatar } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { useTheme } from "hyper-native-ui";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@/types";
import { RootState } from "@/redux-stores/store";
import { RTCView } from "react-native-webrtc";
import { SocketContext } from "@/provider/SocketConnections";
import VideoCallCounter from "@/components/calling/videoCallCounter";
import ActionBoxComponent from "@/components/calling/ActionBox";
import CallDeclined from "./callDeclined";
import { hapticVibrate } from "@/lib/RN-vibration";
import { Socket } from "socket.io-client";
import { IconButtonWithoutThemed } from "@/components/skysolo-ui/Icon";
type ChannelData<T> = {
	type: "MICROPHONE" | "CAMERA" | "MESSAGE" | "INITIAL";
	value: T;
	remoteId: string;
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
	const loaded = useRef(true);
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const [callState, setCallState] = useState<"CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE" | "ERROR">("IDLE");
	const {
		localStream,
		remoteStream,
		toggleCamera,
		switchCamera,
		stopStream,
		toggleMicrophone,
		isCameraOn,
		isMuted,
		toggleSpeaker,
		isSpeakerOn,
		isFrontCam
	} = useWebRTC({
		remoteUser: remoteUserData,
		session: session,
		socket: socket,
		onCallState(value) {
			setCallState(value);
		},
	});

	const hangUp = useCallback(async () => {
		if (!remoteUserData) { return ToastAndroid.show('user id not found', ToastAndroid.SHORT); }
		stopStream();
		socket?.emit("send-call", {
			...session,
			status: "HANGUP",
			stream: "video",
			remoteId: remoteUserData?.id
		})
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	}, [stopStream]);

	const InitFunc = async () => {
		if (remoteUserData?.userType === "LOCAL" && loaded) {
			loaded.current = false;

			socket?.emit("send-call", {
				id: session?.id,
				username: session?.username,
				email: session?.email,
				name: session?.name,
				profilePicture: session?.profilePicture,
				status: "CALLING",
				stream: "video",
				remoteId: remoteUserData?.id
			})
		}
		if (remoteUserData?.userType === "REMOTE" && session && loaded) {
			loaded.current = false;
			socket?.emit("answer-call", {
				id: session?.id,
				username: session?.username,
				email: session?.email,
				name: session?.name,
				profilePicture: session?.profilePicture,
				status: "calling",
				stream: "video",
				call: "ACCEPT",
				remoteId: remoteUserData?.id
			})
		}
	};

	useEffect(() => { InitFunc(); }, []);

	if (callState === "DISCONNECTED") {
		return <CallDeclined remoteUserData={remoteUserData} stopStream={stopStream} />
	}

	return (
		<View style={{
			flex: 1,
			backgroundColor: currentTheme.background,
		}}>
			{callState === "CONNECTED" ? <VideoCallCounter name={remoteUserData?.name} /> : <></>}
			<StatusBar translucent backgroundColor={"transparent"}
				barStyle={themeScheme === "dark" ? "light-content" : "dark-content"} />
			<Components
				localStream={localStream}
				remoteStream={remoteStream}
				session={session}
				remoteUserData={remoteUserData}
				currentTheme={currentTheme}
				isCameraOn={isCameraOn}
				isMuted={isMuted}
				socket={socket}
			/>
			<ActionBoxComponent
				currentTheme={currentTheme}
				isCameraOn={isCameraOn}
				isMuted={isMuted}
				isSpeakerOn={isSpeakerOn}
				isFrontCam={isFrontCam}
				toggleSpeaker={toggleSpeaker}
				endCall={hangUp}
				toggleCamera={toggleCamera}
				switchCamera={switchCamera}
				toggleMicrophone={toggleMicrophone} />
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
}: {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	session: Session["user"];
	remoteUserData: Session["user"];
	currentTheme: any;
	isCameraOn: boolean;
	isMuted: boolean;
	socket: Socket | null;
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
}) => {
	return <>
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
				// mirror={true}
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
					color={"white"} />
			</View> : <></>}
		</TouchableOpacity>
		{/* small */}
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={screenSwapping}
			style={{
				position: "absolute",
				backgroundColor: currentTheme.accent,
				borderRadius: 20,
				overflow: "hidden",
				width: "30%",
				right: 10,
				aspectRatio: 2.5 / 4,
				borderWidth: 6,
				borderColor: currentTheme.background,
				top: Number(StatusBarTop) + 2
			}}>
			{smallStream && smallStreamActions.isCameraOn ? <RTCView
				zOrder={1}
				style={{
					width: "100%",
					height: "100%",
				}}
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
				</View>}
			<TouchableOpacity
				onPress={screenSwapping}
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
						color={currentTheme.foreground} />
					: <></>}
			</TouchableOpacity>
		</TouchableOpacity>
	</>
};