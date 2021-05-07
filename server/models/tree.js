const { v4: uuid } = require('uuid');
const { Repository } = require('./Repository.js');

const treeFromRequest = ({
    capture_id, 
    image_url,
    lat,
    lon,
    species_id = -1,
    morphology = '',
    age = -1,
    created_at,
    updated_at
}) => {
return Object.freeze({ 
    id: uuid(),
    latest_capture_id: capture_id,
    image_url,
    lat,
    lon,
    species_id,
    morphology,
    age,
    status: 'alive',
    created_at,
    updated_at
    });
}

const createTree = (treeRepository) => (async tree => {
    const repository = new Repository(treeRepository);
    return repository.add(tree);
});

module.exports = {
    createTree,
    treeFromRequest
};
