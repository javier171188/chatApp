import Header from "./Header";
import { socketCreateNewRoom } from "../redux/actions";
import "../styles/components/Header.css";
import "../styles/components/CreateRoom.css";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";


const CreateRoom = ({ userState, socketCreateNewRoom }) => {
  const { t, i18n } = useTranslation();

  function createRoom(e) {
    e.preventDefault();
    const roomName = e.target[0].value;
    const allTarget = Object.values(e.target);
    const contactsList = allTarget.filter((c) => c.checked);
    const date = new Date();
    const dateStr = date.getTime().toString();
    const participants = contactsList.map((c) => ({
      userName: c.value,
      _id: c.id,
      joinDate: dateStr
    }));
    participants.push({ userName: userState.userName, _id: userState._id, joinDate: dateStr });

    socketCreateNewRoom({ roomName, participants });
  }

  return (
    <>
      <Header />
      <Box
        className='createRoomContainer'
        sx={{
          border: 3,
          borderColor: 'primary.main'
        }}>
        <Typography
          variant="h4"
          component="h2"
          className='settings__title'
          color="primary"
        >
          {t("Create New Room")}
        </Typography>
        <form onSubmit={createRoom}>
          <div className='new-room__name'>
            <label> <Typography
              variant="h5"
              component="h3"
              color="primary"
            >
              {t("Room Name")}
            </Typography>
            </label>
            <Input
              type="text"
              placeholder={t("Write a name for the room...")}
              required
              className='new-room__input-name'
            />
          </div>
          <br />
          <div className='new-room__contacts'>
            <Typography
              className='new-room__title-users'
              variant="h5"
              component="h3"
              color="primary"
            >
              {t("Choose people for the new chat room")}
            </Typography>
            <div className='new-room__contacts-list'>
              {userState.contacts.map((c) => {
                if (c.status === "accepted") {
                  return (<label htmlFor={c._id} key={c._id} className='new-room__contacts-label'>
                    <input
                      id={c._id}
                      type='checkbox'
                      name="participants"
                      value={c.userName} />
                    {c.userName}
                  </label>);
                }
              })}
            </div>
            <Button
              className='new-room__create-button'
              id='new-room__create-button'
              variant='contained'
              type='submit'
            >
              {t("Create")}
            </Button>
          </div>
        </form>
      </Box>
      <Button
        className='new-room__cancel-button'
        id='new-room__cancel-button'
        variant='outlined'
        component={Link}
        to='/chat/'
      >
        {t("Cancel")}
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  userState: state.userState,
});

const mapDispatchToProps = {
  socketCreateNewRoom,
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
