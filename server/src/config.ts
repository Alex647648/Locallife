export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  graphApiKey: process.env.GRAPH_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || 'https://11155111.rpc.thirdweb.com/',
  identityRegistryAddress: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  reputationRegistryAddress: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator',
  baseSepoliaUsdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  defaultPayTo: process.env.DEFAULT_PAY_TO || '0x0000000000000000000000000000000000000000',
} as const;
