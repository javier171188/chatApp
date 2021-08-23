'use strict';

import { useState } from "react";


const Login = () => {
  const [password, updatePassword] = useState("");
  const [email, updateEmail] = useState("");
  
  return (
    <div className="login-box">
      <form className="login-form">
        <label htmlFor="e-mail">
          E-mail
          <input
            id="e-mail"
            value={email}
            placeholder="Write your e-mail"
            onChange={(e) => updateEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            value={password}
            placeholder="password"
            onChange={(e) => updatePassword(e.target.value)}
          />
        </label>

        <button className="login-button">Log in!</button>
      </form>

      <div>Not an user yet? <a href="#">register</a></div>
      
    </div>
  );
};

export default Login;