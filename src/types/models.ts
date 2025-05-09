export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string; 
  tags: string;
  complexity_level: 'easy' | 'medium' | 'hard';
  html_css_code: string;
  screenshot: string | null;
  status: 'active' | 'deleted';
}

export interface Request {
  id: number;
  status: 'draft' | 'formed' | 'completed' | 'rejected';
  created_at: string;
  formed_at?: string;
  completed_at?: string;
  total_price: number;
  creator?: number;
  moderator?: number;
  services?: RequestService[];
}

export interface RequestService {
  id: number;
  request: number;
  service: number;
  quantity: number;
}

export interface ServiceFilterParams {
  category?: string;
  price_min?: number;
  price_max?: number;
  status?: 'active' | 'inactive';
  search?: string;
  complexity_level?: 'easy' | 'medium' | 'hard';
}