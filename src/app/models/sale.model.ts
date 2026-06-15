export interface MedicineSale {
  id?: number;
  medicineId: number;
  medicineName: string;
  quantitySold: number;
  totalPrice: number;
  saleDate?: Date;
  customerName: string;
}