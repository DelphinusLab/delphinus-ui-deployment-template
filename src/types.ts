export enum L1ClientRole {
  Monitor,
  Wallet,
}

export interface ChainConfig {
  chainName: string;
  mongodbUrl: string;
  syncEventsStep: number;
  gasWarningAmount?: string;
  blockExplorer?: string;
  bufferBlocks?: number;
  wsSource: string;
  rpcSource: string;
  privateKey: string;
  deviceId: string;
  monitorAccount: string;
  l2Account: string;
  enabled: boolean;
  isSnap: boolean;
}
