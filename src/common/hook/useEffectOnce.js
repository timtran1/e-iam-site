import React from 'react';

/**
 *
 * @param {React.EffectCallback} effect
 */
const useEffectOnce = (effect) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(effect, []);
};

export default useEffectOnce;
