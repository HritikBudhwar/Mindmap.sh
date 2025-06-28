import React, { useState, useEffect } from 'react';
import './UserProfile.css'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const location = useLocation();
  const { username } = location.state || { username: 'Guest' };


  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/40');
  const [description, setDescription] = useState('No description set');
  const [email, setEmail] = useState('');  
  const [createdAt, setCreatedAt] = useState('');  
  const [imports, setImports] = useState(0); 
  const [exports, setExports] = useState(0);  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [newDescription, setNewDescription] = useState(description);  
  const cards = []; 


  const fetchSelfInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/selfInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }), 
      });


      if (!response.ok) {
        throw new Error('Failed to fetch self data');
      }


      const result = await response.json();

      

      const user_email = result.email || 'No email available';
      const user_selfdescription = result.selfdescription || 'No description available';
      const user_imports = result.imports || 0;
      const user_exports = result.exports || 0;
      const user_created_at = result.createdAt || 'Unknown';
      let user_profile_pic = result.selfProfile;
      console.log(user_email , user_profile_pic)
      if(!user_profile_pic){
        user_profile_pic = 'https://via.placeholder.com/40'
      }
      else{
        user_profile_pic = `http://localhost:5000${user_profile_pic}`
      }

      setEmail(user_email);
      setImports(user_imports);
      setExports(user_exports);
      setDescription(user_selfdescription);
      setCreatedAt(user_created_at);
      setProfilePic(user_profile_pic)
    } catch (error) {
      console.error('Error fetching self info:', error);
    }
  };


  useEffect(() => {
    fetchSelfInfo();  
  }, [username]);  

  const handleDoubleClick = () => {
    setIsModalOpen(true);  
    setNewDescription(description);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  
  };

  const handleSaveDescription = async () => {
    setDescription(newDescription);  
    setIsModalOpen(false);  

    try{
      const response = await fetch('http://localhost:5000/api/saveNewDesc' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username , desc : newDescription }), 
      });
    }
    catch(error){
      console.log(error);
    }
  };

  return (
    <div className="user-profile">
      {/* Profile Photo */}
      <div className="profile-photo-container">
      <img 
        src={profilePic} 
        alt={`${username}'s Profile`} 
        className="profile-photo"
        onError={() => setProfilePic('https://placehold.co/600x400')}
        />
        {/*Fixed the Image issue*/}
      </div>

      {/* User Details */}
      <div className="user-details">
        <h2 className="username">{username}</h2>
        <p className="email"><strong>Email:</strong> {email}</p> {/* Display email */}
        <p className="stats">
          <strong>Imports:</strong> {imports || 0} | <strong>Exports:</strong> {exports || 0}
        </p>
        <p className="description-in-profile" onDoubleClick={handleDoubleClick}> 
          <strong>Description:</strong> 
          <p>
          {description}
          </p>
        </p>
        <p className="created-at">
          <strong>Account Created:</strong> {new Date(createdAt).toLocaleDateString() || 'Unknown'} {/* Format creation date */}
        </p>
      </div>

      {/* Modal for editing the description */}
      {isModalOpen && (
        <div className={`modal1 ${isModalOpen ? 'open' : ''}`}>
          <div className="modal1-content">
            <h3 className='rando'>Edit Description</h3>
            <textarea 
              onChange={(e) => setNewDescription(e.target.value)}  
              rows="5"
              cols="40"
              placeholder='WordLimit200'
              className='texty'
            />
            <div className="modal1-buttons">
              <button onClick={handleSaveDescription}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;