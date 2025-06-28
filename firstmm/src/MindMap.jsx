import React, { useCallback, useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import topicNode from './topicNode';
import NodeToolBar from './component/NodeToolBar';
import './component/NodeToolBar.css';
import subTopicNode from './subtopicNode';
import SideBar from './component/SideBar';
import titleNode from './titleNode';

const nodeTypes = { topicNode, subTopicNode, titleNode };

function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null); 
  
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
        const loadedNodes = data.nodes || [];
        const loadedEdges = data.edges || [];
        setNodes(loadedNodes);
        setEdges(loadedEdges);


        const existingIds = loadedNodes.map(node => {
          const idMatch = node.id.match(/node-(\d+)/);
          return idMatch ? parseInt(idMatch[1], 10) : 0; 
        });
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        setNodeIdCounter(maxId + 1); 
      } else {
        console.error('Failed to load mind map data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching mind map data:', error);
    }
  };

  fetchMindMapData();
}, [userName, cardTitle]);

  const sizeMap = {
    S: '12px',
    M: '16px',
    L: '20px',
    XL: '24px',
    XXL: '30px',
  };

 

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge); 
  };

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      const deletedNodeIds = deletedNodes.map((node) => node.id);
      setNodes((nds) => nds.filter((node) => !deletedNodeIds.includes(node.id)));
      setEdges((eds) => eds.filter((edge) => !deletedNodeIds.includes(edge.source) && !deletedNodeIds.includes(edge.target)));
    },
    [setNodes, setEdges]
  );

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');

    if (!nodeType) return;
    console.log(nodeType);

    const canvasBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top,
    };

    var a = '';
    if (nodeType === 'topicNode') {
      a = 'topicNode';
    } else if (nodeType === 'subTopicNode') {
      a = 'subtopicNode';
    } else {
      a = 'titleNode';
    }

    const newNode = {
      id: `node-${nodeIdCounter}`,
      type: nodeType,
      position,
      data: { 
        value: a,
        width: 150,
        height: 100,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter((prevId) => prevId + 1);
  }, [setNodes, nodeIdCounter]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };


  const handleSave = async () => {
    console.log(userName);
    console.log(nodes);
    console.log(edges);
    console.log(cardTitle)
    const mapData = { userName, cardTitle,nodes, edges }; 
    try {
      const response = await fetch('http://localhost:5000/api/saveMindMap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapData),
      });
  
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); 
      alert('Mind map saved successfully!');
      console.log(data.cards); 
    } catch (error) {
      console.error('Error saving mind map:', error);
      alert('Failed to save mind map. Please try again.');
    }
  };
  

  const onNodeDoubleClick = (event, node) => {
    setSelectedNode(node);
    const handleNodeMeasurement = (id, width, height) => {
      setSelectedNode(prevNode => 
        prevNode && prevNode.id === id 
          ? { ...prevNode, data: { ...prevNode.data, width, height }} 
          : prevNode
      );
    };
  
    setNodes(nds => 
      nds.map(n => ({
        ...n,
        data: {
          ...n.data,
          onSelect: n.id === node.id ? handleNodeMeasurement : undefined
        }
      }))
    );
    setSidebarVisible(true);
    console.log(nodes);
    console.log(edges);
  };

  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  return (
    <div>
      <NodeToolBar 
        selectedEdge={selectedEdge} 
        setEdges={setEdges} 
        handleSave={handleSave}
      />
      <div
        style={{
          width: 'calc(80vw - 37px)', 
          height: '100vh',
          position: 'absolute',
          right: 0,
          top: 0,
          border: '1px solid black',
          marginLeft: '20vw', 
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeClick={onEdgeClick} 
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {sidebarVisible && selectedNode && (
        <SideBar
          selectedNode={selectedNode}
          setNodes={setNodes}
          setSelectedNode={setSelectedNode} 
          onClose={handleSidebarClose}
        />
      )}
    </div>
  );
}

export default MindMap;
