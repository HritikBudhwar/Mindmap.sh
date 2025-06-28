import { Handle, Position } from '@xyflow/react';
import React, { useCallback, useState, useRef, useEffect } from 'react';

function topicNode({ data, isConnectable, selected, id }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); 
  const nodeRef = useRef(null);

  useEffect(() => {
    if (selected && nodeRef.current) {
      const { width, height } = nodeRef.current.getBoundingClientRect();
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);
      data.onSelect && data.onSelect(id, roundedWidth, roundedHeight);
    }
  }, [selected, id, data.onSelect]);

  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isConnecting) {
      setIsHovered(false);
    }
  };

  const handleStyle = {
    opacity: (isHovered || isConnecting) ? 1 : 0,
    transition: 'opacity 0.3s',
    backgroundColor: "blue", // Corrected property name
  };
  

  return (
    <div
      ref={nodeRef}
      className="topicNode"
      style={{
        padding: '10px',
        background: data.background || '#fbff00',
        borderRadius: '5px',
        textAlign: 'center',
        color : data.color || "black",
        border : data.border ||"2px solid black",
        filter: isHovered ? 'brightness(0.8)' : 'none',
        fontSize : data.fontSize || '16px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>{data.value}</div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        id="a"
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        id="a1"
        style={handleStyle}
        
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b1"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
      <Handle
        type="target"
        position={Position.Right}
        id="c"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c1"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
      <Handle
        type="target"
        position={Position.Left}
        id="d"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
      <Handle
        type="source"
        position={Position.Left}
        id="d1"
        isConnectable={isConnectable}
        style={handleStyle}
        
      />
    </div>
  );
}

export default topicNode;
