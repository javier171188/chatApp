'use strict';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { render } from "react-dom";
import Login from "./LoginForm";
import Register from "./RegisterForm";

const App = () => {
  return (
    <div>
      <h1 className="title">Chat App!</h1>
      <Router>
         <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
              <Register/>
          </Route>
          <Route path="/">
            Home
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
};

render(<App />, document.getElementById("root"));