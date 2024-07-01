import Menu from './components/Menu/Menu';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const About = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={3} style={{ padding: '0px' }}>
                    <Menu />
                </Col>
                <Col md={9}>
                    <h1>About Page</h1>
                    <p>This is the about page.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
