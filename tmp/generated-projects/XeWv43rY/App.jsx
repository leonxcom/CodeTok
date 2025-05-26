import React from 'react';

const SimpleButton = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Click Me
    </button>
  );
};

export default SimpleButton;