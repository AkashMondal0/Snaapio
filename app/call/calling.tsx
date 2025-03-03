import { memo, useCallback } from "react";
import { Text, useTheme } from "hyper-native-ui";
import { Image, TouchableOpacity, View } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";

const Calling = memo(function Calling() {
	const { currentTheme } = useTheme();
	const navigation = useNavigation();
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const inComingCall = useSelector((state: RootState) => state.CallState.callStatus);
	// const userData = inComingCall?.participants?.filter((p) => p.user.id !== session?.id)[0];

	// const HP = useCallback(() => {
	// 	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
	// }, []);
	
	const Decline = useCallback(() => {
		// HP();
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}
		navigation.dispatch(StackActions.replace("HomeTabs"))
	}, []);

	return (
		<View style={{
			flex: 1,
			justifyContent: "space-between",
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
				<View>
					<TouchableOpacity
						activeOpacity={0.6}
						style={{
							padding: 15,
							borderRadius: 50,
							aspectRatio: 1 / 1,
							backgroundColor: currentTheme.muted
						}}>
						<Icon iconName="Minimize2" size={24} onPress={() => { }} />
					</TouchableOpacity>
				</View>
				<View style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1
				}}>
					<Text variant="H5" bold="bold">Akash ( Son )</Text>
					<Text variant="body1" variantColor="secondary">0:00</Text>
				</View>
				<View>
					<TouchableOpacity
						activeOpacity={0.6}
						style={{
							padding: 15,
							borderRadius: 50,
							aspectRatio: 1 / 1,
							backgroundColor: currentTheme.muted
						}}>
						<Icon iconName="UserPlus" size={24} onPress={() => { }} />
					</TouchableOpacity>
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
				padding: 14,
				borderRadius: 30,
				display: "flex",
				flexDirection: "row",
				gap: 12,
				alignItems: "center",
				backgroundColor: currentTheme.muted,
				marginBottom: 20
			}}>
				<TouchableOpacity
					activeOpacity={0.6}
					style={{
						padding: 15,
						borderRadius: 50,
						backgroundColor: currentTheme.background
					}}>
					<Icon iconName="Video" size={24} onPress={() => { }} />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.background
				}}>
					<Icon iconName="Volume2" size={24} onPress={() => { }} />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.6} style={{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.background
				}}>
					<Icon iconName="MicOff" size={24} onPress={() => { }} />
				</TouchableOpacity>
				<TouchableOpacity onPress={Decline} activeOpacity={0.6} style={[{
					padding: 15,
					borderRadius: 50,
					backgroundColor: currentTheme.destructive,
					transform: [{ rotate: "133deg" }]
				}]}>
					<Icon iconName="Phone" size={24} onPress={Decline} />
				</TouchableOpacity>
			</View>
		</View>
	)
})
export default Calling;