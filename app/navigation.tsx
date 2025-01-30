import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    createStaticNavigation,
    StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedsScreen from './home/feeds';
import SearchScreen from './home/search';
import { Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
import { ProfileScreen } from './profile';
import { Avatar } from '@/components/skysolo-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import ReelsScreen from './home/reels';
import { NotFound } from './NotFound';
import AccountScreen from './home/account';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import {
    AskAiChatScreen,
    AssetSelectScreen,
    ChatAssetsReviewScreen,
    ChatListScreen,
    ChatScreen,
    ImagePreviewScreen,
    NewChatScreen
} from '@/app/message';
import { PostReviewScreen, NewPostSelectionScreen } from '@/app/upload';
import { ProfileEditScreen } from '@/app/profile';
import { CommentScreen, LikeScreen, PostScreen } from '@/app/post';
import { StoryScreen, StorySelectingScreen, StoryUploadScreen } from '@/app/story';
import { HighlightPageScreen, HighlightSelectingScreen, HighlightUploadScreen } from '@/app/highlight';
import { NotificationScreen } from './screens';

const HomeTabs = createBottomTabNavigator({
    screenOptions: {
        headerShown: false
    },
    screens: {
        Home: {
            screen: FeedsScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <HomeIcon size={size} color={color} />
                ),
            },
        },
        Search: {
            screen: SearchScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <Search size={size} color={color} />
                ),
            },
        },
        Create: {
            screen: NewPostSelectionScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <PlusCircle size={size} color={color} />
                ),
            },
        },
        Reels: {
            screen: ReelsScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <Film size={size} color={color} />
                ),
            },
        },
        Account: {
            screen: AccountScreen,
            options: ({ navigation, route }) => ({
                title: "Profile",
                tabBarIcon: ({ color, size, focused }) => (
                    <AccountIcon
                        size={size}
                        focused={focused}
                        onPress={() => navigation.navigate(route.name, route.params)} />
                ),
            }),
        },
    },
});

const AuthStack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
        keyboardHandlingEnabled: true,
    },
    screens: {
        Welcome: InitialScreen,
        Login: LoginScreen,
        Register: RegisterScreen
    }
})

const RootStack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
        keyboardHandlingEnabled: true,
    },
    groups: {
        Home: {
            screens: {
                HomeTabs: HomeTabs,
                Notification: NotificationScreen,
            }
        },
        Account: {
            screens: { AccountEdit: ProfileEditScreen, }
        },
        Settings: {
            screens: {
                Settings: SettingScreen,
                ThemeSettings: ThemeSettingScreen,
            }
        },
        Profile: {
            screens: {
                Profile: {
                    screen: ProfileScreen,
                    linking: {
                        path: 'user/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                // ProfileFollowersAndFollowing:TabFollowingAndFollowers
            }
        },
        Post: {
            screens: {
                Post: {
                    screen: PostScreen,
                    linking: {
                        path: 'post/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                PostLike: {
                    screen: LikeScreen,
                    linking: {
                        path: 'post/:id/:like',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                PostComment: {
                    screen: CommentScreen,
                    linking: {
                        path: 'post/:id/:comment',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                SelectPosts: NewPostSelectionScreen,
                PostUpload: PostReviewScreen,
            },
        },
        Story: {
            screens: {
                Story: StoryScreen,
                SelectStory: StorySelectingScreen,
                StoryUpload: StoryUploadScreen,
            }
        },
        Highlight: {
            screens: {
                Highlight: {
                    screen: HighlightPageScreen,
                    linking: {
                        path: 'hightlight/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                HighlightSelect: HighlightSelectingScreen,
                HighlightUpload: HighlightUploadScreen,
            }
        },
        Message: {
            screens: {
                MessageList: ChatListScreen,
                MessageRoom: {
                    screen: ChatScreen,
                    linking: {
                        path: 'chat/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                FindMessage: NewChatScreen,
                MessageAssetSelect: AssetSelectScreen,
                SendAssetPreview: ChatAssetsReviewScreen,
                MessageImagePreview: ImagePreviewScreen
            }
        },
        AiMessage: {
            screens: {
                AiMessage: AskAiChatScreen,
            }
        },
        NotFound: {
            screens: { NotFound },
            linking: {
                path: '*',
            },
        },
    },
});

export const Navigation = createStaticNavigation(RootStack);
export const AuthNavigation = createStaticNavigation(AuthStack);


type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

const AccountIcon = ({
    onPress,
    size,
    focused
}: {
    onPress: () => void,
    size?: number,
    focused: boolean
}) => {
    const sessionAvatarUrl = useSelector((state: RootState) => state.AuthState.session.user?.profilePicture, (prev, next) => prev === next);

    return (
        <Avatar size={28} url={sessionAvatarUrl} onPress={onPress} isBorder={focused} />
    );
};