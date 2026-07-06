import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alpha Store',
    short_name: 'Alpha',
    description: 'Scalable commerce storefront',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#06b6d4',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
