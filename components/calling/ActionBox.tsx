import { TouchableOpacity, View } from "react-native";
import { IconButtonWithoutThemed } from "../skysolo-ui/Icon";

const ActionBoxComponent = ({
	toggleCamera,
	toggleMicrophone,
	switchCamera,
	endCall,
	toggleSpeaker,
	isSpeakerOn,
	isCameraOn,
	isMuted,
	isFrontCam,
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
	isFrontCam: boolean
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
						backgroundColor: isFrontCam ? currentTheme.background : currentTheme.foreground,
						borderWidth: 1,
						borderColor: currentTheme.border
					}}>
					<IconButtonWithoutThemed
						iconName={isFrontCam ? "SwitchCamera" : "Camera"}
						size={24} onPress={switchCamera}
						color={!isFrontCam ? currentTheme.background : currentTheme.foreground} />
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

export default ActionBoxComponent;