import React from 'react';
import { BrowserRouter, Route  } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';

const App = () => (
    <BrowserRouter>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
    </BrowserRouter>
);

export default App;