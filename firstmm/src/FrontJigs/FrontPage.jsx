import React, { useState } from 'react';
import DashBoard from './DashBoard';
import MenuNav from './MenuNav';
import InfoHolder from './InfoHolder';
import { useLocation } from 'react-router-dom';
const FrontPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');

  const handleNavClick = (view) => {
    setActiveView(view);
  };

  const handleDashClick = (view) =>{
    setActiveView(view)
  };

  const location = useLocation();
  const { username, cards } = location.state?.userInfo || {};
  console.log(username);
  console.log(cards)
  
  return (
    <>
      <MenuNav onNavClick={handleNavClick} username = {username} /> {/* Pass the function */}
      <DashBoard isOpen={isOpen} setIsOpen={setIsOpen} onDashClick={handleDashClick} username = {username}/>
      <InfoHolder isOpen={isOpen} activeView={activeView} username = {username} cardData = {cards} /> {/* Correctly pass props */}
    </>
  );
};

export default FrontPage;
