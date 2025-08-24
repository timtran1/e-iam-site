import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {ELEMENT_ID} from './common/constant/element-id.js';

// Global variables for managing render timing and observers
let renderTimeoutId = null;
let bodyObserver = null;
let targetObserver = null;

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
 */
const attachObserver = (node) => {
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
  targetObserver = observer;
};

/**
 * Checks if the target element exists and attaches observer if needed
 * Prevents multiple observers from being attached to the same element
 */
const checkAndAttachObserver = () => {
  const target = document.getElementById(ELEMENT_ID.__VARIABLES_REGION);

  // Only attach observer if element exists and hasn't been observed yet
  if (target && !target.__attachedObserver) {
    // Mark element as observed to prevent duplicate observers
    target.__attachedObserver = true;

    // Attach the mutation observer
    attachObserver(target);

    // Initial render when observer is first attached
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

  // Disconnect observers to prevent memory leaks
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }

  if (targetObserver) {
    targetObserver.disconnect();
    targetObserver = null;
  }

  // Clean up the marker from DOM elements
  const target = document.getElementById(ELEMENT_ID.__VARIABLES_REGION);
  if (target && target.__attachedObserver) {
    delete target.__attachedObserver;
  }
};

// Set up body observer to watch for the target element being added to DOM
bodyObserver = new MutationObserver(() => {
  checkAndAttachObserver();
});

// Start observing the body for changes (target element might be added dynamically)
bodyObserver.observe(document.body, {
  childList: true, // Watch for added/removed children
  subtree: true, // Watch changes in all descendants
});

// Add cleanup listener for page unload to prevent memory leaks
window.addEventListener('beforeunload', cleanup);

// Initial check in case the target element already exists
checkAndAttachObserver();
