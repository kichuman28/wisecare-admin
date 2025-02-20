import AgoraRTC from 'agora-rtc-react';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { ref, set, serverTimestamp } from 'firebase/database';
import { rtdb } from '../../../firebase'; // Update to use rtdb instead of db
import { useState, useEffect } from 'react';

const appId = import.meta.env.VITE_AGORA_APP_ID;
const appCertificate = import.meta.env.VITE_AGORA_APP_CERTIFICATE;

if (!appId) throw new Error('Agora App ID is not defined');
if (!appCertificate) throw new Error('Agora Certificate is not defined');

// Configure client options
const config = {
  mode: "rtc", // Real-time communication mode
  codec: "vp8", // Video codec
  appId: appId
};

// Configure video quality settings
export const videoConfig = {
  encoderConfig: {
    width: 640,
    height: 360,
    frameRate: 30,
    bitrate: 800
  }
};

// Create Agora client
export const useClient = () => {
  return AgoraRTC.createClient(config);
};

// Create audio and video tracks on demand
export const useMicrophoneAndCameraTracks = () => {
  const [tracks, setTracks] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const initializeTracks = async () => {
    try {
      setError(null);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: videoConfig.encoderConfig,
        optimizationMode: "detail" // Other options: "motion", "bandwidth"
      });
      const newTracks = [audioTrack, videoTrack];
      setTracks(newTracks);
      setReady(true);
      return newTracks;
    } catch (err) {
      setError(err);
      setReady(false);
      throw err;
    }
  };

  const releaseTracks = () => {
    if (tracks) {
      tracks[0]?.close();
      tracks[1]?.close();
      setTracks(null);
      setReady(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseTracks();
    };
  }, []);

  return {
    tracks,
    ready,
    error,
    initializeTracks,
    releaseTracks
  };
};

// Generate a token and save it to Firebase Realtime Database
export const generateAndSaveToken = async (channelName, uid, role = RtcRole.PUBLISHER) => {
  try {
    // Token expires in 1 hour
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    // Save token to Firebase Realtime Database
    const tokenRef = ref(rtdb, `agoraTokens/${channelName}/${uid}`);
    await set(tokenRef, {
      token,
      channelName,
      uid,
      role,
      createdAt: serverTimestamp(),
      expiresAt: privilegeExpiredTs * 1000, // Convert to milliseconds
    });

    return {
      token,
      expiresIn: expirationTimeInSeconds
    };
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

// Utility function to generate channel name
export const generateChannelName = (doctorId, patientId) => {
  return `consultation_${doctorId}_${patientId}`;
};

// Video call states
export const CallState = {
  IDLE: 'idle',
  JOINING: 'joining',
  CONNECTED: 'connected',
  ERROR: 'error',
  LEAVING: 'leaving'
};

// Error handling utility
export const handleError = (error) => {
  console.error('Agora error:', error);
  // Add your error reporting logic here
  return {
    code: error.code || 'UNKNOWN',
    message: error.message || 'An unknown error occurred',
    details: error.details || {}
  };
};

// Call quality presets
export const qualityPresets = {
  high: {
    width: 1280,
    height: 720,
    frameRate: 30,
    bitrate: 2000
  },
  medium: {
    width: 640,
    height: 360,
    frameRate: 30,
    bitrate: 800
  },
  low: {
    width: 320,
    height: 180,
    frameRate: 15,
    bitrate: 400
  }
}; 