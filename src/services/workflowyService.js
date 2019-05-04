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
