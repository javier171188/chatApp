'use strict';

import { useState } from "react";

const Register = () => {
  const [password, updatePassword] = useState("");
  const [confPassword, updateConfPassword] = useState("");
  const [email, updateEmail] = useState("");
  const [userName, updateName] = useState('');
  return (
    <div className="register-box">
      <form className="register-form"> 
      <label htmlFor="name">
          User Name
          <input
            id="name"
            value={userName}
            placeholder="Choose an user name"
            onChange={(e) => updateName(e.target.value)}
          />
        </label>
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

        <label htmlFor="confirm-password">
          Confirm your password
          <input
            type="password"
            id="confirm-password"
            value={confPassword}
            placeholder="confirm your password"
            onChange={(e) => updateConfPassword(e.target.value)}
          />
        </label>

        <button className='register-button' onSubmit={test(userName)}>Register</button>
      </form>
      <div>Already an user? <a href="/login">log in</a></div>
      
    </div>
  );
};

function test(userName){
  console.log('hello');
}

export default Register;