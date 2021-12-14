import React from "react";
import { Link } from "react-router-dom";
//import "../styles/components/Header.css";
import Menu from './Menu';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { setAuth } from "../redux/actions";
import * as type from "../redux/types";
import store from "../redux/store";

const Header = () => {
  const { t, i18n } = useTranslation();

  const action = ({ type, data }) => store.dispatch({
    type,
    data,
  });
  action({
    type: type.GET_USER,
  });


  return (
    <Box >
      <AppBar position="static">
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {/*
      <div className="to-center">
        <div>
          <p> ...</p>
        </div>
      </div>*/
          }
          {/*<h1 className='header-title' onClick={goHome}>{t("App name")}</h1>*/}
          <Button
            component={Link}
            to='/chat/'
          >
            <Typography
              variant="h4"
              component="div"
              sx={{ mr: 2 }}
              style={{ textTransform: 'none' }}
              color="common.white"
            >
              {t("App name")}
            </Typography>
          </Button>
          {/*<Typography className="header__menu" sx={{ flexGrow: 1 }} component='div'>
            <div className="header__menu--button">
              <p className='header__menu--icon'><MenuIcon></MenuIcon></p>
            </div>
            <ul className='header__menu--options'>
              <li ><Link className='header__menu--item' to="/chat/settings/">{t("Settings")}</Link></li>
              <li ><div className='header__menu--item' onClick={handleLogOut}>{t("Logout")}</div></li>
            </ul>
        </Typography>*/}
          <Menu />
        </Toolbar>
      </AppBar>
    </Box >
  );
};

const mapDispatchToProps = {
  setAuth,
};

export default connect(null, mapDispatchToProps)(Header);
