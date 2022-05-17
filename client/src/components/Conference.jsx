import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import OvenLiveKit from 'ovenlivekit';



function Conference(props){
    const{currentRoomName, userState} = props;
    const {userId} = userState;
    const history = useHistory();
    const localInput = OvenLiveKit.create();
    let localVideo;

    useEffect(()=>{
        localVideo = document.getElementById('local-video');
        localInput.attachMedia(localVideo);
        // Get media stream from user device
        localInput.getUserMedia().then(function () {
                localVideo.srcObject = localInput.stream;
                // Got device stream and start streaming to OvenMediaEngine
                //localInput.startStreaming('wss://your_oven_media_engine:3333/app/stream?direction=send');

                localInput.startStreaming(
                    `ws://localhost:3333/app/stream0?direction=send&transport=tcp`,
                    {
                      maxVideoBitrate: 500,
                    }
                  );
        });
    }, [])
    
    function goHome(){
        console.log('Remember to finish all the calls.')
        localVideo.srcObject = null;
        localInput.remove();
        history.push('/chat/');
    }
    return (
        <>
            <h1>Call with {currentRoomName} </h1>
            <video id='local-video'></video>
            <button onClick={goHome}>Hang up!</button>
        </>
    )
}


const mapStateToProps = (state) => ({
    currentRoomName: state.chatArea.currentRoomName,
    userState: state.userState,
  });

export default connect(mapStateToProps, null)(Conference);
