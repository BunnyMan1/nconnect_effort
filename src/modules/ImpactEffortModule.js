import React, { useState, useEffect } from 'react';
import '../ImpactEffortChart.css';
import { moduleConfig, chartConfig, getPlotDimensions } from './moduleConfig';

const ImpactEffortModule = ({ moduleId, onNavigate, showNavigation = true }) => {
    const [notes, setNotes] = useState('');
    const config = moduleConfig[moduleId];

    // Load notes from localStorage on component mount
    useEffect(() => {
        if (config) {
            const savedNotes = localStorage.getItem(`${moduleId}_notes`);
            if (savedNotes) {
                setNotes(savedNotes);
            }
        }
    }, [moduleId, config]);

    // Save notes to localStorage whenever notes change
    useEffect(() => {
        if (config) {
            localStorage.setItem(`${moduleId}_notes`, notes);
        }
    }, [notes, moduleId, config]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                onNavigate('next');
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                onNavigate('previous');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);

    if (!config) {
        return <div>Module not found</div>;
    }

    const { name, futureImpact, currentImpact, description, notes: defaultNotes, connectingLineStyle = 'solid' } = config;
    const { chartWidth, chartHeight, margin } = chartConfig;
    const { plotWidth, plotHeight } = getPlotDimensions();

    // Convert percentage to actual coordinates
    const getCoords = (point) => ({
        x: margin.left + (point.x / 100) * plotWidth,
        y: margin.top + ((100 - point.y) / 100) * plotHeight
    });

    const futureCoords = getCoords(futureImpact);
    const currentCoords = getCoords(currentImpact);

    // Grid lines
    const gridLines = [];
    for (let i = 0; i <= 10; i++) {
        const x = margin.left + (i / 10) * plotWidth;
        const y = margin.top + (i / 10) * plotHeight;

        // Vertical grid lines
        gridLines.push(
            <line
                key={`v-${i}`}
                x1={x}
                y1={margin.top}
                x2={x}
                y2={margin.top + plotHeight}
                stroke="#e5e5e5"
                strokeWidth="1"
                strokeDasharray="2,2"
            />
        );

        // Horizontal grid lines
        gridLines.push(
            <line
                key={`h-${i}`}
                x1={margin.left}
                y1={y}
                x2={margin.left + plotWidth}
                y2={y}
                stroke="#e5e5e5"
                strokeWidth="1"
                strokeDasharray="2,2"
            />
        );
    }

    return (
        <div className="chart-container">
            {/* Navigation Header */}
            {showNavigation && (
                <div className="navigation-header">
                    <button
                        className="nav-button prev-button"
                        onClick={() => onNavigate('previous')}
                        title="Previous (←)"
                    >
                        ← Previous
                    </button>
                    <h2 className="chart-title">
                        {description}
                    </h2>
                    <button
                        className="nav-button next-button"
                        onClick={() => onNavigate('next')}
                        title="Next (→)"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Chart Container */}
            <div className="chart-wrapper">
                <svg width={chartWidth} height={chartHeight} className="chart-svg">
                    {/* Grid */}
                    {gridLines}

                    {/* Main axis lines */}
                    <line
                        x1={margin.left + plotWidth / 2}
                        y1={margin.top}
                        x2={margin.left + plotWidth / 2}
                        y2={margin.top + plotHeight}
                        stroke="#333"
                        strokeWidth="2"
                    />
                    <line
                        x1={margin.left}
                        y1={margin.top + plotHeight / 2}
                        x2={margin.left + plotWidth}
                        y2={margin.top + plotHeight / 2}
                        stroke="#333"
                        strokeWidth="2"
                    />

                    {/* Chart border */}
                    <rect
                        x={margin.left}
                        y={margin.top}
                        width={plotWidth}
                        height={plotHeight}
                        fill="none"
                        stroke="#333"
                        strokeWidth="2"
                    />

                    {/* Connecting Line with Arrow */}
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="13"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon
                                points="0 0, 10 3.5, 0 7"
                                fill="#3b82f6"
                            />
                        </marker>
                    </defs>

                    {/* Connecting line from current to future */}
                    <line
                        x1={currentCoords.x}
                        y1={currentCoords.y}
                        x2={futureCoords.x}
                        y2={futureCoords.y}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray={connectingLineStyle === 'dotted' ? '5,5' : 'none'}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Future Impact Point (Green) */}
                    <circle
                        cx={futureCoords.x}
                        cy={futureCoords.y}
                        r="12"
                        fill="#22c55e"
                        stroke="#16a34a"
                        strokeWidth="2"
                    />
                    <text
                        x={futureCoords.x}
                        y={futureCoords.y + 5}
                        textAnchor="middle"
                        className="point-text"
                    >
                        F
                    </text>

                    {/* Current Impact Point (Orange) */}
                    <circle
                        cx={currentCoords.x}
                        cy={currentCoords.y}
                        r="12"
                        fill="#f97316"
                        stroke="#ea580c"
                        strokeWidth="2"
                    />
                    <text
                        x={currentCoords.x}
                        y={currentCoords.y + 5}
                        textAnchor="middle"
                        className="point-text"
                    >
                        C
                    </text>

                    {/* Y-axis label */}
                    <text
                        x={20}
                        y={margin.top + plotHeight / 2}
                        textAnchor="middle"
                        className="axis-label"
                        transform={`rotate(-90, 20, ${margin.top + plotHeight / 2})`}
                    >
                        Impact
                    </text>

                    {/* Y-axis markers */}
                    <text
                        x={margin.left - 10}
                        y={margin.top + 5}
                        textAnchor="end"
                        className="axis-marker"
                    >
                        High Impact
                    </text>
                    <text
                        x={margin.left - 10}
                        y={margin.top + plotHeight}
                        textAnchor="end"
                        className="axis-marker"
                    >
                        Low Impact
                    </text>

                    {/* X-axis label */}
                    <text
                        x={margin.left + plotWidth / 2}
                        y={chartHeight - 5}
                        textAnchor="middle"
                        className="axis-label"
                    >
                        Effort
                    </text>

                    {/* X-axis markers */}
                    <text
                        x={margin.left}
                        y={margin.top + plotHeight + 25}
                        textAnchor="start"
                        className="axis-marker"
                    >
                        Low Effort
                    </text>
                    <text
                        x={margin.left + plotWidth}
                        y={margin.top + plotHeight + 25}
                        textAnchor="end"
                        className="axis-marker"
                    >
                        High Effort
                    </text>
                </svg>
            </div>

            {/* Legend */}
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color future"></div>
                    <span>Future Impact</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color current"></div>
                    <span>Current Impact</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color connecting-line" style={{
                        background: 'linear-gradient(to right, #3b82f6 50%, transparent 50%)',
                        backgroundSize: connectingLineStyle === 'dotted' ? '10px 3px' : '100% 3px',
                        backgroundRepeat: 'repeat-x'
                    }}></div>
                    <span>Connecting Line ({connectingLineStyle})</span>
                </div>
            </div>

            {/* Notes Section */}
            {/* <div className="notes-section">
                <label htmlFor="notes" className="notes-label">
                    Notes & Action Items:
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="notes-textarea"
                    placeholder={defaultNotes}
                />
                <div className="save-status">
                    Notes automatically saved to {moduleId}_notes.txt
                </div>
            </div> */}
        </div>
    );
};

export default ImpactEffortModule; 
