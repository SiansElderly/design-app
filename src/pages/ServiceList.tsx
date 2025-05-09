import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form,Button } from 'react-bootstrap';
import { ServiceAPI } from '../api/services';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../types/models';
import { getMockServices } from '../api/mockData';

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }>({});

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const servicesData = await ServiceAPI.getAll({
          category: filters.category,
          price_min: filters.minPrice,
          price_max: filters.maxPrice
        });
        setServices(servicesData);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить услуги. Показаны mock-данные');
        const mockResponse = await getMockServices({
          category: filters.category,
          price_min: filters.minPrice,
          price_max: filters.maxPrice
        });
        setServices(mockResponse.services);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [filters]);

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <Container className="py-4">
      <h1 className="mb-4">Каталог услуг</h1>
      
      <Form className="mb-4 p-3 bg-light rounded">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Категория</Form.Label>
              <Form.Select
                value={filters.category || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  category: e.target.value || undefined
                })}
              >
                <option value="">Все категории</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>Цена от</Form.Label>
              <Form.Control
                type="number"
                value={filters.minPrice ?? ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                placeholder="Минимальная цена"
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>Цена до</Form.Label>
              <Form.Control
                type="number"
                value={filters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                placeholder="Максимальная цена"
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button 
              variant="outline-secondary"
              onClick={handleResetFilters}
              className="w-100"
            >
              Сбросить
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p>Загрузка услуг...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="mb-4">
          {error}
          <div className="mt-2">
            <Button 
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </Button>
          </div>
        </Alert>
      ) : services.length === 0 ? (
        <Alert variant="info">
          Услуги не найдены. Попробуйте изменить параметры фильтрации.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {services.map(service => (
            <Col key={service.id}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}