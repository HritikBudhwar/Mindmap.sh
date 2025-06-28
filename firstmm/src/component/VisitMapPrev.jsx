import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './VisitMapPrev.css';

const VisitMapPrev = ({ userName }) => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cards/load', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userName }),
        });
        const data = await response.json();

        if (data.success) {
          setCards(data.cards);
        } else {
          console.error('Failed to load cards:', data.message);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, [userName]);

  const handleVisitCardClick = (cardTitle) => { 
    console.log(userName); 
    console.log(cardTitle); 
    navigate('/visitmap', { state: { userName, cardTitle } }); 
  };

  return (
    <div className="cards-container-visit-Map">
      {cards.length > 0 ? (
        cards.map((card) => (
          <div key={card._id} onClick={() => handleVisitCardClick(card.title)} className="card-visit-map"> 
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))
      ) : (
        <p>No cards available</p>
      )}
    </div>
  );
};

export default VisitMapPrev;
