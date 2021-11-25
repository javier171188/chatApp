import { useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Input from "@mui/material/Input";
import BrushIcon from "@mui/icons-material/Brush";
import Button from "@mui/material/Button";
import {
  sendMessageAction,
  subscribeRoomsAction,
  addUserToRoomAction,
  setDrawingAreaOn,
  acceptRequestAction,
} from "../redux/actions";
import MessageForm from "./MessageForm";
import AddingUsers from "./AddingUsers";
import Drawing from "./Drawing";
import "../styles/components/ChatView.css";


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
  } = props;
  const { t, i18n } = useTranslation();

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
  return (
    <div className='chat'>
      {currentRoomId && (groupRoom
        ? <div className='chat-header'>
          <h1 className='chat-header__name'>{currentRoomName}</h1>
          <div className='chat-header__buttons'>
            <Button
              className='chat-header__add'
              onClick={() => { addUserToRoom(currentRoomId); }}
              color='inherit'
              variant='contained'
              id='add-user-button'
            >
              {t("Add")}
            </Button>
            <Button
              className='chat-header__remove'
              onClick={removeUserFromRoom}
              color='inherit'
              variant='contained'
              id='remove-user-button'
            >
              {t("Remove")}
            </Button>
          </div>
        </div>
        : <div className='chat-header'>
          <h1 className='chat-header__name'>{currentRoomName}</h1>
        </div>
      )}
      <div className='chat-messages'>
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
              color='inherit'
              variant='contained'
              onClick={acceptRequest}
            >
              {t("Accept")}
            </Button>
          </>
        }
      </div>
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
              color='inherit'
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
            color='inherit'
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
    </div>);
}

const mapStateToProps = (state) => ({
  userState: state.userState,
  currentMessages: state.currentMessages,
  currentRoomId: state.currentRoomId,
  contactStatus: state.contactStatus,
  addingUser: state.addingUser,
  drawingAreaOn: state.drawingAreaOn,
  groupRoom: state.groupRoom,
  currentRoomName: state.currentRoomName,
  currentUserChat: state.currentUserChat,
});

const mapDispatchToProps = {
  sendMessageAction,
  subscribeRoomsAction,
  addUserToRoomAction,
  setDrawingAreaOn,
  acceptRequestAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);
