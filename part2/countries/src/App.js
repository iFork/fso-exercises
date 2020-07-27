import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Filter = (props) => {
    const {countryFilter, setCountryFilter} = props;
    return (
        <div>
            Find countries: <input value={countryFilter} 
                onChange={(e) => setCountryFilter(e.target.value)} />
        </div>
    );
}


const Weather = (props) => {
    const {country} = props;
    const [currentWeather, setCurrentWeather] = useState({})

    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;
        axios
            .get(`http://api.weatherstack.com/current`
                + `?access_key=${apiKey}`
                + `&query=${country.capital}`)
            .then(response => {
                console.log("fullfilled, response is:", response);
                setCurrentWeather(response.data.current);
            });
    }, [country.capital]) // specify all dependencies of the Effect.
    return (
        <div>
            <h2>Weather in {country.capital}</h2>
            <div><b>temperature</b>: {currentWeather.temperature} Celcius</div>
            <img src={currentWeather.weather_icons} 
                 alt="icon for current weather condition" /> 
            <div><b>wind</b>: 
                {currentWeather.wind_speed} km/h,
                direction {currentWeather.wind_dir}</div>
        </div>
    );
}

const Country = (props) => {
    const {country} = props;
    return (
        <div>
            <h1>{country.name}</h1>  
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h2>Languages</h2>
            <ul>
                {country.languages.map(language => 
                    <li key={language.iso639_1}>{language.name}</li>)}
            </ul>
            <img className="flag" height="250" src={country.flag} alt={country.name + " flag"} />
            <Weather country={country} />
        </div>
    );
}

const Countries = (props) => {
    const {countries, setCountryFilter} = props;
    return (
        <div>
            {countries.map(country => 
                <div key={country.alpha3Code}> 
                    {country.name} 
                    <button type="button" 
                        onClick={() => 
                            setCountryFilter(country.name)}>show</button>
                </div>)}
        </div>
    );
}

const Display = (props) => {
    const {countries, countryFilter, setCountryFilter} = props;

    const countriesFound = countries.filter(country => 
                    country.name.toLowerCase()
                    .indexOf(countryFilter.toLowerCase()) !== -1);

    if (!countryFilter) {
        return (
            <div>Please enter a search query</div>
        );
    }
    else if (countriesFound.length > 10) {
        return (
            <div>Too many matches, please enter more specific search term</div>
        );
    }
    else if (countriesFound.length === 0) {
        return (
          <div>No country is found. Please modify search term.</div>  
        );
    }
    else if (countriesFound.length === 1) {
        return (
            <Country country={countriesFound[0]} />
        );
    }
    else {
        return (
            <Countries 
                countries={countriesFound} setCountryFilter={setCountryFilter}/>
        );
    }
}

function App() {
    const [countries, setCountries] = useState([])
    const [countryFilter, setCountryFilter] = useState("");

    useEffect(() => {
        console.log("Effect()");
        axios
            .get("https://restcountries.eu/rest/v2/all")
            .then(response => {
                console.log("fullfilled, response is:", response);
                setCountries(response.data);
            })
    }, [])
    console.log("rendering");

    return (
        <div className="App">
            <Filter countryFilter={countryFilter}
            setCountryFilter={setCountryFilter} /> 
            <Display
                countries={countries} countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}/>
        </div>
    );
}

export default App;
