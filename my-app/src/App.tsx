import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8888/order/create_payment_url', {
        amount: 100000,
        bankCode: 'NCB',
        language: 'vn'
      }, {
        withCredentials: true // Đảm bảo thông tin đăng nhập được bao gồm trong yêu cầu
      });
      window.location.href = response.data.data; // Redirect to the VNPAY URL
    } catch (error) {
      console.log("run herere ");
      console.error('Error creating payment URL:', error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <button  onClick={handleSubmit}>Submit</button>
      </header>
    </div>
  );
}

export default App;
