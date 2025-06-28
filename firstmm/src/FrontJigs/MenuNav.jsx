import React, { useState, useEffect } from 'react';
import './NavBar.css';
import axios from 'axios';import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuNav = ({ onNavClick, username }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/40');
  console.log(username)

  const [searchValue, setSearchValue] = useState('');

  const handleSearchClick = async () => {
  const userName = searchValue;
  const self = username;
    try {
      console.log(username);
      const response = await fetch('http://localhost:5000/api/userSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username : searchValue }),
      });
  
      const data = await response.json();
      console.log("Data.exist: ", data.exist);
      const cards = data.cards
      if (response.ok) {
        if (data.exist) {
          console.log(data.cards);
          const userInfo = {
            username: data.username,
            cards: data.cards,
          };
  
          console.log(data.username, "Cards : {");
          console.log(userInfo.cards);
          console.log("}");
          navigate('/otherfile', { state: { userName, cards , self} });
        } else {
          alert("User Not Present");
        }
      } else {
        alert("User Not Present");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }

  };
  

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getProfile/${username}`);
      const result = response.data;
      if (result.status) {
        const source = `http://localhost:5000${result.profilePicUrl}`;

        setProfilePic(source);
      } else {
        setProfilePic('https://via.placeholder.com/40');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfilePic('https://via.placeholder.com/40');
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getProfile/${username}`);
        const result = response.data;
        console.log("In Menu Nav : " , result.profilePicUrl);
        if (result.status) {
          const source = `http://localhost:5000${result.profilePicUrl}`;

          setProfilePic(source);
        } else {
          setProfilePic('https://via.placeholder.com/40');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfilePic('https://via.placeholder.com/40');
      }
    };

    fetchProfile();
  }, [username]);

  const handleProfilePicClick = () => {
    document.getElementById('fileInput').click();
  };
/*
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newProfilePic = reader.result; // Base64 encoded image data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('profilePic', file);

        try {
          const response = await axios.post('http://localhost:5000/api/uploadProfile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data);
          // Fetch and set the new profile picture after upload
          const result = await axios.get(`http://localhost:5000/api/getProfile/${username}`);
          console.log(result.data.status);
          if (result.data.status) {
            const source = `http://localhost:5000${result.profilePicUrl}`
            setProfilePic(source);
          }
        } catch (error) {
          console.error('Error uploading profile:', error);
        }
      };
      reader.readAsDataURL(file);
    }


  };
*/
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newProfilePic = reader.result; // Base64 encoded image data
      setProfilePic(newProfilePic);
    };
    reader.readAsDataURL(file);
  }

  if(file){
    const formData = new FormData();
    formData.append('username', username);
    formData.append('profilePic', file);
    
    try {
      const response = await axios.post('http://localhost:5000/api/uploadProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    }
    catch (error) {
      console.error('Error uploading profile:', error);
    }

  }
};
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>MindMap.SH</h1>
      </div>

      <div className="navbar-center">
        <a onClick={() => onNavClick('home')}>Home</a>
        <a onClick={() => onNavClick('progress')}>Progress</a>
        <a onClick={() => onNavClick('about')}>About</a>
      </div>

      <div className="navbar-right">


      <div className="search">
          <input 
            type="text" 
            placeholder="Search..." 
            className='search-inp'

            value={searchValue} // Bind the input value to the state
            onChange={(e) => setSearchValue(e.target.value)} // Update state on input change
          />
          <Search 
            size={29} 
            className='search-icon'
            color='white' 
            onClick={handleSearchClick} // Call handleSearchClick on icon click
            style={{ cursor: 'pointer' }} // Make icon clickable
          />
        </div>


        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfilePicClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </nav>
  );
};

export default MenuNav;
