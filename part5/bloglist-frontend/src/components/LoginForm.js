import React from 'react';

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

export default LoginForm;
