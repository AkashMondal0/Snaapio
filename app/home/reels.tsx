import { Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";
import { View } from "react-native";
import { useQuery } from '@tanstack/react-query'

const fetchTodoList = async () => {
    const response = await fetch('https://api.sampleapis.com/coffee/hot/1')

    const res = response.json()
    return res
}

const ReelsScreen = memo(function ReelsScreen({ navigation }: any) {
    // const { data, isLoading, refetch } = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })

    // console.log(data)
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Text variant="heading2">Reels Screen</Text>
        </View>
    )
})
export default ReelsScreen;