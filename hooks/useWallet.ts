import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useAccount, useBalance } from 'wagmi';

// Custom hook to access wallet state from Dynamic + Wagmi
export const useWallet = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const { address, isConnected, chain } = useAccount();
  
  // Get ETH balance on current chain
  const { data: balance } = useBalance({
    address: address,
  });

  // Format address for display (0x1234...5678)
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Open Dynamic's auth/connect modal
  const openConnectModal = () => {
    setShowAuthFlow(true);
  };

  return {
    // Connection state
    isConnected: isLoggedIn && isConnected,
    isLoggedIn,
    
    // Wallet info
    address,
    formattedAddress: formatAddress(address),
    chain,
    chainId: chain?.id,
    chainName: chain?.name,
    
    // Balance
    balance: balance?.formatted,
    balanceSymbol: balance?.symbol,
    
    // User info from Dynamic
    user,
    primaryWallet,
    
    // Actions
    openConnectModal,
  };
};

export default useWallet;
