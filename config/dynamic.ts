// Dynamic SDK Configuration
// Get your Environment ID from https://app.dynamic.xyz

// Environment ID - replace with your own from Dynamic Dashboard
// For development, you can use Vite's env variable: import.meta.env.VITE_DYNAMIC_ENV_ID
export const DYNAMIC_ENV_ID = import.meta.env.VITE_DYNAMIC_ENV_ID || '';

// Dynamic SDK settings
export const dynamicSettings = {
  environmentId: DYNAMIC_ENV_ID,
  // App display name
  appName: 'LocalLife',
  // Mobile experience mode
  mobileExperience: 'redirect' as const,
  // Initial authentication mode - show wallet options
  initialAuthenticationMode: 'connect-only' as const,
  // Enable embedded wallets for non-crypto users
  walletsConfig: {
    embeddedWallets: {
      createOnLogin: 'on' as const,
    },
  },
};
