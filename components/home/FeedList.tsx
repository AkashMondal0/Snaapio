import { FlashList } from '@shopify/flash-list';
import { memo, useState } from 'react';
import { View } from 'react-native';
import { Post } from '@/types';
import { Avatar, Image, Loader, Text } from '@/components/skysolo-ui';



const FeedList = memo(function FeedList() {
    const [loading, setLoading] = useState(true)

    const list: Post[] = [...feedList] as any

    return <View style={{
        width: "100%",
        height: "100%",
        paddingHorizontal: 5
    }}>
        {loading ? <View style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Loader size={40} />
        </View> : <></>}
        <FlashList
            onLoad={() => setLoading(false)}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={({ item }) => <Item data={item} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={400}
            estimatedItemSize={50}
            data={list} />
    </View>
})

export default FeedList

const Item = memo(function ({ data }: { data: Post }) {

    return <View style={{
        width: "100%",
        paddingVertical: 10,
    }}>
        <View style={{
            width: "100%",
            paddingVertical: 10,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Avatar
                size={45}
                url={data.user?.profilePicture} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    style={{ fontWeight: "300" }}
                    variant="heading4">
                    {data?.content ?? "new chat"}
                </Text>
            </View>
        </View>
        <Image src={data.fileUrl[0]} style={{
            width: "100%",
            height: 560
        }} />
    </View>
}, (prev, next) => {
    return prev.data.id === next.data.id
})

const ListHeaderComponent = () => {
    return <View>
        <Text variant="heading2" style={{
            fontWeight: "700",
            padding: 10,
            paddingVertical: 14
        }}>SkyLight</Text>
    </View>
}

const feedList = [
    {
        "id": "lucjyx561g",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fyash-chavan-1BGSppxfujU-unsplash.jpg.jpeg?alt=media&token=b5ca29ef-5834-4e93-957d-bb823b684d8d"
        ],
        "createdAt": "2024-09-11T15:40:54.747Z",
        "updatedAt": "2024-09-11T15:40:54.722Z",
        "authorId": null,
        "commentCount": 1,
        "likeCount": 1,
        "is_Liked": true,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "neb9z8zz9z",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fkody-goodson-m8qISZuRzQA-unsplash.jpg.jpeg?alt=media&token=88224c62-e3c2-439c-9a77-8a6d648583b0"
        ],
        "createdAt": "2024-09-11T15:40:49.364Z",
        "updatedAt": "2024-09-11T15:40:49.340Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 1,
        "is_Liked": true,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "0pxxj7lz1c",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fzack-ECdTCHje9e4-unsplash.jpg.jpeg?alt=media&token=a1bcae69-e724-416b-bb7c-8dfce545b7ab"
        ],
        "createdAt": "2024-09-11T15:40:30.576Z",
        "updatedAt": "2024-09-11T15:40:30.552Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "2c3gb1xjbb",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fmaxim-simonov-40Ar1SytWi4-unsplash.jpg.jpeg?alt=media&token=d25bd071-0cbc-4e9d-9e83-eb4855277256"
        ],
        "createdAt": "2024-09-11T15:40:24.435Z",
        "updatedAt": "2024-09-11T15:40:24.410Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "jcxnxpl7y5",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fvander-films-YQRSn9fvrUk-unsplash.jpg.jpeg?alt=media&token=55dc4d92-ca1d-4168-aff5-f53568aa9345"
        ],
        "createdAt": "2024-09-11T15:39:55.673Z",
        "updatedAt": "2024-09-11T15:39:55.643Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "0x16fdyvsm",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Frouhalla-shabir-YTDt3C6CGVA-unsplash.jpg.jpeg?alt=media&token=f0e6b56b-eef5-4dae-9dc8-d620089b1371"
        ],
        "createdAt": "2024-09-11T15:39:44.364Z",
        "updatedAt": "2024-09-11T15:39:44.340Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "79mwypc2ur",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Frohan-O89B6SYSZGQ-unsplash.jpg.jpeg?alt=media&token=548b2170-cc7d-4ea6-99cf-d5a3a06763dd"
        ],
        "createdAt": "2024-09-11T15:39:38.135Z",
        "updatedAt": "2024-09-11T15:39:38.111Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "9caum4zcsn",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fikshit-chaudhari-CmM-yZasjaQ-unsplash.jpg.jpeg?alt=media&token=1a7e3c17-15ac-4fa2-b9f4-8f3bd1947b3f"
        ],
        "createdAt": "2024-09-11T15:39:30.153Z",
        "updatedAt": "2024-09-11T15:39:30.129Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "6zbh141m0u",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fnandaperin-SEkUbe3Zj2Q-unsplash.jpg.jpeg?alt=media&token=6a147619-c78d-4029-9e7c-fe28dcdbd943"
        ],
        "createdAt": "2024-09-11T15:39:22.784Z",
        "updatedAt": "2024-09-11T15:39:22.760Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 1,
        "is_Liked": true,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "z2siqjrv7k",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fvander-films-YQRSn9fvrUk-unsplash.jpg.jpeg?alt=media&token=d20d5d02-8fd0-4dda-b6e9-0a6da6319c26"
        ],
        "createdAt": "2024-09-11T15:39:15.533Z",
        "updatedAt": "2024-09-11T15:39:15.508Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "u17p25j1ve",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fomair-parvez-ivg8MShjB-Y-unsplash.jpg.jpeg?alt=media&token=a149196a-840a-4d49-b0b1-464958d2e7a6"
        ],
        "createdAt": "2024-09-11T15:39:06.712Z",
        "updatedAt": "2024-09-11T15:39:06.688Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "86rv0nawsq",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Ffaruk-tokluoglu-xWuD_oRWzUw-unsplash.jpg.jpeg?alt=media&token=e4ceaf89-e8ad-4aca-88d6-2c6b0e6452af"
        ],
        "createdAt": "2024-09-11T15:38:59.695Z",
        "updatedAt": "2024-09-11T15:38:59.671Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "b5dltfvwmf",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Feric-muhr--TJGAtPA7GQ-unsplash.jpg.jpeg?alt=media&token=e56d1ee0-f451-4d42-930d-83f75685a8d5"
        ],
        "createdAt": "2024-09-11T15:38:51.281Z",
        "updatedAt": "2024-09-11T15:38:51.257Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "3yj7nifk8q",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fraymond-petrik-5KvrBkAVPlA-unsplash.jpg.jpeg?alt=media&token=2d38eeb8-b9eb-4212-a3ac-25e2a5495f2f"
        ],
        "createdAt": "2024-09-11T15:38:44.707Z",
        "updatedAt": "2024-09-11T15:38:44.683Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "fk9toij8xi",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fjoel-durkee-LrgFJd61TvY-unsplash.jpg.jpeg?alt=media&token=d5901790-98a4-4926-ab68-23e4b48d8a79"
        ],
        "createdAt": "2024-09-11T15:38:27.988Z",
        "updatedAt": "2024-09-11T15:38:27.964Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "6afnhg5wgn",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Ftiago-ferreira-vyrJBd6NSlQ-unsplash.jpg.jpeg?alt=media&token=29c96e9b-8b36-4c81-a20e-8b7be1370c76"
        ],
        "createdAt": "2024-09-11T15:38:19.877Z",
        "updatedAt": "2024-09-11T15:38:19.853Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "0o72cbchem",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsamsung-memory-63976YzkHqM-unsplash.jpg.jpeg?alt=media&token=66e576a6-9aaa-430e-a49d-49bfdeab1832"
        ],
        "createdAt": "2024-09-11T15:37:36.155Z",
        "updatedAt": "2024-09-11T15:37:36.131Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "fo0f7308uc",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fevgeni-tcherkasski-HiprNExjcZA-unsplash.jpg.jpeg?alt=media&token=207e3f6d-a76a-4f21-9fa4-5e03f6b9ca8b"
        ],
        "createdAt": "2024-09-11T15:37:17.018Z",
        "updatedAt": "2024-09-11T15:37:16.994Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "azqwom4kkt",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsamsung-memory-SMHx_spBYx0-unsplash.jpg.jpeg?alt=media&token=9a9ba611-4948-4850-87ca-5cc194905800"
        ],
        "createdAt": "2024-09-11T15:37:07.119Z",
        "updatedAt": "2024-09-11T15:37:07.096Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "n9re6zr9up",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fkristine-kozaka-Z9xPTZfRvNw-unsplash.jpg.jpeg?alt=media&token=c596904c-050d-4ccc-a824-e465ef899734"
        ],
        "createdAt": "2024-09-11T15:36:53.781Z",
        "updatedAt": "2024-09-11T15:36:53.757Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "0cnwgxnvqm",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fdavid-villasana-e9--Ak7Z2qs-unsplash.jpg.jpeg?alt=media&token=8bea0971-8918-4cad-b1a2-b15fac9790d9"
        ],
        "createdAt": "2024-09-11T15:36:43.264Z",
        "updatedAt": "2024-09-11T15:36:43.240Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "kwbbcom1ek",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Ftoa-heftiba-ZTXTG_7bZNA-unsplash.jpg.jpeg?alt=media&token=1f5d464d-87dc-472a-8ac1-91b24fdf586c"
        ],
        "createdAt": "2024-09-11T15:36:31.977Z",
        "updatedAt": "2024-09-11T15:36:31.953Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "ak5hrkudhi",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Ftiago-ferreira--hOMJa84C3o-unsplash.jpg.jpeg?alt=media&token=22aaecac-2509-4f5d-aaf5-e8ebe63eba1a"
        ],
        "createdAt": "2024-09-11T15:36:19.045Z",
        "updatedAt": "2024-09-11T15:36:19.022Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "cd660w49j0",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fjohannes-sejer-Kd1cdeqoQ0U-unsplash.jpg.jpeg?alt=media&token=80360fea-cec8-40d7-969a-bbd6fe8d37de"
        ],
        "createdAt": "2024-09-11T15:36:06.105Z",
        "updatedAt": "2024-09-11T15:36:06.081Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "7jop7e1m7k",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsky%20chat.png.jpeg?alt=media&token=d0a25962-bbd8-45c0-9813-737f452ce12a"
        ],
        "createdAt": "2024-09-11T15:13:32.248Z",
        "updatedAt": "2024-09-11T15:13:32.226Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "o00g5jeqce",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fhero.jpg.jpeg?alt=media&token=b04e12ef-d9f8-4118-a608-b273b9a548a5"
        ],
        "createdAt": "2024-09-04T19:41:44.913Z",
        "updatedAt": "2024-09-04T19:41:44.887Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "y241ohzs1y",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Flogo.jpg.jpeg?alt=media&token=196d622c-4210-4bd4-b0e5-9a05a4474655"
        ],
        "createdAt": "2024-09-04T19:41:39.689Z",
        "updatedAt": "2024-09-04T19:41:39.659Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "movbxfzvjl",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsky%20chat.png.jpeg?alt=media&token=eb34a1d5-1d0e-415b-bca1-44a1d93e7197"
        ],
        "createdAt": "2024-09-04T19:41:25.384Z",
        "updatedAt": "2024-09-04T19:41:25.361Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "m95silicpx",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsvgexport-8.png.jpeg?alt=media&token=836ddad7-bbc4-43c5-a713-c205a79a11df"
        ],
        "createdAt": "2024-09-04T19:41:03.361Z",
        "updatedAt": "2024-09-04T19:41:03.338Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "xq5o1dfcdh",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fsaikat.JPG.jpeg?alt=media&token=9fc7036b-319c-4fd7-a230-610de102b180"
        ],
        "createdAt": "2024-09-04T19:40:33.888Z",
        "updatedAt": "2024-09-04T19:40:33.864Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "dysa82y8xm",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_908.jpg.jpeg?alt=media&token=d919bf84-e1ad-4a0e-9d73-bb0523a29e21"
        ],
        "createdAt": "2024-09-03T20:20:52.016Z",
        "updatedAt": "2024-09-03T20:20:51.989Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "vq14fbhh6o",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_838.jpg.jpeg?alt=media&token=08ba6e77-c6e3-48ba-bb19-c1358925e2b2"
        ],
        "createdAt": "2024-09-03T20:20:22.959Z",
        "updatedAt": "2024-09-03T20:20:22.928Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "7qrp4knisl",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_783.jpg.jpeg?alt=media&token=11a8e5f5-e2ac-4f67-9caa-0513e862b67c"
        ],
        "createdAt": "2024-09-03T20:19:30.994Z",
        "updatedAt": "2024-09-03T20:19:30.967Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "awn9mabozi",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2F1723976118362.jpg.jpeg?alt=media&token=4ff2ad30-bd67-43d4-a902-16ddd774ced1"
        ],
        "createdAt": "2024-08-18T22:15:56.737Z",
        "updatedAt": "2024-08-18T22:15:56.711Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 1,
        "is_Liked": true,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "rqrzaks4jl",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240806_132950.jpg.jpeg?alt=media&token=5376a644-f49c-43ff-af20-26c013a4d4b6"
        ],
        "createdAt": "2024-08-14T23:16:15.230Z",
        "updatedAt": "2024-08-14T23:16:15.203Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "jncvlfod52",
        "content": "",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240731_210654.jpg.jpeg?alt=media&token=7b2fc29e-c7f7-46fd-ac7a-f242cbe848da"
        ],
        "createdAt": "2024-08-14T23:16:02.243Z",
        "updatedAt": "2024-08-14T23:16:02.216Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 1,
        "is_Liked": true,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "lcayped55d",
        "content": "Coding time 💫😀💫😀",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240716_205552.jpg.jpeg?alt=media&token=569748b9-c350-4d17-9c8e-f19b138feef3"
        ],
        "createdAt": "2024-08-14T22:37:36.983Z",
        "updatedAt": "2024-08-14T22:37:36.952Z",
        "authorId": null,
        "commentCount": 2,
        "likeCount": 1,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    },
    {
        "id": "dj1dfckr91",
        "content": "Coffee aur code",
        "title": null,
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240802_184002.jpg.jpeg?alt=media&token=6c279d03-052f-4074-af4a-c4c0815a1ea3"
        ],
        "createdAt": "2024-08-14T22:35:33.008Z",
        "updatedAt": "2024-08-14T22:35:32.978Z",
        "authorId": null,
        "commentCount": 0,
        "likeCount": 0,
        "is_Liked": false,
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        }
    }
]