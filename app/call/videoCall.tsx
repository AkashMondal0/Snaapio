import useWebRTC from "@/lib/useWebRTC";
import { Button } from "hyper-native-ui";
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { RTCView } from "react-native-webrtc";


const CallScreen: React.FC = ({ }) => {
	const { localStream, remoteStream, startCall, endCall } = useWebRTC();

	return (
		<View style={styles.container}>
			<StatusBar translucent backgroundColor={"transparent"} barStyle={"light-content"} />
			{remoteStream ? (
				<RTCView style={{
					zIndex: 1000,
					backgroundColor: "#fff",
					width: 160,
					height: 240,
					position: "absolute",
					right: 10,
					borderRadius: 20,
					margin: 10,
					marginTop: 30 + 10 ?? 30
				}} streamURL={remoteStream.toURL()} objectFit="cover" />
			) : <View style={{
				zIndex: 1000,
				backgroundColor: "#fff",
				width: 160,
				height: 240,
				position: "absolute",
				right: 10,
				borderRadius: 20,
				margin: 10,
				marginTop: 30 + 10 ?? 30
			}}></View>}
			{localStream && (
				<RTCView style={styles.video} streamURL={localStream.toURL()} objectFit="cover" />
			)}
			<View style={styles.actionBox}>
				<Button onPress={startCall} variant="success" width={"80%"}>Start Call</Button>
				<Button onPress={endCall} variant="danger" width={"80%"}>End Call</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	video: {
		width: "100%",
		height: "100%",
		flex: 1
	},
	actionBox: {
		position: "absolute",
		bottom: 0,
		marginVertical: 10,
		width: "100%",
		gap: 10,
		alignItems: "center",
	},
});

export default CallScreen;