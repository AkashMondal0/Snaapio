import { useTheme } from "hyper-native-ui";
import { View } from "react-native";

const FeedItemLoader = ({ size }: { size?: number }) => {
    const { currentTheme } = useTheme();
    const background = currentTheme.input;
    return <View>
        {Array(size ?? 4).fill(0).map((_, i) =>
            <View key={i}
                style={{
                    width: "100%",
                    paddingVertical: 14,
                    paddingHorizontal: "2%",
                }}>
                {/* header */}
                <View style={{
                    marginHorizontal: "2%",
                    paddingVertical: 10,
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6
                }}>
                    <View
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 120,
                            backgroundColor: background
                        }}
                    />
                    <View style={{
                        gap: 5
                    }}>
                        <View
                            style={{
                                width: 180,
                                height: 14,
                                borderRadius: 50,
                                backgroundColor: background
                            }}
                        />
                        <View
                            style={{
                                width: 120,
                                height: 12,
                                borderRadius: 50,
                                backgroundColor: background
                            }}
                        />
                    </View>
                </View>
                {/* view image */}
                <View
                    style={{
                        aspectRatio: 4 / 5,
                        flex: 1,
                        padding: 4,
                        width: "100%",
                        height: "100%",
                        borderRadius: 16,
                        backgroundColor: background
                    }} />
                {/* action */}
                <View style={{
                    gap: 6,
                    marginHorizontal: "2%",
                    paddingVertical: 10
                }}>
                    <View style={{
                        width: 200,
                        height: 16,
                        borderRadius: 50,
                        backgroundColor: background
                    }} />
                    <View style={{
                        width: 120,
                        height: 14,
                        borderRadius: 50,
                        backgroundColor: background
                    }} />
                </View>
            </View>)}
    </View>
}

export default FeedItemLoader;