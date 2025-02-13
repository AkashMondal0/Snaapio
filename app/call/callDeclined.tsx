import { memo, useCallback } from "react";
import { Text, useTheme } from "hyper-native-ui";
import { Image, TouchableOpacity, View } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import * as Haptics from 'expo-haptics';
const InComingCall = memo(function InComingCall() {
	const { currentTheme } = useTheme();
	const hp = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
					<Text variant="H4" bold="bold">Akash ( Son )</Text>
					<Text variant="body1" variantColor="secondary">Call Decline</Text>
				</View>
			</View>
			{/* center */}
			<View>
				<Image
					source={{ uri: "https://www.slashfilm.com/img/gallery/why-people-thought-ciri-was-recast-in-the-witcher-season-2/a-more-rugged-battle-hardened-ciri-1686416930.jpg" }}
					style={{
						width: 220,
						aspectRatio: 1 / 1,
						borderRadius: 500,
						marginBottom: 30,
					}}
				/>
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
					<TouchableOpacity onPress={hp}
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
						<Icon iconName="Plus" size={40} color={currentTheme.background} onPress={hp}/>
					</TouchableOpacity>
					<Text variant="body1" center variantColor="secondary">Decline</Text>
				</View>
				<View>
					<TouchableOpacity
						onPress={hp}
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
						<Icon iconName="MessageSquareText" size={24} onPress={hp} />
					</TouchableOpacity>
					<Text variant="body1" center variantColor="secondary">Message</Text>
				</View>
			</View>
		</View>
	)
})
export default InComingCall;