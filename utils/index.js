const fs = require('fs');
const path = require('path');

async function loadDeploymentFromNetwork(network, name) {
    let deployment;
    try {
        deployment = JSON.parse(fs.readFileSync(path.join(__dirname, '../deployments', network, name + '.json')));
    } catch(e) {
        return null;
    }
    return deployment;
}

module.exports = {
    loadDeploymentFromNetwork
}
