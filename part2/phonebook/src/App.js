import React, { useState, useEffect } from 'react';
import personService from './services/person';


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
    const { person, handleDelete } = props;
    return (
        <div>
            {person.name} {person.number} 
            {/* TODO: add space / margin between these inline elements */}
            <button type="button" onClick={handleDelete}>delete</button>
        </div>
    );
}

const Persons = (props) => {
    console.log("Persons: props:", props);
    const { persons, handleDelete } = props;
    return (
        <div>
            {persons.map(person => 
                <Person 
                    key={person.name} 
                    person={person}
                    handleDelete={() => {
                        //NOTE: 'event' argument is optional
                        // console.log("handleDelete called w/ event", event.target);
                        handleDelete(person.id, person.name)
                    }
                    }
                />)}
        </div>
    );
}

const idOf = (name, persons) => {
    for (const person of persons) {
        if (person.name === name) {
            return person.id;
        }
    }
    return -1;
}


function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("")
    const [filterName, setFilterName] = useState("")

    const fetchHook = () => {
        personService
            .getAll()
            .then(initialPersons => {
                console.log("fulfilled, response is:", initialPersons);
                setPersons(initialPersons);
            })
    }
    useEffect(fetchHook, [])

    const personsToShow = filterName 
                          ? persons.filter(person =>
                            person.name.toLowerCase()
                              .indexOf(filterName.toLowerCase()) !== -1)
                          : persons

    const addPerson = (event) => {
        event.preventDefault(); 
        console.log("clicked", event.target)
        const idOfDuplicate = idOf(newName, persons);
        if (idOfDuplicate === -1) {
            const newPerson = {name: newName, number: newNumber};
            personService
                .create(newPerson)
                .then(returnedPerson => {
                    console.log("creation fulfilled, respose is:", 
                                    returnedPerson);
                    setPersons(persons.concat(returnedPerson));
                    setNewName("");
                    setNewNumber("");
                })
        }
        else {
            if(window.confirm(`${newName} is already added to Phonebook,` 
                    + ` replace old number with a new one?`)) {
                const newPerson = {name: newName, number: newNumber};
                personService
                    .update(idOfDuplicate, newPerson)
                    .then(returnedPerson => {
                        console.log("update fulfilled, respose is:", 
                                        returnedPerson);
                        setPersons(persons.map(p => 
                            p.id === idOfDuplicate 
                            ? returnedPerson : p));
                        setNewName("");
                        setNewNumber("");
                    })
            }
        }
    }

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete ${name} from contacts?`)) {
            personService
            .deletePerson(id)
            .then(response => {
                console.log("delete succeeded, response is:", response);
                setPersons(persons.filter(p => p.id !== id));
            })
            .catch( () => alert("Delete failed"));
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
            <Persons persons={personsToShow} handleDelete={handleDelete}/>
        </div>
    );
}

export default App;
