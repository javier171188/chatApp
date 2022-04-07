import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// let streams = ['Andy', 'John'];
// let currentRoomName = ['Video'];

function Conference(props){
    const history = useHistory();
    const {streams, currentRoomName}= props;

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
            <source src="https://youtu.be/mFY0J5W8Udk" />
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
  });

  export default connect(mapStateToProps, null)(Conference);
