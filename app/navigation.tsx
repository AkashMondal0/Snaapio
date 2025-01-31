import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    createStaticNavigation,
    StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedsScreen from './home/feeds';
import SearchScreen from './home/search';
import { Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
import { ProfileScreen, TabFollowingAndFollowers } from './profile';
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
                HomeTabs: {
                    screen: HomeTabs,
                    linking: {
                        path: "/"
                    }
                },
                Notification: {
                    screen: NotificationScreen,
                    linking: {
                        path: "/notification"
                    }
                },
            }
        },
        Account: {
            screens: {
                AccountEdit: {
                    screen: ProfileEditScreen,
                    linking: {
                        path: "/account/edit"
                    }
                }
            }
        },
        Settings: {
            screens: {
                Settings: {
                    screen: SettingScreen,
                    linking: {
                        path: "/settings"
                    }
                },
                ThemeSettings: {
                    screen: ThemeSettingScreen,
                    linking: {
                        path: "/settings/theme"
                    }
                },
            }
        },
        Profile: {
            screens: {
                Profile: {
                    screen: ProfileScreen,
                    linking: {
                        path: '/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                ProfileFollowingFollowers: {
                    screen: TabFollowingAndFollowers,
                    linking: {
                        path: '/:id/:section',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
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
                        path: 'post/:id/likes',
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
                        path: 'post/:id/comments',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                SelectPosts: {
                    screen: NewPostSelectionScreen,
                    linking: {
                        path: 'post/select'
                    }
                },
                PostUpload: {
                    screen: PostReviewScreen,
                    linking: {
                        path: 'post/upload'
                    }
                },
            },
        },
        Story: {
            screens: {
                Story: {
                    screen: StoryScreen,
                    linking: {
                        path: 'story/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                SelectStory: {
                    screen: StorySelectingScreen,
                    linking: {
                        path: 'story/select'
                    }
                },
                StoryUpload: {
                    screen: StoryUploadScreen,
                    linking: {
                        path: 'story/upload'
                    }
                },
            }
        },
        Highlight: {
            screens: {
                Highlight: {
                    screen: HighlightPageScreen,
                    linking: {
                        path: 'highlight/:id',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                HighlightSelect: {
                    screen: HighlightSelectingScreen,
                    linking: {
                        path: 'highlight/select'
                    }
                },
                HighlightUpload: {
                    screen: HighlightUploadScreen,
                    linking: {
                        path: 'highlight/upload'
                    }
                },
            }
        },
        Message: {
            screens: {
                MessageList: {
                    screen: ChatListScreen,
                    linking: {
                        path: 'chat/list'
                    }
                },
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
                FindMessage: {
                    screen: NewChatScreen,
                    linking: {
                        path: 'chat/new'
                    }
                },
                MessageAssetSelect: {
                    screen: AssetSelectScreen,
                    linking: {
                        path: 'chat/asset/select'
                    }
                },
                SendAssetPreview: {
                    screen: ChatAssetsReviewScreen,
                    linking: {
                        path: 'chat/asset/preview'
                    }
                },
                MessageImagePreview: {
                    screen: ImagePreviewScreen,
                    linking: {
                        path: 'chat/image/preview'
                    }
                }
            }
        },
        AiMessage: {
            screens: {
                AiMessage: {
                    screen: AskAiChatScreen,
                    linking: {
                        path: 'ai/message'
                    }
                },
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