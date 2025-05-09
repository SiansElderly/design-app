import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      
      <Container className="text-center py-5">
        <h1 className="display-1">404</h1>
        <p className="lead">Страница не найдена</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
        >
          На главную
        </Button>
      </Container>
      
    </>
  );
}