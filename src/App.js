import React from 'react';
import axios from 'axios';
import PersonList from './PersonList';

const App = () => {

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:57678/persons');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 col-lg-12 mb-4">          
        <PersonList fetchData={fetchData} />
        </div>       
      </div>
    </div>
  );
};

export default App;
