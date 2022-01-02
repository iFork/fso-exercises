function AddNote (props) { 
  return (
    <form>
      <input 
        name="note"
        type="text"
      />
      <button type="submit">
        Add note
      </button>
    </form>
  );
}

export default AddNote;
