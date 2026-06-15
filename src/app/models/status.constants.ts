export const STATUS_COLORS = {
  inStock: {
    backgroundColor: '#4caf50',
    color: 'white'
  },
  lowStock: {
    backgroundColor: '#ffc107',
    color: '#333'
  },
  expiring: {
    backgroundColor: '#f44336',
    color: 'white'
  }
};

export enum StatusType {
  IN_STOCK = 'inStock',
  LOW_STOCK = 'lowStock',
  EXPIRING = 'expiring'
}
