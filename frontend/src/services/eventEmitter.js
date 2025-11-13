const eventEmitter = {
  _events: {},
  dispatch(event, data) {
    if (!this._events[event]) return;
    this._events[event].forEach(callback => callback(data));
  },
  subscribe(event, callback) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  },
  unsubscribe(event, callback) {
    if (!this._events[event]) return;
    const index = this._events[event].indexOf(callback);
    if (index > -1) {
      this._events[event].splice(index, 1);
    }
  },
};

export default eventEmitter;
