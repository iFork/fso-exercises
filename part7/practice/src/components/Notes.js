import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

export default function Notes ({ notes }) { 
  return (
    <div> 
      <h1>Notes</h1>
      <Table striped hover >
        <thead>
          <tr>
            <th>Note title</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => {
            return (
              <tr key={note.id}>
                <td>
                  <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </td>
                <td>
                  {note.user}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table></div>
  );
}

