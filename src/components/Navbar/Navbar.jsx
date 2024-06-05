import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li className="navbar-logo">
          <Link to="/">
            <img src={"images/logo.webp"} alt="Logo" className="navbar-logo-image" />
          </Link>
        </li>
        <li className='navbar-leaderboard'>
          <Link to="/leaderboard">
            <img src={"images/ranking.svg"} alt="Leaderboard" className="navbar-image" />
          </Link>
        </li>
        <li className="navbar-user">
          <Link to="/login">
            <img src={"images/user.svg"} alt="User" className="navbar-image" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
