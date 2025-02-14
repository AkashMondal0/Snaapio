import { mediaDevices } from "react-native-webrtc";

const peerConstraints = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' }
	]
};

let peerConnection = new RTCPeerConnection(peerConstraints);

peerConnection.addEventListener('icecandidate', (event) => {
	if (event.candidate) {
		// Send ICE candidate to the remote peer
		console.log('New ICE candidate', event.candidate);
	}
});

peerConnection.addEventListener('track', (event) => {
	const remoteStream = event.streams[0];
	console.log('Remote stream added:', remoteStream);
	// Render remote stream
	// setRemoteStream(remoteStream);
	return remoteStream
});

async function getMediaStream() {
	let mediaConstraints = {
		audio: true,
		video: { facingMode: 'user' }
	};

	try {
		const localStream = await mediaDevices.getUserMedia(mediaConstraints);
		console.log('Local stream obtained', localStream);
		return localStream;
	} catch (error) {
		console.error('Error obtaining media stream:', error);
	}
}

async function addTracksToPeer(localMediaStream) {
	localMediaStream.getTracks().forEach(track => {
		peerConnection.addTrack(track, localMediaStream);
	});
}


async function createOffer() {
	try {
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);
		console.log('Offer created and local description set', offer);
		// Send offer to remote peer
	} catch (error) {
		console.error('Error creating offer:', error);
	}
}


async function createAnswer(offerDescription) {
	try {
	  await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));
	  const answer = await peerConnection.createAnswer();
	  await peerConnection.setLocalDescription(answer);
	  console.log('Answer created and local description set', answer);
	  // Send answer to remote peer
	} catch (error) {
	  console.error('Error creating answer:', error);
	}
  }
  