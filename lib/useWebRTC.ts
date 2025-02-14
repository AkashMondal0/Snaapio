import { useState, useEffect, useRef } from "react";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from "react-native-webrtc";
import { io } from "socket.io-client";

// WebRTC Configuration
const configuration = {
  iceServers: [
    { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
  ],
};

// Initialize Socket.io
const socket = io("http://192.168.31.212:4000");

const useWebRTC = () => {
  const roomId = "1234"
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    registerGlobals();
    startLocalStream();

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const startLocalStream = async () => {
    const stream = await mediaDevices.getUser Media({
      audio: true,
      video: true,
    });
    setLocalStream(stream);
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnectionRef.current = peerConnection;
  };

  const handleOffer = async (offer: any) => {
    createPeerConnection();
    await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnectionRef.current?.createAnswer();
    await peerConnectionRef.current?.setLocalDescription(answer);
    socket.emit('answer', answer);
  };

  const handleAnswer = async (answer: any) => {
    await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    try {
      // Use the received offerDescription
      const offerDescription = new RTCSessionDescription( offerDescription );
      await peerConnectionRef.current?.setRemoteDescription( offerDescription );
    
      const answerDescription = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription( answerDescription );
    
      // Send the answerDescription back as a response to the offerDescription.
    } catch( err ) {
      // Handle Errors
    };
  };

  const handleIceCandidate = async (candidate: any) => {
    await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const startCall = async () => {
    createPeerConnection();
    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer);
    socket.emit('offer', offer);
  };

  return { localStream, remoteStream, startCall, endCall };
};

export default useWebRTC;
