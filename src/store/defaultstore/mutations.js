export function fetchData (state, { data, moduleName }) {
  state[moduleName].data = data
  state[moduleName].fetch = true
}

export function addRow (state, { row, moduleName }) {
  const i = state[moduleName].data.findIndex(el => el.id === row.id)
  if (i === -1) {
    state[moduleName].data.push(row)
  } else {
    state[moduleName].data.splice(i, 1, row)
  }
}

export function addRowToSpecificAttribute (
  state,
  { row, moduleName, id, attribute }
) {
  const i = state[moduleName].data.findIndex(el => el.id === id)
  if (i === -1) {
    const j = state[moduleName].data[i][attribute].findIndex(
      el2 => el2.id === row.id
    )
    if (j === -1) {
      state[moduleName].data[i][attribute].push(row)
    } else {
      state[moduleName].data[i][attribute].splice(j, 1, row)
    }
  }
}

export function deleteRow (state, { id, moduleName }) {
  const i = state[moduleName].data.findIndex(el => el.id === id)
  if (i !== -1) {
    state[moduleName].data.splice(i, 1)
  }
}
