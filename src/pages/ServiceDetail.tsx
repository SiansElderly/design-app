import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge,Row,Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ServiceAPI } from '../api/services';
import type { Service } from '../types/models';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!id) throw new Error('ID услуги не указан');
        
        const numericId = parseInt(id);
        if (isNaN(numericId)) throw new Error('Неверный ID услуги');

        const data = await ServiceAPI.getById(numericId);
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-3">
        <Alert variant="warning">Услуга не найдена</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        ← Назад к списку
      </Button>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-4">
              <Card.Img
                variant="top"
                src={service.screenshot || '/default-service.jpg'}
                alt={service.name}
                className="img-fluid rounded"
                onError={(e) => (e.currentTarget.src = '/default-service.jpg')}
              />
            </Col>
            
            <Col md={6}>
              <Card.Title as="h2">{service.name}</Card.Title>
              
              <div className="d-flex gap-2 mb-3">
                <Badge bg="primary">{service.category}</Badge>
                <Badge bg={
                  service.complexity_level === 'easy' ? 'success' :
                  service.complexity_level === 'medium' ? 'warning' : 'danger'
                }>
                  {service.complexity_level}
                </Badge>
              </div>
              
              <Card.Text className="fs-5 fw-bold mb-3">
                {service.price ? `${service.price} ₽` : 'Цена не указана'}
              </Card.Text>
              
              {service.tags && (
                <div className="mb-3">
                  <h5>Теги:</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {service.tags.split(',').map(tag => (
                      <Badge key={tag} bg="secondary">{tag.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {service.html_css_code && (
                <div className="mb-4">
                  <h5>Пример кода:</h5>
                  <pre className="bg-light p-3 rounded">
                    <code>{service.html_css_code}</code>
                  </pre>
                </div>
              )}
              
              <div className="d-flex gap-3">
                <Button variant="primary">Добавить в заявку</Button>
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                  Назад
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}