import React from 'react';
import '../ImpactEffortChart.css';

const PipelineModule = () => {
    const pipelineItems = [
        { id: 1, text: 'Lesson Plan AI' },
        { id: 2, text: 'Branch Visit Scheduling' },
        { id: 3, text: 'Branch Audit' },
        { id: 4, text: 'OCR + AI' },
        { id: 5, text: 'Design System' },
        { id: 6, text: 'WhatsApp communication and tracking' }
    ];

    return (
        <div className="pipeline-container">
            <div className="pipeline-header">
                <h2 className="pipeline-title">Pipeline - Future Projects</h2>
                <p className="pipeline-subtitle">Upcoming projects and initiatives</p>
            </div>

            {/* Pipeline Items List */}
            <div className="pipeline-list">
                {pipelineItems.map((item) => (
                    <div key={item.id} className="pipeline-item">
                        <div className="item-content">
                            <h3 className="item-title">{item.text}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="pipeline-summary">
                <p>Total pipeline items: {pipelineItems.length}</p>
            </div>
        </div>
    );
};

export default PipelineModule; 
