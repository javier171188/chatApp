'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import NotFound from '../components/NotFound';
import GoHome from '../components/GoHome';
import UploadAvatar from '../components/UploadAvatar';
import CreateRoom from '../components/CreateRoom';
import Settings from '../components/Settings';



const App = ({ isAuth }) => (
    isAuth
        ? <BrowserRouter>
            <Switch>
                <Route exact path='/chat/upload/avatar' component={UploadAvatar} />
                <Route exact path='/chat' component={Home} />
                <Route exact path='/chat/login' component={GoHome} />
                <Route exact path='/chat/register' component={GoHome} />
                <Route exact path='/chat/create-room' component={CreateRoom} />
                <Route exact path='/chat/settings' component={Settings} />
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
        : <BrowserRouter>
            <Switch>
                <Route exact path='/chat' component={Login} />
                <Route exact path='/chat/login' component={Login} />
                <Route exact path='/chat/register' component={Register} />
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
);

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps, null)(App);