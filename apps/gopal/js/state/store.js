export function createStore(initialState) {
  let state = initialState;
  const subs = new Set();

  function get() { return state; }

  function set(next, reason = "") {
    state = next;
    for (const fn of subs) fn(state, reason);
  }

  function update(mutator, reason = "") {
    const next = structuredClone(state);
    mutator(next);
    set(next, reason);
  }

  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  return { get, set, update, subscribe };
}
