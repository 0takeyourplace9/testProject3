// @ts-ignore
window.Service = class Service {
  constructor() {
    if (window.SharedWorker) {
      if (!Service.instance) {
        this.worker = new SharedWorker('/worker.js');
        Service.instance = this;
      }
      return Service.instance;
    }
  }
  set onmessage(fn) {
    if (window.SharedWorker) {
      this.worker.port.onmessage = fn;
    }
  }
  set onmessageerror(fn) {
    if (window.SharedWorker) {
      this.worker.port.onmessageerror = fn;
    }
  }
  set onerror(fn) {
    if (window.SharedWorker) {
      this.worker.onerror = fn;
    }
  }
  addEventListener(type, fn) {
    if (window.SharedWorker) {
      this.worker.port.addEventListener(type, fn);
    }
  }
  removeEventListener(type, fn) {
    if (window.SharedWorker) {
      this.worker.removeEventListener(type, fn);
    }
  }
  postMessage(message) {
    if (window.SharedWorker) {
      this.worker.port.postMessage(message);
    }
  }
};
