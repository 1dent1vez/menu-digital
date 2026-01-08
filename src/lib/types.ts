export type MenuVariantOption = {
  id: string;
  name: string;
  price: number;
};

export type MenuVariantGroup = {
  id: string;
  name: string;
  required?: boolean;
  options: MenuVariantOption[];
};

export type MenuExtraOption = {
  id: string;
  name: string;
  price: number;
};

export type MenuExtraGroup = {
  id: string;
  name: string;
  maxSelect?: number;
  options: MenuExtraOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  image: string;
  variants?: MenuVariantGroup[];
  extras?: MenuExtraGroup[];
};

export type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string;
  name: string;
  price: number;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  notes?: string;
  variantSelections: SelectedOption[];
  extraSelections: SelectedOption[];
};

export type OrderType = "mesa" | "pickup" | "delivery";

export type OrderTypesEnabled = {
  mesa: boolean;
  pickup: boolean;
  delivery: boolean;
};

export type OrderDetails = {
  type: OrderType;
  tableNumber?: string;
  pickupName?: string;
  pickupTime?: string;
  deliveryName?: string;
  deliveryAddress?: string;
  deliveryReferences?: string;
  deliveryPhone?: string;
  deliveryNotes?: string;
};

export type Config = {
  businessName: string;
  whatsappNumber: string;
  currency: string;
  deliveryFee?: number;
  minOrder?: number;
  hoursText: string;
  addressText?: string;
  lockTableFromUrl?: boolean;
  orderTypesEnabled: OrderTypesEnabled;
};
