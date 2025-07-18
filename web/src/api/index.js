import axios from '@/utils/axios'

export default {
  getOsInfo (params = {}) {
    return axios({ url: '/monitor', method: 'get', params })
  },
  getIpInfo (params = {}) {
    return axios({ url: '/ip-info', method: 'get', params })
  },
  getSSHList(params = {}) {
    return axios({ url: '/get-ssh-list', method: 'get', params })
  },
  addSSH(data) {
    return axios({ url: '/add-ssh', method: 'post', data })
  },
  updateSSH(data) {
    return axios({ url: '/update-ssh', method: 'post', data })
  },
  removeSSH(id) {
    return axios({ url: `/remove-ssh/${ id }`, method: 'delete' })
  },
  getPlusInfo() {
    return axios({ url: '/plus-info', method: 'get' })
  },
  getPlusDiscount() {
    return axios({ url: '/plus-discount', method: 'get' })
  },
  getCommand(hostId) {
    return axios({ url: '/command', method: 'get', params: { hostId } })
  },
  decryptPrivateKey(data) {
    return axios({ url: '/decrypt-private-key', method: 'post', data })
  },
  getHostList() {
    return axios({ url: '/host-list', method: 'get' })
  },
  addHost(data) {
    return axios({ url: '/host-save', method: 'post', data })
  },
  updateHost(data) {
    return axios({ url: '/host-save', method: 'put', data })
  },
  batchUpdateHost(data) {
    return axios({ url: '/batch-update-host', method: 'put', data })
  },
  removeHost(data) {
    return axios({ url: '/host-remove', method: 'post', data })
  },
  importHost(data) {
    return axios({ url: '/import-host', method: 'post', data })
  },
  getPubPem() {
    return axios({ url: '/get-pub-pem', method: 'get' })
  },
  login(data) {
    return axios({ url: '/login', method: 'post', data })
  },
  getLoginRecord() {
    return axios({ url: '/log', method: 'get' })
  },
  saveIpWhiteList(data) {
    return axios({ url: '/ip-white-list', method: 'post', data })
  },
  updatePwd(data) {
    return axios({ url: '/pwd', method: 'put', data })
  },
  getMFA2QR() {
    return axios({ url: '/mfa2-code', method: 'post' })
  },
  getMFA2Status() {
    return axios({ url: '/mfa2-status', method: 'get' })
  },
  enableMFA2(data) {
    return axios({ url: '/mfa2-enable', method: 'post', data })
  },
  disableMFA2() {
    return axios({ url: '/mfa2-disable', method: 'post' })
  },
  getNotifyConfig() {
    return axios({ url: '/notify-config', method: 'get' })
  },
  updateNotifyConfig(data) {
    return axios({ url: '/notify-config', method: 'put', data })
  },
  getNotifyList() {
    return axios({ url: '/notify', method: 'get' })
  },
  updateNotifyList(data) {
    return axios({ url: '/notify', method: 'put', data })
  },
  getGroupList() {
    return axios({ url: '/group', method: 'get' })
  },
  addGroup(data) {
    return axios({ url: '/group', method: 'post', data })
  },
  updateGroup(id, data) {
    return axios({ url: `/group/${ id }`, method: 'put', data })
  },
  deleteGroup(id) {
    return axios({ url: `/group/${ id }`, method: 'delete' })
  },
  getScriptList(params = {}) {
    return axios({ url: '/script', method: 'get', params })
  },
  importScript(data) {
    return axios({ url: '/import-script', method: 'post', data })
  },
  getLocalScriptList() {
    return axios({ url: '/local-script', method: 'get' })
  },
  addScript(data) {
    return axios({ url: '/script', method: 'post', data })
  },
  updateScript(id, data) {
    return axios({ url: `/script/${ id }`, method: 'put', data })
  },
  deleteScript(id) {
    return axios({ url: `/script/${ id }`, method: 'delete' })
  },
  batchRemoveScript(data) {
    return axios({ url: '/batch-remove-script', method: 'post', data })
  },
  getScriptGroupList() {
    return axios({ url: '/script-group', method: 'get' })
  },
  addScriptGroup(data) {
    return axios({ url: '/script-group', method: 'post', data })
  },
  updateScriptGroup(id, data) {
    return axios({ url: `/script-group/${ id }`, method: 'put', data })
  },
  deleteScriptGroup(id) {
    return axios({ url: `/script-group/${ id }`, method: 'delete' })
  },
  getOnekeyRecord() {
    return axios({ url: '/onekey', method: 'get' })
  },
  deleteOnekeyRecord(ids) {
    return axios({ url: '/onekey', method: 'post', data: { ids } })
  },
  getEasynodeVersion() {
    return axios({ url: '/version', method: 'get' })
  },
  getPlusConf() {
    return axios({ url: '/plus-conf', method: 'get' })
  },
  updatePlusKey(data) {
    return axios({ url: '/plus-conf', method: 'post', data })
  },
  getAIConfig() {
    return axios({ url: '/ai-config', method: 'get' })
  },
  saveAIConfig(data) {
    return axios({ url: '/ai-config', method: 'post', data })
  },
  getAIModels(data) {
    return axios({ url: '/ai-models', method: 'post', data })
  },
  getChatHistory() {
    return axios({ url: '/chat-history', method: 'get' })
  },
  saveChatHistory(data) {
    return axios({ url: '/chat-history', method: 'post', data })
  },
  removeChatHistory(chatId) {
    return axios({ url: `/chat-history/${ chatId }`, method: 'delete' })
  },
  removeSomeLoginRecords() {
    return axios({ url: '/remove-some-login-records', method: 'delete' })
  }
}
