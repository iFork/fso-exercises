import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({
  loginHandler,
  username,
  setUsername,
  password,
  setPassword}) => {
  return (
    <form onSubmit={loginHandler}>
      <div>
        <label htmlFor="id_username">Username</label>
        <input
          type="text"
          name="username"
          id="id_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="id_password">Password</label>
        <input
          type="password"
          name="password"
          id="id_password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

LoginForm.propTypes = {
  loginHandler: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
}
export default LoginForm;
