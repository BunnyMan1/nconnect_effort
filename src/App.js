import React, { useState } from 'react';
import './App.css';
import './ImpactEffortChart.css';
import ImpactEffortModule from './modules/ImpactEffortModule';
import PipelineModule from './modules/PipelineModule';
import { moduleConfig } from './modules/moduleConfig';

function App() {
  const [currentModule, setCurrentModule] = useState('MicroSchedule');

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
  return (
    <div className="App">
      <div className="app-layout">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Modules / Projects</h3>
          </div>
          <div className="sidebar-content">
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
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {moduleConfig[currentModule]?.type === 'pipeline' ? (
            <PipelineModule />
          ) : (
            <ImpactEffortModule
              moduleId={currentModule}
              onNavigate={handleNavigate}
              showNavigation={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
