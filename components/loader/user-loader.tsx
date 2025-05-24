import { useTheme } from "hyper-native-ui";
import React from "react"
import { View } from "react-native"


const UserItemLoader = ({ size }: { size?: number }) => {
	const { currentTheme } = useTheme();
	const background = currentTheme.input
	return <>
		{Array(size ?? 12).fill(0).map((_, i) => <View
			key={i}
			style={{
				flexDirection: 'row',
				padding: 12,
				alignItems: 'center',
				width: '100%',
				gap: 10,
				marginVertical: 2,
				justifyContent: 'space-between',
			}}>
			<View style={{
				display: 'flex',
				flexDirection: 'row',
				gap: 10,
				alignItems: 'center',
			}}>
				<View
					style={{
						width: 60,
						height: 60,
						borderRadius: 120,
						backgroundColor: background
					}} />
				<View style={{
					gap: 8,
				}}>
					<View style={{
						width: 120,
						height: 12,
						borderRadius: 120,
						backgroundColor: background
					}} />
					<View style={{
						width: 70,
						height: 10,
						borderRadius: 120,
						backgroundColor: background
					}} />
				</View>
			</View>
			<View style={{
				width: 80,
				height: 40,
				borderRadius: 10,
				backgroundColor: background
			}} />
		</View>)}
	</>
}

export default UserItemLoader;

type Props = {
  size?: number;
};

export const DiscoverUserItemLoader = ({ size = 6 }: Props) => {
 const { currentTheme } = useTheme();
  const background = currentTheme.input;

  return (
    <View style={{
		flex:1,
		flexDirection:"row",
		flexWrap:"wrap"
	}}>
      {Array(size)
        .fill(0)
        .map((_, i) => (
          <View
            key={i}
            style={{
              padding: 6,
              width: "50%",
            }}
          >
            <View
              style={{
                padding: 8,
                borderColor: currentTheme.border,
                borderWidth: 1,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: background,
                  }}
                />
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 80,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: background,
                      marginBottom: 6,
                    }}
                  />
                  <View
                    style={{
                      width: 60,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: background,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: 36,
                  backgroundColor: background,
                  borderRadius: 6,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
        ))}
    </View>
  )
};
