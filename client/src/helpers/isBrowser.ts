export const isBrowser = () => typeof window === 'object' && typeof document === 'object' && document.nodeType === 9;
export const isServer = () => typeof process === 'object' && !!process.versions && !!process.versions.node;
