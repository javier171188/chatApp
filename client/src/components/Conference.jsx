import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {getRoomUsers, checkStreamsAction, setCurrentStreamsAction} from '../redux/actions';
import OvenPlayer from 'ovenplayer';
import OvenLiveKit from 'ovenlivekit';
//require('hls.js');

let localInput;
let localVideo;
let checkStreamsInterval;

function Conference(props){
    const{currentRoomName, 
        userState, 
        currentUsers, 
        getRoomUsers, 
        currentRoomId,
        checkStreamsAction,
        currentStreams,
        setCurrentStreamsAction,
    } = props;
    const {_id:userId} = userState;
    const history = useHistory();
    let streamIds = currentStreams.map(s => s.split('-')[1]);
    
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
        streamIds.forEach((sId)=>{
            if (sId === userId) return;
            const player = OvenPlayer.create(`${currentRoomId}-${sId}`, {
                sources: [
                    //         {
                    //     label: 'label_for_webrtc',
                    //     // Set the type to 'webrtc'
                    //     type: 'webrtc',
                    //     // Set the file to WebRTC Signaling URL with OvenMediaEngine 
                    //     file: `ws://localhost:3333/app/${currentRoomId}-${sId}`
                    // },   
                    {type : "hls", 
                    file :  `http://localhost:8080/app/${currentRoomId}-${sId}/playlist.m3u8`, 
                    label: "hls"}
                ]
            });
        })

        if (!checkStreamsInterval){
            checkStreamsInterval = setInterval(checkStreamsAction, 2500,currentRoomId );
        }
        
    },[currentStreams]);

    
    function goHome(){
        console.log('Remember to clear the setInterval')
        localVideo.srcObject = null;
        localInput.remove();
        //The documentation mentions stopStreaming, but it doesn't seem to be defined.
        //localInput.stopStreaming();
        clearInterval(checkStreamsInterval);
        checkStreamsInterval = null;
        history.push('/chat/');
        setCurrentStreamsAction([]);
    }

    console.log('times');
    
    return (
        <>
            <h1>Call with {currentRoomName} </h1>
            <video id='local-video'></video>
            <button onClick={goHome}>Hang up!</button>
            <div>
                {/* {currentUsers.map((user)=>{
                    let currentUserId =user._id;
                   if (currentUserId !== userId && currentStreams.includes(currentUserId)){
                    return <div key={user._id}>
                        <div id={`${currentRoomId}-${user._id}`}></div>
                        <div > {user.userName}</div>
                   </div>
                   }
                })} */}
                {streamIds.map((stream)=>{
                    let currentUser =currentUsers.filter(u =>{
                        console.log(stream);  
                        return  u._id === stream})[0];
                    
                    let currentUserId = currentUser._id;
                   if (currentUserId !== userId ){
                    return <div key={currentUser._id}>
                        <div id={`${currentRoomId}-${stream}`}></div>
                        <div > {currentUser.userName}</div>
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
    currentStreams: state.chatArea.currentStreams,
  });

const mapDispatchToProps = {
    getRoomUsers,
    checkStreamsAction,
    setCurrentStreamsAction,
  };

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
