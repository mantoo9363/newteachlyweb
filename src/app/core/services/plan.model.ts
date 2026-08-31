export interface Plan {
  id: number;
  productName: string;
  pid: string;
  requirements: string;
  mrp: number | null;
  discountPercent: number | null;
  finalPrice: number | null;
  imgUrl: string;
  demoRoute: string;
  backendPlanKey?: string;
  iframeUrl?: string;
  isPurchased?: boolean;
  isDemoActive?: boolean;
}
