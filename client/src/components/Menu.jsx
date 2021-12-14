import React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import * as type from "../redux/types";
import { useHistory } from "react-router-dom";
import store from "../redux/store";


export default function Menu() {
    const action = ({ type, data }) => store.dispatch({
        type,
        data,
    });
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { t, i18n } = useTranslation();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGoSettings = () => {
        history.push('/chat/settings/');
    }

    const handleLogout = () => {
        setAnchorEl(null);
        action({
            type: type.LOGOUT,
        });
    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color='secondary'
                variant="Contained"
            >
                <MenuIcon></MenuIcon>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleGoSettings}>{t("Settings")}</MenuItem>
                <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
            </Menu>
        </div>
    );
}