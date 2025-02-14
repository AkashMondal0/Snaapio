import { useState, useEffect, useRef } from "react";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from "react-native-webrtc";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";
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
  const roomId = "1234";
  let isVoiceOnly = false;
  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true
    }
  };

  const [localStream, setLocalStream] = useState<any>(null);
  const [localMediaStream, setLocalMediaStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(new RTCPeerConnection(configuration));
  let datachannel = peerConnectionRef.current?.createDataChannel('my_channel');

  // Getting a Media Stream using getUserMedia
  // If you only want a voice call then you can flip isVoiceOnly over to true.
  // You can then cycle and enable or disable the video tracks on demand during a call.
  const startLocalUserStream = async () => {
    try {
      let mediaConstraints = {
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
        }
      };
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      if (isVoiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      };
      setLocalStream(mediaStream);
    } catch (err) {
      console.log("Error - startLocalStream function")
    };
  };

  // Getting a Media Stream using getDisplayMedia
  // This will allow capturing the device screen, also requests permission on execution.
  const startLocalMediaStream = async () => {
    try {
      const mediaStream = await mediaDevices.getDisplayMedia();
      setLocalMediaStream(mediaStream);
    } catch (err) {
      // Handle Error
      console.log("Error - startMediaStream function")
    };
  }

  // Toggle the Active Microphone
  const toggleMicrophone = async () => {
    let isMuted = false;

    try {
      const audioTrack = await localMediaStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      isMuted = !isMuted;
    } catch (err) {
      // Handle Error
      console.log("Error - toggleMicrophone function")
    };
  }

  // Switching the Active Camera
  const switchCamera = async () => {
    try {
      const videoTrack = await localMediaStream.getVideoTracks()[0];
      const facingMode = videoTrack.getSettings().facingMode === 'user' ? 'environment' : 'user';
      videoTrack.setSettings({ facingMode });
    } catch (err) {
      // Handle Error
      console.log("Error - switchCamera function")
    };
  }


  const stopStream = async () => {
    try {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      if (!datachannel) return;
      datachannel?.close();
    } catch (err) {
      // Handle Error
      console.log("Error - hangUp function")
    };
  }

  const cameraTurnOff = async () => {
    try {

    } catch (err) {
      // Handle Error
      console.log("Error - cameraTurnOff function")
    };
  }

  // Creating an Offer 
  const createOffer = async () => {
    try {
      const offerDescription = await peerConnectionRef.current?.createOffer(sessionConstraints);
      await peerConnectionRef.current?.setLocalDescription(offerDescription);
      // Send the offerDescription to the other participant.
    } catch (err) {
      // Handle Errors
      console.log("Error - createOffer function", err)
    };
  }

  // Creating an Answer
  const createAnswer = async (offerDescription: RTCSessionDescription | RTCSessionDescriptionInit) => {
    try {
      const remoteOfferDescription = new RTCSessionDescription(offerDescription);
      await peerConnectionRef.current?.setRemoteDescription(remoteOfferDescription);

      const answerDescription = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answerDescription);
      // Send the answerDescription back as a response to the offerDescription.

    } catch (err) {
      // Handle Errors
      console.log("Error - createAnswer function")
    };
  }

  // Controlling remote audio tracks
  // const controlRemoteAudio = async (trackId: string, isEnabled: boolean) => {
  //   try {
  //     const remoteAudioTracks = peerConnectionRef.current?.getRemoteStreams()[0].getAudioTracks();
  //     const remoteAudioTrack = remoteAudioTracks.find((track) => track.id === trackId);
  //     if (remoteAudioTrack) {
  //       remoteAudioTrack.enabled = isEnabled;
  //     }
  //   } catch (err) {
  //     // Handle Errors
  //     console.log("Error - controlRemoteAudio function")
  //   };
  // }
  // Joining a Room
  // const joinRoom = () => {
  //   socket.emit("join-room", { roomId });
  //   socket.on("offer", (data) => {
  //     createAnswer(data.offer);
  //   });
  //   socket.on("answer", (data) => {
  //     peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
  //   });
  //   socket.on("ice-candidate", (data) => {
  //     const candidate = new RTCIceCandidate(data.candidate);
  //     peerConnectionRef.current?.addIceCandidate(candidate);
  //   });
  // }

  // // Leaving a Room
  // const leaveRoom = () => {
  //   socket.emit("leave-room", { roomId });
  //   socket.off("offer");
  //   socket.off("answer");
  //   socket.off("ice-candidate");
  // }

  // useEffect(() => {
  //   joinRoom();
  //   return leaveRoom;
  // }, [joinRoom, leaveRoom]);

  useEffect(() => {
    startLocalUserStream();
    // 
    datachannel?.addEventListener('open', event => { });
    datachannel?.addEventListener('close', event => { });
    datachannel?.addEventListener('message', message => { });
    // 
    peerConnectionRef.current?.addEventListener('datachannel', event => {
      let datachannel = event.channel;

      // Now you've got the datachannel.
      // You can hookup and use the same events as above ^
    });
    // 
    peerConnectionRef.current?.addEventListener('connectionstatechange', event => { });
    peerConnectionRef.current?.addEventListener('icecandidate', event => { });
    peerConnectionRef.current?.addEventListener('icecandidateerror', event => { });
    peerConnectionRef.current?.addEventListener('iceconnectionstatechange', event => { });
    peerConnectionRef.current?.addEventListener('icegatheringstatechange', event => { });
    peerConnectionRef.current?.addEventListener('negotiationneeded', event => { });
    peerConnectionRef.current?.addEventListener('signalingstatechange', event => { });

    peerConnectionRef.current?.addEventListener('track', event => {
      if (event.track) {
        const remoteStream = new MediaStream([event.track]);
        setRemoteStream(remoteStream);
      }
    });

    return () => {
      peerConnectionRef.current?.removeEventListener("connectionstatechange");
      peerConnectionRef.current?.removeEventListener("icecandidate");
      peerConnectionRef.current?.removeEventListener("icecandidateerror");
      peerConnectionRef.current?.removeEventListener("icegatheringstatechange");
      peerConnectionRef.current?.removeEventListener("iceconnectionstatechange");
      peerConnectionRef.current?.removeEventListener("negotiationneeded");
      peerConnectionRef.current?.removeEventListener("track");
      peerConnectionRef.current?.removeEventListener("signalingstatechange");
    };
  }, [peerConnectionRef.current]);

  return {
    localStream,
    remoteStream,
    localMediaStream,
    peerConnectionRef,
    startLocalMediaStream,
    startLocalUserStream,
    toggleMicrophone,
    stopStream,
    switchCamera,
    cameraTurnOff
  };
};

export default useWebRTC;
