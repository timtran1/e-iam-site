import ReactDOM from 'react-dom/client';
import App from './App.jsx';

let reactRoot = null;
let isReactMounted = false;
let renderDebounceTimer = null;

// Configuration for debounce timing
const RENDER_CONFIG = {
  DEBOUNCE_DELAY: 500, // milliseconds to wait before re-render
  DOM_STABLE_DELAY: 200, // milliseconds to wait for DOM to stabilize
};

/**
 * Check if React root element exists and is ready for mounting
 * @returns {boolean} True if safe to mount React
 */
function canMountReact() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.warn('Root element not found, waiting for DOM...');
    return false;
  }

  // Check if React content is missing (indicating u5cms may have cleared it)
  const hasReactContent = rootElement.children.length > 0;

  return !isReactMounted || !hasReactContent;
}

/**
 * Render React app safely (internal function)
 */
function _renderReactAppInternal() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.warn('Cannot render React: root element not found');
    return;
  }

  if (canMountReact()) {
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
  }
}

/**
 * Debounced version of renderReactApp
 * @param {number | null} customDelay - Optional custom delay in milliseconds
 * @param {boolean} immediate - If true, render immediately without debounce
 */
function renderReactApp(customDelay = null, immediate = false) {
  // Clear existing timer
  if (renderDebounceTimer) {
    clearTimeout(renderDebounceTimer);
    renderDebounceTimer = null;
  }

  if (immediate) {
    console.log('Immediate React render requested');
    _renderReactAppInternal();
    return;
  }

  const delay =
    customDelay !== null ? customDelay : RENDER_CONFIG.DEBOUNCE_DELAY;

  console.log(`Scheduling React render...`);
  renderDebounceTimer = setTimeout(() => {
    renderDebounceTimer = null;
    _renderReactAppInternal();
  }, delay);
}

/**
 * Handle DOM mutations that might indicate u5cms interference
 */
function handleDOMChanges(mutations) {
  let shouldReRender = false;

  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Check if root element was affected
      const rootElement = document.getElementById('root');

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
          Array.from(mutation.addedNodes).some((node) => node.id === 'root')
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
    renderReactApp(RENDER_CONFIG.DOM_STABLE_DELAY);
  }
}

/**
 * Initialize DOM observer to watch for u5cms changes
 */
function initializeDOMObserver() {
  const observer = new MutationObserver(handleDOMChanges);

  // Observe changes to body and its subtree
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  console.log('DOM observer initialized to watch for u5cms changes');

  return observer;
}

/**
 * Handle page reload events (from u5cms autoequalsone function)
 */
function handlePageEvents() {
  // Listen for before page unload
  window.addEventListener('beforeunload', () => {
    console.log('Page is reloading, React will re-mount after reload');
    isReactMounted = false;
  });

  // Re-render after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      renderReactApp(null, true)
    );
  }
}

// Initialize everything
console.log('Initializing app app with u5cms compatibility...');

// Handle page events
handlePageEvents();

// Initial render (immediate, no debounce)
renderReactApp(null, true);

// Start observing DOM changes
initializeDOMObserver();
