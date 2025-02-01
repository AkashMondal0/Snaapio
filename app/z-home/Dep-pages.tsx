// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { ProfileScreen, TabFollowingAndFollowers } from '../profile';
// import { CommentScreen, LikeScreen, PostScreen } from "../post";
// import { NotificationScreen } from "../screens";
// import { useTheme } from 'hyper-native-ui';

// const Stack = createNativeStackNavigator();

// function Pages({
//     mainRouteName,
//     ScreenComponent
// }: {
//     mainRouteName: string,
//     ScreenComponent: React.ReactNode | any
// }) {
//     const { currentTheme: { background } } = useTheme();
//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 headerShown: false,
//                 contentStyle: {
//                     backgroundColor: background,
//                     width: '100%',
//                     height: '100%',
//                     flex: 1
//                 }
//             }}>
//             <Stack.Screen name={mainRouteName} component={ScreenComponent} />
//             <Stack.Screen name={"profile"} component={ProfileScreen} />
//             <Stack.Screen name="profile/followersAndFollowing" component={TabFollowingAndFollowers} />
//             <Stack.Screen name="notification" component={NotificationScreen} />
//             {/* post */}
//             <Stack.Screen name="post" component={PostScreen} />
//             <Stack.Screen name="post/like" component={LikeScreen} />
//             <Stack.Screen name="post/comment" component={CommentScreen} />
//         </Stack.Navigator >
//     );
// }

// export default Pages;