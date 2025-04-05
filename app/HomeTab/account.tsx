import React from "react";
import { StaticScreenProps } from "@react-navigation/native";
import ProfilePage from "@/components/profile/page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
type Props = StaticScreenProps<{
    id: string;
}>;
const AccountScreen = ({ route }: Props) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user, (prev, next) => prev === next);

    if (!session?.username) return <></>;
    return <ProfilePage username={session?.username} />
}
export default AccountScreen;