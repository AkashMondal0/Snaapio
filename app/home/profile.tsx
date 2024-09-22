import { ProfileHeader, ProfileNavbar } from "@/components/profile";
import { RootState } from "@/redux-stores/store";
import { NavigationProps } from "@/types";
import { ScrollView, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSelector } from "react-redux";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            params: { username: string }
        }
    }
}
const ProfileScreen = ({ navigation, route }: ScreenProps) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const username = route?.params?.params?.username ?? session?.username

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <ScrollView
                nestedScrollEnabled={true}
                style={{
                    width: '100%',
                }}>
                <ProfileNavbar navigation={navigation}
                    isProfile={username === session?.username}
                    username={username} />
                <ProfileHeader navigation={navigation} />
                <PagerView
                    initialPage={0}
                    style={{
                        width: "100%",
                        minHeight: 700,
                    }}>
                    <View style={{
                        width: '100%',
                        height: 700,
                        backgroundColor: 'red'
                    }}></View>
                    <View style={{
                        width: '100%',
                        height: 700,
                        backgroundColor: 'blue'
                    }}></View>
                    <View style={{
                        width: '100%',
                        height: 700,
                        backgroundColor: 'green'
                    }}></View>
                </PagerView>
            </ScrollView>
        </View>
    )
}
export default ProfileScreen;

const userData = {
    "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
    "username": "akash",
    "email": "akash@gmail.com",
    "name": "Akash Mondal",
    "bio": "Hi!👋I'mAkashMondal",
    "website": [],
    "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956",
    "postCount": 38,
    "followerCount": 2,
    "followingCount": 3,
    "friendship": {
        "followed_by": true,
        "following": true
    }
}
const post = {
    "findAllPosts": [
        {
            "id": "lucjyx561g",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fyash-chavan-1BGSppxfujU-unsplash.jpg.jpeg?alt=media&token=b5ca29ef-5834-4e93-957d-bb823b684d8d"
            ],
            "commentCount": 1,
            "likeCount": 1
        },
        {
            "id": "neb9z8zz9z",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fkody-goodson-m8qISZuRzQA-unsplash.jpg.jpeg?alt=media&token=88224c62-e3c2-439c-9a77-8a6d648583b0"
            ],
            "commentCount": 0,
            "likeCount": 1
        },
        {
            "id": "0pxxj7lz1c",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fzack-ECdTCHje9e4-unsplash.jpg.jpeg?alt=media&token=a1bcae69-e724-416b-bb7c-8dfce545b7ab"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "2c3gb1xjbb",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fmaxim-simonov-40Ar1SytWi4-unsplash.jpg.jpeg?alt=media&token=d25bd071-0cbc-4e9d-9e83-eb4855277256"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "jcxnxpl7y5",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fvander-films-YQRSn9fvrUk-unsplash.jpg.jpeg?alt=media&token=55dc4d92-ca1d-4168-aff5-f53568aa9345"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "0x16fdyvsm",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Frouhalla-shabir-YTDt3C6CGVA-unsplash.jpg.jpeg?alt=media&token=f0e6b56b-eef5-4dae-9dc8-d620089b1371"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "79mwypc2ur",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Frohan-O89B6SYSZGQ-unsplash.jpg.jpeg?alt=media&token=548b2170-cc7d-4ea6-99cf-d5a3a06763dd"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "9caum4zcsn",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fikshit-chaudhari-CmM-yZasjaQ-unsplash.jpg.jpeg?alt=media&token=1a7e3c17-15ac-4fa2-b9f4-8f3bd1947b3f"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "6zbh141m0u",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fnandaperin-SEkUbe3Zj2Q-unsplash.jpg.jpeg?alt=media&token=6a147619-c78d-4029-9e7c-fe28dcdbd943"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "z2siqjrv7k",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fvander-films-YQRSn9fvrUk-unsplash.jpg.jpeg?alt=media&token=d20d5d02-8fd0-4dda-b6e9-0a6da6319c26"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "u17p25j1ve",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fomair-parvez-ivg8MShjB-Y-unsplash.jpg.jpeg?alt=media&token=a149196a-840a-4d49-b0b1-464958d2e7a6"
            ],
            "commentCount": 0,
            "likeCount": 0
        },
        {
            "id": "86rv0nawsq",
            "fileUrl": [
                "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Ffaruk-tokluoglu-xWuD_oRWzUw-unsplash.jpg.jpeg?alt=media&token=e4ceaf89-e8ad-4aca-88d6-2c6b0e6452af"
            ],
            "commentCount": 0,
            "likeCount": 0
        }
    ]
}