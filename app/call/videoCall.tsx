import React, { useCallback, useEffect, useRef } from "react";
import { Avatar } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { useTheme } from "hyper-native-ui";
import { View, StatusBar, TouchableOpacity, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Session } from "@/types";
import { incomingCallAnswerApi, sendCallingRequestApi } from "@/redux-stores/slice/call/api.service";
import { IconButtonWithoutThemed } from "@/components/skysolo-ui/Icon";
import { RootState } from "@/redux-stores/store";
import { RTCView } from "react-native-webrtc";

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
	const dispatch = useDispatch();
	const { currentTheme } = useTheme();
	const navigation = useNavigation();
	const loaded = useRef(true);
	const answerIncomingCall = useSelector((state: RootState) => state.CallState.callingAnswer);

	const {
		localStream,
		remoteStream,
		toggleCamera,
		switchCamera,
		stopStream,
		toggleMicrophone,
		isCameraOn, isMuted,
		createOffer,
		toggleSpeaker,
		isSpeakerOn
	} = useWebRTC({ remoteUser: remoteUserData });

	const hangUp = useCallback(async () => {
		if (!remoteUserData) { return ToastAndroid.show('user id not found', ToastAndroid.SHORT); }
		stopStream();
		await dispatch(sendCallingRequestApi({
			requestUserId: remoteUserData.id,
			requestUserData: remoteUserData,
			isVideo: false,
			status: "hangUp",
		}) as any);
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	}, [stopStream])

	const InitFunc = async () => {
		if (route.params?.userType === "REMOTE" && loaded) {
			loaded.current = false;
			// createOffer();
			await dispatch(incomingCallAnswerApi({
				acceptCall: true,
				requestSenderUserId: route.params?.id as string,
			}) as any)
		}
	}

	useEffect(() => {
		InitFunc();
		if (answerIncomingCall === "ACCEPT") {
			createOffer();
		}
		if (answerIncomingCall === "DECLINE") {
			stopStream();
			navigation.dispatch(StackActions.replace("CallDeclined", remoteUserData as any))
		}
	}, [remoteUserData, stopStream, createOffer, answerIncomingCall])


	return (
		<View style={{
			flex: 1,
			backgroundColor: currentTheme.accent,
		}}>
			<StatusBar translucent backgroundColor={"transparent"} barStyle={"light-content"} />
			{remoteStream ? (
				<RTCView
					mirror={true}
					objectFit={'cover'}
					style={{
						width: "100%",
						height: "100%",
						flex: 1,
					}}
					// @ts-ignore
					streamURL={remoteStream?.toURL()}
				/>
			) : <UserCameraEmpty remoteUserData={remoteUserData} />}

			{localStream ?
				<View style={{
					position: "absolute",
					backgroundColor: currentTheme.accent,
					borderRadius: 20,
					overflow: "hidden",
					width: "30%",
					right: 18,
					aspectRatio: 3 / 5,
					top: Number(StatusBar.currentHeight) + 10
				}}>
					<RTCView
						zOrder={1}
						style={{
							width: "100%",
							height: "100%",
						}}
						// @ts-ignore
						streamURL={localStream?.toURL()}
						objectFit="cover" />
				</View> : <></>}
			<ActionBoxComponent
				currentTheme={currentTheme}
				isCameraOn={isCameraOn}
				isMuted={isMuted}
				isSpeakerOn={isSpeakerOn}
				toggleSpeaker={toggleSpeaker}
				endCall={hangUp}
				toggleCamera={toggleCamera}
				switchCamera={switchCamera}
				toggleMicrophone={toggleMicrophone} />
		</View>
	);
};

export default CallScreen;

const ActionBoxComponent = ({
	toggleCamera,
	toggleMicrophone,
	switchCamera,
	endCall,
	toggleSpeaker,
	isSpeakerOn,
	isCameraOn,
	isMuted,
	currentTheme
}: {
	currentTheme: any,
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	switchCamera: () => void;
	endCall: () => void;
	toggleSpeaker: () => void,
	isSpeakerOn: boolean,
	isCameraOn: boolean;
	isMuted: boolean
}) => {

	return (
		<View style={{
			position: "absolute",
			bottom: 0,
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<View style={{
				padding: 14,
				borderRadius: 30,
				display: "flex",
				flexDirection: "row",
				gap: 12,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: currentTheme.accent,
				marginBottom: 20,
				borderWidth: 0.5,
				borderColor: currentTheme.input,
				marginVertical: 10,
			}}>
				{/* video */}
				<TouchableOpacity onPress={toggleCamera}
					activeOpacity={0.6}
					style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: isCameraOn ? currentTheme.background : currentTheme.foreground,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<IconButtonWithoutThemed
						iconName={isCameraOn ? "Video" : "VideoOff"}
						size={24} onPress={toggleCamera}
						color={!isCameraOn ? currentTheme.background : currentTheme.foreground} />
				</TouchableOpacity>
				{/* SwitchCamera */}
				<TouchableOpacity onPress={switchCamera}
					activeOpacity={0.6} style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<IconButtonWithoutThemed
						iconName="SwitchCamera"
						size={24} onPress={switchCamera}
						color={currentTheme.foreground} />
				</TouchableOpacity>
				{/* mic */}
				<TouchableOpacity onPress={toggleMicrophone} activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: !isMuted ? currentTheme.background : currentTheme.foreground,
					borderWidth: 1,
					borderColor: currentTheme.border
				}}>
					<IconButtonWithoutThemed
						iconName={isMuted ? "MicOff" : "Mic"}
						size={24} onPress={toggleMicrophone}
						color={isMuted ? currentTheme.background : currentTheme.foreground} />
				</TouchableOpacity>
				{/* end call */}
				<TouchableOpacity onPress={endCall} activeOpacity={0.6} style={[{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.destructive,
					transform: [{ rotate: "133deg" }],
					borderWidth: 1,
					borderColor: currentTheme.border
				}]}>
					<IconButtonWithoutThemed iconName="Phone" size={24}
						onPress={endCall}
						color={currentTheme.destructive_foreground} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

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
