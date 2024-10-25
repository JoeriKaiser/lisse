export type Scan = {
  userId: string;
  barcode: string;
  productName?: string;
  productCategory?: string;
  scannedAt?: string;
  notes?: string;
};

export type EndpointConfiguration = {
  id: number;
  name: string;
  url: string;
  authMethod: string;
  authValue: string;
  customHeaders: Record<string, string>;
  isActive: boolean;
};
