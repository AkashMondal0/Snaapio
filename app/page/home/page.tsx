import React, { memo, useContext, useMemo } from 'react'
import { Animated, FlatList, ScrollView } from 'react-native'
import PrivateChatCard from './components/UserCard';
import { useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react-native';
import NoItem from './components/No_Item';
import LoadingUserCard from './components/LoadingUserCard';
import { RootState } from '../../../redux/store';
import { GroupConversation, PrivateChat, PrivateMessage } from '../../../types/private-chat';
import FloatingButton from '../../../components/shared/Floating';
import SearchList from './components/SearchList';
import Header from './components/header';
import { useForm } from 'react-hook-form';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import { ProfileContext } from '../../../provider/Profile_Provider';
import GroupConversationCard from './components/GroupCard';
interface CardList {
    type: "private" | "group"
    item: PrivateChat | GroupConversation
    name?: string
}

const HomeScreen = ({ navigation }: any) => {
    const usePrivateChat = useSelector((state: RootState) => state.privateChat)
    const useGroupChat = useSelector((state: RootState) => state.groupChat)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const AnimatedState = useContext(AnimatedContext)
    const profileState = useContext(ProfileContext)
    // search form
    const { control, watch, reset } = useForm({
        defaultValues: {
            search: '',
        }
    });

    // const [bottomSheetData, setBottomSheetData] = useState<User>()
    // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    // const snapPoints = useMemo(() => ["30%", "50%", "90%"], [])

    // const handleSheetChanges = useCallback((userData: User) => {
    //     setBottomSheetData(userData)
    //     bottomSheetModalRef.current?.present()
    // }, [])

    const margeList: CardList[] = useMemo(() => {
        // marge group and private chat list
        const privateList = [...usePrivateChat.List].map((item) => {
            return {
                type: "private",
                item,
                name: item.userDetails?.username
            }
        })
        const groupList = [...useGroupChat.groupChatList].map((item) => {
            return {
                type: "group",
                item,
                name: item.name
            }
        })

        const sortedNewDate = (messages:PrivateMessage[]) => {
            return messages && [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt
        }

        return [...privateList, ...groupList].sort((a, b) => {
            const _a = a.item.messages && a.item.messages?.length > 0 ? sortedNewDate(a.item.messages): a.item.createdAt
            const _b = b.item.messages && b.item.messages?.length > 0 ? sortedNewDate(b.item.messages): b.item.createdAt
            return new Date(_b).getTime() - new Date(_a).getTime()
        })
        // search filter
        .filter((item) => {
            return item.name?.toLowerCase().includes(watch("search").toLowerCase()) || ""
        })
    }, [usePrivateChat.List, useGroupChat.groupChatList, watch("search")]) as CardList[]


    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: AnimatedState.backgroundColor
        }}>
            {/* <ActionSheet
                BottomSheetComponent={<ProfileBottomSheet UserData={bottomSheetData as User} />}
                bottomSheetModalRef={bottomSheetModalRef}
                snapPoints={snapPoints} /> */}
            <SearchList theme={useTheme}
                reset={reset}
                inputHandleControl={control} />
            <Header theme={useTheme}
                AnimatedState={AnimatedState}
                navigation={navigation} />
            {usePrivateChat.loading ? <ScrollView>
                {Array.from({ length: 15 }).fill(0).map((item, i) => <LoadingUserCard theme={useTheme} key={i} />)}
            </ScrollView>
                : <FlatList
                    // optimization
                    initialNumToRender={10}
                    windowSize={5}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={30}
                    removeClippedSubviews={true}
                    data={margeList}
                    renderItem={({ item }) => {
                        if (item.type === "private") {
                            return <PrivateChatCard
                                navigation={navigation}
                                data={item.item as PrivateChat} />
                        }
                        else {
                            return <GroupConversationCard
                                navigation={navigation}
                                data={item.item as PrivateChat} />
                        }
                    }}
                    ListEmptyComponent={() => <NoItem them={useTheme} />}
                    onRefresh={profileState.fetchUserData}
                    refreshing={usePrivateChat.loading}
                    keyExtractor={(item) => item.item._id as any}
                />}

            <FloatingButton
                onPress={() => {
                    navigation.navigate('Message')
                }}
                theme={useTheme}
                icon={<UserPlus color={useTheme.color}
                    size={35} />} />
        </Animated.View>
    )
}

export default memo(HomeScreen)