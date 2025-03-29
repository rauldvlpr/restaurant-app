export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'waiter' | 'chef';
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
} 