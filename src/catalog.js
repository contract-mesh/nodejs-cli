'use strict';

async function getProject(name) {
  // testing dummy
  if (name === 'contract-mesh/api') {
    return {
      contractmesh: 1.0,
      type: project,
      info: {
        name: contract-mesh/api
      }
    }
  }
  return null;
}

module.exports.getProject = getProject;