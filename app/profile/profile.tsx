import React from "react";
import { StaticScreenProps } from "@react-navigation/native";
import ProfilePage from "@/components/profile/page";
type Props = StaticScreenProps<{
    id: string;
}>;
const ProfileScreen = ({ route }: Props) => <ProfilePage username={route.params.id} />
export default ProfileScreen;