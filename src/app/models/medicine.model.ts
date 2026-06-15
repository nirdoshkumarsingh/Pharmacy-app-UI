export interface Medicine {
  id?: number;
  medicineName: string;
  notes: string;
  expiryDate: Date;
  quantity: number;
  price: number;
  brand: string;
}

export class MedicineUtil {
  static getColorCode(medicine: Medicine): string {
    const expiryDate = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    // Red: Expiry date less than 30 days
    if (daysUntilExpiry < 30) {
      return 'red';
    }
    // Yellow: Quantity less than 10
    if (medicine.quantity < 10) {
      return 'yellow';
    }
    return 'green';
  }
  // Check if medicine is expired
  static isExpired(medicine: Medicine): boolean {
    return new Date() > new Date(medicine.expiryDate);
  }
  // Get days until expiry
  static getDaysUntilExpiry(medicine: Medicine): number {
    const expiryDate = new Date(medicine.expiryDate);
    const today = new Date();
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}