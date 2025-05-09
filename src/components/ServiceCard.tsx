import { Card, Button } from 'react-bootstrap';
import { Service } from '../types/models';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Фикс пути для mock-режима
  const imageUrl = service.screenshot 
    ? service.screenshot.startsWith('/') 
      ? `${import.meta.env.BASE_URL}${service.screenshot}` 
      : service.screenshot
    : '/default-service.jpg';

  return (
    <Card className="mb-4 shadow-sm h-100">
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={service.name}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-service.jpg';
        }}
      />
      <Card.Body className="d-flex flex-column bg-primary-light">
        <Card.Title>{service.name}</Card.Title>
        <Card.Text className="text-muted">
          Категория: {service.category}
          <br />
          Цена: {service.price} ₽
          <br />
          Сложность: {service.complexity_level === 'easy' ? '★☆☆' : 
                    service.complexity_level === 'medium' ? '★★☆' : '★★★'}
        </Card.Text>
        <Button 
          style={{ backgroundColor: '#5A8F9C', color: 'white' }}
          href={`/services/${service.id}`}
          className="mt-auto"
        >
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
}