import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { startCallAction} from "../redux/actions";



function Conference(props){
    const { 
        recording, 
        startCallAction, 
        currentRoomName, 
        streams, 
        streamName,
        audio,
        video, 
    } = props;
   
    const history = useHistory();
   

    useEffect(() => {
        startCallAction({
            recording, 
            streamName,
            audio,
            video, 
        });

    }, []);

    function handleHangUpClick(){
        history.push('/chat/');
    }

return(
    <>
    <Box component='h1'>{currentRoomName}</Box>
    <Button variant="contained" onClick={handleHangUpClick}>Hang up</Button>
    <Box component='div' className='user'>
        
        <video 
            id="red5pro-publisher" 
            className="red5pro-publisher" 
            controls 
            autoPlay 
            playsInline 
            muted 
            width={320} 
            height={240}
       >
        </video>
    </Box>

    <Stack className='participants' spacing={2} direction="row" >
        {streams.map(s =>(
            <video 
            id={s} 
            className="red5pro-subscriber" 
            controls 
            autoPlay 
            playsInline 
            muted 
            width={320} 
            height={240}
            key={s}
        >
            <source src="https://youtu.be/mFY0J5W8Udk" />
        </video>
        ))}
    </Stack>
    </>
)
}

const mapStateToProps = (state) => ({
    currentRoomName: state.chatArea.currentRoomName,
    streams: state.conferenceArea.streams,
    streamName: state.userState._id,
    recording: state.conferenceArea.recording,
    video: state.conferenceArea.videoOn,
    audio: state.conferenceArea.microphoneOn,
  });

  const mapDispatchToProps = {
        startCallAction,
  };
  

  export default connect(mapStateToProps, mapDispatchToProps)(Conference);
