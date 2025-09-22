import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {ELEMENT_ID} from './common/constant/element-id.js';

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
      console.log(`Hidden element: #${elementId}`);
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

// Execute immediately when script loads (highest priority)
executeHideLogic();

let reactRoot = null;
let isReactMounted = false;
let renderDebounceTimer = null;

// Configuration for debounce timing
const RENDER_CONFIG = {
  DEBOUNCE_DELAY: 500, // milliseconds to wait before re-render
  DOM_STABLE_DELAY: 200, // milliseconds to wait for DOM to stabilize
};

// Default container configuration
const CONTAINER_CONFIG = {
  DEFAULT_ID: 'react-app-root',
  DEFAULT_CLASS: 'react-app-container',
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
      document.getElementById('root') ||
      document.getElementById('app') ||
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
        console.log(`Created React container with ID: ${containerId}`);
      } else {
        console.error('Cannot find target element to append React container');
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
    console.log('Rendering <App /> ...');

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

    console.log('React app mounted successfully');
  }
}

/**
 * Debounced version of renderReactApp
 * @param {string} containerId - ID of the container element
 * @param {number | null} customDelay - Optional custom delay in milliseconds
 * @param {boolean} immediate - If true, render immediately without debounce
 */
function renderReactApp(
  containerId = CONTAINER_CONFIG.DEFAULT_ID,
  customDelay = null,
  immediate = false
) {
  // Clear existing timer
  if (renderDebounceTimer) {
    clearTimeout(renderDebounceTimer);
    renderDebounceTimer = null;
  }

  if (immediate) {
    console.log('Immediate React render requested');
    _renderReactAppInternal(containerId);
    return;
  }

  const delay =
    customDelay !== null ? customDelay : RENDER_CONFIG.DEBOUNCE_DELAY;

  console.log(`Scheduling React render...`);
  renderDebounceTimer = setTimeout(() => {
    renderDebounceTimer = null;
    _renderReactAppInternal(containerId);
  }, delay);
}

/**
 * Handle DOM mutations that might indicate external interference
 * @param mutations
 * @param {string} containerId - ID of the container element
 */
function handleDOMChanges(
  mutations,
  containerId = CONTAINER_CONFIG.DEFAULT_ID
) {
  let shouldReRender = false;

  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Check if root element was affected
      const rootElement = document.getElementById(containerId);

      if (rootElement) {
        // If root element is empty but React should be mounted, re-render
        if (isReactMounted && rootElement.children.length === 0) {
          console.log(
            'Detected React content cleared, scheduling re-render...'
          );
          shouldReRender = true;
        }

        // Check if root element was removed and re-added
        if (
          mutation.target === document.body &&
          Array.from(mutation.addedNodes).some(
            (node) => node.id === containerId
          )
        ) {
          console.log(
            'Detected root element re-added, scheduling re-render...'
          );
          shouldReRender = true;
        }
      }
    }
  });

  if (shouldReRender) {
    // Reset flag to allow re-mounting
    isReactMounted = false;

    // Use debounced render with DOM stable delay
    renderReactApp(containerId, RENDER_CONFIG.DOM_STABLE_DELAY);
  }
}

/**
 * Initialize DOM observer to watch for external changes
 * @param {string} containerId - ID of the container element
 */
function initializeDOMObserver(containerId = CONTAINER_CONFIG.DEFAULT_ID) {
  const observer = new MutationObserver((mutations) =>
    handleDOMChanges(mutations, containerId)
  );

  // Observe changes to body and its subtree
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  console.log('DOM observer initialized to watch for external changes');

  return observer;
}

/**
 * Handle page reload events
 * @param {string} containerId - ID of the container element
 */
function handlePageEvents(containerId = CONTAINER_CONFIG.DEFAULT_ID) {
  // Listen for before page unload
  window.addEventListener('beforeunload', () => {
    console.log('Page is reloading, React will re-mount after reload');
    isReactMounted = false;
  });

  // Re-render after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      renderReactApp(containerId, null, true)
    );
  }
}

/**
 * Initialize React app with universal mounting capability
 * @param {Object} options - Configuration options
 * @param {string} options.containerId - ID of the container element
 * @param {boolean} options.enableDOMObserver - Whether to enable DOM observer
 * @param {boolean} options.autoRender - Whether to auto-render on initialization
 */
function initializeReactApp(options = {}) {
  const {
    containerId = CONTAINER_CONFIG.DEFAULT_ID,
    enableDOMObserver = true,
    autoRender = true,
  } = options;

  console.log('Initializing universal React app...');

  // Handle page events
  handlePageEvents(containerId);

  // Initial render if auto-render is enabled
  if (autoRender) {
    renderReactApp(containerId, null, true);
  }

  // Start observing DOM changes if enabled
  if (enableDOMObserver) {
    initializeDOMObserver(containerId);
  }

  // Return public API for manual control
  return {
    render: (immediate = false) => renderReactApp(containerId, null, immediate),
    unmount: () => {
      if (reactRoot && isReactMounted) {
        reactRoot.unmount();
        isReactMounted = false;
        console.log('React app unmounted');
      }
    },
    isReactMounted: () => isReactMounted,
    getContainer: () => getOrCreateContainer(containerId),
  };
}

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

export default initializeReactApp;
