import { RootState } from '@/app/redux/store'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { View, ViewProps } from 'react-native'
import { useSelector } from 'react-redux'
type SkeletonProps = ViewProps & {
    radius?: number
}
const SkySoloSkeleton = (props: SkeletonProps) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return <View {...props}>
        <ContentLoader
            backgroundColor={currentTheme?.accent}
            foregroundColor={currentTheme?.background}>
            <Rect width="100%" height="100%" rx={props.radius} ry={props.radius} />
        </ContentLoader>
    </View>
}
export default SkySoloSkeleton