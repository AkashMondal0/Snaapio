import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { useTheme } from "hyper-native-ui";
import { View, StatusBar, ToastAndroid, TouchableOpacity } from "react-native";
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

const CallScreen = ({
	route
}: {
	route: {
		params: Session["user"] & {
			isVideo: boolean;
			userType: "REMOTE" | "LOCAL"
		} | null
	}
}) => {
	const remoteUserData = route?.params;
	const { socket } = useContext(SocketContext);
	const { currentTheme, themeScheme } = useTheme();
	const navigation = useNavigation();
	const loaded = useRef(true);
	const [isSwapped, setIsSwapped] = useState(true);
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

	const screenSwapping = () => {
		hapticVibrate();
		setIsSwapped((prev) => !prev);
	}

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
	}, [stopStream])

	const InitFunc = async () => {
		if (remoteUserData?.userType === "LOCAL" && loaded) {
			loaded.current = false;

			socket?.emit("send-call", {
				...session,
				status: "CALLING",
				stream: "video",
				remoteId: remoteUserData?.id
			})
		}
		if (remoteUserData?.userType === "REMOTE" && session && loaded) {
			loaded.current = false;
			socket?.emit("answer-call", {
				...session,
				status: "calling",
				stream: "video",
				call: "ACCEPT",
				remoteId: remoteUserData?.id
			})
		}
	}

	useEffect(() => { InitFunc(); }, [])

	if (callState === "DISCONNECTED") {
		return <CallDeclined remoteUserData={remoteUserData} stopStream={stopStream} />
	}

	return (
		<View style={{
			flex: 1,
			backgroundColor: currentTheme.accent,
		}}>
			{callState === "CONNECTED" ? <VideoCallCounter /> : <></>}
			<StatusBar translucent backgroundColor={"transparent"}
				barStyle={themeScheme === "dark" ? "light-content" : "dark-content"} />

			{isSwapped ?
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
					largeStreamActions={{ isCameraOn, isMuted }}
					currentTheme={currentTheme}
					screenSwapping={screenSwapping}
				/> :
				// remote
				<ScreenComponent StatusBarTop={StatusBar.currentHeight || 0}
					// remote user
					smallStream={remoteStream}
					smallStreamUser={remoteUserData}
					smallStreamActions={{ isCameraOn, isMuted }}
					// session is local user
					largeStream={localStream}
					largeStreamUser={session}
					currentTheme={currentTheme}
					largeStreamActions={{ isCameraOn, isMuted }}
					screenSwapping={screenSwapping} />}
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

const UserCameraEmpty = ({ remoteUserData }: { remoteUserData: Session["user"] }) => {
	const { currentTheme } = useTheme();
	return (
		<View style={{
			backgroundColor: currentTheme.muted,
			width: "100%",
			height: "100%",
			flex: 1,
			alignItems: "center",
			justifyContent: "center"
		}}>
			<Avatar url={remoteUserData?.profilePicture} size={220} />
		</View>
	)
}

const ScreenComponent = ({
	screenSwapping,
	StatusBarTop,
	currentTheme,
	largeStream,
	largeStreamUser,
	smallStream,
	smallStreamUser,
	smallStreamActions,
	largeStreamActions
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
		<>
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
				: <UserCameraEmpty remoteUserData={largeStreamUser} />}
		</>
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
					<Avatar url={smallStreamUser?.profilePicture} size={80} onPress={screenSwapping} />
				</View>}
		</TouchableOpacity>
	</>
}