// Virtual Keyboard Implementation for Smart Locker
let keyboard = null;
let activeInputElement = null;
let currentLayoutName = 'default';

function isEditableInput(element) {
  return Boolean(
    element &&
      (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') &&
      typeof element.setSelectionRange === 'function'
  );
}

function resolveKeyboardInput(candidate) {
  if (isEditableInput(candidate)) return candidate;
  if (isEditableInput(document.activeElement)) return document.activeElement;
  return document.getElementById('username-input');
}

function focusAndMoveCaretToEnd(element) {
  if (!element) return;
  element.focus();
  if (typeof element.setSelectionRange === 'function') {
    const end = element.value.length;
    element.setSelectionRange(end, end);
  }
}

function initVirtualKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');

  if (!keyboardContainer || typeof window.SimpleKeyboard === 'undefined') {
    console.warn('Virtual keyboard not available');
    return;
  }

  keyboard = new window.SimpleKeyboard.default({
    onKeyPress: onKeyPress,
    theme: 'hg-theme-default custom-keyboard',
    layoutName: currentLayoutName,
    layout: {
      default: [
        '1 2 3 4 5 6 7 8 9 0',
        'q w e r t y u i o p',
        'a s d f g h j k l',
        'shift z x c v b n m backspace',
        '.com @ space'
      ],
      shift: [
        '! @ # $ % ^ & * ( )',
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        'shift Z X C V B N M backspace',
        '.com @ space'
      ]
    },
    display: {
      backspace: 'backspace',
      enter: 'enter',
      shift: 'shift',
      space: 'space'
    }
  });

  const hideButton = document.getElementById('keyboard-hide-btn');
  if (hideButton) {
    hideButton.addEventListener('click', hideVirtualKeyboard);
  }

  keyboardContainer.addEventListener('pointerdown', function (event) {
    const target = event.target;
    const keyButton = target && target.closest ? target.closest('.hg-button') : null;
    if (!keyButton) return;
    event.preventDefault();
    if (activeInputElement) {
      focusAndMoveCaretToEnd(activeInputElement);
    }
  });

  window.virtualKeyboard = keyboard;
}

function onKeyPress(button) {
  if (!activeInputElement) return;

  switch (button) {
    case 'backspace':
      activeInputElement.value = activeInputElement.value.slice(0, -1);
      break;
    case 'space':
      activeInputElement.value += ' ';
      break;
    case 'enter':
      activeInputElement.blur();
      hideVirtualKeyboard();
      break;
    case 'shift':
      toggleShiftKeyboard();
      break;
    default:
      activeInputElement.value += button;
  }

  activeInputElement.dispatchEvent(new Event('input', { bubbles: true }));
  focusAndMoveCaretToEnd(activeInputElement);
}

function toggleShiftKeyboard() {
  if (!keyboard) return;
  currentLayoutName = currentLayoutName === 'shift' ? 'default' : 'shift';
  keyboard.setOptions({ layoutName: currentLayoutName });
}

function showVirtualKeyboard(inputElement) {
  const resolvedInput = resolveKeyboardInput(inputElement);
  if (!resolvedInput) return;
  activeInputElement = resolvedInput;
  const keyboardContainer = document.getElementById('keyboard');

  if (keyboardContainer) {
    keyboardContainer.classList.remove('hidden');
    document.body.classList.add('keyboard-open');
    if (keyboard && typeof keyboard.setInput === 'function') {
      keyboard.setInput(activeInputElement.value || '');
    }
  }
  focusAndMoveCaretToEnd(activeInputElement);
}

function hideVirtualKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  if (keyboardContainer) {
    keyboardContainer.classList.add('hidden');
    document.body.classList.remove('keyboard-open');
  }
  activeInputElement = null;
}

function toggleVirtualKeyboard(inputElement) {
  const keyboardContainer = document.getElementById('keyboard');
  if (keyboardContainer && keyboardContainer.classList.contains('hidden')) {
    showVirtualKeyboard(inputElement);
  } else {
    hideVirtualKeyboard();
  }
}

function attachKeyboardToInputs() {
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="number"], input[type="search"], input[type="password"], textarea'
  );

  inputs.forEach(input => {
    if (!input.dataset.keyboardAttached) {
      input.addEventListener('focus', function () {
        showVirtualKeyboard(this);
      });

      input.addEventListener('blur', function () {
        setTimeout(() => {
          const keyboardContainer = document.getElementById('keyboard');
          if (document.activeElement === this) return;
          if (keyboardContainer && keyboardContainer.contains(document.activeElement)) return;
          hideVirtualKeyboard();
        }, 100);
      });

      input.dataset.keyboardAttached = 'true';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  function initIfReady() {
    if (typeof window.SimpleKeyboard !== 'undefined') {
      initVirtualKeyboard();
      attachKeyboardToInputs();
    }
  }

  initIfReady();
  if (typeof window.SimpleKeyboard === 'undefined') {
    setTimeout(initIfReady, 500);
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        attachKeyboardToInputs();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showVirtualKeyboard,
    hideVirtualKeyboard,
    toggleVirtualKeyboard,
    attachKeyboardToInputs
  };
}
