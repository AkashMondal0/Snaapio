import React, { useCallback, useEffect } from "react";
import { Avatar, Icon } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { useTheme } from "hyper-native-ui";
import { View, StatusBar, TouchableOpacity, ToastAndroid } from "react-native";
import { RTCView } from "react-native-webrtc";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Session } from "@/types";
import { sendCallingRequestApi } from "@/redux-stores/slice/call/api.service";


const CallScreen = ({
	route
}: { route: any }) => {
	const remoteUserData = route.params;
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const remoteUserCallAnswer = useSelector((state: RootState) => state.CallState.callingAnswer);

	const { localStream, remoteStream,
		toggleCamera, switchCamera,
		stopStream, toggleMicrophone,
		isCameraOn, isMuted, createOffer, toggleSpeaker, isSpeakerOn } = useWebRTC({
			session: session,
			remoteUser: remoteUserData
		});
	const exit = () => {
		stopStream();
		if (navigation.canGoBack()) {
			navigation.goBack()
		}
	}

	const hangUp = useCallback(async () => {
		if (!remoteUserData) return ToastAndroid.show('user id not found', ToastAndroid.SHORT);
		await dispatch(sendCallingRequestApi({
			requestUserId: remoteUserData.id,
			requestUserData: remoteUserData,
			isVideo: false,
			status: "hangUp",
		}) as any);
		exit()
	}, [])

	useEffect(() => {
		console.log("remoteUserCallAnswer",remoteUserCallAnswer)
		if (remoteUserCallAnswer === "ACCEPT") {
			createOffer();
		}
		if (remoteUserCallAnswer === "DECLINE") {
			// exit();
		}
	}, [remoteUserCallAnswer])

	return (
		<View style={{
			flex: 1,
			backgroundColor: "#000",
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
					backgroundColor: "#000",
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
				isCameraOn={isCameraOn}
				isMuted={isMuted}
				isSpeakerOn={isSpeakerOn}
				toggleSpeaker={toggleSpeaker}
				endCall={hangUp}
				toggleCamera={toggleCamera}
				switchCamera={createOffer}
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
	isMuted
}: {
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	switchCamera: () => void;
	endCall: () => void;
	toggleSpeaker: () => void,
	isSpeakerOn: boolean,
	isCameraOn: boolean;
	isMuted: boolean
}) => {
	const { currentTheme } = useTheme();

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
				<TouchableOpacity onPress={toggleCamera}
					activeOpacity={0.6}
					style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<Icon iconName={isCameraOn ? "Video" : "VideoOff"} size={24} onPress={toggleCamera} />
				</TouchableOpacity>
				<TouchableOpacity onPress={switchCamera}
					activeOpacity={0.6} style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<Icon iconName="SwitchCamera" size={24} onPress={switchCamera} />
				</TouchableOpacity>
				{/* <TouchableOpacity onPress={toggleSpeaker}
					activeOpacity={0.6} style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<Icon iconName="Volume2" size={24} onPress={toggleSpeaker } />
				</TouchableOpacity> */}
				<TouchableOpacity onPress={toggleMicrophone} activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.background,
					borderWidth: 1,
					borderColor: currentTheme.border
				}}>
					<Icon iconName={isMuted ? "MicOff" : "Mic"} size={24} onPress={toggleMicrophone} />
				</TouchableOpacity>
				<TouchableOpacity onPress={endCall} activeOpacity={0.6} style={[{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.destructive,
					transform: [{ rotate: "133deg" }],
					borderWidth: 1,
					borderColor: currentTheme.border
				}]}>
					<Icon iconName="Phone" size={24} onPress={endCall} color="#fff" />
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
