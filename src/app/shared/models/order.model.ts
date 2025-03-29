import { User } from './user.model';
import { Product } from './product.model';

export interface Order {
  id: number;
  tableNumber: number;
  status: 'pending' | 'in-progress' | 'completed' | 'paid';
  total: number;
  waiterId: number;
  waiter?: User;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  notes?: string;
} 