export function isMimeTypeSupported(mimetype: string) {
   const supportedMimeTypes = ['image/png', 'image/jpeg'] as string[];
   return supportedMimeTypes.includes(mimetype);
}
