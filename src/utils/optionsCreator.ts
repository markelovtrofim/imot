export function optionsCreator(state: any | null) {
  if (state) {
    let local: { value: any, label: string }[] = [];
    for (let i = 0; i < state.length; i++) {
      local.push({value: state[i], label: state[i].title});
    }
    return local
  }
  return [];
};


// VEL - value equal label
export function optionsCreatorVEL(state: any) {
  if (state) {
    let local: { value: any, label: string }[] = [];
    for (let i = 0; i < state.length; i++) {
      local.push({value: state[i], label: state[i]});
    }
    debugger
    return local
  }
  return [];
}