import ReactDOM from 'react-dom/client';
import App from './App.jsx';

let reactRoot = null;
let isReactMounted = false;

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
 * Render React app safely
 */
function renderReactApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.warn('Cannot render React: root element not found');
    return;
  }

  if (canMountReact()) {
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
    // Small delay to ensure DOM is stable after u5cms changes
    setTimeout(() => {
      isReactMounted = false; // Reset flag to allow re-mounting
      renderReactApp();
    }, 100);
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
    document.addEventListener('DOMContentLoaded', renderReactApp);
  }
}

// Initialize everything
console.log('Initializing React app with u5cms compatibility...');

// Handle page events
handlePageEvents();

// Initial render
renderReactApp();

// Start observing DOM changes
initializeDOMObserver();

// Expose global functions for u5cms coordination (optional)
window.reactAppUtils = {
  reRender: () => {
    console.log('Manual React re-render requested');
    isReactMounted = false;
    renderReactApp();
  },
  isReactMounted: () => isReactMounted,
};
