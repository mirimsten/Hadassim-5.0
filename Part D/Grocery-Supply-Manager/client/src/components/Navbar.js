
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const name = localStorage.getItem('userName'); 
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={handleLogout}>
        <h2 className="store-name">Grocery</h2>
      </div>
      <div className="navbar-right">
        {isLoggedIn && (
          <>
            <span className="user-name">{role === 'admin' ? 'מנהל' : 'ספק'} {name}</span>
            <button onClick={handleLogout}>התנתק</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
