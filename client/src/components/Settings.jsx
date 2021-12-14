import Header from "./Header";
import { changeLanguageAction } from "../redux/actions";
import "../styles/components/Header.css";
import "../styles/components/Settings.css";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";


const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];

const Settings = ({ userState, changeLanguageAction }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("language"));


  let commonStyles = {
    border: 3,
    borderColor: 'primary.main'
  }

  function changeLanguage(event) {
    event.preventDefault();
    const languages = Object.values(event.target);
    const chosenLanguage = languages.filter((l) => l.checked)[0];

    const paramsLang = {
      email: JSON.parse(sessionStorage.getItem("email")),
      language: chosenLanguage.value,
    };

    changeLanguageAction({ paramsLang });
    i18n.changeLanguage(chosenLanguage.value);
  }

  function handleChange(e) {
    setLanguage(e.target.value);
  }

  return (
    <>
      <Header />
      <Typography
        variant="h4"
        component="h2"
        className='settings__title'
        color="primary"
      >
        {t("Settings")}
      </Typography>
      <Box
        className='settings__user'
        sx={commonStyles}
      >
        <Typography
          className='settings__user-title'
          variant="h5"
          component="h3"
          color="primary"
        >
          {t("User Options")}
        </Typography>
        <Divider />
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
          className='setting__user--options'>
          {t("User Options")}...
        </Typography>
      </Box>
      <Box sx={commonStyles}>
        <form onSubmit={(e) => changeLanguage(e)} className='settings__language'>
          <Typography
            variant="h5"
            component="h3"
            className='settings__language-title'
            color="primary"
          >
            {t("Choose your language")}
          </Typography>
          <Divider />
          <div className='settings__language-container'>
            <div className='settings__language-list'>
              {LANGUAGES.map((l) => (<label htmlFor={l.code} key={l.code} className='settings__language-label'>
                <input
                  id={l.code}
                  type="radio"
                  name="participants"
                  value={l.code}
                  checked={l.code === language}
                  onChange={(e) => handleChange(e)}
                />
                {t(l.name)}
              </label>))}
            </div>
            <Button
              className='settings__language-button'
              id='settings__language-button'
              type='submit'
              variant='contained'
              style={{ textTransform: 'none' }}
            >
              {t("Choose")}
            </Button>
          </div>
        </form>
      </Box>
      <Button
        component={Link}
        to='/chat/'
        className='settings__cancel-button'
        id='settings__cancel-button'
        variant='outlined'
        style={{ textTransform: 'none' }}
      >
        {t("Go back")}
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  userState: state.userState,
});

const mapDispatchToProps = {
  changeLanguageAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
