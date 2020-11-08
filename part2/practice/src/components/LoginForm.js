import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const LoginForm = ({ loginCb }) => {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");

        const handleLogin = async (event) => {
            // prevent default submit ('get' request and reload)
            event.preventDefault();
            // console.log('Logging in', username, password);
            await loginCb({ username, password })
            // NOTE: once login is successfull this component will become
            // unmounted (since LoginForm is rendered conditionally subject
            // to `user===null` and `loginCb` sets user state), hence
            // setting its states (reseting username, password) says 
            // `Warning: Can't perform a React state update on an unmounted
            // component.This is a no-op, but it indicates a memory leak`
            // 
            // setUsername("");
            // setPassword("");
        };

        return (
            <form
                onSubmit={handleLogin}
            >
                <div>
                    <label htmlFor='id_username'>Username</label>
                    <input
                        id='id_username'
                        type='text'
                        name='username'
                        value={username}
                        onChange={({target}) => setUsername(target.value)} />
                </div>
                <div>
                    <label htmlFor='id_password'>Password </label>
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

LoginForm.propTypes = {
    loginCb: PropTypes.func.isRequired
}

export default LoginForm;
