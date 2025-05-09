import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { BsBoxArrowInRight } from 'react-icons/bs';

export default function Header() {
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          HackDesign
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/services" 
              className="nav-link-custom"
            >
              Услуги
            </Nav.Link>
          </Nav>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-light"
              onClick={() => navigate('/login')}
              className="d-flex align-items-center gap-1"
            >
              <BsBoxArrowInRight /> Войти
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}