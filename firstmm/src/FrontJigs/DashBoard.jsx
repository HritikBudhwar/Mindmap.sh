import React from 'react';
import { Menu, Zap, FileCog, PenTool, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

const DashBoard = ({ isOpen, setIsOpen, onDashClick , username }) => {
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen); 
  };

  const handleProfileClick = () => {
    navigate('/selfprofile', {
      state: { username: username }, 
    });
  };

  return (
    <>
      {!isOpen && (
        <div className="menu-strip" onClick={toggleMenu}>
          <Menu size={32} color="white" />
        </div>
      )}

      <div className={`container ${isOpen ? 'open' : ''}`}>
        <div className="row" onClick={toggleMenu}>
          <Menu size={32} color="black" />
          <h1>Dashboard</h1>
        </div>

        <div className="row" onClick={() => onDashClick('VisitMap')}>
          <Zap size={29} color="black" />
          <p className="other-map">VisitMap</p>
        </div>

        <div className="row" onClick={() => onDashClick('home')}>
          <FileCog size={29} color="black" />
          <p className="other-map">EditMap</p>
        </div>

        <div className="row" onClick={() => onDashClick('user-note')}>
          <PenTool size={29} color="black" />
          <p className="other-map">Notes</p>
        </div>

        {/* Profile Component */}
        <div className="profile-section">
          <div className="row" onClick={handleProfileClick}>
            <User size={29} color="black" />
            <p className="other-map">Profile</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
