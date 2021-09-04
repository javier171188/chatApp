'use strict';
import React from 'react';
import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import NotFound from '../views/NotFound';
import GoHome from '../views/GoHome';
import UploadAvatar from '../views/UploadAvatar';
import Context from '../context/Context';



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
                            <Route component={NotFound} />
                        </Switch>
                      </BrowserRouter>
                    : <BrowserRouter>
                        <Switch>
                            <Route exact path='/' component={Login} /> 
                            <Route exact path='/chat' component={Login} /> 
                            <Route exact path='/chat/login' component={Login} />
                            <Route exact path='/chat/register' component={Register} />
                            <Route component={NotFound} />
                        </Switch>
                    </BrowserRouter>
            }
    </Context.Consumer>
);

export default App;