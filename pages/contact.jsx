import Menu from './components/Menu/Menu';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Contact = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} style={{ padding: '0px' }}>
          <Menu />
        </Col>
        <Col md={9}>
          <h1>Contact Page</h1>
          <p>This is the contact page.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
