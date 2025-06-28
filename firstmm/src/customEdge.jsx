import React from 'react';
import { getBezierPath, EdgeText } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: '#007bff', 
          strokeWidth: 3,    
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeText
        x={labelX}
        y={labelY}
        label={data?.label}
        labelStyle={{ fill: '#007bff' }}
        labelShowBg
        labelBgStyle={{ fill: 'white' }}
        labelBgPadding={[2, 4]}
        labelBgBorderRadius={2}
      />
    </>
  );
};

export default CustomEdge;