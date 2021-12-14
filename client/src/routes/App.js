import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch } from "react-router-dom";
import Home from "../components/Home.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import NotFound from "../components/NotFound.jsx";
import CreateRoom from "../components/CreateRoom.jsx";
import Settings from "../components/Settings.jsx";
import SecureRoute from "../components/SecureRoute.jsx";

const App = ({ isAuth }) => (
  <BrowserRouter>
    <Switch>
      <SecureRoute exact path='/chat' isAuth={isAuth} component={Home} />
      <SecureRoute exact path='/chat/login' isAuth={isAuth} component={Login} />
      <SecureRoute exact path='/chat/register' isAuth={isAuth} component={Register} />
      <SecureRoute exact path='/chat/create-room' isAuth={isAuth} component={CreateRoom} />
      <SecureRoute exact path='/chat/settings' isAuth={isAuth} component={Settings} />
      <SecureRoute isAuth={isAuth} component={NotFound} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = (state) => ({
  isAuth: state.loginLogout.isAuth,
});

export default connect(mapStateToProps, null)(App);
