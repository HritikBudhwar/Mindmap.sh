import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VisitMap.css';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import topicNode from '../topicNode';
import './NodeToolBar.css';
import subTopicNode from '../subtopicNode';
import titleNode from '../titleNode';
import VisitSideBar from './VisitSideBar';

const nodeTypes = { topicNode, subTopicNode, titleNode };

const VisitMap = () => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [sidebar, setSideBarVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null); // State for the selected node

  const location = useLocation();
  const { userName, cardTitle } = location.state || {};

  useEffect(() => {
    const fetchMindMapData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/loadMindMap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, cardTitle }),
        });
        const data = await response.json();

        if (data.success) {
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        } else {
          console.error('Failed to load mind map data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching mind map data:', error);
      }
    };

    fetchMindMapData();
  }, [userName, cardTitle]);

  const onVisitNodeDoubleClick = (event, node) => {
    setSelectedNode(node); // Select the Double click node
    setSideBarVisible(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeDoubleClick={onVisitNodeDoubleClick}
          zoomOnDoubleClick={false}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {sidebar && <VisitSideBar onClose={() => setSideBarVisible(false)} selectedNode={selectedNode} setNodes={setNodes} setSelectedNode={setSelectedNode} userName={userName} cardTitle={cardTitle} edges={edges} nodes={nodes}/>} {/* Pass the selected node as a prop */}
    </div>
  );
};

export default VisitMap;
