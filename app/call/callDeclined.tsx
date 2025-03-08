import { memo, useCallback } from "react";
import { Text, useTheme } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@/types";

const CallDeclined = memo(function CallDeclined({
	route
}: {
	route: {
		params: {
			remoteUserData: Session["user"] & {
				stream: "video" | "audio";
				userType: "REMOTE" | "LOCAL"
			} | null
		}
	}
}) {
	const remoteUserData = route.params.remoteUserData;
	const navigation = useNavigation();
	const { currentTheme } = useTheme();

	const Back = useCallback(() => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}
	}, []);

	return (
		<View style={{
			flex: 1,
			justifyContent: "space-around",
			alignItems: "center",
		}}>
			{/* top */}
			<View style={{
				display: "flex",
				flexDirection: "row",
				height: 100,
				alignItems: "center",
				justifyContent: "space-between",
				paddingHorizontal: 16
			}}>
				<View style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1
				}}>
					<Text variant="H4" bold="bold">{remoteUserData?.name}</Text>
					<Text variant="body1" variantColor="secondary">Call Decline</Text>
				</View>
			</View>
			{/* center */}
			<View>
				<View>
					<Avatar
						size={220}
						url={remoteUserData?.profilePicture}
						style={{
							aspectRatio: 1 / 1,
							borderRadius: 500,
							marginBottom: 30,
						}}
					/>
				</View>
			</View>
			{/* end */}
			<View style={{
				width: "100%",
				borderRadius: 30,
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-around",
				paddingHorizontal: "6%",
			}}>
				<View>
					<TouchableOpacity onPress={Back}
						activeOpacity={0.6}
						style={{
							aspectRatio: 1 / 1,
							width: 60,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 50,
							backgroundColor: currentTheme.foreground,
							marginBottom: 2,
							transform: [{ rotate: "133deg" }]
						}}>
						<Icon iconName="Plus" size={40} color={currentTheme.background} onPress={Back} />
					</TouchableOpacity>
					<Text variant="body1" center variantColor="secondary">Decline</Text>
				</View>
				<View>
					<TouchableOpacity
						// onPress={hp}
						activeOpacity={0.6}
						style={{
							aspectRatio: 1 / 1,
							width: 60,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 50,
							backgroundColor: currentTheme.muted,
							marginBottom: 2
						}}>
						<Icon iconName="MessageSquareText" size={24} />
					</TouchableOpacity>
					<Text variant="body1" center variantColor="secondary">Message</Text>
				</View>
			</View>
		</View>
	)
})
export default CallDeclined;