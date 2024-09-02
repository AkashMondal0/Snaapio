import { View, Text, Button, Card, Switch, Image, CheckBox, Input, Skeleton } from "@/components/skysolo-ui";
import { memo } from "react";


const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Card style={{
                width: '80%',
                height: '20%',
            }}>
                <Text variant="heading3">Feed Screen</Text>
            </Card>
            <Switch />
            <Input />
            <CheckBox />
            <Button>
                Go to Home
            </Button>
            <Image source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG-20240819-WA0005.jpg.jpeg?alt=media&token=254f4006-3c4e-419e-ab48-88e408966990',
            }} />
        </View>
    )
})
export default FeedsScreen;