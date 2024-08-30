import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { User } from '../../../../types/profile';
import Avatar from '../../../../components/shared/Avatar';

interface ProfileBottomSheetProps {
    UserData: User
}
const ProfileBottomSheet = ({ UserData }: ProfileBottomSheetProps) => {
    return (
        <View style={styles.container}>
            <Avatar size={100} 
            border
            url={UserData.profilePicture} 
            text={UserData.username} />
            <Text style={styles.name}>{UserData.username}</Text>
            <Text style={styles.bio}>{UserData.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    bio: {
        marginTop: 10,
        textAlign: 'center',
    },
});

export default ProfileBottomSheet;