import React from 'react';
import './NodeToolBar.css';

const NodeToolBar = ({ selectedEdge, setEdges , handleSave }) => {

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };


  const changeEdgeType = (newType) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge?.id 
          ? { ...edge, type: newType } 
          : edge 
      )
    );
  };
  const changeEdgLabel = (e) => {
    const newType = e.target.value
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge?.id 
          ? { ...edge, label : newType } 
          : edge 
      )
    );
  };
  const changeAnimateType = () => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge?.id 
          ? { ...edge, animated: !edge.animated } 
          : edge 
      )
    );
  };

 
  return (
    <div className='main-div'>
      {/* Topic node draggable */}
      <p>Components Drag and drop</p>
      <div
        className="topic-node"
        draggable
        onDragStart={(event) => handleDragStart(event, 'topicNode')}
      >
        Topic Node
      </div>
      
      {/* Subtopic node draggable */}
      <div
        className="subtopic-node"
        draggable
        onDragStart={(event) => handleDragStart(event, 'subTopicNode')}
      >
        Subtopic Node
      </div>
      <div
        className="title-node"
        draggable
        onDragStart={(event) => handleDragStart(event, 'titleNode')}
      >
        title Node
      </div>

      {/* Edge styling section */}
      <div className="edge-style">
        <div className="edge-title">
          Change Edge Type:
          <button  className = "s"onClick={() => changeEdgeType('default')}>Bezier</button>
          <button  className = "s"onClick={() => changeEdgeType('smoothstep')}>Smooth Step</button>
          <button  className = "s"onClick={() => changeEdgeType('straight')}>Straight</button>
          <button  className = "s"onClick={() => changeEdgeType('step')}>Step</button>
          <button  className = "s"onClick={() => changeAnimateType()}>animate</button>
        </div>
      </div>

      <div className='label-txt-change'>
      <p>Change label: </p>
      <input  className = "edge-txt"  type="text" onChange={changeEdgLabel} />

      </div>

      <div className="save-button" onClick={handleSave}>
        SaveMap
      </div>
    </div>
  );
};

export default NodeToolBar;
