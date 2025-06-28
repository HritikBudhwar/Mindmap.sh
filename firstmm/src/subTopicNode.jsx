import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function SubTopicNode({ data, isConnectable }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleStyle = {
    opacity: isHovered || data.isCreatingEdge ? 1 : 0,
    transition: 'opacity 0.3s',
  };
  
  const nodeStyle = {
        padding: '10px',
        background: data.background || '#ffbf66',
        borderRadius: '5px',
        textAlign: 'center',
        color : data.color || "black",
        border : data.border ||"2px solid black",
        filter: isHovered ? 'brightness(0.8)' : 'none',
        fontSize : data.fontSize || '16px'
  };

  return (
    <div
      className="text-updater-node"
      style={nodeStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        isConnectable={true}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c1"
        isConnectable={true}
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

export default SubTopicNode;