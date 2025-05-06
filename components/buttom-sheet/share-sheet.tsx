import React, { useMemo } from "react";
import { useTheme, PressableButton, Text } from "hyper-native-ui";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setShareSheetData } from "@/redux-stores/slice/dialog";
import { RootState } from "@/redux-stores/store";
import { Icon } from "../skysolo-ui";
import { ToastAndroid, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { configs } from "@/configs";
const Share_Sheet = ({
	sheetRef,
}: {
	sheetRef: any
}) => {
	const { currentTheme } = useTheme();
	const data = useSelector((state: RootState) => state.DialogsState.shareSheetData);
	const snapPoints = useMemo(() => ["25%"], []);
	const dispatch = useDispatch();

	const handleShare = async () => {
		if (!data?.id) return;
		const url = `${configs.AppDetails.appUrl}/post/${data.id}`;
		await Clipboard.setStringAsync(url);
		ToastAndroid.show("Copied", ToastAndroid.SHORT);
	};

	return (
		<>
			<BottomSheet
				ref={sheetRef as any}
				index={-1}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				// onChange={handleSheetChange}
				enablePanDownToClose
				enableOverDrag
				enableContentPanningGesture
				enableHandlePanningGesture
				onClose={() => { dispatch(setShareSheetData(null)); }}
				handleIndicatorStyle={{
					backgroundColor: currentTheme?.primary,
				}}
				backgroundStyle={{
					borderTopRightRadius: 30,
					borderTopLeftRadius: 30,
					backgroundColor: currentTheme?.secondary,
				}}
				style={{
					elevation: 10,
					flex: 1
				}}
			>
				<BottomSheetScrollView style={{
					flex: 1,
				}}>
					<View style={{
						flexDirection: 'row',       // Arrange buttons in a row
						justifyContent: 'center',   // Center the buttons horizontally
						alignItems: 'center',       // Align them vertically
						marginVertical: 14,
						width: "100%",
						flex: 1,
						display: "flex",
						gap: 16,                    // Add space between buttons (RN 0.71+)
					}}>
						<View>
							<PressableButton style={{ padding: 10, borderRadius: 100, }}
								// disabled={loading}
								onPress={handleShare}
								radius={100}
							>
								<Icon
									iconName={'Link2'}
									// disabled={loading}
									onPress={handleShare}
									size={34}
								/>
							</PressableButton>
							<Text variant="overline" center>Copy Link</Text>
						</View>
						<View>
							<PressableButton style={{ padding: 10, borderRadius: 100, }}
								// disabled={loading}
								onPress={handleShare}
								radius={100}
							>
								<Icon
									iconName={'Share'}
									size={34}
									style={{}}
									// disabled={loading}
									onPress={handleShare}
								/>
							</PressableButton>
							<Text variant="overline" center>Share</Text>
						</View>
						<View>
							<PressableButton style={{ padding: 10, borderRadius: 100, }}
								// disabled={loading}
								onPress={handleShare}
								radius={100}
							>
								<Icon
									iconName={'Forward'}
									size={34}
									// disabled={loading}
									onPress={handleShare}
								/>
							</PressableButton>
							<Text variant="overline" center>Send</Text>
						</View>
					</View>
				</BottomSheetScrollView>
			</BottomSheet>
		</>
	);
};
export default Share_Sheet;