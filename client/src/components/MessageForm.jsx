
import Context from "../context/Context";
import '../styles/components/MessageForm.css';

function MessageForm(props) {
    return (<Context.Consumer>
            {
                ({userState})=>{
                    const selfUser = userState._id === props.sender._id;
                    var messageClass = 'sender-user';
                    if (selfUser){
                        messageClass = 'self-user';
                    }
                    return(
                        <>
                        {selfUser 
                                ? 
                                <p  className='self-user'  >
                                    {`You: ${props.message}`}
                                </p>
                                : 
                                <p  className='sender-user'  >
                                    {`${props.sender.userName}: ${props.message}`}
                                </p>
                        }
                        </>
                    );
                }
            }
        </Context.Consumer>)
}

export default MessageForm;