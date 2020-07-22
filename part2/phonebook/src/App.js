import React, { useState } from 'react';


const PersonForm = ({newName, newNumber, setNewName, setNewNumber, 
                     addPerson }) => {
    return (
        <form>
            <div>
                Name: <input type="text" value={newName} 
                    onChange={event => 
                            setNewName(event.target.value)} />
            </div>
            <div>
                Number: <input type="tel" value={newNumber} 
                    onChange={event=> 
                            setNewNumber(event.target.value)} />
            </div>
            <div>
                <button type="submit" onClick={addPerson} >
                    Add
                </button>
            </div>

        </form>
    );
}

const Filter = ({filterName, setFilterName}) => {
    return (
        <div>
            Filter by name: <input type="text" value={filterName} 
                onChange={(e) => setFilterName(e.target.value)} />
        </div>
    );
}

const Person = (props) => {
    console.log("Person: props:", props);
    const { person } = props;
    return (
        <div>
            {person.name} {person.number}
        </div>
    );
}

const Persons = (props) => {
    console.log("Persons: props:", props);
    const { persons } = props;
    return (
        <div>
            {persons.map(person => <Person key={person.name} person={person} />)}
        </div>
    );
}

const isDuplicate = (name, persons) => {
    const namesArr = persons.map(person => person.name);
    return namesArr.indexOf(name) !== -1;         
}


function App() {
    const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("")
    const [filterName, setFilterName] = useState("")

    const personsToShow = filterName 
                          ? persons.filter(person =>
                            person.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
                          : persons

    const addPerson = (event) => {
        event.preventDefault(); 
        console.log("clicked", event.target)
        if (!isDuplicate(newName, persons)) {
            const newPerson = {name: newName, number: newNumber};
            setPersons(persons.concat(newPerson));
            setNewName("");
            setNewNumber("");
        }
        else {
            window.alert(`Phonebook alreeady contains an \
                          entry for ${newName}`);   
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filterName={filterName} setFilterName={setFilterName} />
            <h3> Add a new person</h3>
            <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson}
                        setNewNumber={setNewNumber} setNewName={setNewName} />
            <h3>Numbers</h3>
            <Persons persons={personsToShow} />
        </div>
    );
}

export default App;
