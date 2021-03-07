import { useHistory } from 'react-router-dom';

export default function Login ({ onLogin }) {
  const history = useHistory();

  const handleLogin = (evt) => {
    evt.preventDefault();
    onLogin(evt.target.username.value);
    history.push('/');
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input name="username" />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            name="password" />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}
