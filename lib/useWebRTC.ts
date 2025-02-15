import { uesSocket } from "@/provider/SocketConnections";
import { Session } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from "react-native-webrtc";

const Empty = {
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOn: true,
  startLocalUserStream: async () => { },
  createOffer: async () => { },
  toggleMicrophone: () => { },
  toggleCamera: () => { },
  switchCamera: () => { },
  stopStream: () => { },
};

const useWebRTC = ({
  session,
  remoteUser
}: {
  session: Session["user"] | null;
  remoteUser: Session["user"] | null;
}) => {
  if (!session || !remoteUser) {
    console.error("Session or remoteUser is invalid.");
    return Empty;
  }
  const socket = uesSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFrontCam, setIsFrontCam] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(new RTCPeerConnection({
    iceServers: [{
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302"]
    }]
  }));

  // 📌 **Start Local User Stream**
  const startLocalUserStream = async () => {
    try {
      const mediaConstraints = {
        audio: true,
        video: {
          frameRate: 30,
          facingMode: "user",
        },
      };

      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      mediaStream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, mediaStream);
      });

      setLocalStream(mediaStream);
    } catch (err) {
      console.error("Error starting local stream:", err);
    }
  };

  // 📌 **Toggle Microphone**
  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  // 📌 **Toggle Camera**
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn((prev) => !prev);
    }
  };

  // 📌 **Stop Camera**
  const stopCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        track.stop();
      });
      setIsCameraOn((prev) => !prev);
    }
  };

  // 📌 **Switch Front/Back Camera**
  const switchCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const constraints = { facingMode: isFrontCam ? 'user' : 'environment' };
      videoTrack.applyConstraints(constraints);
      setIsFrontCam((prev) => !prev);
    }
  };

  // 📌 **Create Offer**
  const createOffer = async () => {
    try {
      const offerDescription = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offerDescription);

      socket.emit("offer", {
        userId: session.id,
        receiver: remoteUser.id,
        offerDescription: peerConnectionRef.current?.localDescription,
      });
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  // 📌 **Create Answer**
  const createAnswer = async ({ offer }: { offer: RTCSessionDescription }) => {
    try {
      const remoteOfferDescription = new RTCSessionDescription(offer);
      await peerConnectionRef.current?.setRemoteDescription(remoteOfferDescription);

      socket.emit("answer", {
        userId: session.id,
        receiver: remoteUser.id,
        answer: peerConnectionRef.current?.localDescription,
      });
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };

  // 📌 **Handle ICE Candidate**
  const handleICECandidate = async ({ candidate }: { candidate: RTCIceCandidate }) => {
    try {
      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error handling ICE candidate:", err);
    }
  };

  // 📌 **Stop Media Stream & Peer Connection**
  const stopStream = async () => {
    // socket.emit("leave-room", roomId);
    stopCamera();
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop(); // Stop track
        localStream.removeTrack(track); // Remove track
      });
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    console.log("Stopping camera and media stream...");
  };

  // 📌 **Event Listeners for WebRTC Signaling**
  useEffect(() => {
    startLocalUserStream();
    socket.on("offer", createAnswer);
    socket.on("answer", async ({ answer }: { answer: RTCSessionDescription }) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });
    socket.on("candidate", handleICECandidate);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      stopStream();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    isMuted,
    isCameraOn,
    startLocalUserStream,
    createOffer,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
    stopStream,
    stopCamera
  };
};

export default useWebRTC;
