import * as api from '../utils/api';
const uuidv4 = require('uuid/v4');


export function saveWorkflowy(params) {
  return api.post('/api/v1/workflowy', params)
}
export function getDefaultWorkflowy() {
  return api.get('/api/v1/workflowy/default')
}
export function getWorkflowyByVersion(params) {
  return api.get(`/api/v1/workflowy/version${params.id}`)
}
export function generateUuid(){
    return uuidv4();
}
export function getAllRelations(){
    // relation
    return api.get('/api/v1/workflowy/relations')
}
export function getRelation(rootId){
    // relation
    return api.get(`/api/v1/workflowy/relations/${rootId}`)
}
export function setRelations(rootId, relations){
    // relation
    return api.post(`/api/v1/workflowy/relations/${rootId}`, relations)
}
export function saveAllRelations(relations){
    // relation
    return api.post(`/api/v1/workflowy/relations/`, {relations})
}
export function getAllNodes(){
    // relation
    return api.get('/api/v1/workflowy/nodes')
}
export function getNode(id){
    // relation
    return api.get(`/api/v1/workflowy/nodes/${id}`)
}
export function getNodesByIds(ids){
    // relation
    return api.post(`/api/v1/workflowy/search_nodes/`, {ids})
}
export function setNode(id, node){
    console.log("setNode", id, node);
    // relation
    return api.post(`/api/v1/workflowy/nodes/${id}`, node)
}
export function saveAllNodes(nodes){
    // relation
    return api.post(`/api/v1/workflowy/nodes/`, {nodes})
}
