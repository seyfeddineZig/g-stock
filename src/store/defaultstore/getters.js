export function getAll (state) {
  return moduleName => {
    return state[moduleName].data
  }
}

export function getByAttribute (state) {
  return ({ moduleName, attribute, value }) => {
    return state[moduleName].data.filter(e => e[attribute] === value)
  }
}

export function getOne (state) {
  return ({ moduleName, id }) => {
    return state[moduleName].data.find(e => e.id === id)
  }
}

export function getOneByAttribute (state) {
  return ({ moduleName, attribute, value }) => {
    return state[moduleName].data.find(el => el[attribute] === value)
  }
}
export function fetched (state) {
  return moduleName => {
    return state[moduleName].fetch
  }
}
