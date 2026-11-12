import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.justtsaurav.eveemobile',
  appName: 'Eevee Mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#08090d',
  },
};

export default config;
