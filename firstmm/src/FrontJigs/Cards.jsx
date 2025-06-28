import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

const Cards = ({ userName }) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [editingCard, setEditingCard] = useState({ index: null, title: '', description: '' });

  const TITLE_WORD_LIMIT = 10;
  const DESC_WORD_LIMIT = 50;

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cards/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });

      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCardClick = () => {
    setShowModal(true);
  };

  const handleEditClick = (e, index) => {
    e.stopPropagation();
    setEditingCard({
      index,
      title: cards[index].title,
      description: cards[index].description
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingCard.title.trim() || !editingCard.description.trim()) {
      alert('Please provide both a title and a description.');
      return;
    }

    const titleWords = editingCard.title.trim().split(/\s+/).length;
    const descWords = editingCard.description.trim().split(/\s+/).length;

    if (titleWords > TITLE_WORD_LIMIT) {
      alert(`Title should not exceed ${TITLE_WORD_LIMIT} words.`);
      return;
    }

    if (descWords > DESC_WORD_LIMIT) {
      alert(`Description should not exceed ${DESC_WORD_LIMIT} words.`);
      return;
    }

    try {
      const updatedCards = [...cards];
      updatedCards[editingCard.index] = {
        title: editingCard.title,
        description: editingCard.description
      };

      const response = await fetch('http://localhost:5000/api/cards/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: userName, 
          cards: updatedCards 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
        setShowEditModal(false);
        setEditingCard({ index: null, title: '', description: '' });
      } else {
        alert('Error updating card');
      }
    } catch (error) {
      console.log('Error updating card:', error);
    }
  };

  const handleSaveCard = async () => {
    if (!newCardTitle.trim() || !newCardDesc.trim()) {
      alert('Please provide both a title and a description.');
      return;
    }

    const titleWords = newCardTitle.trim().split(/\s+/).length;
    const descWords = newCardDesc.trim().split(/\s+/).length;

    if (titleWords > TITLE_WORD_LIMIT) {
      alert(`Title should not exceed ${TITLE_WORD_LIMIT} words.`);
      return;
    }

    if (descWords > DESC_WORD_LIMIT) {
      alert(`Description should not exceed ${DESC_WORD_LIMIT} words.`);
      return;
    }

    try {
      const newCard = { title: newCardTitle, description: newCardDesc };
      const response = await fetch('http://localhost:5000/api/cards/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, card: newCard }),
      });

      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
        setShowModal(false);
        setNewCardTitle('');
        setNewCardDesc('');
      } else {
        alert('Card Is Already present');
      }
    } catch (error) {
      console.log('Error adding card:', error);
    }
  };

  const handleDeleteCard = async (index) => {
    try {
      const updatedCards = cards.filter((_, i) => i !== index);
      
      const response = await fetch('http://localhost:5000/api/cards/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, cards: updatedCards }),
      });
  
      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
      } else {
        alert('Error deleting card');
      }
    } catch (error) {
      console.log('Error deleting card:', error);
    }
  };
  
  const handleCardClick = (cardTitle) => {
    navigate('/mindmap', { state: { userName, cardTitle } });
  };

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div key={index} onClick={() => handleCardClick(card.title)} className="card custom-card">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <div className="card-buttons">
            <button
              className="edit-button"
              onClick={(e) => handleEditClick(e, index)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCard(index);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="card add-card-button" onClick={handleAddCardClick}>
        <span>+ Add Card</span>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Card</h3>
            <input
              type="text"
              placeholder="Card Title (max 10 words)"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
            <textarea
              placeholder="Card Description (max 50 words)"
              value={newCardDesc}
              onChange={(e) => setNewCardDesc(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSaveCard}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Card</h3>
            <input
              type="text"
              placeholder="Card Title (max 10 words)"
              value={editingCard.title}
              onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
            />
            <textarea
              placeholder="Card Description (max 50 words)"
              value={editingCard.description}
              onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleEditSave}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;