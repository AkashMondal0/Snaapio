import React, { useState, useEffect, useCallback } from "react";
import { View, Button } from "react-native";
import { mediaDevices } from "react-native-webrtc";
import { useFocusEffect } from "@react-navigation/native";

const VideoScreen = ({ navigation }:any) => {
  const [stream, setStream] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const startCamera = async () => {
        try {
          const mediaConstraints = { video: true, audio: true };
          const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
          
          if (isActive) {
            setStream(mediaStream);
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      };

      startCamera();

      return () => {
        isActive = false;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [])
  );

  return (
    <View>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default VideoScreen;
