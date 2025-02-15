import { Icon } from "@/components/skysolo-ui";
import useWebRTC from "@/lib/useWebRTC";
import { Avatar, useTheme } from "hyper-native-ui";
import React from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { RTCView } from "react-native-webrtc";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { useNavigation } from "@react-navigation/native";


const CallScreen = ({
	route
}: { route: any }) => {
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const { localStream, remoteStream, toggleCamera, switchCamera, stopStream, toggleMicrophone } = useWebRTC({
		session: session,
		remoteUser: route.params
	});


	return (
		<View style={{
			flex: 1,
			backgroundColor: "#000",
		}}>
			<StatusBar translucent backgroundColor={"transparent"} barStyle={"light-content"} />
			{remoteStream ? <View style={{
				position: "absolute",
				backgroundColor: "#000",
				borderRadius: 20,
				overflow: "hidden",
				width: "40%",
				height: "25%",
				right: 18,
				zIndex: 1000,
				top: Number(StatusBar.currentHeight) + 10
			}}>
				<RTCView style={{
					position: "absolute",
					backgroundColor: "#000",
					borderRadius: 20,
					overflow: "hidden",
					width: "100%",
					height: "100%",
					zIndex: 1000,
				}} streamURL={remoteStream?.toURL()} objectFit="cover" />
			</View> : <UserCameraEmpty />}
			{localStream ? (
				<RTCView
					mirror={true}
					objectFit={'cover'}
					style={{
						width: "100%",
						height: "100%",
						flex: 1,
						backgroundColor: "#fff"
					}}
					streamURL={localStream.toURL()}
					zOrder={0}
				/>
			) : <></>}
			<ActionBoxComponent
				endCall={stopStream}
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
	endCall
}: {
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	switchCamera: () => void;
	endCall: () => void;
}) => {
	console.log("ActionBoxComponent")
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
				backgroundColor: currentTheme.muted,
				marginBottom: 20,
				borderWidth: 0.5,
				borderColor: currentTheme.border,
				marginVertical: 10,
				width: "80%",
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
					<Icon iconName="Video" size={24} onPress={toggleCamera} />
				</TouchableOpacity>
				<TouchableOpacity onPress={switchCamera}
					activeOpacity={0.6} style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<Icon iconName="Volume2" size={24} onPress={switchCamera} />
				</TouchableOpacity>
				<TouchableOpacity onPress={toggleMicrophone} activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.background,
					borderWidth: 1,
					borderColor: currentTheme.border
				}}>
					<Icon iconName="MicOff" size={24} onPress={toggleMicrophone} />
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

const UserCameraEmpty = () => {
	const { currentTheme } = useTheme();
	return (
		<View style={{
			position: "absolute",
			backgroundColor: currentTheme.muted,
			borderRadius: 20,
			overflow: "hidden",
			width: "40%",
			height: "25%",
			right: 18,
			zIndex: 1000,
			top: Number(StatusBar.currentHeight) + 10,
			alignItems: "center",
			justifyContent: "center"
		}}>
			<Avatar size={120}
				src={"https://i0.wp.com/ovicio.com.br/wp-content/uploads/2024/05/20240502-ovicio-ciri-witcher.webp?resize=555%2C555&ssl=1"} />
		</View>
	)
}
