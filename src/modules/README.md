# Module System Documentation

This folder contains the modular architecture for the Impact vs Effort Analysis tool.

## New Architecture

The module system has been refactored to use a single reusable component with a master configuration file, eliminating code duplication.

### Files
- `ImpactEffortModule.js` - Single reusable component for all modules
- `moduleConfig.js` - Master configuration file containing all module data
- `createModule.js` - Template file (legacy, no longer needed)

## Configuration

All module data is centralized in `moduleConfig.js`:

```javascript
export const moduleConfig = {
  Module1: {
    name: 'Module 1',
    futureImpact: { x: 25, y: 85 }, // Low effort, high impact
    currentImpact: { x: 80, y: 20 }, // High effort, low impact
    description: 'Module 1 Impact vs Effort Analysis',
    notes: 'Add your notes, action items, or observations here...',
    connectingLineStyle: 'solid' // 'solid' or 'dotted'
  },
  // ... more modules
};
```

## Adding New Modules

To add a new module, simply add a new entry to the `moduleConfig` object in `moduleConfig.js`:

```javascript
Module4: {
  name: 'Module 4',
  futureImpact: { x: 30, y: 90 }, // Custom coordinates
  currentImpact: { x: 75, y: 15 }, // Custom coordinates
  description: 'Module 4 Impact vs Effort Analysis',
  notes: 'Custom placeholder text...',
  connectingLineStyle: 'dotted' // 'solid' or 'dotted'
}
```

The module will automatically appear in the navigation without any additional code changes.

## Features
Each module includes:
- Impact vs Effort chart visualization
- Connecting line with arrow from current to future impact points
- Configurable line style (solid or dotted) in blue color
- Individual notes section that auto-saves to localStorage
- Unique module identification
- Persistent data storage per module
- Configurable plot coordinates
- Custom descriptions and placeholder text

## Data Storage
- Notes are automatically saved to localStorage with the key `{moduleId}_notes`
- Each module maintains its own separate notes
- Data persists between browser sessions

## Navigation
- Use the navigation buttons at the top to switch between modules
- The active module is highlighted in blue
- Each module maintains its own state independently
- Navigation is automatically generated from the configuration

## Benefits of New Architecture
- **No Code Duplication**: Single component handles all modules
- **Easy Maintenance**: Changes to chart logic only need to be made in one place
- **Simple Configuration**: Adding new modules requires only configuration changes
- **Consistent Behavior**: All modules behave identically
- **Type Safety**: Configuration structure ensures consistency 
