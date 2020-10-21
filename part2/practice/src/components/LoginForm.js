import React from 'react';

export const LoginForm = ({
    loginHandler,
    username,
    setUsername,
    password,
    setPassword,
    }) => {
    // console.log({loginHandler, username, setUsername, password, setPassword});
    return (
        <form
            onSubmit={loginHandler}
        >
            <div>
                <label for='id_username'>Username</label>
                <input
                    id='id_username'
                    type='text'
                    name='username'
                    value={username}
                    onChange={({target}) => setUsername(target.value)} />
            </div>
            <div>
                <label for='id_password'>Password </label>
                <input
                    id='id_password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={({target}) => setPassword(target.value)} />
            </div>
            <div>
                <button type="submit">
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
