import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {ELEMENT_ID} from './common/constant/element-id.js';

// Global variables for managing render timing and observers
let renderTimeoutId = null;
const elementObservers = new Map(); // Store observers for each element

/**
 * Renders the React App with debouncing to prevent excessive re-renders
 * Uses a timeout to batch multiple rapid changes into a single render
 */
function renderApp() {
  // Clear any pending render to avoid multiple renders
  clearTimeout(renderTimeoutId);

  // Debounce render calls with a delay for better performance
  renderTimeoutId = setTimeout(() => {
    try {
      console.log('Rendering <App /> ...');

      // Ensure root element exists before attempting to render
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        console.error('Root element not found - cannot render React app');
        return;
      }

      // Create root and render the App component
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
    } catch (error) {
      console.error('Error rendering React app:', error);
    }
  }, 1000);
}

/**
 * Attaches a MutationObserver to monitor changes in the target node
 * Re-renders the app when relevant mutations are detected
 * @param {HTMLElement} node - The DOM element to observe
 * @param {string} elementId - The element ID for tracking
 */
const attachObserver = (node, elementId) => {
  const observer = new MutationObserver((mutationsList) => {
    // Filter only relevant mutations to avoid unnecessary re-renders
    const relevantMutations = mutationsList.filter(
      (mutation) =>
        mutation.type === 'childList' ||
        mutation.type === 'characterData' ||
        mutation.type === 'attributes'
    );

    if (relevantMutations.length > 0) {
      // Log for debugging
      console.log(`Relevant mutation detected in #${node.id}`);

      // Trigger app re-render
      renderApp();
    }
  });

  // Configure observer to watch for content changes
  observer.observe(node, {
    characterData: true, // Watch text content changes
    subtree: true, // Watch changes in child elements
  });

  // Store observer reference for cleanup
  elementObservers.set(elementId, observer);
};

/**
 * Checks if target elements exist and attaches observers if needed
 * Prevents multiple observers from being attached to the same element
 */
const checkAndAttachObservers = () => {
  let hasNewObserver = false;

  // Iterate through all element IDs and attach observers
  Object.values(ELEMENT_ID).forEach((elementId) => {
    const target = document.getElementById(elementId);

    // Only attach observer if element exists and hasn't been observed yet
    if (target && !target.__attachedObserver) {
      // Mark element as observed to prevent duplicate observers
      target.__attachedObserver = true;

      // Attach the mutation observer
      attachObserver(target, elementId);
      hasNewObserver = true;

      console.log(`Observer attached to element: #${elementId}`);
    }
  });

  // Initial render when any new observer is attached
  if (hasNewObserver) {
    renderApp();
  }
};

/**
 * Cleanup function to disconnect all observers and clear timeouts
 * Should be called when the page is unloading
 */
const cleanup = () => {
  console.log('Cleaning up observers and timeouts');

  // Clear any pending render timeout
  clearTimeout(renderTimeoutId);

  // Disconnect all element observers to prevent memory leaks
  elementObservers.forEach((observer, elementId) => {
    observer.disconnect();
    console.log(`Observer disconnected for element: #${elementId}`);
  });
  elementObservers.clear();

  // Clean up the marker from all DOM elements
  Object.values(ELEMENT_ID).forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element && element.__attachedObserver) {
      delete element.__attachedObserver;
    }
  });
};

/**
 * Set up observers for specific elements instead of observing the entire body
 * This approach is more efficient and targeted
 */
const initializeObservers = () => {
  // Check for elements periodically until they are found
  const checkInterval = setInterval(() => {
    checkAndAttachObservers();

    // Stop checking if all elements have been found and observed
    const allElementsObserved = Object.values(ELEMENT_ID).every((elementId) => {
      const element = document.getElementById(elementId);
      return element && element.__attachedObserver;
    });

    if (allElementsObserved) {
      clearInterval(checkInterval);
      console.log('All target elements found and observers attached');
    }
  }, 500); // Check every 500ms

  // Stop checking after 30 seconds to prevent infinite checking
  setTimeout(() => {
    clearInterval(checkInterval);
    console.log('Observer initialization timeout reached');
  }, 30000);
};

// Add cleanup listener for page unload to prevent memory leaks
window.addEventListener('beforeunload', cleanup);

// Initialize observers
initializeObservers();

// Initial check in case target elements already exist
checkAndAttachObservers();
