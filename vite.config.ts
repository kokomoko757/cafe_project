import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aboutus: resolve(__dirname, 'aboutus.html'),
        booking: resolve(__dirname, 'booking.html'),
        colophon: resolve(__dirname, 'colophon.html'),
        details: resolve(__dirname, 'details.html'),
        location: resolve(__dirname, 'location.html'),
        menu: resolve(__dirname, 'menu.html'),
        order: resolve(__dirname, 'order.html'),
        partner: resolve(__dirname, 'partner.html'),
        reviews: resolve(__dirname, 'reviews.html'),
      },
    },
  },
});
