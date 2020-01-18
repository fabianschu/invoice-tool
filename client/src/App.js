import React, {useState, useEffect} from 'react';
import './App.css';
import CreateCustomer from './components/CreateCustomer';
import Customers from './components/Customers';



function App() {

  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <div className="App">
      < Customers />
    </div>
  );
}

export default App;
