import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import "./i18n";
import App from "./routes/App";

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import CssBaseline from "@material-ui/core/CssBaseline";


let theme = createTheme({
    palete: {
        primary: red,
        secondary: blue,
        type: 'dark'
    },

});

//let theme = createTheme();
//theme = responsiveFontSizes(theme);


// Erase
//require("dotenv").config();

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById("root"),
);
