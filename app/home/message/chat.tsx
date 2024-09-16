import { View } from "@/components/skysolo-ui";
import { memo, useContext } from "react";
import { NavigationContext } from '@react-navigation/native';
// import Messages from "@/data/message.json";
// import Chat from "@/data/chatlist.json";
import { Navbar, Input, MessageList } from "@/components/message";



const ChatScreen = memo(function ChatScreen() {
    const navigation = useContext(NavigationContext);

    const PressBack = () => {
        navigation?.goBack()
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={Chat[1] as any} pressBack={PressBack} />
            <MessageList messages={Messages as any} conversation={Chat[1] as any} />
            <Input conversation={Chat[1] as any} />
        </View>
    )
})
export default ChatScreen;

const Chat = [
    {
        "id": "maqbpudju8",
        "members": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "afb707d7-70be-48ff-b256-1d5b470832be"
        ],
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "user": {
            "id": "afb707d7-70be-48ff-b256-1d5b470832be",
            "username": "test",
            "email": "test@gmail.com",
            "name": "Test",
            "profilePicture": null
        },
        "isGroup": false,
        "lastMessageContent": null,
        "totalUnreadMessagesCount": 0,
        "lastMessageCreatedAt": null,
        "createdAt": null,
        "updatedAt": "2024-08-23T08:02:30.571Z",
        "groupName": null,
        "groupImage": null,
        "groupDescription": null,
        "messages": []
    },
    {
        "id": "g2gijpoask",
        "members": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "30840219-080e-4566-b659-bd1b63e697e2"
        ],
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "user": {
            "id": "30840219-080e-4566-b659-bd1b63e697e2",
            "username": "oliviasen",
            "email": "olivia@gmail.com",
            "name": "Olivia Sen",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F30840219-080e-4566-b659-bd1b63e697e2%2FIMG_0032.png.jpeg?alt=media&token=162d991c-2bcf-4626-8207-8b7548612aa7"
        },
        "isGroup": false,
        "lastMessageContent": "Wwww",
        "totalUnreadMessagesCount": 0,
        "lastMessageCreatedAt": "2024-09-04T06:25:50.939Z",
        "createdAt": null,
        "updatedAt": "2024-08-15T00:01:02.000Z",
        "groupName": null,
        "groupImage": null,
        "groupDescription": null,
        "messages": []
    },
    {
        "id": "i9az4pmiim",
        "members": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "user": {
            "id": "aff8475e-4d00-4d29-b633-107b7d701502",
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "isGroup": false,
        "lastMessageContent": "My room",
        "totalUnreadMessagesCount": 0,
        "lastMessageCreatedAt": "2024-08-22T23:44:58.350Z",
        "createdAt": null,
        "updatedAt": "2024-08-14T23:17:31.419Z",
        "groupName": null,
        "groupImage": null,
        "groupDescription": null,
        "messages": []
    }
]

const Messages = [
    {
        "id": "77c0078a-40f6-40a2-9b19-62ebae85684f",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "New bike New bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew New bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bike bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bikeNew bike",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_783.jpg.jpeg?alt=media&token=2f1d17d3-9b0b-4726-91fb-615b9868fef5"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T00:21:57.330Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "2dab508a-2f69-4a4b-a97d-01b6ef7c8a78",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiiii",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FScreenshot_2024-08-20-13-35-45-277_com.instagram.android.jpg.jpeg?alt=media&token=01d171e7-42ea-4490-8b7a-056da5544331"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T09:46:07.774Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "5cdce06a-518c-4503-99f3-6195be2f0c1b",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hi there 👋🤗",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG-20240819-WA0003.jpg.jpeg?alt=media&token=97c9b5eb-5e53-4dae-b141-4a043096480b",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_908.jpg.jpeg?alt=media&token=969f396a-6b2b-48e2-8c12-67fd4fcf4690",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_838.jpg.jpeg?alt=media&token=f468f1a4-5230-4e6a-8701-ac2229edb7cc",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_728.jpg.jpeg?alt=media&token=75bba463-5faa-4468-aa78-873014b379e0",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG-20240819-WA0005.jpg.jpeg?alt=media&token=254f4006-3c4e-419e-ab48-88e408966990",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_783.jpg.jpeg?alt=media&token=72b8ab92-f738-4787-944a-5cd8a77281cf"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T11:28:40.729Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "a2c7c0de-3f14-4128-a4ad-a1b47f8a0ebb",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "💥",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2F1723976118362.jpg.jpeg?alt=media&token=b25c3c0c-0186-45e6-812d-b51671d29b2f"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T12:54:58.083Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "5765ca3b-0e1d-4f6e-bcf2-635970ce0e3e",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hii",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T12:56:41.043Z",
        "updatedAt": "2024-08-21T12:56:43.560Z",
        "members": null
    },
    {
        "id": "da0b8691-bc22-47ed-a68a-69af0e4da78c",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiii",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0035.png.jpeg?alt=media&token=fd72b7ba-3e35-4a94-9068-ba465cfd8c20"
        ],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T12:57:05.237Z",
        "updatedAt": "2024-08-21T12:57:07.756Z",
        "members": null
    },
    {
        "id": "c9f5b6aa-03da-406b-9c12-af1866a72528",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Code ",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240806_132950.jpg.jpeg?alt=media&token=716c8fcc-268c-47f5-9eb6-f1e0c6cbad95"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T12:57:39.851Z",
        "updatedAt": "2024-08-21T12:57:42.308Z",
        "members": null
    },
    {
        "id": "de36bbab-0d56-4920-8e80-d00deb75e072",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Hii",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-21T13:01:15.696Z",
        "updatedAt": "2024-08-21T13:01:26.453Z",
        "members": null
    },
    {
        "id": "b41d3419-6e0e-4aa2-964f-a27755d862b8",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiiii",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:03:26.936Z",
        "updatedAt": "2024-08-21T13:03:29.331Z",
        "members": null
    },
    {
        "id": "cfe58596-fc58-46fd-aa64-a7295a335c0f",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiiii",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:04:02.134Z",
        "updatedAt": "2024-08-21T13:04:13.271Z",
        "members": null
    },
    {
        "id": "d66957bf-5471-469a-b98f-f624ffa221b0",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiii",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:04:26.639Z",
        "updatedAt": "2024-08-21T13:04:31.443Z",
        "members": null
    },
    {
        "id": "8411158f-4db8-4264-adfb-6b7c1f994789",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hiii2",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:04:41.812Z",
        "updatedAt": "2024-08-21T13:04:44.271Z",
        "members": null
    },
    {
        "id": "6ba5f0ed-6fda-41a9-a46d-cdd69c7835f1",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hii3",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:04:50.906Z",
        "updatedAt": "2024-08-21T13:05:15.686Z",
        "members": null
    },
    {
        "id": "7453b8e2-d5e0-4ea4-afbc-8f4619d8f145",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hii34",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:05:02.299Z",
        "updatedAt": "2024-08-21T13:05:15.686Z",
        "members": null
    },
    {
        "id": "b4611ece-ee1a-40aa-b94b-2519293b5cb8",
        "conversationId": "i9az4pmiim",
        "authorId": "aff8475e-4d00-4d29-b633-107b7d701502",
        "content": "Hi344",
        "user": {
            "username": "mrunalthakur",
            "email": "mrunalthakur@gmail.com",
            "name": "Mrunal Thakur",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "aff8475e-4d00-4d29-b633-107b7d701502",
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-21T13:05:11.414Z",
        "updatedAt": "2024-08-21T13:05:15.686Z",
        "members": null
    },
    {
        "id": "73675c93-a785-4912-a6f4-5a182f0ecbe5",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "New bike",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_783.jpg.jpeg?alt=media&token=478ef16e-f9f2-4538-ac97-3d5932ab7849",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_838.jpg.jpeg?alt=media&token=2f407501-26e1-4934-8bfd-34a7c929c96e",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_908.jpg.jpeg?alt=media&token=d6ac8084-3cb9-452e-b03f-ccc736a2e783",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240819_230913_728.jpg.jpeg?alt=media&token=7539a7df-8083-4cde-8769-696336ba155f"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-22T23:41:03.148Z",
        "updatedAt": "2024-08-22T23:41:03.123Z",
        "members": null
    },
    {
        "id": "818b8571-b4bc-45aa-afe1-99efbfc47ecc",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Hiii 👋 mrunal",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-22T23:43:20.998Z",
        "updatedAt": "2024-08-22T23:43:20.973Z",
        "members": null
    },
    {
        "id": "7085695b-efb4-4ded-b874-50dd16d75ff3",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "How are you",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-22T23:43:29.495Z",
        "updatedAt": "2024-08-22T23:43:29.469Z",
        "members": null
    },
    {
        "id": "42b62558-2a2f-42bc-aa23-c514660d35dc",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Hey 👋",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-22T23:43:37.916Z",
        "updatedAt": "2024-08-22T23:43:37.891Z",
        "members": null
    },
    {
        "id": "7fab485d-661b-4918-a74d-f5f7925e4152",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "My room",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240816_104313.jpg.jpeg?alt=media&token=cd906687-0307-42da-8b55-2ee398deae45",
            "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG_20240816_104251.jpg.jpeg?alt=media&token=bf5b9293-d713-47d2-9207-5c1478cafa37"
        ],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b"
        ],
        "createdAt": "2024-08-22T23:44:58.350Z",
        "updatedAt": "2024-08-22T23:44:58.325Z",
        "members": null
    },
    {
        "id": "cafa43d5-ae29-4d02-9d2e-eb1231b07de7",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "👋 hi",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-14T23:17:42.714Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "df45c467-7d87-4846-aa17-83edc5c8dc62",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Hello 🤗🤗👋",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-15T00:01:22.506Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    },
    {
        "id": "aac68eb6-534b-42a2-a2cf-6947950dca87",
        "conversationId": "i9az4pmiim",
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "content": "Hii",
        "user": {
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "fileUrl": [],
        "deleted": false,
        "seenBy": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "aff8475e-4d00-4d29-b633-107b7d701502"
        ],
        "createdAt": "2024-08-19T06:50:25.564Z",
        "updatedAt": "2024-08-21T12:56:09.493Z",
        "members": null
    }
]