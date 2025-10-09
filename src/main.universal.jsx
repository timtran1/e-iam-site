import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {ELEMENT_ID} from './common/constant/element-id.js';
import {isU5AdminPreview} from './common/helper/pageContext.js';
import replaceU5CMSFunctions from './utils/replaceU5CMSFunctions.js';

// Check if we're in u5admin preview mode - if so, exit early
const isPreview = isU5AdminPreview();
if (isPreview) {
  console.log('u5admin preview detected - skipping all universal script logic');
  // Exit early, don't execute any universal script logic
} else {
  // Only execute universal script logic if NOT in preview mode
  executeUniversalScript();
}

/**
 * Hide server-side elements immediately when universal script loads
 * This prevents flickering and conflicts with React rendering
 */
function hideServerSideElements() {
  console.log('Hiding server-side elements for universal mode...');

  // Get all element IDs from the constant
  const elementIds = Object.values(ELEMENT_ID);

  elementIds.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Add display: none !important to hide the element
      element.style.setProperty('display', 'none', 'important');
    }
  });
}

/**
 * Execute hiding logic with multiple strategies to ensure it runs as early as possible
 */
function executeHideLogic() {
  // Strategy 1: Execute immediately (script load time)
  hideServerSideElements();

  // Strategy 2: Execute when DOM is ready (if not already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideServerSideElements);
  }

  // Strategy 3: Execute after a short delay as fallback
  setTimeout(hideServerSideElements, 100);
}

/**
 * Execute all universal script logic
 * This includes hiding elements and initializing React
 */
function executeUniversalScript() {
  // Execute hiding logic immediately when script loads (highest priority)
  executeHideLogic();

  // Initialize React app
  initializeUniversalReact();
}

/**
 * Initialize React app for universal mode
 */
function initializeUniversalReact() {
  // Auto-initialize when script loads
  let reactAppInstance = null;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      reactAppInstance = initializeReactApp();
    });
  } else {
    reactAppInstance = initializeReactApp();
  }

  // Expose global API for external control (optional)
  if (typeof window !== 'undefined') {
    window.ReactApp = {
      init: initializeReactApp,
      getInstance: () => reactAppInstance,
    };
  }
}

let reactRoot = null;
let isReactMounted = false;

// Default container configuration
const CONTAINER_CONFIG = {
  DEFAULT_ID: 'app-root',
  DEFAULT_CLASS: 'app-container',
  FALLBACK_TARGET: 'body', // Where to append if no specific target found
};

/**
 * Create or get the React container element
 * @param {string} containerId - ID of the container element
 * @returns {HTMLElement} The container element
 */
function getOrCreateContainer(containerId = CONTAINER_CONFIG.DEFAULT_ID) {
  let container = document.getElementById(containerId);

  if (!container) {
    // Try to find alternative containers
    container =
      document.getElementById(CONTAINER_CONFIG.DEFAULT_ID) ||
      document.getElementById('root') ||
      document.querySelector('[data-react-root]');

    if (!container) {
      // Create new container
      container = document.createElement('div');
      container.id = containerId;
      container.className = CONTAINER_CONFIG.DEFAULT_CLASS;

      // Find the best place to append the container
      const targetElement = document.querySelector(
        CONTAINER_CONFIG.FALLBACK_TARGET
      );
      if (targetElement) {
        targetElement.appendChild(container);
        console.log(`Created container with ID: ${containerId}`);
      } else {
        console.error('Cannot find target element to append container');
        return null;
      }
    } else {
      console.log(`Using existing container: ${container.id}`);
    }
  }

  return container;
}

/**
 * Check if React root element exists and is ready for mounting
 * @param {string} containerId - ID of the container element
 * @returns {boolean} True if safe to mount React
 */
function canMountReact(containerId = CONTAINER_CONFIG.DEFAULT_ID) {
  const rootElement = getOrCreateContainer(containerId);

  if (!rootElement) {
    console.warn('Root element not found, waiting for DOM...');
    return false;
  }

  // Check if React content is missing (indicating external system may have cleared it)
  const hasReactContent = rootElement.children.length > 0;

  return !isReactMounted || !hasReactContent;
}

/**
 * Render React app safely (internal function)
 * @param {string} containerId - ID of the container element
 */
function _renderReactAppInternal(containerId = CONTAINER_CONFIG.DEFAULT_ID) {
  const rootElement = getOrCreateContainer(containerId);

  if (!rootElement) {
    console.warn('Cannot render React: root element not found');
    return;
  }

  if (canMountReact(containerId)) {
    console.log('Rendering...');

    // Clean up previous root if exists
    if (reactRoot && isReactMounted) {
      try {
        reactRoot.unmount();
      } catch (error) {
        console.warn('Error unmounting previous React root:', error);
      }
    }

    // Create new root and render
    reactRoot = ReactDOM.createRoot(rootElement);
    reactRoot.render(<App />);
    isReactMounted = true;

    console.log('App mounted successfully');

    replaceU5CMSFunctions();
  }
}

/**
 * Initialize React app with universal mounting capability
 */
function initializeReactApp(options = {}) {
  const {containerId = CONTAINER_CONFIG.DEFAULT_ID, autoRender = true} =
    options;
  console.log('Initializing universal app...');

  // Initial render if auto-render is enabled
  if (autoRender) {
    _renderReactAppInternal(containerId);
  }

  // Return public API for manual control
  return {
    render: () => _renderReactAppInternal(containerId),
    unmount: () => {
      if (reactRoot && isReactMounted) {
        reactRoot.unmount();
        isReactMounted = false;
        console.log('App unmounted');
      }
    },
  };
}

export default initializeReactApp;
