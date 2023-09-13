/**
 * @typedef {Object} Message
 * @property {string} type
 * @property {string} payload
 * @property {string} timestamp
 *
 * Reserved message types: PING
 */

const buffer = [];

onconnect = (e) => {
  var port = e.ports[0];
  port.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'PING': {
          port.postMessage(buffer.pop());
          return;
        }
        default: {
          buffer.push({ ...message, timestamp: event.timestamp });
          return;
        }
      }
    } catch (e) {}
  };
};
