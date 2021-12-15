import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { UsuarioContext } from '../context/UsuarioContext'
import Button from 'react-bootstrap/Button'
import {Container} from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

const MainScreen = () => {

    const {usuario, setUsuario} = useContext(UsuarioContext);
    const history = useHistory();

    useEffect(() => {
        // console.log('usuario',usuario);
        if (!usuario) {
            history.push('/login')
        }
    },[usuario])

    const cerrarSesion = () => {
        setUsuario(null);
        localStorage.clear();
    }

    return(
        <>
        {/* <Container>
            <Row>
                <Col></Col>
                <Col xs={5} ></Col>
                <Col style={{textAlign: "right"}}>
                    <h5>Usuario: {`${usuario?.name}`}</h5> 
                    <Button variant="primary" onClick={cerrarSesion}>Cerrar sesion</Button>
                </Col>
            </Row>
        </Container> */}

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
            <Navbar.Brand>Control Flota</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <NavDropdown title="Conductores" id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={() => history.push('/conductores')}>Ver Conductores</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => history.push('/ingresar-conductor')}>Crear Conductor</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Rutas" id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={() => history.push('/')}>Ver Rutas</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => history.push('/ingresar-ruta')}>Crear Ruta</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link>Usuario: {`${usuario?.name}`}</Nav.Link>
                    <Button variant="danger" onClick={cerrarSesion}>Cerrar sesion</Button>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        </>

        
    );

}

export default MainScreen;