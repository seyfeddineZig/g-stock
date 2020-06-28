export function fetchData (context, { Vue, fetch, moduleName }) {
  if (!fetch) {
    Vue.$axios.get(moduleName + '/index').then(res => {
      context.commit('fetchData', { data: res.data, moduleName: moduleName })
    })
  }
}

export function addRow (context, { row, moduleName }) {
  context.commit('addRow', { row, moduleName })
}

export function deleteRow (context, { Vue, id, moduleName, moduleLabel }) {
  Vue.$axios.delete(moduleName + '/delete/' + id).then(res => {
    if (res) {
      context.commit('deleteRow', { id, moduleName })
      Vue.$q.notify({
        type: 'positive',
        position: 'bottom-right',
        timeout: 1500,
        message: moduleLabel + ' a été supprimé avec succés'
      })
      Vue.socket.emit('DELETE', {
        id: id,
        moduleName: moduleName
      })
    } else {
      Vue.confirmDeleteDialog = null
    }
  })
}
