// import { Session } from "@/types";
// import { useState, useEffect, useRef } from "react";
// import {
//   RTCPeerConnection,
//   mediaDevices,
//   RTCSessionDescription,
//   RTCIceCandidate,
// } from "react-native-webrtc";
// import InCallManager from "react-native-incall-manager";
// import { Socket } from "socket.io-client";
// import { hapticVibrate } from "@/lib/RN-vibration";
// type SocketRes<T> = {
//   userId: string;
//   members: string[];
//   data: T;
// };

// const configuration = {
//   iceServers: [{
//     urls: [
//       'stun:stun.l.google.com:19302',
//       'stun:stun1.l.google.com:19302',
//       'stun:stun2.l.google.com:19302',
//       'stun:stun3.l.google.com:19302',
//       'stun:stun4.l.google.com:19302'
//     ]
//   }],
// }

// const useWebRTC = ({
//   remoteUser,
//   session,
//   socket,
//   onError,
//   onCallState,
// }: {
//   remoteUser: Session["user"] & {
//     stream: "video" | "audio";
//     userType: "REMOTE" | "LOCAL"
//   } | any,
//   session: Session["user"],
//   socket: Socket | null
//   onCallState?: (value: "CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE" | "ERROR") => void,
//   onError?: (message: string, err: any) => void
// }) => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOn, setIsCameraOn] = useState(true);
//   const [isFrontCam, setIsFrontCam] = useState(true);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(true);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const streamType = remoteUser?.stream === "video" ? true : false;
//   // WebRTC PeerConnection Reference
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(
//     new RTCPeerConnection(configuration)
//   );

//   // 📌 **Start Local User Stream**
//   const startLocalUserStream = async () => {
//     try {
//       const mediaConstraints = {
//         audio: true,
//         video: streamType
//       };

//       const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

//       mediaStream.getTracks().forEach((track) =>
//         peerConnectionRef.current?.addTrack(track, mediaStream)
//       );

//       setLocalStream(mediaStream as any);
//       InCallManager.start({ media: "audio" });
//       onCallState?.("PENDING");
//       // console.log("📌 Local stream started.");
//     } catch (err) {
//       onError?.("❌ Error starting local stream:", err);
//       console.error("❌ Error starting local stream:", err);
//     }
//   };

//   // 📌 **Create Offer**
//   const createOffer = async () => {
//     if (!session || !remoteUser) return console.error("not found !session | !remoteUser")
//     try {
//       const offerDescription = await peerConnectionRef.current?.createOffer({
//         OfferToReceiveAudio: true,
//         OfferToReceiveVideo: true
//       });
//       if (!offerDescription) return;

//       await peerConnectionRef.current?.setLocalDescription(offerDescription);
//       socket?.emit("offer", {
//         userId: session.id,
//         remoteId: remoteUser?.id,
//         data: offerDescription,
//       });

//       onCallState?.("PENDING");
//       // console.log("📌 Offer created and sent.");
//     } catch (err) {
//       onError?.("❌ Error creating offer:", err)
//       console.error("❌ Error creating offer:", err);
//     }
//   };

//   // 📌 **Create Answer**
//   const createAnswer = async (res: SocketRes<RTCSessionDescription>) => {
//     if (!session || !remoteUser) return console.error("not found !session | !remoteUser")
//     try {
//       const remoteOffer = new RTCSessionDescription(res.data);
//       await peerConnectionRef.current?.setRemoteDescription(remoteOffer);

//       const answer = await peerConnectionRef.current?.createAnswer();
//       await peerConnectionRef.current?.setLocalDescription(answer);

//       socket?.emit("answer", {
//         userId: session.id,
//         remoteId: remoteUser?.id,
//         data: answer,
//       });

//       // console.log("📌 Answer created and sent.");
//     } catch (err) {
//       onError?.("❌ Error creating answer:", err);
//       console.error("❌ Error creating answer:", err);
//     }
//   };

//   // 📌 **Handle Incoming ICE Candidate**
//   const handleRemoteICECandidate = async (res: SocketRes<RTCIceCandidate>) => {
//     if (!session || !remoteUser) return console.error("not found !session | !remoteUser")
//     try {
//       if (!res.data) return;
//       await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(res.data));
//       onCallState?.("CONNECTED");
//       // console.log("📌 Remote ICE candidate added.");
//     } catch (err) {
//       onError?.("❌ Error adding ICE candidate:", err);
//       console.error("❌ Error adding ICE candidate:", err);
//     }
//   };

//   // 📌 **Handle ICE Candidate Event**
//   const handleICECandidateEvent = (event: any) => {
//     if (!session || !remoteUser) return console.error("not found !session | !remoteUser")
//     if (event.candidate) {
//       socket?.emit("candidate", {
//         userId: session.id,
//         remoteId: remoteUser?.id,
//         data: event.candidate,
//       });
//       // console.log("📌 ICE candidate sent.");
//     }
//   };

//   const handleAnswer = (data: SocketRes<RTCSessionDescription>) => {
//     peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.data))
//   }

//   // 📌 **Handle Remote Stream**
//   const handleTrackEvent = (event: any) => {
//     if (event.streams && event.streams[0]) {
//       setRemoteStream(event.streams[0]);
//       if (event.streams[0]?.getVideoTracks()[0]?.enabled || event.streams[0]?.getAudioTracks()[0]?.enabled) {
//         socket?.emit("call-action", {
//           remoteId: remoteUser?.id,
//           type: "INITIAL",
//           value: {
//             isCameraOn: event.streams[0]?.getVideoTracks()[0]?.enabled,
//             isMuted: isMuted
//           },
//         });
//       }
//       // console.log("📌 Remote stream received.");
//     }
//   };

//   /// ------------- system camera ---------------

//   // 📌 **Toggle Microphone**
//   const toggleMicrophone = () => {
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setIsMuted((prev) => !prev);
//       socket?.emit("call-action", {
//         remoteId: remoteUser?.id,
//         type: "MICROPHONE",
//         value: {
//           isMuted: !isMuted
//         },
//       });
//       hapticVibrate();
//       // console.log("📌 Microphone toggled.");
//     }
//   };

//   // 📌 **Toggle Camera**
//   const toggleCamera = () => {
//     if (localStream) {
//       localStream.getVideoTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       socket?.emit("call-action", {
//         remoteId: remoteUser?.id,
//         type: "CAMERA",
//         value: {
//           isCameraOn: !isCameraOn
//         },
//       });
//       setIsCameraOn((prev) => !prev);
//       hapticVibrate();
//       // console.log("📌 Camera toggled.");
//     }
//   };

//   // 📌 **Switch Front/Back Camera**
//   const switchCamera = () => {
//     if (!localStream || !isCameraOn) return;

//     const videoTrack = localStream.getVideoTracks()[0];
//     const constraints = { facingMode: isFrontCam ? "environment" : "user" };

//     videoTrack.applyConstraints(constraints);
//     setIsFrontCam((prev) => !prev);
//     hapticVibrate()
//     console.log("📌 Camera switched.");
//   };

//   //  📌 **AudioToSpeaker**
//   const toggleSpeaker = () => {
//     InCallManager.setSpeakerphoneOn(!isSpeakerOn); // Enable loudspeaker
//     setIsSpeakerOn((prev) => !prev);
//   };

//   // 📌 **Stop Stream & Cleanup**
//   const stopStream = () => {
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//     if (remoteStream) {
//       remoteStream.getTracks().forEach((track) => track.stop());
//     }
//     peerConnectionRef.current?.close();
//     peerConnectionRef.current = new RTCPeerConnection(configuration);

//     setLocalStream(null);
//     setRemoteStream(null);
//     if (!session || !remoteUser) return console.error("not found !session | !remoteUser")
//     socket?.emit("peerLeft", {
//       id: session.id,
//       remoteId: remoteUser?.id,
//       data: null,
//     });
//     InCallManager.stop();
//     hapticVibrate();
//     onCallState?.("DISCONNECTED");
//   };

//   const cleanUp = () => {
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//     if (remoteStream) {
//       remoteStream.getTracks().forEach((track) => track.stop());
//     }
//     InCallManager.stop();
//     peerConnectionRef.current?.close();
//     peerConnectionRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
//     });
//     setLocalStream(null);
//     setRemoteStream(null);
//   };

//   const PeerLeft = () => {
//     onCallState?.("DISCONNECTED");
//   }
//   // 📌 **callAnswer**
//   const callAnswer = (data: any) => {
//     if (data.call === "ACCEPT") {
//       createOffer();
//     }
//     if (data.call === "DECLINE") {
//       stopStream();
//       onCallState?.("DISCONNECTED");
//     }
//   }

//   // 📌 **WebRTC Event Listeners**
//   useEffect(() => {
//     startLocalUserStream();
//     // socket
//     socket?.on("offer", createAnswer);
//     socket?.on("answer", handleAnswer);
//     socket?.on("candidate", handleRemoteICECandidate);
//     socket?.on("peerLeft", PeerLeft);
//     socket?.on("answer-call", callAnswer);
//     // peerConnection
//     peerConnectionRef.current?.addEventListener("track", handleTrackEvent);
//     peerConnectionRef.current?.addEventListener("icecandidate", handleICECandidateEvent);

//     return () => {
//       socket?.off("offer", createAnswer);
//       socket?.off("answer", handleAnswer);
//       socket?.off("candidate", handleRemoteICECandidate);
//       socket?.off("answer-call", callAnswer);
//       socket?.off("peerLeft", PeerLeft);
//       peerConnectionRef.current?.removeEventListener("track", handleTrackEvent);
//       peerConnectionRef.current?.removeEventListener("icecandidate", handleICECandidateEvent);
//       cleanUp();
//     };
//   }, [session, remoteUser]);

//   return {
//     localStream,
//     remoteStream,
//     isMuted,
//     isCameraOn,
//     isSpeakerOn,
//     isFrontCam,
//     startLocalUserStream,
//     toggleMicrophone,
//     toggleCamera,
//     switchCamera,
//     toggleSpeaker,
//     stopStream,
//     createOffer,
//     createAnswer,
//   };
// };

// export default useWebRTC;