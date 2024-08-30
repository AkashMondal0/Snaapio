import React, { useCallback, useContext } from 'react'
import { View, Text, ScrollView, ToastAndroid, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ChevronRight, UserRoundPlus, Users, UsersRound, XCircle } from 'lucide-react-native';
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import UserCard from './components/User-Card';
import { RootState } from '../../../../redux/store';
import { fetchSearchUser } from '../../../../redux/apis/user';
import { User } from '../../../../types/profile';
import Padding from '../../../../components/shared/Padding';
import MyInput from '../../../../components/shared/Input';
import SingleCard from '../../../../components/shared/Single-Card';
import MultipleCard from '../../../../components/shared/Multiple-card';
import { PrivateChat } from '../../../../types/private-chat';
import uid from '../../../../utils/uuid';
import Avatar from '../../../../components/shared/Avatar';
import FloatingButton from '../../../../components/shared/Floating';
import { AnimatedContext } from '../../../../provider/Animated_Provider';
import Header from './components/header';
import MyButton from '../../../../components/shared/Button';

export default function NewMessageScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const AnimatedState = useContext(AnimatedContext)
    const { user } = useSelector((state: RootState) => state.profile)
    const { List } = useSelector((state: RootState) => state.privateChat)
    const { searchUser: searchResult } = useSelector((state: RootState) => state.users)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const [addToListUser, setAddToListUser] = React.useState<User[]>([])

    const Color = useTheme.color;
    const iconColor = useTheme.iconColor;

    const { control, watch, formState: { errors } } = useForm({
        defaultValues: {
            search: '',
        }
    });

    const handleSearch = useCallback((search: string) => {
        if (search.trim().length > 0) {
            dispatch(fetchSearchUser(search) as any)
        }
    }, []);

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    const CreateConnectionUser = useCallback(async (receiverData: User) => {
        const getChat = List.find((item) => item.users?.find((item) => item === receiverData._id))

        if (getChat) {
            navigation.navigate('Chat', {
                userId: getChat?.userDetails?._id,
                newChat: false,
                chatDetails: getChat,
                userDetail: receiverData,
            })
        } else {
            try {

                const createNewConversation: PrivateChat = {
                    _id: '',
                    users: [user?._id, receiverData._id] as any,
                    lastMessageContent: '',
                    messages: [],
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    typing: false,
                }
                navigation.navigate('Chat', {
                    chatId: uid(),
                    userDetail: receiverData,
                    chatDetails: createNewConversation,
                    newChat: true
                })
            } catch (error: any) {
                ToastAndroid.show(error.response.data, ToastAndroid.SHORT)
            }
        }

    }, []);

    const AddToUserGroup = useCallback((item: User) => {
        if (addToListUser.find((i) => i._id === item._id)) {
            setAddToListUser(addToListUser.filter((i) => i._id !== item._id))
        } else {
            setAddToListUser([...addToListUser, item])
        }
    }, []);

    const CrateNewGroup = useCallback(() => {
        navigation.navigate('NewGroup', {
            users: addToListUser,
            groupId: uid(),
        })
    }, [addToListUser]);


    return (
        <>
            <Header theme={useTheme}
                label='Message'
                AnimatedState={AnimatedState}
                navigation={navigation} items={<>
                    {addToListUser.length <= 0 ? <></> : <MyButton variant="info"
                        radius={10}
                        onPress={CrateNewGroup}
                        theme={useTheme} title='Crate' />}
                </>} />
            <ScrollView>
                <Padding size={10} />

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    marginHorizontal: 10,
                }}>
                    <MyInput
                        debouncedHandleSearch={debouncedHandleSearch}
                        control={control}
                        secondaryText='To:'
                        height={45}
                        placeholder='Search'
                        name='search'
                        theme={useTheme} />
                    <FlatList
                        data={addToListUser}
                        horizontal
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => {
                            return <View>
                                <TouchableOpacity
                                    onPress={() => setAddToListUser(addToListUser.filter((i) => i._id !== item._id))}
                                    style={{
                                        position: "absolute",
                                        zIndex: 100,
                                        backgroundColor: useTheme.background,
                                        borderRadius: 20 / 2,
                                        alignSelf: "flex-end",
                                        right: 5,
                                        top: 5,
                                    }}>
                                    <XCircle color={useTheme.DangerButtonColor} />
                                </TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between', padding: 10, backgroundColor: useTheme.background, borderRadius: 10
                                }}>
                                    <View>
                                        <Avatar size={60} url={item.profilePicture} text={item.username} />
                                        <Text style={{ color: useTheme.textColor, fontSize: 16, alignSelf: "center" }}>{item.username}</Text>
                                    </View>
                                </View>
                            </View>
                        }}
                    />
                    {/* {watch("search").length <= 0 || addToListUser.length <= 0 ? <>
                        <SingleCard
                            label={'Add a Friend'}
                            iconBackgroundColor={useTheme.primary}
                            icon={<UserRoundPlus color={Color} />}
                            secondaryIcon={<ChevronRight color={iconColor} />} />

                        <SingleCard
                            onPress={() => { }}
                            label={'New Group'}
                            iconBackgroundColor={useTheme.selectedItemColor}
                            icon={<Users color={Color} />}
                            secondaryIcon={<ChevronRight color={iconColor} />} />
                    </> : <></>} */}


                    <View style={{ width: "100%" }}>
                        <Text style={{
                            color: useTheme.textColor,
                            fontSize: 14,
                            fontWeight: '600',
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                        }}>Suggested</Text>
                    </View>
                    <MultipleCard theme={useTheme}>
                        {searchResult.filter((item) => item._id !== user?._id)
                            .map((item, index) => (
                                <UserCard
                                    key={index}
                                    theme={useTheme}
                                    user={item}
                                    avatarUrl={item.profilePicture}
                                    onPress={() => {
                                        if (addToListUser.length <= 0) {
                                            CreateConnectionUser(item)
                                        } else {
                                            AddToUserGroup(item)
                                        }
                                    }}
                                    iconBackgroundColor={useTheme.background}
                                    onLongPress={() => AddToUserGroup(item)}
                                    secondaryIcon={
                                        <>
                                            {
                                                addToListUser.length <= 0 ? <ChevronRight color={iconColor} /> :
                                                    <TouchableOpacity onPress={() => {
                                                        if (addToListUser.find((i) => i._id === item._id)) {
                                                            setAddToListUser(addToListUser.filter((i) => i._id !== item._id))
                                                        } else {
                                                            setAddToListUser([...addToListUser, item])
                                                        }

                                                    }}>
                                                        <View style={{
                                                            backgroundColor: useTheme.background,
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 50,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 20,
                                                                fontWeight: '600',
                                                                color: useTheme.primary,
                                                            }}>
                                                                {addToListUser.find((i) => i._id === item._id) ? <Check color={useTheme.primary} /> : ''}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                            }
                                        </>
                                    } />
                            ))}
                    </MultipleCard>
                </View>
                <Padding size={10} />

            </ScrollView>
        </>
    )
}


