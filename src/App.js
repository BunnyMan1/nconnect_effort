import React, { useState } from 'react';
import './App.css';
import './ImpactEffortChart.css';
import ImpactEffortModule from './modules/ImpactEffortModule';
import PipelineModule from './modules/PipelineModule';
import OverviewChart from './modules/OverviewChart';
import { moduleConfig } from './modules/moduleConfig';

function App() {
  const [currentModule, setCurrentModule] = useState('MicroSchedule');
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'overview'
  
  // Global state for dot visibility - both default to false (turned off)
  const [showFutureDot, setShowFutureDot] = useState(false);
  const [showCurrentDot, setShowCurrentDot] = useState(false);

  const modules = Object.keys(moduleConfig).map(moduleId => ({
    id: moduleId,
    name: moduleConfig[moduleId].name
  }));

  const handleNavigate = (direction) => {
    const currentIndex = modules.findIndex(module => module.id === currentModule);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % modules.length;
    } else if (direction === 'previous') {
      newIndex = currentIndex === 0 ? modules.length - 1 : currentIndex - 1;
    }

    setCurrentModule(modules[newIndex].id);
  };

  // Filter out pipeline modules for navigation (they don't need chart navigation)
  const chartModules = modules.filter(module => moduleConfig[module.id].type !== 'pipeline');

  return (
    <div className="App">
      <div className="app-layout">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">nConnect Projects</h3>
            <div className="view-mode-toggle">
              <button
                className={`view-mode-button ${viewMode === 'individual' ? 'active' : ''}`}
                onClick={() => setViewMode('individual')}
              >
                Individual
              </button>
              <button
                className={`view-mode-button ${viewMode === 'overview' ? 'active' : ''}`}
                onClick={() => setViewMode('overview')}
              >
                Overview
              </button>
            </div>
          </div>
          
          {/* Dot Visibility Controls */}
          <div className="dot-controls">
            <h4 className="dot-controls-title">Status Dots</h4>
            <div className="dot-control-item">
              <label className="dot-control-label">
                <input
                  type="checkbox"
                  checked={showFutureDot}
                  onChange={(e) => setShowFutureDot(e.target.checked)}
                  className="dot-control-checkbox"
                />
                <span className="dot-control-text">
                  <span className="dot-indicator future-dot"></span>
                  Future Status (Green)
                </span>
              </label>
            </div>
            <div className="dot-control-item">
              <label className="dot-control-label">
                <input
                  type="checkbox"
                  checked={showCurrentDot}
                  onChange={(e) => setShowCurrentDot(e.target.checked)}
                  className="dot-control-checkbox"
                />
                <span className="dot-control-text">
                  <span className="dot-indicator current-dot"></span>
                  Current Status (Orange)
                </span>
              </label>
            </div>
          </div>
          
          <div className="sidebar-content">
            {viewMode === 'individual' && (
              <div className="module-list">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    className={`sidebar-module-button ${currentModule === module.id ? 'active' : ''}`}
                    onClick={() => setCurrentModule(module.id)}
                  >
                    {module.name}
                  </button>
                ))}
              </div>
            )}
            {viewMode === 'overview' && (
              <div className="overview-info">
                <p>All modules displayed on a single chart with filtering options.</p>
                <p>Hover over points to see module names.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {viewMode === 'overview' ? (
            <OverviewChart 
              showFutureDot={showFutureDot}
              showCurrentDot={showCurrentDot}
            />
          ) : (
            <>
              {moduleConfig[currentModule]?.type === 'pipeline' ? (
                <PipelineModule />
              ) : (
                <ImpactEffortModule
                  moduleId={currentModule}
                  onNavigate={handleNavigate}
                  showNavigation={true}
                  showFutureDot={showFutureDot}
                  showCurrentDot={showCurrentDot}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
