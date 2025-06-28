import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import './SideBar.css';

const Sidebar = ({ selectedNode, setNodes, setSelectedNode, onClose }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLinks(selectedNode.data.links || []);
      setTitle(selectedNode.data.title || ''); 
      setDescription(selectedNode.data.description || ''); 
    }
  }, [selectedNode]);

  const handleNameChange = (e) => {
    const newValue = e.target.value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, value: newValue } }
          : node
      )
    );
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: { ...prevNode.data, value: newValue },
    }));
  };

  const handleColorChange = (co) => {
    const colorStyle = co === "black" 
      ? { background: co, color: "white", border: "2px solid gray" }
      : { background: co, color: "black", border: "2px solid black" };
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...colorStyle } }
          : node
      )
    );
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: { ...prevNode.data, ...colorStyle },
    }));
  };

  const handlePositionChange = (e, axis) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, position: { ...node.position, [axis]: value } }
            : node
        )
      );
      setSelectedNode((prevNode) => ({
        ...prevNode,
        position: { ...prevNode.position, [axis]: value },
      }));
    }
  };

  const sizeMap = {
    S: '10px',
    M: '16px',
    L: '20px',
    XL: '24px',
    XXL: '30px',
  };

  const handleSizeChange = (e) => {
    const newValue = e.target.value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, fontSize: sizeMap[newValue] } }
          : node
      )
    );
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: { ...prevNode.data, fontSize: sizeMap[newValue] },
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
    updateNodeData({ links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLinks = [...links, { type: 'Article', title: '', url: '' }];
    setLinks(newLinks);
    updateNodeData({ links: newLinks });
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    updateNodeData({ links: newLinks });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateNodeData({ title: newTitle });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateNodeData({ description: newDescription });
  };

  const updateNodeData = (updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: { ...prevNode.data, ...updatedData },
    }));
  };

  return (
    <div className="sidebar">
      <button className="close-button" onClick={onClose}></button>
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('properties')} 
          className={activeTab === 'properties' ? 'active' : ''}
        >
          Properties
        </button>
        <button 
          onClick={() => setActiveTab('content')} 
          className={activeTab === 'content' ? 'active' : ''}
        >
          Content & Links
        </button>
      </div>

      {activeTab === 'properties' && selectedNode && (
        <div>
          <label>Label:</label>
          <input 
            className="label-txt" 
            type="text" 
            value={selectedNode.data.value} 
            onChange={handleNameChange} 
          />
          <label>Position X:</label>
          <input 
            type="number" 
            value={selectedNode.position.x} 
            onChange={(e) => handlePositionChange(e, 'x')} 
          />
          <label>Position Y:</label>
          <input 
            type="number" 
            value={selectedNode.position.y} 
            onChange={(e) => handlePositionChange(e, 'y')} 
          />
          <label>Size:</label>
          <select value="Size" onChange={handleSizeChange}>
            <option value="Size">Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
          <div className="node-color">
            Node-Color
            <div className='handler' style={{ display: 'flex', gap: '5px' }}>
              {["black", "#66deff", "#ff6666", "#fbff66"].map((color, index) => (
                <button 
                  key={index}
                  style={{
                    cursor: "pointer",
                    backgroundColor: color,
                    border: "1px solid black",
                    borderRadius: "2px",
                    color: color === "black" ? "white" : "black"
                  }} 
                  onClick={() => handleColorChange(color)}
                >
                  {color === "black" ? "BLA" : color === "#66deff" ? "BLU" : color === "#ff6666" ? "RED" : "GRE"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div>
          <label>Title:</label>
          <input 
            className="first-title" 
            type="text" 
            value={title} 
            onChange={handleTitleChange} 
          />
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} />
          <div className="linking">
            <h4>Links</h4>
            {links.map((link, index) => (
              <div className="in-link" key={index}>
                <select
                  className="options"
                  value={link.type}
                  onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                >
                  <option value="Article">Article</option>
                  <option value="YouTube">YouTube</option>
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  className="second-title"
                  onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  className="url"
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                />
                <button className="link-help" onClick={() => handleRemoveLink(index)}>Remove</button>
              </div>
            ))}
            <button className="link-help-add" onClick={handleAddLink}>Add Link</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
