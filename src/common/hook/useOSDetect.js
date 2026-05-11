import {useMemo} from 'react';

/**
 * Detect the user's operating system once on mount.
 *
 * @returns {{os: 'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'unknown'}}
 */
export default function useOSDetect() {
  const os = useMemo(() => {
    if (typeof navigator === 'undefined') return 'unknown';

    const platform = navigator.userAgentData?.platform || '';
    const ua = navigator.userAgent || '';

    // iPadOS reports as Mac with touch points
    if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
    if (/Mac/.test(ua) && navigator.maxTouchPoints > 1) return 'iOS';

    if (/Android/.test(ua) || /android/i.test(platform)) return 'Android';
    if (/Mac|Macintosh/.test(ua) || /macOS/i.test(platform)) return 'macOS';
    if (/Win/.test(ua) || /windows/i.test(platform)) return 'Windows';
    if (/Linux|X11/.test(ua) || /linux/i.test(platform)) return 'Linux';

    return 'unknown';
  }, []);

  return {os};
}
