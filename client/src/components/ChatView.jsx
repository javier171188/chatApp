import { useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Input from "@mui/material/Input";
import BrushIcon from "@mui/icons-material/Brush";
import Button from "@mui/material/Button";
import {
  sendMessageAction,
  subscribeRoomsAction,
  addUserToRoomAction,
  setDrawingAreaOn,
  acceptRequestAction,
  startCallAction,
  
} from "../redux/actions";
import MessageForm from "./MessageForm";
import AddingUsers from "./AddingUsers";
import Drawing from "./Drawing";
import "../styles/components/ChatView.css";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


function ChatView(props) {
  const {
    currentMessages,
    userState,
    currentRoomId,
    contactStatus,
    addingUser,
    drawingAreaOn,
    currentRoomName,
    groupRoom,
    sendMessageAction,
    subscribeRoomsAction,
    addUserToRoomAction,
    setDrawingAreaOn,
    acceptRequestAction,
    currentUserChat,
    startCallAction,
  } = props;
  const { t, i18n } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    const $messages = document.querySelector(".chat-messages");
    if ($messages) {
      $messages.scrollTop = $messages.scrollHeight;
    }
  }, [currentMessages]);

  subscribeRoomsAction(userState);

  function addUserToRoom(roomId) {
    addUserToRoomAction(roomId);
  }

  function removeUserFromRoom() {
    console.log("Deleting user");
  }

  function acceptRequest() {
    const params = {
      participants: [userState._id, currentUserChat],
    };
    acceptRequestAction(params);
  }

  function openDrawingArea() {
    setDrawingAreaOn(true);
  }

  function sendNewMessage(event, imageStr = "") {
    const data = {
      event, userState, currentRoomId, imageStr,
    };
    sendMessageAction(data);
  }

  function handleClickCall(){
    history.push('/chat/conference');
    startCallAction();
  }
  return (
    <Box className='chat'>
      <Toolbar
        sx={{
          bgcolor: 'primary.main',
          color: '#fff'
        }}
        className='chat-header'>
        {currentRoomId && (<>
          <h1 className='chat-header__name'>{currentRoomName}</h1>
          {groupRoom && <>
            <div className='chat-header__buttons'>
            <Button
                className='chat-header__add'
                onClick={handleClickCall}
                color='primary'
                variant='contained'
                id='start-conference-button'
              >
                {t("Call")}
              </Button>
              <Button
                className='chat-header__add'
                onClick={() => { addUserToRoom(currentRoomId); }}
                color='primary'
                variant='contained'
                id='add-user-button'
              >
                {t("Add")}
              </Button>
              <Button
                className='chat-header__remove'
                onClick={removeUserFromRoom}
                color='error'
                variant='contained'
                id='remove-user-button'
              >
                {t("Remove")}
              </Button>
            </div></>
          }
        </>
        )}
      </Toolbar>

      <Box sx={{
        border: 3,
        borderColor: 'primary.main'
      }} className='chat-messages'>

        {currentMessages.map((message) => (
          <MessageForm
            key={message.date + message.sender._id}
            userState={userState}
            sender={message.sender}
            message={message.message}
            date={message.date.toString()}
            isImage={message.isImage}
          />
        ))
        }
        {
          !currentRoomId && <h1 className='chat-start'>{t("Click a user or a conversation to start chatting.")}</h1>
        }
        {
          contactStatus === "pending" && <h1 className='chat-start'>{currentRoomName + t(" has not accepted your request yet.")}</h1>
        }
        {
          contactStatus === "request" && <>
            <h1 className='chat-start'>{currentRoomName + t(" wants to add you as a contact.")}</h1>
            <Button
              className='chat-accept'
              id='chat-accept-button'
              variant='contained'
              onClick={acceptRequest}
            >
              {t("Accept")}
            </Button>
          </>
        }
      </Box>
      {(currentRoomId && currentRoomId !== "1")
        && <div className='chat-submit-bar'>
          <form onSubmit={(event) => sendNewMessage(event)}
            className='chat-submit-form'
          >
            <div className='chat-input__container' >
              <Input
                autoFocus
                id='messages-input'
                className='chat-writing'
                type="text"
                placeholder={t("Type a message...")}
                fullWidth
              />
            </div>
            <Button
              className='chat-button'
              id='send-message__button'
              color='primary'
              variant='contained'
              type="submit"
            >
              {t("Send")}
            </Button>
          </form>
          <Button
            className='chat-button__drawing'
            id='drawing-button'
            onClick={openDrawingArea}
            variant="contained"
            color='secondary'
            startIcon={<BrushIcon />}
          >
            {t("Draw")}
          </Button>
        </ div>
      }
      {addingUser
        && <AddingUsers />
      }
      {drawingAreaOn
        && <Drawing />
      }
    </Box>);
}

const mapStateToProps = (state) => ({
  userState: state.userState,
  currentMessages: state.chatArea.currentMessages,
  currentRoomId: state.chatArea.currentRoomId,
  contactStatus: state.sideChanges.contactStatus,
  addingUser: state.modals.addingUser,
  drawingAreaOn: state.modals.drawingAreaOn,
  groupRoom: state.sideChanges.groupRoom,
  currentRoomName: state.chatArea.currentRoomName,
  currentUserChat: state.chatArea.currentUserChat,
});

const mapDispatchToProps = {
  sendMessageAction,
  subscribeRoomsAction,
  addUserToRoomAction,
  setDrawingAreaOn,
  acceptRequestAction,
  startCallAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);
