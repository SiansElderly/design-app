import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white py-4 border-top">
      <Container>
        <Row className="g-3">
          <Col md={4}>
            <h5 className="text-primary mb-3">HackDesign</h5>
            <p className="text-muted mb-0">
              Профессиональные дизайн-услуги для вашего бизнеса
            </p>
          </Col>
          
          <Col md={2}>
            <h5 className="text-primary mb-3">Навигация</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-dark hover-primary">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-decoration-none text-dark hover-primary">
                  Услуги
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-primary mb-3">Контакты</h5>
            <ul className="list-unstyled text-dark">
              <li className="mb-2">Email: design@hack.ru</li>
              <li>Телефон: +7 (495) 123-4567</li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-primary mb-3">© 2024</h5>
            <p className="text-muted small mb-0">
              Все права защищены
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}