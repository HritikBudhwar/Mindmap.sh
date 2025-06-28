import React, { useState, useEffect } from 'react';
import './InfoHolder.css';
import Cards from './Cards';
import VisitMapPrev from '../component/VisitMapPrev';
import ProgressBar from './ProgressBar';
import UserNote from '../component/UserNote';
const InfoHolder = ({ isOpen, activeView, cardData, username }) => { 
  const [cardProgress, setCardProgress] = useState([]); 

  
  useEffect(() => {
    if (activeView === 'progress') {
      loadCard1();
    }
  }, [activeView]);

  const loadCard1 = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cards/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      console.log(data);

      if (data.success) {
        const progressData = data.cards.map((card) => {
          const totalNodes = card.userMapNode.length;
          if (totalNodes === 0) {
            return { title: card.title, percentage: 0 }; // No nodes, display 0%
          }

          const completedNodes = card.userMapNode.filter((node) => node.data.status === 'Completed').length;
          const progressPercentage = (completedNodes / totalNodes) * 100;
          return { title: card.title, percentage: progressPercentage.toFixed(2) };
        });
        setCardProgress(progressData); // Update state with calculated progress
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className={`holder ${isOpen ? 'open' : 'closed'}`}>
      {activeView === 'home' && (
        <div className="home">
          <Cards userName={username} /> 
        </div>
      )}
      {activeView === 'progress' && (
        <div className="progress-container">
          {cardProgress.map((card) => (
            <div key={card.title} className="progress-item">
              <h3>{card.title}</h3>
              <ProgressBar percentage={card.percentage} />
              <p>{card.percentage || 0}% completed</p>
            </div>
          ))}
        </div>
      )}
      {activeView === 'about' && <div className="about">
  <h3 className="about-title">Created By:</h3>
  <div className="about-entry">
    <p className="about-label"><span className="about-name-label">Name:</span> Hrishikesh U</p>
    <p className="about-label"><span className="about-srn-label">SRN:</span> PES1UG23CS248</p>
  </div>
  <hr />
  <div className="about-entry">
    <p className="about-label"><span className="about-name-label">Name:</span> Hritik Budhwar</p>
    <p className="about-label"><span className="about-srn-label">SRN:</span> PES1UG23CS249</p>
  </div>
  <hr />
  <div className="about-entry">
    <p className="about-label"><span className="about-name-label">Name:</span> Jayesh M Kotian</p>
    <p className="about-label"><span className="about-srn-label">SRN:</span> PES1UG23CS265</p>
  </div>
  <hr />

  <p className='Author'>Contacts : Please Don't Contact Us</p>
  <p className='Author'>Email : No Email</p>
</div>
}
      {activeView === 'VisitMap' && (
        <div className='visit-map-container'>
          <VisitMapPrev userName={username} />
        </div>
      )}

      {
        activeView === 'user-note' && (
           
           <div className='user-container'>
              <UserNote username = {username}></UserNote>

           </div>

          
      )}
    </div>
  );
};

export default InfoHolder;
