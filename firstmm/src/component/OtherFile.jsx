import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OtherFile.css';

const OtherFile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, cards, self } = location.state || {};
  const username = userName;
  const [profilePic, setProfilePic] = useState('https://placehold.co/600x400'); // Default placeholder image
  const [description1, setDescription] = useState('No description set');
  const [imports1, setImports] = useState(0);  // State for imports
  const [exports1, setExports] = useState(0);  // State for exports

  useEffect(() => {
    const fetchOtherInfo = async () => {
      try {
        // Fetch user data from the backend
        const response = await fetch('http://localhost:5000/api/selfInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username }), // Pass the username
        });

        if (!response.ok) {
          throw new Error('Failed to fetch self data');
        }

        const result = await response.json();

        // Extract data from the response
        const user_email = result.email || 'No email available';
        const user_selfdescription = result.selfdescription || 'No description available';
        const user_imports = result.imports || 0;
        const user_exports = result.exports || 0;
        const user_created_at = result.createdAt || 'Unknown';
        let user_profile_pic = result.selfProfile;

        // If no profile picture is set, use a placeholder
        if (!user_profile_pic) {
          user_profile_pic = 'https://placehold.co/600x400';
        } else {
          user_profile_pic = `http://localhost:5000${user_profile_pic}`; // Add base URL for profile picture
        }

        // Update the state with the fetched data
        setProfilePic(user_profile_pic);
        setDescription(user_selfdescription);
        setImports(user_imports);
        setExports(user_exports);

      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use a fallback placeholder image in case of error
        setProfilePic('https://placehold.co/600x400');
      }
    };

    fetchOtherInfo();
  }, [username]); 


  const viewOther = (cardTitle) => {
    navigate('/othervisitmap', { state: { userName, cardTitle } });
  };

  const handleImportClick = async (e, cardTitle) => {
    e.stopPropagation(); 
    let newCardTitle = "";
    let newCardDesc = "";
    let cardData = "";
    let fag = false;

    try {
      const data = {
        username,
        self,
        cardTitle,
      };

      const response = await fetch('http://localhost:5000/api/cards/Import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json(); 
      cardData = result.card;
      console.log(cardData);
      newCardDesc = cardData.description;
      newCardTitle = cardData.title;
      if (response.status === 200) {
        console.log("Yay")
      } else {
        console.error('Error:', result.message || 'Import failed');
        alert('Error importing card');
      }
    } catch (error) {
      console.error('Error importing card:', error);
      alert("Sorry, an error occurred while importing the card.");
    }

    {/*------------------------------------------------------------*/ }
    try {
      const newCardf = { title: newCardTitle, description: newCardDesc };
      const response = await fetch('http://localhost:5000/api/cards/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: self, card: newCardf }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Yay');
      } else {
        alert('Card Is Already present');
      }
    } catch (error) {
      console.log('Error adding card:', error);
    }

    {/*==============================================================*/ }

    try {
      const dataToSend = {
        self: self,
        cardTitle: newCardTitle,
        newCard: cardData,
      };
      console.log(self);
      const response = await fetch('http://localhost:5000/api/cards/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      
    } catch (error) {
      console.log('Error adding card:', error);
    }

    {/*==========================================*/}
    //Don't forget about this its important 
    console.log(fag)
    if (fag) {
      try {
        const user11 = self;
        const user22 = username;
        const response = await fetch('http://localhost:5000/api/updateimportexport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user1: user11, user2: user22 }),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container-other">
      <div className="other-side-bar">
        <div className="profile-image">
          <img 
            src={profilePic} 
            alt="Profile" 
            onError={() => setProfilePic('https://placehold.co/600x400')} 
          />
        </div>

        <p>UserName : {username}</p>
        <p>Description : <p>{description1}</p></p>
        <p>Number of Imports : {imports1}</p>
        <p>Number of Exports : {exports1}</p>
      </div>

      <div className="cards-viewing">
        {cards.map((card, index) => (
          <div
            key={index}
            className="other-card"
            onClick={() => viewOther(card.title)}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <div className="card-button">
              <button
                className="import-button"
                onClick={(e) => handleImportClick(e, card.title)} 
              >
                Import
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherFile;
