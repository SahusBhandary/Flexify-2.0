import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/hello/`)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>{message || "Loading..."}</h1>
      
    </div>
  );
}

export default Home;