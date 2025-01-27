import { memo, useCallback, useEffect, useState } from "react";
import { Loader, ThemedView } from "hyper-native-ui";
import { disPatchResponse, loadingType, Post } from "@/types";
import AppHeader from "@/components/AppHeader";
import { FeedItem } from "@/components/home";
import { useDispatch } from "react-redux";
import { fetchOnePostApi } from "@/redux-stores/slice/post/api.service";
import ErrorScreen from "@/components/error/page";
import { ScrollView, View } from "react-native";
import { StaticScreenProps } from "@react-navigation/native";

type Props = StaticScreenProps<{
    postId: string;
}>;
const PostScreen = memo(function PostScreen({  route }: Props) {
    const postId = route.params.postId;
    const [state, setState] = useState<{
        loading: loadingType,
        error: boolean,
        data: Post | null
    }>({
        data: null,
        error: false,
        loading: "idle"
    })

    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        const res = await dispatch(fetchOnePostApi(postId) as any) as disPatchResponse<Post>
        if (res.error) return setState({ ...state, loading: "normal", error: true })
        if (res.payload.id) {
            setState({ ...state, loading: "normal", data: res.payload })
        }
    }, [postId])

    useEffect(() => {
        fetchApi()
    }, [postId])

    const onRefresh = useCallback(() => {
        fetchApi()
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Post" titleCenter />
            <ScrollView>
                {state.loading !== 'normal' ? <Loader size={50} />
                    : state.error ? <ErrorScreen message="Not Found" /> :
                        state.data?.id ? <FeedItem data={state.data} /> : <View />}
            </ScrollView>
        </ThemedView>
    )
})
export default PostScreen;