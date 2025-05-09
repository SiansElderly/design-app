import apiClient from './apiClient';
import { getMockServices, getMockServiceById, MOCK_SERVICES } from './mockData';
import type { Service, Request, ServiceFilterParams} from '../types/models';

// Проверка доступности бэкенда
const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health/', { timeout: 2000 });
    return true;
  } catch (error) {
    console.warn('Бэкенд недоступен, переключаемся на мок-данные');
    return false;
  }
};

const API_TIMEOUT = 3000;

export const ServiceAPI = {
  getById: async (id: number): Promise<Service> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      const service = await getMockServiceById(id);
      if (!service) throw new Error(`Услуга с ID ${id} не найдена в мок-данных`);
      return service;
    }

    try {
      const response = await apiClient.get(`/services/${id}/`, { timeout: API_TIMEOUT });
      return response.data;
    } catch (error) {
      console.warn('Используем мок-данные для getById');
      const service = MOCK_SERVICES.find(s => s.id === id);
      if (!service) throw new Error('Услуга не найдена');
      return service;
    }
  },

  getAll: async (params?: ServiceFilterParams): Promise<Service[]> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      const { services } = await getMockServices(params);
      return services;
    }

    try {
      const apiParams = params ? {
        category: params.category,
        price_min: params.price_min?.toString(),
        price_max: params.price_max?.toString(),
        status: params.status,
        search: params.search,
        complexity_level: params.complexity_level
      } : undefined;

      const response = await apiClient.get('/services/', { 
        params: apiParams,
        timeout: API_TIMEOUT
      });
      
      return response.data?.services || response.data || [];
    } catch (error) {
      console.warn('Используем мок-данные для getAll');
      const { services } = await getMockServices(params);
      return services;
    }
  },

  getActive: async (): Promise<Service[]> => {
    return ServiceAPI.getAll({ status: 'active' });
  },

  create: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      throw new Error('Создание услуг недоступно в оффлайн-режиме');
    }

    try {
      const response = await apiClient.post('/services/', serviceData, { timeout: API_TIMEOUT });
      return response.data;
    } catch (error) {
      throw new Error('Не удалось создать услугу');
    }
  },

  uploadImage: async (serviceId: number, imageFile: File): Promise<string> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      return '/default-service.jpg';
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await apiClient.post(
        `/services/${serviceId}/upload-image/`, 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: API_TIMEOUT
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      throw new Error('Не удалось загрузить изображение');
    }
  }
};

export const RequestAPI = {
  getAll: async (params?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Request[]> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      return [];
    }

    try {
      const response = await apiClient.get('/requests/', { 
        params,
        timeout: API_TIMEOUT
      });
      return response.data?.requests || response.data || [];
    } catch (error) {
      console.warn('Используем пустой список заявок');
      return [];
    }
  },

  getDraft: async (): Promise<Request | null> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      return null;
    }

    try {
      const response = await apiClient.get('/requests/draft/', { timeout: API_TIMEOUT });
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  submit: async (id: number): Promise<void> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      throw new Error('Подтверждение недоступно в оффлайн-режиме');
    }

    try {
      await apiClient.post(`/requests/${id}/submit/`, {}, { timeout: API_TIMEOUT });
    } catch (error) {
      throw new Error('Не удалось подтвердить заявку');
    }
  },

  complete: async (id: number): Promise<void> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      throw new Error('Завершение недоступно в оффлайн-режиме');
    }

    try {
      await apiClient.post(`/requests/${id}/complete/`, {}, { timeout: API_TIMEOUT });
    } catch (error) {
      throw new Error('Не удалось завершить заявку');
    }
  },

  addService: async (requestId: number, serviceId: number): Promise<void> => {
    const isBackendAlive = await checkBackendAvailability();
    
    if (!isBackendAlive) {
      throw new Error('Добавление услуг недоступно в оффлайн-режиме');
    }

    try {
      await apiClient.post(
        `/requests/${requestId}/services/`,
        { service_id: serviceId },
        { timeout: API_TIMEOUT }
      );
    } catch (error) {
      throw new Error('Не удалось добавить услугу в заявку');
    }
  }
};