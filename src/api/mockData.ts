import type { Service, Request, User } from '../types/models';

// Фиксированный пользователь
export const FIXED_USER: User = {
  id: 1,
  username: 'test_user',
  email: 'user@example.com',
  is_staff: false
};

// Mock услуги
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Разработка логотипа',
    category: 'design',
    price: 5000,
    description: 'Профессиональный дизайн логотипа для вашего бренда',
    tags: 'logo, branding, vector',
    complexity_level: 'medium',
    html_css_code: '',
    screenshot: '${import.meta.env.BASE_URL}mock-images/logo-design.jpg',
    status: 'active'
  },
  {
    id: 2,
    name: 'Создание сайта-визитки',
    category: 'web',
    price: 15000,
    description: 'Адаптивный сайт на 5 страниц с CMS',
    tags: 'website, landing, responsive',
    complexity_level: 'medium',
    html_css_code: '<div class="container">...</div>',
    screenshot: '${import.meta.env.BASE_URL}mock-images/website.jpg',
    status: 'active'
  },
  {
    id: 3,
    name: 'SEO-оптимизация',
    category: 'marketing',
    price: 8000,
    description: 'Продвижение в поисковых системах',
    tags: 'seo, promotion, traffic',
    complexity_level: 'easy',
    html_css_code: '',
    screenshot: '${import.meta.env.BASE_URL}mock-images/seo.jpg',
    status: 'active'
  },
  {
    id: 4,
    name: 'Мобильное приложение',
    category: 'development',
    price: 50000,
    description: 'Кроссплатформенное приложение на Flutter',
    tags: 'mobile, app, flutter',
    complexity_level: 'hard',
    html_css_code: '',
    screenshot: '${import.meta.env.BASE_URL}mock-images/mobile-app.jpg',
    status: 'active'
  },
  {
    id: 5,
    name: 'Копирайтинг',
    category: 'content',
    price: 3000,
    description: 'Написание продающих текстов',
    tags: 'text, copywriting, content',
    complexity_level: 'easy',
    html_css_code: '',
    screenshot: '${import.meta.env.BASE_URL}mock-images/copywriting.jpg',
    status: 'active'
  }
];

// Mock заявки
export const MOCK_REQUESTS: Request[] = [
  {
    id: 1,
    status: 'draft',
    created_at: '2024-05-20T10:00:00Z',
    total_price: 5000,
    creator: FIXED_USER.id,
    services: [
      {
        id: 1,
        request: 1,
        service: 1,
        quantity: 1
      }
    ]
  },
  {
    id: 2,
    status: 'formed',
    created_at: '2024-05-21T14:30:00Z',
    formed_at: '2024-05-21T15:00:00Z',
    total_price: 23000,
    creator: FIXED_USER.id,
    services: [
      {
        id: 2,
        request: 2,
        service: 2,
        quantity: 1
      },
      {
        id: 3,
        request: 2,
        service: 5,
        quantity: 1
      }
    ]
  }
];

interface GetMockServicesParams {
  category?: string;
  price_min?: number ;
  price_max?: number ;
  status?: string;
  search?: string;
}

export const getMockServices = async (params?: GetMockServicesParams): Promise<{ services: Service[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  

  let services = [...MOCK_SERVICES];


  if (!params) {
    return { services };
  }

  const {
    category,
    price_min = -Infinity, 
    price_max = Infinity,  
    status,
    search
  } = params;

  if (category) {
    services = services.filter(s => s.category === category);
  }

  services = services.filter(s => 
    s.price >= price_min && 
    s.price <= price_max
  );

  if (status) {
    services = services.filter(s => s.status === status);
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    services = services.filter(s => 
      s.name.toLowerCase().includes(searchTerm) ||
      (s.description?.toLowerCase().includes(searchTerm)) ||
      s.tags.toLowerCase().includes(searchTerm)
    );
  }

  return { services };
};

export const getMockServiceById = async (id: number): Promise<Service | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_SERVICES.find(service => service.id === id) || null;
};

interface GetMockRequestsParams {
  status?: string;
  date_from?: string;
  date_to?: string;
}

export const getMockRequests = async (params?: GetMockRequestsParams): Promise<Request[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let requests = [...MOCK_REQUESTS];

  if (params?.status) {
    requests = requests.filter(r => r.status === params.status);
  }

  if (params?.date_from) {
    const dateFrom = new Date(params.date_from);
    requests = requests.filter(r => new Date(r.created_at) >= dateFrom);
  }

  if (params?.date_to) {
    const dateTo = new Date(params.date_to);
    requests = requests.filter(r => new Date(r.created_at) <= dateTo);
  }

  return requests;
};

// Вспомогательные функции
export const getMockRequestById = async (id: number): Promise<Request | null> => {
  await new Promise(resolve => setTimeout(resolve, 250));
  return MOCK_REQUESTS.find(request => request.id === id) || null;
};

export const getMockUserRequests = async (userId: number): Promise<Request[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_REQUESTS.filter(request => request.creator === userId);
};