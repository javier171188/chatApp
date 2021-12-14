import { connect } from "react-redux";
import { setAddingUser, addUsersAction } from "../redux/actions";
import "../styles/components/AddingUsers.css";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


const AddingUsers = (props) => {
  const {
    currentUsers,
    currentRoomName,
    userState,
    setAddingUser,
    addUsersAction,
    currentRoomId,
  } = props;
  const { t, i18n } = useTranslation();

  function addUser(event) {
    event.preventDefault();
    const allTarget = Object.values(event.target);
    const contactsList = allTarget.filter((c) => c.checked);
    const date = new Date();
    const dateStr = date.getTime().toString();
    const newUsers = contactsList.map((c) => ({ userName: c.value, _id: c.id, joinDate: dateStr }));

    addUsersAction({ roomId: currentRoomId, newUsers });
  }

  function goBack() {
    setAddingUser(false);
  }
  const currentUsersIds = currentUsers.map((c) => c._id);
  return (
    <div className='adding-mod'>
      <div className='adding-box'>
        <Typography
          variant="h5"
          component="h2"
          className='adding-title'
          color="primary"
          sx={{ m: 2 }}
        >
          {t("Add users to")} {currentRoomName}
        </Typography>
        <Divider />
        <Divider />
        {<form className='adding-form'
          onSubmit={addUser}
        >
          {<Container
            className='adding-contacts'
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {userState.contacts.map((c) => {
              if (!currentUsersIds.includes(c._id) && c.status === "accepted") {
                return (
                  <label htmlFor={c._id} key={c._id} className='adding-contacts__contact'>
                    <input
                      id={c._id}
                      type="checkbox"
                      name="participants"
                      value={c.userName} /> {c.userName}
                  </label>
                );
              }
            })
            }
          </Container>
          }
          <Button
            className='adding-button'
            id='adding-button'
            type='submit'
            color='primary'
            variant='contained'
          >
            {t("Add")}
          </Button>
        </form>}
        <Button
          className='adding-button__cancel'
          id='adding-button__cancel'
          onClick={goBack}
          color='error'
          variant='contained'
        >
          {t("Cancel")}
        </Button>
      </div>
    </div>);
};

const mapStateToProps = (state) => ({
  userState: state.userState,
  currentRoomName: state.chatArea.currentRoomName,
  currentRoomId: state.chatArea.currentRoomId,
  currentUsers: state.chatArea.currentUsers,
});

const mapDispatchToProps = {
  setAddingUser,
  addUsersAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddingUsers);
