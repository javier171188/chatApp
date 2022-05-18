import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import OvenLiveKit from 'ovenlivekit';
import {getRoomUsers, checkStreamsAction} from '../redux/actions';
import OvenPlayer from 'ovenplayer';

let localInput;
let localVideo;
let checkStreamsInterval;

function Conference(props){
    const{currentRoomName, 
        userState, 
        currentUsers, 
        getRoomUsers, 
        currentRoomId,
        checkStreamsAction
    } = props;
    const {_id:userId} = userState;
    const history = useHistory();

    
    useEffect(()=>{
        getRoomUsers(currentRoomId);
        localInput = OvenLiveKit.create();
        localVideo = document.getElementById('local-video');
        localInput.attachMedia(localVideo);
        // Get media stream from user device
        localInput.getUserMedia().then(function () {
                localVideo.srcObject = localInput.stream;
                // Got device stream and start streaming to OvenMediaEngine
                localInput.startStreaming(
                    `ws://localhost:3333/app/${currentRoomId}-${userId}?direction=send&transport=tcp`,
                    {
                      maxVideoBitrate: 500,
                    }
                  );
                
        });

    }, [])

    useEffect(()=>{
        currentUsers.forEach((user)=>{
            if (user._id === userId) return;
            const player = OvenPlayer.create(`${currentRoomId}-${user._id}`, {
                sources: [
                            {
                        label: 'label_for_webrtc',
                        // Set the type to 'webrtc'
                        type: 'webrtc',
                        // Set the file to WebRTC Signaling URL with OvenMediaEngine 
                        file: `ws://localhost:3333/app/${currentRoomId}-${user._id}`
                    }
                ]
            });
        },[])

        if (!checkStreamsInterval){
            checkStreamsInterval = setInterval(()=>{
                checkStreamsAction();
            }, 2500 );
        }
        
    })

    
    function goHome(){
        console.log('Remember to clear the setInterval')
        localVideo.srcObject = null;
        localInput.remove();
        //The documentation mentions stopStreaming, but it doesn't seem to be defined.
        //localInput.stopStreaming();
        clearInterval(checkStreamsInterval);
        history.push('/chat/');
    }

    console.log('times');
    return (
        <>
            <h1>Call with {currentRoomName} </h1>
            <video id='local-video'></video>
            <button onClick={goHome}>Hang up!</button>
            <div>
                {currentUsers.map((user)=>{
                   if (user._id !== userId){
                    return <div key={user._id}>
                        <div id={`${currentRoomId}-${user._id}`}></div>
                        <div > {user.userName}</div>
                   </div>
                   }
                })}
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({
    currentRoomName: state.chatArea.currentRoomName,
    currentRoomId: state.chatArea.currentRoomId,
    userState: state.userState,
    currentUsers: state.chatArea.currentUsers,
  });

const mapDispatchToProps = {
    getRoomUsers,
    checkStreamsAction
  };

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
