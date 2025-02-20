import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
const VideoCallCounter = ({
	name = 'User',
	visible = true
}: {
	name: string | undefined;
	visible?: boolean;
}) => {
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(true);

	useEffect(() => {
		let timer: any;
		if (isRunning) {
			timer = setInterval(() => {
				setSeconds(prevSeconds => prevSeconds + 1);
			}, 1000);
		} else {
			clearInterval(timer);
		}
		return () => clearInterval(timer);
	}, [isRunning]);

	const formatTime = (secs: any) => {
		const minutes = Math.floor(secs / 60);
		const secsRemaining = secs % 60;
		return `${String(minutes).padStart(2, '0')}:${String(secsRemaining).padStart(2, '0')}`;
	};

	return (
		<View style={{
			alignItems: 'center',
			justifyContent: 'center',
			padding: 20,
			position: 'absolute',
			top: 60,
			zIndex: 1,
			width: '100%',
		}}>
			<View>
				<Text style={{
					fontSize: 20,
					fontWeight: 'bold',
					color: 'white',
				}}>{name}
				</Text>
			</View>
			<Text style={{
				fontSize: 20,
				fontWeight: 'bold',
				color: 'white',
			}}>{formatTime(seconds)}</Text>
		</View>
	);
};

export default VideoCallCounter;