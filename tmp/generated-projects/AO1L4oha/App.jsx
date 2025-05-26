import React, { useState } from 'react';

const TestButton = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button 
      onClick={() => setCount(count + 1)}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      点击次数: {count}
    </button>
  );
};

export default TestButton;