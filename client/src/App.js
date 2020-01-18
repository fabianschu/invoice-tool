import React, {useState, useEffect} from 'react';
import './App.css';
import CreateCustomer from './components/CreateCustomer';
import Customers from './components/Customers';



function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');


  return (
    <div className="App">
      < Customers setSelectedCustomer={setSelectedCustomer} />
    </div>
  );
}

export default App;
