import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button, Text } from 'hyper-native-ui';
import LottieView from 'lottie-react-native';
import { logoutApi } from '@/redux-stores/slice/auth/api.service';
import LogOutDialog from '@/components/dialogs/logout';
import { useTheme } from 'hyper-native-ui';    


const ErrorScreen = ({
    message = "PAGE_NOT_FOUND"
}: {
    message?: ErrorType | string
}) => {
    const animation = useRef<LottieView>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const { currentTheme } = useTheme();
    const dispatch = useDispatch();
    useEffect(() => {
        animation.current?.play();
    }, []);

    function displayErrorMessage(ErrorType: ErrorType | string) {
        let title, description;
        let errorTypeUpper = typeof ErrorType === "string" ? ErrorType.toUpperCase() : ErrorType

        if (errorTypeUpper === "GENERAL_SERVER_ERROR") {
            title = "Oops! Something went wrong.";
            description = "Our server encountered an unexpected issue. Please try again later. If the problem persists, contact our support team.";
        } else if (errorTypeUpper === "NETWORK_ERROR") {
            title = "Network Error";
            description = "It seems there is a problem with your network connection. Please check your internet connection and try again.";
        } else if (errorTypeUpper === "AUTHENTICATION_ERROR") {
            title = "Authentication Failed";
            description = "We couldn't verify your credentials. Please check your username and password and try again.";
        } else if (errorTypeUpper === "PAGE_NOT_FOUND") {
            title = "Sorry, this page isn't available.";
            description = "The page you're looking for doesn't exist. It might have been removed, renamed, or didn't exist in the first place.";
        } else if (errorTypeUpper === "UNAUTHORIZED_ACCESS") {
            title = "Access Denied";
            description = "You do not have permission to access this resource. Please contact support if you believe this is a mistake.";
        } else if (errorTypeUpper === "BAD_USER_INPUT") {
            title = "Invalid Client Credentials";
            description = "The data you provided is invalid. Please check your input and try again.";
        } else if (errorTypeUpper === "UNAUTHENTICATED") {
            title = "Unauthenticated Access";
            description = "You need to be logged in to access this feature. Please log in or sign up to continue";
        } else if (errorTypeUpper === "SERVICE_UNAVAILABLE") {
            title = "Service Unavailable";
            description = "Our servers are currently undergoing maintenance. Please check back later.";
        } else if (errorTypeUpper === "RATE_LIMIT_EXCEEDED") {
            title = "Rate Limit Exceeded";
            description = "You've made too many requests in a short period. Please slow down and try again later.";
        } else if (errorTypeUpper === "INTERNAL_SERVER_ERROR") {
            title = "Internal Server Error";
            description = "An unexpected error occurred on our server. Our team has been notified and is working to resolve the issue.";
        } else if (errorTypeUpper === "DATA_FETCH_ERROR") {
            title = "Data Fetch Error";
            description = "We encountered an error while trying to retrieve data. Please refresh the page or try again later.";
        } else if (errorTypeUpper === "TIMEOUT_ERROR") {
            title = "Request Timeout";
            description = "Your request took too long to process. Please try again later.";
        } else {
            title = "Server Error";
            description = "An unexpected error occurred on our server. Our team has been notified and is working to resolve the issue.";
        }

        return { title, description }
    }

    return (
        <>
            <LogOutDialog
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                confirm={() => { dispatch(logoutApi() as any) }} />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: currentTheme?.background,
                height: 450,
            }}>
                <>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: currentTheme?.foreground,
                    }}>{displayErrorMessage(message).title}</Text>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 250,
                            height: 250,
                            alignContent: "center",
                        }}
                        source={require('../../assets/lottie/Animation -error.json')}
                    />
                    <Text style={{
                        fontSize: 12,
                        color: currentTheme?.destructive,
                        textAlign: 'center',
                        marginBottom: 20,
                        width: '80%',
                    }}>
                        {displayErrorMessage(message).description}
                    </Text>
                    <Button onPress={() => {
                        setModalVisible(true)
                    }}>
                        Log Out
                    </Button>
                </>
            </View>
        </>
    );
};

export default ErrorScreen;

export type ErrorType =
    | "GENERAL_SERVER_ERROR"
    | "NETWORK_ERROR"
    | "AUTHENTICATION_ERROR"
    | "PAGE_NOT_FOUND"
    | "UNAUTHORIZED_ACCESS"
    | "SERVICE_UNAVAILABLE"
    | "RATE_LIMIT_EXCEEDED"
    | "INTERNAL_SERVER_ERROR"
    | "DATA_FETCH_ERROR"
    | "UNAUTHENTICATED"
    | "TIMEOUT_ERROR";