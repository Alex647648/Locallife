/**
 * Minimal ABI fragments for ERC-8004 on-chain registries.
 * Only includes functions we actually call — keeps the bundle small.
 *
 * Contracts deployed on Sepolia:
 *   IdentityRegistry: 0x8004A818BFB912233c491871b3d84c89A494BD9e
 *   ReputationRegistry: 0x8004B663056A597Dffe9eCcC1965A193B7388713
 */

export const IDENTITY_REGISTRY_ABI = [
  'function register(string agentURI) returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

export const REPUTATION_REGISTRY_ABI = [
  'function giveFeedback(uint256 agentId, int128 value, uint8 valueDecimals, string tag1, string tag2, string endpoint, string feedbackURI, bytes32 feedbackHash)',
  'function getSummary(uint256 agentId, address[] clientAddresses, string tag1, string tag2) view returns (uint256 count, int128 summaryValue, uint8 summaryValueDecimals)',
  'function readAllFeedback(uint256 agentId, address[] clientAddresses, string tag1, string tag2, bool includeRevoked) view returns (tuple(address clientAddress, uint256 feedbackIndex, int128 value, uint8 valueDecimals, string tag1, string tag2, string endpoint, string feedbackURI, bytes32 feedbackHash, bool isRevoked)[])',
];
