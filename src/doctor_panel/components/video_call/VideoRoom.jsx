import React, { useState, useEffect, useRef } from 'react';
import { useClient, useMicrophoneAndCameraTracks, generateAndSaveToken, generateChannelName, CallState } from './AgoraConfig';
import { useAuth } from '../../../context/AuthContext';
import { VideoCameraIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const VideoRoom = ({ patient, onError, children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [callState, setCallState] = useState(CallState.IDLE);
  const [permissionError, setPermissionError] = useState(null);
  
  const client = useClient();
  const { tracks, ready, error, initializeTracks, releaseTracks } = useMicrophoneAndCameraTracks();
  const localVideoRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mounted) {
          if (mediaType === "video") {
            setUsers(prevUsers => {
              if (!prevUsers.find(u => u.uid === user.uid)) {
                return [...prevUsers, user];
              }
              return prevUsers;
            });
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          user.audioTrack?.stop();
        }
        if (mediaType === "video") {
          setUsers(prevUsers => prevUsers.filter(User => User.uid !== user.uid));
        }
      });

      client.on("user-left", (user) => {
        setUsers(prevUsers => prevUsers.filter(User => User.uid !== user.uid));
      });
    };

    init();

    return () => {
      mounted = false;
      client.removeAllListeners();
    };
  }, [client]);

  // Handle local video display
  useEffect(() => {
    if (start && tracks && tracks[1] && localVideoRef.current) {
      tracks[1].play(localVideoRef.current);
    }
  }, [start, tracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callState !== CallState.IDLE) {
        leaveChannel();
      }
    };
  }, []);

  const joinChannel = async () => {
    if (!patient) return;
    
    try {
      setCallState(CallState.JOINING);
      setPermissionError(null);

      // Initialize tracks (this will trigger permission requests)
      const newTracks = await initializeTracks();
      
      const channelName = generateChannelName(user.uid, patient.id);
      const { token } = await generateAndSaveToken(channelName, user.uid);
      
      await client.join(import.meta.env.VITE_AGORA_APP_ID, channelName, token, user.uid);
      await client.publish(newTracks);
      setStart(true);
      setCallState(CallState.CONNECTED);
    } catch (error) {
      setCallState(CallState.ERROR);
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission')) {
        setPermissionError('Please allow access to camera and microphone to join the call.');
      }
      releaseTracks();
      onError(error);
    }
  };

  const leaveChannel = async () => {
    setCallState(CallState.LEAVING);
    releaseTracks();
    await client.leave();
    client.removeAllListeners();
    setUsers([]);
    setStart(false);
    setCallState(CallState.IDLE);
    setPermissionError(null);
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      {start && tracks ? (
        <div className="absolute inset-0">
          {/* Remote videos */}
          <div className="absolute inset-0">
            {users.length > 0 ? (
              users.map((user) => (
                user.videoTrack && (
                  <div key={user.uid} className="w-full h-full">
                    <div ref={(node) => node && user.videoTrack.play(node)} className="w-full h-full object-cover" />
                  </div>
                )
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoCameraIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for others to join...</p>
                </div>
              </div>
            )}
          </div>

          {/* Local video */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div ref={localVideoRef} className="w-full h-full" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            {permissionError ? (
              <>
                <ExclamationCircleIcon className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg text-red-500">{permissionError}</p>
                <p className="text-sm mt-2">Please check your browser settings and try again</p>
              </>
            ) : (
              <>
                <VideoCameraIcon className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Ready to start consultation</p>
                <p className="text-sm mt-2">Click join to start video call</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Return the control functions to be used by parent */}
      {typeof children === 'function' && children({ joinChannel, leaveChannel, callState, tracks })}
    </div>
  );
};

export default VideoRoom; 