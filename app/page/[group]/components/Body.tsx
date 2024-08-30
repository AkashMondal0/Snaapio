import React, { FC, useEffect, useMemo, useCallback, memo } from 'react';
import { ActivityIndicator, ToastAndroid, View, VirtualizedList, Text, Image } from 'react-native';
import ChatCard from './MessageCard';
import { useDispatch } from 'react-redux';
import { CurrentTheme } from '../../../../types/theme';
import { GroupConversation, PrivateChat, PrivateMessage, PrivateMessageSeen } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import MyButton from '../../../../components/shared/Button';
import { ArrowDown } from 'lucide-react-native';
import _ from 'lodash';
import { dateFormat } from '../../../../utils/timeFormat';
import { FlashList } from '@shopify/flash-list';
import MessageType from './MessageType';
import { sendMessageSeenGroup } from '../../../../redux/slice/group-chat';

interface BodyChatProps {
    theme: CurrentTheme
    messages: PrivateMessage[]
    profile: User | null | undefined
    users?: User[] | null | undefined
    conversation: GroupConversation | null | undefined
    messageLoading: boolean
    error: string | null
}
const BodyChat: FC<BodyChatProps> = ({
    theme,
    messages,
    profile,
    messageLoading,
    error,
    conversation
}) => {
    const scrollViewRef = React.useRef<any>(null);
    const dispatch = useDispatch()
    const [userScrollIcon, setUserScrollIcon] = React.useState<boolean>(false)

    // memoized sorted dates
    const memoSortedDates = useMemo(() => {
        const dateSorted = [...messages]
            .slice(0, 0 + 10)
            .filter((value, index, dateArr) => index === dateArr
                .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
            .map((item) => {
                item._id = new Date(item.createdAt).getTime().toString();
                item = { ...item, typeDate: true }
                return item
            })
        const messageSorted = [...messages, ...dateSorted]
            .sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
        return messageSorted
    }, [messages])

    const seenCount = useMemo(() => {
        return memoSortedDates.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined)
    }, [memoSortedDates])


    const messageSeen = useCallback(() => {
        const seen: PrivateMessageSeen = {
            messageIds: seenCount as string[],
            memberId: profile?._id as string,
            receiverIds: conversation?.members?.map(item => item.userId).filter((u) => u !== profile?._id) as string[],
            conversationId: conversation?._id as string
        }
        dispatch(sendMessageSeenGroup(seen) as any)
    }, [messages])

    const getMoreData = async () => {
        // const condition = !privateChat?.loadAllMessages && !privateChat?.loadAllMessages && !messageLoading && messages.length > 19
        // if (condition) {
        //     dispatch(getMoreMessagePrivate({
        //         conversationId: conversationId as string,
        //         page: privateChat?.page || 2 as number,
        //     }) as any)
        // }
    }

    const throttledFunction = _.throttle(() => getMoreData(), 2000);


    useEffect(() => {
        //debounce
        if (!messageLoading) {
            if (messages.length > 0) {
                messageSeen()
            }
        }
    }, [messages])

    const groupUserLength = conversation?.members?.length || 0

// console.log(conversation)
    const ItemView = memo(({ item }: { item: PrivateMessage }) => {
        if (item.typeDate) {
            return (
                <>
                    <Text style={{
                        textAlign: 'center',
                        color: theme.subTextColor,
                        backgroundColor: theme.primaryBackground,
                        borderRadius: 10,
                        padding: 5,
                        marginVertical: 5,
                        alignSelf: 'center'
                    }}>{dateFormat(item.createdAt)}</Text>
                </>
            )

        }
        if (item.fileUrl?.length! > 0 && item?.fileUrl) {

            return <MessageType
                files={item.fileUrl}
                senderData={conversation?.Users?.find(user => user._id === item.memberId) as User}
                sender={item.memberId === profile?._id}
                seen={item.seenBy.length >= groupUserLength && item.seenBy.includes(profile?._id as string)}
                theme={theme}
                receiver={profile as User}
                time={item.createdAt}
            />

        }

        return (
            <ChatCard
                senderData={conversation?.Users?.find(user => user._id === item.memberId) as User}
                key={item._id}
                sender={item.memberId === profile?._id}
                seen={item.seenBy.length >= groupUserLength && item.seenBy.includes(profile?._id as string)}
                theme={theme}
                data={item}
                content={item.content}
            />
        );
    })


    return (
        <>
            <FlashList
                inverted
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString() as string}
                scrollEventThrottle={400}
                ref={scrollViewRef}
                data={memoSortedDates}
                estimatedItemSize={100}
                getItemType={(item) => item._id}
                // initialNumToRender={20}
                // maxToRenderPerBatch={20}
                // windowSize={10}
                // updateCellsBatchingPeriod={100}
                // getItem={(data, index) => data[index]}
                // getItemCount={(data) => data.length}


                onEndReached={throttledFunction}
                renderItem={({ item, index }) => <ItemView item={item} key={index} />}
                onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y > 200) {
                        setUserScrollIcon(true)
                    } else {
                        setUserScrollIcon(false)
                    }
                }}
                // ListHeaderComponent={() => {}}
                ListFooterComponent={() => {
                    return <View style={{
                        paddingVertical: 15,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {messageLoading ?
                            <ActivityIndicator size="large" color={theme.primaryTextColor} />
                            : <></>}
                    </View>
                }}
            />
            <View style={{
                paddingVertical: 15,
                width: "100%",
                position: 'absolute',
                bottom: 50,
                right: 10,
                alignItems: "flex-end",
                zIndex: 1000,
                elevation: 1000,
            }}>
                {userScrollIcon ?
                    <MyButton onPress={() => scrollViewRef?.current?.scrollToOffset({ offset: 0, animated: false })} theme={theme}
                        variant="custom" backgroundColor={theme.cardBackground}
                        height={50}
                        icon={<ArrowDown size={30} color={theme.primaryIconColor} />}
                        width={50} radius={20} /> : <></>}
            </View>
        </>
    );
};

export default BodyChat