// Virtual Keyboard Implementation for Smart Locker
let keyboard = null;
let activeInputElement = null;

// Initialize virtual keyboard
function initVirtualKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  
  if (!keyboardContainer || typeof window.SimpleKeyboard === 'undefined') {
    console.warn('Virtual keyboard not available');
    return;
  }

  keyboard = new window.SimpleKeyboard.default({
    onKeyPress: onKeyPress,
    theme: "hg-theme-default custom-keyboard",
    layout: {
      default: [
        "1 2 3 4 5 6 7 8 9 0",
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "shift z x c v b n m backspace",
        ".com @ space"
      ],
      shift: [
        "! @ # $ % ^ & * ( )",
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "shift Z X C V B N M backspace",
        ".com @ space"
      ]
    },
    display: {
      'backspace': 'backspace',
      'enter': 'enter',
      'shift': 'shift',
      'space': 'space'
    }
  });

  // Set keyboard container
  keyboard.setCaretPosition = false;
  
  // Store reference for later use
  window.virtualKeyboard = keyboard;
}

// Handle key press
function onKeyPress(button) {
  if (!activeInputElement) return;

  if (button === 'backspace') {
    const currentValue = activeInputElement.value;
    activeInputElement.value = currentValue.slice(0, -1);
  } else if (button === 'space') {
    activeInputElement.value += ' ';
  } else if (button === 'enter') {
    activeInputElement.blur();
    hideVirtualKeyboard();
  } else if (button === 'shift') {
    toggleShiftKeyboard();
  } else {
    activeInputElement.value += button;
  }

  // Trigger input event to update UI
  activeInputElement.dispatchEvent(new Event('input', { bubbles: true }));
}

// Toggle shift layout
function toggleShiftKeyboard() {
  if (keyboard) {
    const isShift = keyboard.getName() === 'shift';
    keyboard.setName(isShift ? 'default' : 'shift');
  }
}

// Show virtual keyboard
function showVirtualKeyboard(inputElement) {
  activeInputElement = inputElement;
  const keyboardContainer = document.getElementById('keyboard');
  
  if (keyboardContainer) {
    keyboardContainer.classList.remove('hidden');
    if (keyboard) {
      keyboard.clearDisplay();
    }
  }
  
  inputElement.focus();
}

// Hide virtual keyboard
function hideVirtualKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  if (keyboardContainer) {
    keyboardContainer.classList.add('hidden');
  }
  activeInputElement = null;
}

// Toggle keyboard visibility
function toggleVirtualKeyboard(inputElement) {
  const keyboardContainer = document.getElementById('keyboard');
  if (keyboardContainer && keyboardContainer.classList.contains('hidden')) {
    showVirtualKeyboard(inputElement);
  } else {
    hideVirtualKeyboard();
  }
}

// Attach keyboard to input elements
function attachKeyboardToInputs() {
  // Get all input elements that need virtual keyboard
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="number"], input[type="search"], textarea'
  );

  inputs.forEach(input => {
    if (!input.dataset.keyboardAttached) {
      // Show keyboard on focus
      input.addEventListener('focus', function(e) {
        showVirtualKeyboard(this);
      });

      // Hide keyboard on blur after a small delay
      input.addEventListener('blur', function(e) {
        // Small delay to prevent issues with keyboard button clicks
        setTimeout(() => {
          if (document.activeElement !== this) {
            hideVirtualKeyboard();
          }
        }, 100);
      });

      // Mark as attached
      input.dataset.keyboardAttached = 'true';
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for SimpleKeyboard to load
  if (typeof window.SimpleKeyboard !== 'undefined') {
    initVirtualKeyboard();
    attachKeyboardToInputs();
  } else {
    // Retry after a short delay
    setTimeout(function() {
      if (typeof window.SimpleKeyboard !== 'undefined') {
        initVirtualKeyboard();
        attachKeyboardToInputs();
      }
    }, 500);
  }

  // Reattach keyboard to dynamically created inputs
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
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

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showVirtualKeyboard,
    hideVirtualKeyboard,
    toggleVirtualKeyboard,
    attachKeyboardToInputs
  };
}
