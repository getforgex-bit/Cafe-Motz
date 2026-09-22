export type ProductCategory = 'calientes' | 'frios' | 'comida' | 'postres' | 'especiales';

export interface MenuItem {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  tastingNotes?: string[];
  priceSmall: number;
  priceLarge?: number;
  sizeSmallLabel?: string;
  sizeLargeLabel?: string;
  badge?: string;
  image: string;
  isHouseSpecial?: boolean;
  preparationTime?: string;
}

export interface ComboItem {
  id: string;
  title: string;
  tag: string;
  savings: string;
  description: string;
  price: number;
  isPopular?: boolean;
}

export type MilkOption = 'entera' | 'deslactosada' | 'almendra' | 'avena' | 'ninguna';
export type TemperatureOption = 'caliente' | 'frio' | 'frappe';
export type OrderType = 'local' | 'pickup' | 'domicilio';

export interface OrderCustomization {
  item: MenuItem | ComboItem;
  size: 'small' | 'large';
  milk: MilkOption;
  takeaway: boolean;
  extraEspresso: boolean;
  sweetness: 'normal' | 'poco' | 'sin';
  notes: string;
  customerName: string;
  orderType: OrderType;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category?: ProductCategory;
  size?: 'small' | 'large';
  sizeLabel?: string;
  milk?: MilkOption;
  extraShot?: boolean;
  whippedCream?: boolean;
  unitPrice: number;
  quantity: number;
  image?: string;
  isCombo?: boolean;
}
