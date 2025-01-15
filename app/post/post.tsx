import { memo, useCallback, useEffect, useState } from "react";
import { Loader, ThemedView } from "hyper-native-ui";
import { disPatchResponse, loadingType, NavigationProps, Post } from "@/types";
import AppHeader from "@/components/AppHeader";
import { FeedItem } from "@/components/home";
import { useDispatch } from "react-redux";
import { fetchOnePostApi } from "@/redux-stores/slice/post/api.service";
import ErrorScreen from "@/components/error/page";
import { ScrollView, View } from "react-native";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post,
            index: number
        }
    }
}
const PostScreen = memo(function PostScreen({ navigation, route }: ScreenProps) {
    const postId = route.params.post.id
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
            <AppHeader title="Post" navigation={navigation} titleCenter />
            <ScrollView>
                {state.loading !== 'normal' ? <Loader size={50} />
                    : state.error ? <ErrorScreen message="Not Found" /> :
                        state.data?.id ? <FeedItem data={state.data} navigation={navigation} /> : <View />}
            </ScrollView>
        </ThemedView>
    )
})
export default PostScreen;