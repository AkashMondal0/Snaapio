import { uesSocket } from "@/provider/SocketConnections";
import { Session } from "@/types";
import { useState, useEffect, useRef } from "react";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";

type SocketRes<T> = {
  userId: string;
  members: string[];
  data: T;
};

const Empty = {
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOn: true,
  isSpeakerOn: false,
  startLocalUserStream: async () => { },
  createOffer: async () => { },
  toggleMicrophone: () => { },
  toggleCamera: () => { },
  switchCamera: () => { },
  stopStream: () => { },
  toggleSpeaker: () => { }
};

const useWebRTC = ({
  session,
  remoteUser,
  endStreamCallBack
}: {
  session: Session["user"] | null;
  remoteUser: Session["user"] | null;
  endStreamCallBack?: () => void
}) => {
  if (!session || !remoteUser) {
    console.error("Session or remoteUser is invalid.");
    return Empty;
  }

  const socket = uesSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFrontCam, setIsFrontCam] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // WebRTC PeerConnection Reference
  const peerConnectionRef = useRef<RTCPeerConnection | null>(
    new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    })
  );

  const datachannelRef = useRef(peerConnectionRef.current?.createDataChannel("my_channel"))

  // 📌 **Start Local User Stream**
  const startLocalUserStream = async () => {
    try {
      const mediaConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2,
        },
        video: { frameRate: 30, facingMode: "user" },
      };

      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints as any);

      mediaStream.getTracks().forEach((track) =>
        peerConnectionRef.current?.addTrack(track, mediaStream)
      );

      setLocalStream(mediaStream as any);
      console.log("📌 Local stream started.");
    } catch (err) {
      console.error("❌ Error starting local stream:", err);
    }
  };

  // 📌 **Create Offer**
  const createOffer = async () => {
    try {
      const offerDescription = await peerConnectionRef.current?.createOffer({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      });
      if (!offerDescription) return;

      await peerConnectionRef.current?.setLocalDescription(offerDescription);
      socket?.emit("offer", {
        userId: session.id,
        members: [remoteUser.id],
        data: offerDescription,
      });

      console.log("📌 Offer created and sent.");
    } catch (err) {
      console.error("❌ Error creating offer:", err);
    }
  };

  // 📌 **Create Answer**
  const createAnswer = async (res: SocketRes<RTCSessionDescription>) => {
    try {
      const remoteOffer = new RTCSessionDescription(res.data);
      await peerConnectionRef.current?.setRemoteDescription(remoteOffer);

      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);

      socket?.emit("answer", {
        userId: session.id,
        members: [remoteUser.id],
        data: answer,
      });

      console.log("📌 Answer created and sent.");
    } catch (err) {
      console.error("❌ Error creating answer:", err);
    }
  };

  // 📌 **Handle Incoming ICE Candidate**
  const handleRemoteICECandidate = async (res: SocketRes<RTCIceCandidate>) => {
    try {
      if (!res.data) return;
      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(res.data));
      console.log("📌 Remote ICE candidate added.");
    } catch (err) {
      console.error("❌ Error adding ICE candidate:", err);
    }
  };

  // 📌 **Handle ICE Candidate Event**
  const handleICECandidateEvent = (event: any) => {
    if (event.candidate) {
      socket?.emit("candidate", {
        userId: session.id,
        members: [remoteUser.id],
        data: event.candidate,
      });
      console.log("📌 ICE candidate sent.");
    }
  };

  const handleAnswer = (data: SocketRes<RTCSessionDescription>) => {
    peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.data))
  }

  // 📌 **Handle Remote Stream**
  const handleTrackEvent = (event: any) => {
    if (event.streams && event.streams[0]) {
      setRemoteStream(event.streams[0]);
      console.log("📌 Remote stream received.");
    }
  };

  // 📌 **Toggle Microphone**
  const toggleMicrophone = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
      console.log("📌 Microphone toggled.");
    }
  };

  // 📌 **Toggle Camera**
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn((prev) => !prev);
      console.log("📌 Camera toggled.");
    }
  };

  // 📌 **Switch Front/Back Camera**
  const switchCamera = () => {
    if (!localStream || !isCameraOn) return;

    const videoTrack = localStream.getVideoTracks()[0];
    const constraints = { facingMode: isFrontCam ? "environment" : "user" };

    videoTrack.applyConstraints(constraints);
    setIsFrontCam((prev) => !prev);
    console.log("📌 Camera switched.");
  };

  //  📌 **AudioToSpeaker**
  const toggleSpeaker = () => {
    if (isSpeakerOn) {

      setIsSpeakerOn(false);
    } else {
      setIsSpeakerOn(true);
    }

    console.log("📌 Audio To Speaker");
  };

  // 📌 **Stop Stream & Cleanup**
  const stopStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    peerConnectionRef.current?.close();
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    datachannelRef.current?.close();
    datachannelRef.current = null as any;

    setLocalStream(null);
    setRemoteStream(null);

    endStreamCallBack?.()
    console.log("📌 Streams stopped and cleaned up.");
  };

  // 📌 **WebRTC Event Listeners**
  useEffect(() => {
    startLocalUserStream();
    socket?.on("offer", createAnswer);
    socket?.on("answer", handleAnswer);
    socket?.on("candidate", handleRemoteICECandidate);
    peerConnectionRef.current?.addEventListener("track", handleTrackEvent);
    peerConnectionRef.current?.addEventListener("icecandidate", handleICECandidateEvent);

    return () => {
      socket?.off("offer", createAnswer);
      socket?.off("answer", handleAnswer);
      socket?.off("candidate", handleRemoteICECandidate);
      peerConnectionRef.current?.removeEventListener("track", handleTrackEvent);
      peerConnectionRef.current?.removeEventListener("icecandidate", handleICECandidateEvent);
      // socket
      stopStream();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    isMuted,
    isCameraOn,
    isSpeakerOn,
    startLocalUserStream,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
    toggleSpeaker,
    stopStream,
    createOffer,
    createAnswer,
  };
};

export default useWebRTC;
