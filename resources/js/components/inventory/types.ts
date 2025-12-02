export interface Color {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  product_type_id: number;
  colors: Color[];
  images: { url: string }[];
}

export interface Place {
  id: number;
  name: string;
}

export interface DeviceModel {
  storage: string;
}


export interface Stock {
  is_gift: boolean;
  color_id: number;
  color: Color;
  status_id: number;
  // device_id: number | null;
  // accessory_id: number | null;
}

export type StockData = Stock & Accessory & Device;

export interface TechAccessory {
  model_number: string;
  size: string;
  description: string;
}

export interface Accessory {
  serial_number: string;
  size: string;
  description?: string;
}

export interface Device{
  imei: string;
  imei2: string;
  serial_number: string;
  storage: string;
}

export interface AddInventoryFormData {
  product_id: string;
  entry_date: string;
  expiration_date: string;
  place_id: string;
  count: string;
  stocks: Partial<StockData>[];
}
