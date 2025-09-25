import {baseConfig, getDefineConfig} from './vite.base.js';
import {universalConfig} from './vite.universal.js';
import {regularConfig} from './vite.regular.js';

/**
 * Merge configurations deeply
 * @param {Object} target - Target configuration
 * @param {Object} source - Source configuration to merge
 * @returns {Object} Merged configuration
 */
function mergeConfig(target, source) {
  const result = {...target};

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeConfig(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Get Vite configuration based on mode
 * @param {string} mode - Build mode ('universal', 'development', 'production')
 * @returns {Object} Vite configuration
 */
export function getViteConfig(mode) {
  const isUniversal = mode === 'universal';

  // Start with base configuration
  let config = {...baseConfig};

  // Add base define configuration
  config.define = {
    ...getDefineConfig(mode),
    ...(config.define || {}),
  };

  if (isUniversal) {
    // Merge universal configuration
    config = mergeConfig(config, universalConfig);

    // Merge universal defines
    config.define = {
      ...config.define,
      ...universalConfig.define,
    };
  } else {
    // Merge regular configuration
    config = mergeConfig(config, regularConfig);
  }

  return config;
}
