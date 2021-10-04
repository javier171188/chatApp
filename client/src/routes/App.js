'use strict';
import React from 'react';
import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import NotFound from '../components/NotFound';
import GoHome from '../components/GoHome';
import UploadAvatar from '../components/UploadAvatar';
import Context from '../context/Context';
import CreateRoom from '../components/CreateRoom';



const App = () => (
    <Context.Consumer>
            {
                ({ isAuth }) => isAuth 
                    ? <BrowserRouter>
                        <Switch>
                            <Route exact path='/chat/upload/avatar' component={UploadAvatar} />
                            <Route exact path='/chat' component={Home} /> 
                            <Route exact path='/chat/login' component={GoHome} />
                            <Route exact path='/chat/register' component={GoHome} />
                            <Route exact path='/chat/create-room' component={CreateRoom} />
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
            }
    </Context.Consumer>
);

export default withNamespaces()(App);