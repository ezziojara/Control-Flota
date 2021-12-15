import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useLocation, useHistory } from "react-router-dom"
import Formulario from '../components/Formulario'
import { UsuarioContext } from '../context/UsuarioContext'

const LoginRegistarScreen = () =>{

    const [esLogin, setEsLogin] = useState(true);
    const location = useLocation();
    const history = useHistory();
    const { usuario } = useContext(UsuarioContext);

    useEffect(() => {

        // console.log('aca')

        if (usuario){
            history.push('/')
        }

        if (location.pathname === '/registrar') {
            setEsLogin(false);
        }     
    },[]);

    const cargaPantalla = () => {
        
        if (esLogin) {
            setEsLogin(false);
            history.push('/registrar')
            
        }else{
            setEsLogin(true);
            history.push('/login')
        }

        
    }

    return(
        <div className="card">
             <Container>
                <Row>
                    <Col></Col>
                    <Col xs={8} style={{textAlign: "center"}} >
                    {
                        esLogin ? <h1 className="titulo">Iniciar Sesión</h1> : <h1 className="titulo">Registrar Empresa</h1>
                    }
                    </Col>
                    <Col></Col>
                </Row>
                <Formulario esLogin={esLogin} setEsLogin={setEsLogin}/>
                <Row>
                    <Col></Col>
                    <Col xs={5} style={{textAlign: "center"}} >
                    <Button variant="link" onClick={cargaPantalla}>{esLogin ? 'ir a registrar' : 'ir a login' }</Button>
                    </Col>
                    <Col></Col>
                </Row>
                
            </Container>
        </div>
    );
}

export default LoginRegistarScreen;