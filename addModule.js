#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get module name from command line argument
const moduleName = process.argv[2];

if (!moduleName) {
    console.error('Usage: node addModule.js <ModuleName>');
    console.error('Example: node addModule.js Module4');
    process.exit(1);
}

// Read the template
const templatePath = path.join(__dirname, 'src', 'modules', 'createModule.js');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
const newContent = templateContent
    .replace(/const ModuleName = \(\) => {/g, `const ${moduleName} = () => {`)
    .replace(/const moduleName = 'ModuleName';/g, `const moduleName = '${moduleName}';`)
    .replace(/export default ModuleName;/g, `export default ${moduleName};`);

// Write the new module file
const newModulePath = path.join(__dirname, 'src', 'modules', `${moduleName}.js`);
fs.writeFileSync(newModulePath, newContent);

console.log(`✅ Created new module: ${moduleName}.js`);
console.log(`📝 Don't forget to update App.js to include the new module!`);
console.log(`📋 Add this to your modules array in App.js:`);
console.log(`   import ${moduleName} from './modules/${moduleName}';`);
console.log(`   { id: '${moduleName}', name: '${moduleName.replace(/([A-Z])/g, ' $1').trim()}', component: ${moduleName} },`); 
