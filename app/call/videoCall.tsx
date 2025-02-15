import { Avatar, Icon } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { useTheme } from "hyper-native-ui";
import React, { useEffect } from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { RTCView, RTCPIPView } from "react-native-webrtc";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Session } from "@/types";


const CallScreen = ({
	route
}: { route: any }) => {
	const remoteUserData = route.params
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	// const calling = useSelector((state: RootState) => state.CallState.callingAnswer);
	// const navigation = useNavigation();
	const { localStream, remoteStream, toggleCamera, switchCamera, stopStream, toggleMicrophone, isCameraOn, isMuted, createOffer } = useWebRTC({
		session: session,
		remoteUser: remoteUserData
	});

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
					height: "20%",
					right: 18,
					top: Number(StatusBar.currentHeight) + 10
				}}>
					<RTCView
						zOrder={1}
						style={{
							width: "100%",
							height: "100%",
						}}
						streamURL={localStream?.toURL()}
						objectFit="cover" />
				</View> : <></>}
			<ActionBoxComponent
				isCameraOn={isCameraOn}
				isMuted={isMuted}
				endCall={stopStream}
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
	isCameraOn,
	isMuted
}: {
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	switchCamera: () => void;
	endCall: () => void;
	isCameraOn: boolean;
	isMuted: boolean
}) => {
	const navigation = useNavigation();
	const { currentTheme } = useTheme();

	const hangUp = () => {
		endCall();
		if (navigation.canGoBack()) {
			navigation.goBack()
		}
	}
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
				backgroundColor: currentTheme.muted,
				marginBottom: 20,
				borderWidth: 0.5,
				borderColor: currentTheme.border,
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
				<TouchableOpacity onPress={toggleMicrophone} activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.background,
					borderWidth: 1,
					borderColor: currentTheme.border
				}}>
					<Icon iconName={isMuted ? "MicOff" : "Mic"} size={24} onPress={toggleMicrophone} />
				</TouchableOpacity>
				<TouchableOpacity onPress={hangUp} activeOpacity={0.6} style={[{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.destructive,
					transform: [{ rotate: "133deg" }],
					borderWidth: 1,
					borderColor: currentTheme.border
				}]}>
					<Icon iconName="Phone" size={24} onPress={hangUp} color="#fff" />
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
