import { useHistory } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';

export default function Login ({ onLogin }) {
  const history = useHistory();

  const handleLogin = (evt) => {
    evt.preventDefault();
    onLogin(evt.target.username.value);
    history.push('/');
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group
        as={Col}
        controlId="username">
        <Form.Label>username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          htmlSize={2}
          placeholder="username" />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>password </Form.Label>
        <Form.Control
          type="password"
          name="password" 
          placeholder="password"
          htmlSize={6}
        />
      </Form.Group>
      <Button variant="primary" type="submit">login</Button>
    </Form>
  )
};
