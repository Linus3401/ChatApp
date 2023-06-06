import React from 'react';
import Login from './pages/login';
import Register from './pages/register.jsx';

function App() {
    return (
        <React.StrictMode>
          <div className="App">
          <h1>Welcome to My App</h1>
      <Login />
      <Register />
          </div>
        </React.StrictMode>
      );
    }


export default App;
