import React, { memo, useState } from "react";
import { View } from "react-native";
import { User } from "@/types";
import ProfileInfoCount from "./ProfileInfoCount";
import ProfileActionsButton from "./ProfileActionsButton";
import ProfileStories, { StoryLoader } from "./ProfileStories";
import ProfilePicView from "./ProfilePicView";
import { Separator, Skeleton, Text, useTheme } from "hyper-native-ui";

const ProfileHeader = memo(function HomeScreen({
    userData,
    isProfile
}: {
    userData: User | null,
    isProfile: boolean
}) {
    const [user, setUser] = useState<User | null>(userData)
    const handleFollow = () => {
        if (!user) return
        setUser({
            ...user,
            followerCount: user.followerCount + 1,
            friendship: {
                ...user.friendship,
                following: true,
                followed_by: user.friendship?.followed_by
            }
        })
    }

    const handleUnFollow = () => {
        if (!user) return
        setUser({
            ...user,
            followerCount: user.followerCount - 1,
            friendship: {
                ...user.friendship,
                following: false,
                followed_by: user.friendship?.followed_by
            }
        })
    }

    return (
        <>
            <View style={{
                width: '100%',
                padding: "3.2%",
            }}>
                <View style={{
                    height: 10,
                }} />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: '100%',
                    marginBottom: 8,
                }}>
                    <ProfilePicView user={user} />
                    <ProfileInfoCount userData={user} />
                </View>
                <Text
                    variant="H6"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontWeight: "600",
                        marginVertical: 4,
                        width: '80%'
                    }}>
                    {user?.name}
                </Text>
                <Text
                    numberOfLines={6}
                    ellipsizeMode="tail"
                    variantColor='secondary'
                    lineBreakMode="tail"
                    style={{ fontWeight: "400" }}>
                    {user?.bio}
                </Text>
                <ProfileActionsButton
                    handleFollow={handleFollow}
                    handleUnFollow={handleUnFollow}
                    userData={user}
                    isProfile={isProfile} />
            </View>
            <ProfileStories isProfile={isProfile} user={user} />
            <View style={{ height: 14 }} />
            <Separator value={0.8} />
        </>
    )

}, (prevProps, nextProps) => {
    return prevProps.userData?.id === nextProps.userData?.id
})
export default ProfileHeader;



export const ProfileHeaderLoader = () => {
    const { currentTheme } = useTheme();
    return (<>
        <View style={{
            width: '100%',
            padding: "3.2%",
        }}>
            <View style={{
                height: 10,
            }} />
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: '100%',
                marginBottom: 8,
            }}>
                <View style={{
                    width: 120,
                    height: 120,
                    aspectRatio: 1,
                    borderRadius: 100,
                    backgroundColor: currentTheme.muted
                }} />
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10
                }}>
                    {Array(3).fill(0).map((item, index) => (
                        <View key={index} style={{ alignItems: 'center' }}>
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 10,
                                backgroundColor: currentTheme.muted
                            }} />
                        </View>
                    ))}
                </View>
            </View>
            <View style={{
                gap: 6,
                marginTop: 20
            }}>
                <View style={{
                    width: 230,
                    height: 12,
                    borderRadius: 10,
                    backgroundColor: currentTheme.muted
                }} />
                <View style={{
                    width: 100,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: currentTheme.muted
                }} />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 30,
                gap: 10,
            }}>
                <View
                    style={{
                        width: "49%",
                        height: 40,
                        borderRadius: 10,
                        flex: 1,
                        backgroundColor: currentTheme.muted
                    }}
                />
                <View
                    style={{
                        width: "49%",
                        height: 40,
                        borderRadius: 10,
                        flex: 1,
                        backgroundColor: currentTheme.muted
                    }} />
            </View>
            <StoryLoader/>
        </View>
    </>)
}