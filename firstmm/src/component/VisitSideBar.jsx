import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronDown } from 'lucide-react';

import './VisitSideBar.css';

const VisitSideBar = ({ onClose, selectedNode, setNodes, setSelectedNode, userName, cardTitle, edges, nodes }) => {
  const [status, setStatus] = useState(selectedNode?.data?.status || 'Pending');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    if (selectedNode?.data?.status !== status) {
      setStatus(selectedNode?.data?.status || 'Pending');
    }
  }, [selectedNode]);

  const { data } = selectedNode || {};
  const { title, description, links } = data || {};

  const statusOptions = ['Pending', 'Completed', 'In-Progress'];

  const getStatusClassName = async (currentStatus) => {
    console.log(currentStatus)
    console.log(nodes)
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

      console.log(data.cards); 
    } catch (error) {
      console.error('Error saving VISIT map:', error);
      
    }
    const statusMap = {
      'Pending': 'status-pending',
      'Completed': 'status-completed',
      'In-Progress': 'status-in-progress',
    };
    return statusMap[currentStatus] || 'status-pending';
  };


  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, status: newStatus } }
          : node
      )
    );
    setSelectedNode((prevNode) => ({
      ...prevNode,
      data: { ...prevNode.data, status: newStatus },
    }));
    console.log(status);
  };



  const getVideoTitle = (link) => {
    if (link.title) return link.title;
    if (link.url.includes('youtube.com')) {
      return 'YouTube Video';
    }
    return link.label || link.url;
  };

  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.includes('youtube.com')) {
      return 'https://youtube.com';
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const hasLinks = links && Array.isArray(links) && links.length > 0;

  return (
    <div className="SideBar">
      <button className="close-button" onClick={onClose}>

      </button>

      <div className="status-container">
        <span className={`status-label ${getStatusClassName(status)}`}>
          {status}
        </span>

        <div className="status-dropdown">
          <button
            className="status-button"
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
          >
            Update Status
            <ChevronDown size={16} />
          </button>

          {isStatusMenuOpen && (
            <div className="status-menu">
              {statusOptions.map((option) => (
                <div
                  key={option}
                  className="status-menu-item"
                  onClick={() => handleStatusChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="title-description">
        <h2>{title || 'No title to be displayed'}</h2>
        <p className="description-class">{description || 'No description to be displayed'}</p>
      </div>

      {hasLinks && (
        <div className="free-resources-section">
          <div className="free-resources-header">✓ Free Resources</div>
          <div className="resource-list">
            {links.map((link, index) => (
              <div key={index} className="resource-item">
                <span className={`resource-tag ${link.url.includes('youtube') ? 'tag-video' : 'tag-article'}`}>
                  {link.url.includes('youtube') ? 'Video' : 'Article'}
                </span>
                <a
                  href={formatUrl(link.url)}
                  className="resource-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getVideoTitle(link)}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitSideBar;
