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

  // Global visibility controls
  const [showFutureStatus, setShowFutureStatus] = useState(false);
  const [showCurrentStatus, setShowCurrentStatus] = useState(false);

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

          {/* Global Visibility Controls */}
          <div className="visibility-controls">
            <h4 className="visibility-title">Chart Visibility</h4>
            <div className="visibility-switch">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={showFutureStatus}
                  onChange={(e) => setShowFutureStatus(e.target.checked)}
                  className="switch-input"
                />
                <span className="switch-slider"></span>
                <span className="switch-text">Future Status (Green)</span>
              </label>
            </div>
            <div className="visibility-switch">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={showCurrentStatus}
                  onChange={(e) => setShowCurrentStatus(e.target.checked)}
                  className="switch-input"
                />
                <span className="switch-slider"></span>
                <span className="switch-text">Current Status (Orange)</span>
              </label>
            </div>
            <div className="visibility-note">
              <small>Blue Impact for Effort dots always visible</small>
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
              showFutureStatus={showFutureStatus}
              showCurrentStatus={showCurrentStatus}
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
                  showFutureStatus={showFutureStatus}
                  showCurrentStatus={showCurrentStatus}
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
