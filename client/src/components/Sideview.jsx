import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "../styles/components/Sideview.css";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { setGroupRoom, setCurrentUserChat, socketGetRoom } from "../redux/actions";
import { useHistory } from "react-router-dom";


const { USER_PATH } = process.env;

const Sideview = (props) => {
  const { t, i18n } = useTranslation();
  const { userState } = props;
  const history = useHistory();

  function openOneToOneChat(e, current, receiver, userState) {
    let clickedElement = e.target;
    let { localName } = clickedElement;
    while (localName !== "li") {
      clickedElement = clickedElement.parentElement;
      localName = clickedElement.localName;
    }
    const contactClasses = clickedElement.className.split(" ");

    props.setGroupRoom(false);
    props.setCurrentUserChat(
      receiver,
    );

    props.socketGetRoom({
      users: {
        current, receiver, userState, contactClasses,
      },
    });
  }

  function openGroupChat(roomId, userState) {
    props.socketGetRoom({
      users: { roomId, userState },
    });
    props.setGroupRoom(true);
  }

  function createGroupChat() {
    history.push("/chat/create-room");
  }
  console.log("times"); // just to be sure the element does not render many times

  let commonStyles = {
    border: 3,
    borderColor: 'primary.main'
  }

  return (
    <Box className='user'>
      <Box
        className='user-picture user-picture__container'
        sx={commonStyles}
      >
        {
          userState.hasAvatar && <img className='user-picture' src={`${USER_PATH}/${userState._id}/avatar`} alt="User's avatar" />
        }
      </Box>
      <Box
        className='user-info'
        sx={commonStyles}
      >
        <div className='user-name--container'>
          <h1 className='user-name--text'>
            {userState.userName}
          </h1>
        </div>
        <Divider />
        <Divider />
        <div className='user-contacts'>
          <h1 className="contacts">{t("ContactHeader")}</h1>
          <List>
            {userState.contacts.map((child) => {
              const newMsgs = child.newMsgs ? "new-messages"
                : "no-messages";
              const { status } = child;

              return (
                <ListItem key={child._id} className={`contacts ${newMsgs} ${status}`} onClick={(e) => {
                  openOneToOneChat(
                    e,
                    userState._id,
                    child._id,
                    userState,
                  );
                }}
                >
                  <ListItemIcon >
                    <ArrowRightRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={child.userName} />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Box >
      <Box
        className='chats'
        sx={commonStyles}
      >
        <div className='chats-header'>
          <h1>{t("Group Chats:")}</h1>
          <Box
            className='chats-button'
            onClick={createGroupChat}

          >
            <AddCircleIcon color='primary'></AddCircleIcon>
          </Box>
        </div>
        <Divider />
        <Divider />
        <nav className='chats-nav'>{
          userState.conversations.length < 1
            ? t("You have not started any group chat.")
            : <List>
              {userState.conversations.map((c) => {
                const newMsgs = c.newMsgs ? "new-messages"
                  : "no-messages";
                return (<ListItem
                  key={c.roomId}
                  id={c.roomId}
                  className={`room ${newMsgs}`}
                  onClick={() => openGroupChat(c.roomId, userState)}
                >
                  <ListItemIcon>
                    <ArrowRightRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={c.roomName} />
                </ListItem>);
              })}
            </List>
        }
        </nav>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  userState: state.userState,
  currentUserChat: state.chatArea.currentUserChat,
});

const mapDispatchToProps = {
  setGroupRoom,
  setCurrentUserChat,
  socketGetRoom,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sideview);
