import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    createStaticNavigation,
    StackActions,
    StaticParamList,
    useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
import { Avatar } from '@/components/skysolo-ui';
import { RootState } from '@/redux-stores/store';
import { useSelector } from 'react-redux';

// import all pages
import { NotificationsSettingScreen, SettingScreen, ThemeSettingScreen } from '@/app/setting';
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
import { PremiumSignUpScreen, ProfileEditScreen, ProfileScreen, TabFollowingAndFollowers } from '@/app/profile';
import { CommentScreen, LikeScreen, PostScreen, PostUploadScreen, PostSelectScreen, ShortVideoSelectScreen, ShortVideoUploadScreen, ShortVideoEditScreen, UploadMediaScreen } from '@/app/post';
import { StoryScreen, StorySelectingScreen, StoryUploadScreen } from '@/app/story';
import { HighlightPageScreen, HighlightSelectingScreen, HighlightUploadScreen } from '@/app/highlight';
import { FeedsScreen, AccountScreen, ReelsScreen, SearchScreen } from '@/app/HomeTab';
import { CallingScreen, IncomingCallScreen, CallDeclinedScreen, CallRoomScreen } from './call';
import RoomScreen from './call/videoCall';
import { NotificationScreen } from '@/app/notification';
import { NotFound } from './NotFound';
import PickupImages from './SelectFiles/pickup-images';
import { DiscoverPeopleScreen } from '@/app/discover';

export const HomeTabs = createBottomTabNavigator({
    screenOptions: {
        headerShown: false,
        tabBarShowLabel: false,
        animation: "fade",
        tabBarItemStyle: { margin: 3 }
    },
    screens: {
        Home: {
            screen: FeedsScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <HomeIcon size={30} color={color} />
                ),
            },
        },
        Search: {
            screen: SearchScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <Search size={30} color={color} />
                ),
            },
        },
        Create: {
            screen: UploadMediaScreen,
            options: {
                tabBarIcon: ({ color, size, focused }) => (
                    <PlusCircle size={30} color={color} />
                ),
            },
        },
        Reels: {
            screen: ReelsScreen,
            options: {
                tabBarStyle: { backgroundColor: '#000' },
                tabBarIcon: ({ color, size, focused }) => (
                    <Film size={30} color={focused ? "#fff" : color} />
                ),
            },
        },
        Account: {
            screen: AccountScreen,
            options: ({ navigation, route }) => ({
                title: "Profile",
                tabBarIcon: ({ color, size, focused }) => (
                    <AccountIcon
                        size={30}
                        focused={focused}
                        onPress={(name) => navigation.navigate(route.name, { ...route.params, id: name })} />
                ),
            }),
        },
    },
});

export const RedirectHome = () => {
    const navigation = useNavigation()
    useEffect(() => {
        if (navigation?.canGoBack()) {
            navigation.goBack()
            return
        } else {
            navigation.dispatch(StackActions.replace("HomeTabs"))
        }
    }, [])
    return <></>
}

const AuthStack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
        keyboardHandlingEnabled: true,
    },
    initialRouteName: "Welcome",
    screens: {
        Welcome: {
            screen: InitialScreen,
            linking: {
                path: "/welcome"
            }
        },
        Login: {
            screen: LoginScreen,
            linking: {
                path: "/login"
            }
        },
        Register: {
            screen: RegisterScreen,
            linking: {
                path: "/register"
            }
        },
        NotFound: {
            screen: LoginScreen,
            linking: {
                path: '*',
            },
        },
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
                PickupImages: {
                    screen: PickupImages,
                    options: {
                        animation: "slide_from_bottom"
                    },
                    linking: {
                        path: "/PickupImages"
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
                },
                PremiumSignUpScreen: {
                    screen: PremiumSignUpScreen,
                    linking: {
                        path: "/account/premium_sign_up"
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
                Notifications: {
                    screen: NotificationsSettingScreen,
                    linking: {
                        path: "/settings/notifications"
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
                ProfileFollowing: {
                    screen: TabFollowingAndFollowers,
                    linking: {
                        path: '/:id/following',
                        parse: {
                            id: (id) => id.replace(/^@/, ''),
                        },
                        stringify: {
                            id: (id) => `@${id}`,
                        },
                    },
                },
                ProfileFollower: {
                    screen: TabFollowingAndFollowers,
                    linking: {
                        path: '/:id/follower',
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
                PostsSelect: {
                    screen: PostSelectScreen,
                    options: {
                        animation: "slide_from_bottom"
                    },
                    linking: {
                        path: 'post/select',
                    }
                },
                PostUpload: {
                    screen: PostUploadScreen,
                    linking: {
                        path: 'post/upload'
                    }
                },
                VideoUpload: {
                    screen: ShortVideoUploadScreen,
                    linking: {
                        path: 'video/upload'
                    }
                },
                VideoEdit: {
                    screen: ShortVideoEditScreen,
                    linking: {
                        path: 'video/edit'
                    }
                },
                VideoSelect: {
                    screen: ShortVideoSelectScreen,
                    options: {
                        animation: "slide_from_bottom"
                    },
                    linking: {
                        path: 'video/select',
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
                    options: {
                        animation: "slide_from_bottom"
                    },
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
                    options: {
                        animation: "slide_from_bottom"
                    },
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
                        path: 'message'
                    }
                },
                MessageRoom: {
                    screen: ChatScreen,
                    linking: {
                        path: 'message/:id',
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
                        path: 'message/new'
                    }
                },
                MessageSelectFile: {
                    screen: AssetSelectScreen,
                    options: {
                        animation: "slide_from_bottom"
                    },
                    linking: {
                        path: 'message/asset/select'
                    }
                },
                MessageUploadFile: {
                    screen: ChatAssetsReviewScreen,
                    linking: {
                        path: 'message/asset/upload'
                    }
                },
                MessageImagePreview: {
                    screen: ImagePreviewScreen,
                    linking: {
                        path: 'message/image/preview'
                    }
                }
            }
        },
        AiMessage: {
            screens: {
                AiMessage: {
                    screen: AskAiChatScreen,
                    linking: {
                        path: 'message/ai'
                    }
                },
            }
        },
        Auth: {
            screens: {
                Welcome: {
                    screen: RedirectHome,
                    linking: {
                        path: "/welcome"
                    }
                },
                Login: {
                    screen: RedirectHome,
                    linking: {
                        path: "/login"
                    }
                },
                Register: {
                    screen: RedirectHome,
                    linking: {
                        path: "/register"
                    }
                }
            }
        },
        call: {
            screens: {
                CallDeclined: {
                    screen: CallDeclinedScreen,
                    linking: {
                        path: "/CallDeclined"
                    }
                },
                Video: {
                    screen: RoomScreen,
                    linking: {
                        path: "/video"
                    }
                },
                InComingCall: {
                    screen: IncomingCallScreen,
                    linking: {
                        path: "/incoming_call",
                        parse: {
                            username: (username) => username || '',
                            email: (email) => decodeURIComponent(email || ''),
                            id: (id) => id || '',
                            name: (name) => name || '',
                            profilePicture: (profilePicture) => decodeURIComponent(profilePicture || ''),
                        },
                    }
                },
                Calling: {
                    screen: CallingScreen,
                    linking: {
                        path: "/calling"
                    }
                },
                CallRoom: {
                    screen: CallRoomScreen,
                    linking: {
                        path: "/CallRoom"
                    }
                }
            }
        },
        discover: {
            screens: {
                DiscoverPeople: {
                    screen: DiscoverPeopleScreen,
                    linking: {
                        path: 'discover/people'
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
    onPress: (name: string) => void,
    size?: number,
    focused: boolean
}) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user, (prev, next) => prev === next);
    if (!session) return <></>
    return (
        <Avatar size={28} url={session?.profilePicture} onPress={() => onPress(session?.username)} isBorder={focused} />
    );
};