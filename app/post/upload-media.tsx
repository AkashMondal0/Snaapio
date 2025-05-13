import React, { memo, useState } from "react";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StatusBar, useWindowDimensions, View } from "react-native";
import { useTheme } from 'hyper-native-ui';
import PostSelectScreen from "./post-selecting";
import ShortVideoSelectScreen from "./short-video-select";

type Props = {
	route: {
		path: string
		params: {
			id: string;
			section: string
		}
	}
}

const routes = [
	{ key: 'first', title: 'Photos' },
	{ key: 'second', title: 'Videos' },
];

const UploadMediaScreen = memo(function UploadMediaScreen({ route }: Props) {
	const { currentTheme } = useTheme();
	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);
	return (
		<View style={{
			flex: 1,
			width: '100%',
			height: '100%',
			marginTop:StatusBar.currentHeight
		}}>
			<TabView
				renderTabBar={(props) => (
					<TabBar
						{...props}
						labelStyle={{ fontSize: 16, textTransform: 'none', fontWeight: "500" }}
						indicatorStyle={{ backgroundColor: currentTheme?.foreground }}
						style={{ backgroundColor: currentTheme?.background }}
						activeColor={currentTheme?.foreground}
						inactiveColor={currentTheme?.foreground}
					/>
				)}
				navigationState={{ index, routes }}
				renderScene={SceneMap({
					first: PostSelectScreen,
					second: ShortVideoSelectScreen,
				})}
				sceneContainerStyle={{
					backgroundColor: currentTheme?.background,
				}}
				style={{
					backgroundColor: currentTheme?.background,
				}}

				pagerStyle={{
					backgroundColor: currentTheme?.background,
				}}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</View>
	)
})
export default UploadMediaScreen;