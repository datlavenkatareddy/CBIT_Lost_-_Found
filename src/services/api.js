export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:5000/api'

export const BACKEND_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  'http://localhost:5000'

/**
 * Normalizes item image paths to support:
 * - Uploaded media served by backend: /uploads/...
 * - Static public campus assets: /images/...
 * - Base64 data URLs: data:image/...
 * - Remote HTTP/HTTPS URLs
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '/images/placeholder.svg'
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath
  }
  if (imagePath.startsWith('/uploads')) {
    return `${BACKEND_URL}${imagePath}`
  }
  return imagePath
}
