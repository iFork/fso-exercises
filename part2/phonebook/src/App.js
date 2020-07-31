import React, { useState, useEffect, useRef } from 'react';
import personService from './services/person';

const Notification = ({notification}) => {
    const {message, type} = notification;
    if(!message) {
        return null;
    }
    switch (type) {
        case 'success':
            return (
                <div className="notification success">
                    {message}
                </div>
            );
        case 'error':
            return (
                <div className="notification error">
                    {message}
                </div>
            );
        default:
            console.log("Unknown notification type");
            return (
                <div className="notification">
                    {message}
                </div>
            );
    }
}

const Notifications = ({notifications}) => {
    return (
        <div>
            { notifications.map(n => <Notification 
                                        key={n.id} 
                                        notification={n} />) }
        </div>
    );
}

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
    // console.log("Person: props:", props);
    const { person, handleDelete } = props;
    return (
        <div>
            {person.name} {person.number} 
            <button type="button" className="deleteButton"
                onClick={handleDelete}>delete</button>
        </div>
    );
}

const Persons = (props) => {
    // console.log("Persons: props:", props);
    const { persons, handleDelete } = props;
    return (
        <div>
            {persons.map(person => 
                <Person 
                    key={person.id} 
                    person={person}
                    handleDelete={() => {
                        //NOTE: 'event' argument is optional
                        // console.log("handleDelete called w/ event", event.target);
                        handleDelete(person.id, person.name)
                    }}
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
    const [newNumber, setNewNumber] = useState("");
    const [filterName, setFilterName] = useState("");
    const [notifications, setNotifications] = useState([]);

    //Note: useRef() a mutable object which persists over renders and
    //does not cause re-render.
    const lastNotificationId = useRef(0);

    const addNotification = (message, type) => {
        const newNotificationId = ++lastNotificationId.current; 
        const newNotification = {
            id: newNotificationId,
            message, 
            type
        };
        console.log("adding notification", type, newNotificationId, message);
        //NOTE: use callback in setState() to avoid stale state being captured
        //when previous state is needed for next state calculation.
        // setNotifications(notifications.concat(newNotification))
        setNotifications(prev => prev.concat(newNotification))
        // console.log("notifications appended:", notifications); 
                                        //'notifications' here is stale
        setTimeout(() => {
            console.log("filtering as 5s passed... pop id:", newNotificationId);
            setNotifications(prev => prev
                            .filter(n => n.id !== newNotificationId));
            // console.log("new notifications:", notifications); 
                                        //'notifications' here is stale
        }, 5000);
    }

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
                    addNotification(`${newName} is added to contacts.`, 
                                    'success');
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
                        addNotification(`${newName}'s number is updated`,
                                        'success');
                    })
                    .catch( () => { 
                        console.log("Update failed");
                        addNotification(
                            `${newName} was already removed from the server.`,
                            'error');
                        setPersons(persons.filter(p => p.id !== idOfDuplicate));
                    });
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
                addNotification(`${name} is removed from contacts.`,
                                'success');
            })
            .catch( () => { 
                console.log("Delete failed");
                // setErrorMessage(`${name} was already removed from the server`)
                //Assuming rejection occurs only n case of double-deletion
                //filtering stale item
                setPersons(persons.filter(p => p.id !== id));
                addNotification(`${name} was already deleted from the server`,
                                'error');
            });
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notifications notifications={notifications}/>
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
