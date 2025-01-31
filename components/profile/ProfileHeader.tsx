import React, { memo, useState } from "react";
import { View } from "react-native";
import { User } from "@/types";
import ProfileInfoCount from "./ProfileInfoCount";
import ProfileActionsButton from "./ProfileActionsButton";
import ProfileStories from "./ProfileStories";
import ProfilePicView from "./ProfilePicView";
import { Separator, Text } from "hyper-native-ui";

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