export type Scan = {
  userId: string;
  barcode: string;
  productName?: string;
  productCategory?: string;
  scannedAt?: string;
  notes?: string;
};
