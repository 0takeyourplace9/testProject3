'use client';
import moveFocusInside, { focusIsHidden, focusInside } from 'focus-lock';

var lastActiveTrap = 0;
var lastActiveFocus = null;

var focusOnBody = function focusOnBody() {
  return document && document.activeElement === document.body;
};

var isFreeFocus = function isFreeFocus() {
  return focusOnBody() || focusIsHidden();
};

var activateTrap = function activateTrap() {
  var result = false;

  if (lastActiveTrap) {
    var observed = lastActiveTrap;

    if (!isFreeFocus()) {
      if (observed && !focusInside(observed)) {
        result = moveFocusInside(observed, lastActiveFocus);
      }

      lastActiveFocus = document.activeElement;
    }
  }

  return result;
};

var reducePropsToState = function reducePropsToState(propsList) {
  return propsList
    .filter(function (node) {
      return node;
    })
    .slice(-1)[0];
};

var handleStateChangeOnClient = function handleStateChangeOnClient(trap) {
  lastActiveTrap = trap;

  if (trap) {
    activateTrap();
  }
};

var instances = [];

var emitChange = function emitChange(event) {
  if (handleStateChangeOnClient(reducePropsToState(instances))) {
    event && event.preventDefault();
    return true;
  }

  return false;
};

var attachHandler = function attachHandler() {
  document.addEventListener('focusin', emitChange);
};

var detachHandler = function detachHandler() {
  document.removeEventListener('focusin', emitChange);
};

var focusLock = {
  on: function on(domNode) {
    if (instances.length === 0) {
      attachHandler();
    }

    if (instances.indexOf(domNode) < 0) {
      instances.push(domNode);
      emitChange();
    }
  },
  off: function off(domNode) {
    instances = instances.filter(function (node) {
      return node !== domNode;
    });
    emitChange();

    if (instances.length === 0) {
      detachHandler();
    }
  },
};

export default focusLock;
