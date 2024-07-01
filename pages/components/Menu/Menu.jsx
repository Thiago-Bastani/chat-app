import Link from 'next/link';
import { Nav } from 'react-bootstrap';

const Menu = () => {
  return (
    <Nav className="flex-column bg-dark text-light p-3" style={{ height: '100vh' }}>
      <Nav.Item>
        <Nav.Link href="/" className="text-light">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/about" className="text-light">About</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/contact" className="text-light">Contact</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Menu;
