import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div>
      <button className="navbar-toggle no-style-button" onClick={toggleNavbar}>
        <img src="images/menu.svg" alt="Menu" />
      </button>
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li className="navbar-logo">
            <a href="/">
              <img src="images/logo.webp" alt="Logo" className="navbar-logo-image" />
            </a>
          </li>
          <li className="navbar-leaderboard">
            <a href="/leaderboard">
              <img src="images/ranking.svg" alt="Leaderboard" className="navbar-image" />
            </a>
          </li>
          <li className="navbar-user" onClick={toggleDropdown}>
            <img src="images/user.svg" alt="User" className="navbar-image" />
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <button onClick={handleProfile}>Ver usuario</button>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
