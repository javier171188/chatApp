
import Context from "../context/Context";

function MessageForm(props) {
    return (<Context.Consumer>
            {
                ({userState})=>{
                    const selfUser = userState._id === props.sender._id;
                    const messageClass = 'sender-user';
                    if (selfUser){
                        messageClass = 'self-user';
                    }
                    return(
                        <p  className={messageClass}  >
                            {`${props.sender.userName}: ${props.message}`}
                        </p>
                    );
                }
            }
        </Context.Consumer>)
}

export default MessageForm;