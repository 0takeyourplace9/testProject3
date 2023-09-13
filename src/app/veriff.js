import { lock, unlock } from 'tua-body-scroll-lock';
import focusLock from './dom_focus_lock.js'; //https://unpkg.com/dom-focus-lock/dist/index.esm.js
import { APP_BASE } from './constants.ts';

var IFRAME_MESSAGES;

(function (IFRAME_MESSAGES) {
  IFRAME_MESSAGES['VERIFF_HANDSHAKE'] = 'VERIFF_HANDSHAKE';
  IFRAME_MESSAGES['VERIFF_RENDER'] = 'VERIFF_RENDER';
  IFRAME_MESSAGES['VERIFF_STARTED'] = 'VERIFF_STARTED';
  IFRAME_MESSAGES['VERIFF_FINISHED'] = 'VERIFF_FINISHED';
  IFRAME_MESSAGES['VERIFF_CANCELED'] = 'VERIFF_CANCELED';
  IFRAME_MESSAGES['VERIFF_FORCE_RELOAD'] = 'VERIFF_FORCE_RELOAD';
  IFRAME_MESSAGES['VERIFF_RELOAD_REQUEST'] = 'VERIFF_RELOAD_REQUEST';
})(IFRAME_MESSAGES || (IFRAME_MESSAGES = {}));

var MESSAGES;

(function (MESSAGES) {
  MESSAGES['STARTED'] = 'STARTED';
  MESSAGES['FINISHED'] = 'FINISHED';
  MESSAGES['CANCELED'] = 'CANCELED';
  MESSAGES['RELOAD_REQUEST'] = 'RELOAD';
})(MESSAGES || (MESSAGES = {}));

var wrapperStyles =
  '\n  position: fixed !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  z-index: 9999999;\n  display: block !important;\n  width: 100vw;\n  height: 100%;\n  margin: 0 !important;\n  padding: 0 !important;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  background: rgba(0, 0, 0, 0.6);\n';
var iframeStyles =
  '\n  position: absolute !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw;\n  height: 100%;\n  margin: 0 !important;\n  padding: 0 !important;\n  background: none;\n  border: none\n';

var IFRAME_ID = 'veriffFrame';

function appendParamToUrl(url, name, value) {
  if (value) {
    var newUrl = new URL(url);
    var params = newUrl.searchParams;
    params.set(name, value);
    newUrl.search = params.toString();
    return newUrl.toString();
  }

  return url;
}

function createIframe(url) {
  var frame = document.createElement('iframe');
  frame.src = url;
  frame.allow =
    'autoplay; camera; microphone; fullscreen; accelerometer; magnetometer; gyroscope; picture-in-picture;';
  frame.id = IFRAME_ID;
  frame.style.cssText = iframeStyles;
  var wrapper = document.createElement('div');
  wrapper.style.cssText = wrapperStyles;
  wrapper.appendChild(frame);
  document.body.appendChild(wrapper);
  focusLock.on(frame);
  lock(frame);
  return frame;
}

function createVeriffFrame(_ref) {
  var url = _ref.url,
    lang = _ref.lang,
    _ref$onEvent = _ref.onEvent,
    onEvent =
      _ref$onEvent === void 0
        ? function () {
            return;
          }
        : _ref$onEvent,
    onReload = _ref.onReload;

  if (!url) {
    throw new Error(
      'URL is not provided. Please provide a valid Veriff session url.',
    );
  }

  function closeIframe() {
    var frame = document.getElementById(IFRAME_ID);

    if (frame && frame.parentNode) {
      focusLock.off(frame);
      unlock(frame);
      var wrapper = frame.parentNode.parentNode;

      if (wrapper) {
        wrapper.removeChild(frame.parentNode);
      }
    } else {
      unlock();
    }

    window.removeEventListener('message', handleMessage);
  }

  function handleMessage(event) {
    if (event.origin !== APP_BASE) return;
    var frame = document.getElementById(IFRAME_ID);

    if (event.data === IFRAME_MESSAGES.VERIFF_HANDSHAKE) {
      var _frame$contentWindow;

      (_frame$contentWindow = frame.contentWindow) === null ||
      _frame$contentWindow === void 0
        ? void 0
        : _frame$contentWindow.postMessage(
            {
              name: IFRAME_MESSAGES.VERIFF_RENDER,
              payload: {
                isFullScreenSupported: true,
                isReloadHandled: typeof onReload === 'function',
                version: '1.3.1',
              },
            },
            '*',
          );
    }

    if (event.data === IFRAME_MESSAGES.VERIFF_STARTED) {
      onEvent(MESSAGES.STARTED);
    }

    if (event.data === IFRAME_MESSAGES.VERIFF_CANCELED) {
      closeIframe();
      onEvent(MESSAGES.CANCELED);
    }

    if (event.data === IFRAME_MESSAGES.VERIFF_FINISHED) {
      closeIframe();
      onEvent(MESSAGES.FINISHED);
    }

    if (event.data === IFRAME_MESSAGES.VERIFF_FORCE_RELOAD) {
      window.location.reload();
    }

    if (event.data === IFRAME_MESSAGES.VERIFF_RELOAD_REQUEST) {
      if (typeof onReload === 'function') {
        onReload();
      }

      onEvent(MESSAGES.RELOAD_REQUEST);
    }
  }

  if (lang && lang.length > 0) {
    createIframe(appendParamToUrl(url, 'lang', lang));
  } else {
    createIframe(url);
  }

  window.addEventListener('message', handleMessage);
  return {
    close: closeIframe,
  };
}

export { MESSAGES, createVeriffFrame };
