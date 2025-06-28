import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', margin: '10px 0' }}>
      <div
        style={{
          width: `${percentage}%`,
          height: '10px',
          backgroundColor: '#76c7c0',
          borderRadius: '4px',
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
