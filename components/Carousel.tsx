
const MyPager = () => {
    return (
        <PagerView
            style={{
                width: '100%',
                height: 600,
            }} initialPage={0}>
            <View key="1">
                <Image
                    style={{
                        marginVertical: 10,
                        width: '90%',
                        marginHorizontal: "auto",
                    }}
                    source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG-20240819-WA0005.jpg.jpeg?alt=media&token=254f4006-3c4e-419e-ab48-88e408966990',
                    }} />
            </View>
            <View key="2">
                <Image
                    style={{
                        marginVertical: 10,
                        width: '90%',
                        marginHorizontal: "auto",
                    }}
                    source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2FIMG-20240819-WA0005.jpg.jpeg?alt=media&token=254f4006-3c4e-419e-ab48-88e408966990',
                    }} />
            </View>
        </PagerView>
    );
};
