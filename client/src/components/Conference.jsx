import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import OvenLiveKit from 'ovenlivekit';



function Conference(props){
    const{currentRoomName} = props;
    const history = useHistory();


    
    const localInput = OvenLiveKit.create();
    // Get media stream from user device
    localInput.getUserMedia().then(function () {
            let localVideo = document.getElementById('local-video');
            localInput.attachMedia(localVideo);
            localVideo.srcObject = localInput.stream;
            
            
            // Got device stream and start streaming to OvenMediaEngine
            //localInput.startStreaming('wss://your_oven_media_engine:3333/app/stream?direction=send');
    });


    

    function goHome(){
        console.log('Remember to finish the call.')
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
  });

export default connect(mapStateToProps, null)(Conference);
