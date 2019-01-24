const path = require('path');
const packageJSON = require('./package.json');

const defaultBuildDestination = path.resolve("./build");

module.exports = {
  // buildDestination: process.env.BUILD_PATH || defaultBuildDestination,
  buildDestination: '//Mac/Home/Documents/Qlik/Sense/Extensions/qlik-multi-kpi_local-dev',
  mode: process.env.NODE_ENV || 'development',
  name: packageJSON.name,
  version: process.env.VERSION || 'local-dev',
  url: process.env.BUILD_URL || defaultBuildDestination,
  port: process.env.PORT || 8085
};
