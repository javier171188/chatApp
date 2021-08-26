'use strict';
import { useForm } from 'react-hook-form';

const API = process.env.register || 'http://localhost:3000/';

function Register(){
  const {register, handleSubmit} = useForm();
  const onSubmit = (data) => {
    
    const { password, confirmPassword } = data;
    if (password === confirmPassword){
      fetch(API + 'register')
        .then(data => data.json())
        .then(data => console.log(data))  
    }
  }
  return (
    <div className="register-box">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>  
      <label htmlFor="name">
          User Name
          <input
            id="name"
            placeholder="Choose an user name"
            {...register('userName')}
          />
        </label>
        <label htmlFor="e-mail">
          E-mail
          <input
            id="e-mail"
            placeholder="Write your e-mail"
            {...register('email')}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            placeholder="password"
            {...register('password')}
          />
        </label>

        <label htmlFor="confirm-password">
          Confirm your password
          <input
            type="password"
            id="confirm-password"
            placeholder="confirm your password"
            {...register('confirmPassword')}
          />
        </label>

        <button className='register-button' >Register</button>
      </form>
      <div>Already an user? <a href="/login">log in</a></div>
      
    </div>
  );
}

export default Register;