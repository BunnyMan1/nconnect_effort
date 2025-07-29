import React, { useState, useEffect } from 'react';
import '../ImpactEffortChart.css';
import { moduleConfig, chartConfig, getPlotDimensions } from './moduleConfig';

const OverviewChart = () => {
    const [visibleModules, setVisibleModules] = useState({});
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

    // Initialize all modules as visible by default
    useEffect(() => {
        const initialVisibility = {};
        Object.keys(moduleConfig).forEach(moduleId => {
            if (moduleConfig[moduleId].type !== 'pipeline') {
                initialVisibility[moduleId] = true;
            }
        });
        setVisibleModules(initialVisibility);
    }, []);

    // Load visibility state from localStorage
    useEffect(() => {
        const savedVisibility = localStorage.getItem('overview_chart_visibility');
        if (savedVisibility) {
            setVisibleModules(JSON.parse(savedVisibility));
        }
    }, []);

    // Save visibility state to localStorage
    useEffect(() => {
        localStorage.setItem('overview_chart_visibility', JSON.stringify(visibleModules));
    }, [visibleModules]);

    // Filter modules to only show non-pipeline modules
    const chartModules = Object.keys(moduleConfig).filter(moduleId =>
        moduleConfig[moduleId].type !== 'pipeline'
    );

    // Chart dimensions for overview (larger than individual charts)
    const overviewChartConfig = {
        chartWidth: 1200,
        chartHeight: 800,
        margin: { top: 40, right: 60, bottom: 60, left: 100 }
    };

    const { chartWidth, chartHeight, margin } = overviewChartConfig;
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    // Convert percentage to actual coordinates
    const getCoords = (point) => ({
        x: margin.left + (point.x / 100) * plotWidth,
        y: margin.top + ((100 - point.y) / 100) * plotHeight
    });

    // Calculate quadrant counts
    const calculateQuadrantCounts = () => {
        const counts = {
            topLeft: { current: 0, future: 0 },
            topRight: { current: 0, future: 0 },
            bottomLeft: { current: 0, future: 0 },
            bottomRight: { current: 0, future: 0 }
        };

        chartModules.forEach(moduleId => {
            if (!visibleModules[moduleId]) return;

            const module = moduleConfig[moduleId];
            if (!module.futureImpact || !module.currentImpact) return;

            // Determine quadrant for current status
            const currentQuadrant = getQuadrant(module.currentImpact);
            counts[currentQuadrant].current++;

            // Determine quadrant for future status
            const futureQuadrant = getQuadrant(module.futureImpact);
            counts[futureQuadrant].future++;
        });

        return counts;
    };

    // Helper function to determine quadrant
    const getQuadrant = (point) => {
        if (point.y >= 50) { // High impact
            if (point.x < 50) { // Low effort
                return 'topLeft';
            } else { // High effort
                return 'topRight';
            }
        } else { // Low impact
            if (point.x < 50) { // Low effort
                return 'bottomLeft';
            } else { // High effort
                return 'bottomRight';
            }
        }
    };

    const quadrantCounts = calculateQuadrantCounts();

    // Handle module visibility toggle
    const toggleModuleVisibility = (moduleId) => {
        setVisibleModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Handle mouse events for tooltip
    const handleMouseEnter = (event, moduleName, pointType) => {
        setTooltip({
            show: true,
            content: `${moduleName} - ${pointType}`,
            x: event.clientX + 10,
            y: event.clientY - 10
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, content: '', x: 0, y: 0 });
    };

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

    // Quadrant count labels
    const quadrantLabels = [
        {
            quadrant: 'topLeft',
            x: margin.left + plotWidth * 0.07,
            y: margin.top + plotHeight * 0.45,
            label: 'High Impact, Low Effort'
        },
        {
            quadrant: 'topRight',
            x: margin.left + plotWidth * 0.92,
            y: margin.top + plotHeight * 0.45,
            label: 'High Impact, High Effort'
        },
        {
            quadrant: 'bottomLeft',
            x: margin.left + plotWidth * 0.42,
            y: margin.top + plotHeight * 0.95,
            label: 'Low Impact, Low Effort'
        },
        {
            quadrant: 'bottomRight',
            x: margin.left + plotWidth * 0.57,
            y: margin.top + plotHeight * 0.95,
            label: 'Low Impact, High Effort'
        }
    ];

    return (
        <div className="overview-chart-container">
            <div className="overview-header">
                <h1>Module Overview - Impact vs Effort</h1>
                <p>All modules displayed on a single chart. Hover over points to see module names.</p>
            </div>

            {/* Chart Container */}
            <div className="overview-chart-wrapper">
                <svg width={chartWidth} height={chartHeight} className="overview-chart-svg">
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

                    {/* Arrow marker definition */}
                    <defs>
                        <marker
                            id="overview-arrowhead"
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

                    {/* Quadrant count labels */}
                    {quadrantLabels.map(({ quadrant, x, y, label }) => (
                        <g key={quadrant}>
                            {/* Background rectangle for count */}
                            <rect
                                x={x - 60}
                                y={y - 40}
                                width={130}
                                height={70}
                                fill="rgba(255, 255, 255, 0.9)"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                rx="4"
                            />

                            {/* Quadrant label */}
                            <text
                                x={x + 5}
                                y={y - 20}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="600"
                                fill="#374151"
                            >
                                {label}
                            </text>

                            {/* Current count */}
                            <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="600"
                                fill="#f97316"
                            >
                                Current: {quadrantCounts[quadrant].current}
                            </text>

                            {/* Future count */}
                            <text
                                x={x}
                                y={y + 15}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="600"
                                fill="#22c55e"
                            >
                                Future: {quadrantCounts[quadrant].future}
                            </text>
                        </g>
                    ))}

                    {/* Render modules */}
                    {chartModules.map(moduleId => {
                        const module = moduleConfig[moduleId];
                        if (!visibleModules[moduleId] || !module.futureImpact || !module.currentImpact) {
                            return null;
                        }

                        const futureCoords = getCoords(module.futureImpact);
                        const currentCoords = getCoords(module.currentImpact);

                        return (
                            <g key={moduleId}>
                                {/* Connecting line from current to future */}
                                <line
                                    x1={currentCoords.x}
                                    y1={currentCoords.y}
                                    x2={futureCoords.x}
                                    y2={futureCoords.y}
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeDasharray={module.connectingLineStyle === 'dotted' ? '5,5' : 'none'}
                                    markerEnd="url(#overview-arrowhead)"
                                    opacity="0.7"
                                />

                                {/* Future Impact Point (Green) */}
                                <circle
                                    cx={futureCoords.x}
                                    cy={futureCoords.y}
                                    r="8"
                                    fill="#22c55e"
                                    stroke="#16a34a"
                                    strokeWidth="2"
                                    onMouseEnter={(e) => handleMouseEnter(e, module.name, 'Future Status')}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ cursor: 'pointer' }}
                                />

                                {/* Current Impact Point (Orange) */}
                                <circle
                                    cx={currentCoords.x}
                                    cy={currentCoords.y}
                                    r="8"
                                    fill="#f97316"
                                    stroke="#ea580c"
                                    strokeWidth="2"
                                    onMouseEnter={(e) => handleMouseEnter(e, module.name, 'Current Status')}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ cursor: 'pointer' }}
                                />
                            </g>
                        );
                    })}

                    {/* Y-axis label */}
                    <text
                        x={30}
                        y={margin.top + plotHeight / 2}
                        textAnchor="middle"
                        className="axis-label"
                        transform={`rotate(-90, 30, ${margin.top + plotHeight / 2})`}
                        fontSize="16"
                    >
                        Impact
                    </text>

                    {/* Y-axis markers */}
                    <text
                        x={margin.left - 15}
                        y={margin.top + 10}
                        textAnchor="end"
                        className="axis-marker"
                        fontSize="14"
                    >
                        High Impact
                    </text>
                    <text
                        x={margin.left - 15}
                        y={margin.top + plotHeight}
                        textAnchor="end"
                        className="axis-marker"
                        fontSize="14"
                    >
                        Low Impact
                    </text>

                    {/* X-axis label */}
                    <text
                        x={margin.left + plotWidth / 2}
                        y={chartHeight - 10}
                        textAnchor="middle"
                        className="axis-label"
                        fontSize="16"
                    >
                        Effort
                    </text>

                    {/* X-axis markers */}
                    <text
                        x={margin.left}
                        y={margin.top + plotHeight + 35}
                        textAnchor="start"
                        className="axis-marker"
                        fontSize="14"
                    >
                        Low Effort
                    </text>
                    <text
                        x={margin.left + plotWidth}
                        y={margin.top + plotHeight + 35}
                        textAnchor="end"
                        className="axis-marker"
                        fontSize="14"
                    >
                        High Effort
                    </text>
                </svg>
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="overview-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        zIndex: 1000
                    }}
                >
                    {tooltip.content}
                </div>
            )}

            {/* Legend */}
            <div className="overview-legend">
                <div className="legend-item">
                    <div className="legend-color future"></div>
                    <span>Future Status</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color current"></div>
                    <span>Current Status</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color connecting-line"></div>
                    <span>Connecting Line</span>
                </div>
            </div>

            {/* Module Filter Checkboxes */}
            <div className="module-filters">
                <h3>Module Filters</h3>
                <div className="checkbox-grid">
                    {chartModules.map(moduleId => {
                        const module = moduleConfig[moduleId];
                        return (
                            <label key={moduleId} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={visibleModules[moduleId] || false}
                                    onChange={() => toggleModuleVisibility(moduleId)}
                                />
                                <span className="checkbox-label">{module.name}</span>
                            </label>
                        );
                    })}
                </div>
                <div className="filter-actions">
                    <button
                        onClick={() => {
                            const allVisible = {};
                            chartModules.forEach(moduleId => {
                                allVisible[moduleId] = true;
                            });
                            setVisibleModules(allVisible);
                        }}
                        className="filter-button"
                    >
                        Show All
                    </button>
                    <button
                        onClick={() => {
                            const allHidden = {};
                            chartModules.forEach(moduleId => {
                                allHidden[moduleId] = false;
                            });
                            setVisibleModules(allHidden);
                        }}
                        className="filter-button"
                    >
                        Hide All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewChart; 
