import React, { useState, useEffect } from 'react';
import './UserNote.css';

const UserNote = ({ username }) => {



  useEffect(() => {
    const loadNote = async () => {
      const divs = document.querySelector('.notepad')
      try {
        if (!username) {
          console.error('Username is required to fetch notes.');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/LoadNotes?usernameNote=${username}`);
        const data = await response.json();

        if (data.success && data.userNotes) {
          if(divs.innerText === ''){
          divs.innerText = data.userNotes;
          }
          else{
            divs.placeholder = 'Write Your Notes Here';
          }
        } else {
          console.log(data.message);
          divs.placeholder = 'Write Your Notes Here';
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        divs.placeholder = 'Write Your Notes Here'
      }
    };

    loadNote();
  }, [username]); 


  const saveNote = async () => {
    const divs = document.querySelector('.notepad')
    const noteInfo = divs.innerText;
    console.log(noteInfo);
    try {
      const response = await fetch('http://localhost:5000/api/updateNotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameNote: username, newNote: noteInfo }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Note saved successfully.');
        alert('Notes Saved Successfully')
      } else {
        console.error('Failed to save note:', data.message);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <>
      <div
        className="notepad"
        contentEditable="true"
        spellCheck="true"
        placeholder="Write your notes here..."

  
      ></div>
      <button className="note-button-save"  onClick={saveNote}>
        Save
      </button>
    </>
  );
};

export default UserNote;
