import React, { useContext, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap'
import { Formik, Form as FormFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UsuarioContext } from '../context/UsuarioContext';
import Swal from 'sweetalert2';
import {
     useHistory,
     useParams,
     Link
  } from "react-router-dom";
import MainScreen from '../views/MainScreen';
import moment from 'moment';


const CrearEditarConductor = () => {

    const { id } = useParams();
    const {usuario,setUsuario} = useContext(UsuarioContext);
    const history = useHistory();

    const ConductorSchema = Yup.object().shape({
        rut: Yup.string()
        .test(
            'validarRut',
            'rut incorrecto',
            function(value) {
                let dv;
                if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( value ))
                    return false;
                var tmp 	= value.split('-');
                var digv	= tmp[1]; 
                var rut 	= tmp[0];

                var M=0,S=1;
                for(;rut;rut=Math.floor(rut/10))
                    S=(S+rut%10*(9-M++%6))%11;
                    dv=S?S-1:'k';
                if ( digv == 'K' ) digv = 'k' ;
                return (dv == digv );
            }
          ),
        first_name: Yup.string()
          .min(2, 'Debe tener minimo 2 caracteres')
          .required('Campo requerido'),
        last_name: Yup.string()
          .min(2, 'Debe tener minimo 2 caracteres')
          .required('Campo requerido'),
        fechaNacimiento: Yup.date()
          .required('Campo requerido'),
        estado: Yup.string()
        .required('Campo requerido'),
    });

    const [conductor, setConductor] = useState();

    const getConductor = async () => {
        try{
            if(id){
                const conductorRespuesta = await axios.get(`http://localhost:8000/api/conductores/conductor/${id}`,
                {
                headers: {
                    'token': usuario.token
                }
                });
                // console.log("conductor:", conductorRespuesta.data.conductor)

                const objetoInicial = conductorRespuesta.data.conductor;

                // console.log("objetoInicial:", objetoInicial)
                setConductor({...objetoInicial,fechaNacimiento:moment.utc(objetoInicial.fechaNacimiento).format("YYYY-MM-DD")});
                
            }
            else{
                
                setConductor({
                    first_name: '',
                    last_name: '',
                    fechaNacimiento: '',
                    estado: ''
                })

            }
            

        }catch(err){
            // console.log("error:", err)

            if(err.response.status === 401){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'el periodo del token a acabado'
                })
                cerrarSesion();
                
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'al traer los datos'
                })
            }
        }
    }

    useEffect(() => {
        // id && getConductor();
        getConductor();
    },[id]);

    const cerrarSesion = () => {
        setUsuario(null);
        localStorage.clear();
    }

    // useEffect(() => {
    //     console.log('conductorpost:',conductor)
    // },[conductor]);

    const creaConductor = async (values) => {
        try{
            const conductorValues = {...values, autor:usuario._id}
            await axios.post('http://localhost:8000/api/conductores/new',conductorValues,
            {
              headers: {
                'token': usuario.token
              }
            });

            // console.log("create:", create)

            Swal.fire(
                'Good job!',
                'Se ha creado el conductor',
                'success'
              )


              history.push("/conductores");
           

        }catch(err){
            
            // console.log("prueba:", err)
            if(err.response.status === 401){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'el periodo del token a acabado'
                })
                cerrarSesion();
                
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error.message
                })
            }
            
        }
    }

    const actualizarConductor = async (values) => {
        try{
            await axios.put(`http://localhost:8000/api/conductores/update/${id}`,values,
            {
              headers: {
                'token': usuario.token
              }
            });

            Swal.fire(
                'Good job!',
                'Se ha actualizado el conductor',
                'success'
              )
            
              history.push("/conductores");
              
            // console.log("create:", create)

        }catch(err){
            
            if(err.response.status === 401){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'el periodo del token a acabado'
                })
                cerrarSesion();
                
            }else{

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error.message
                })
            }
            // console.log("prueba:", err.response.data.error.message)
        }
    }

    return (
        <div>
            <MainScreen />
            <Container>
                <Row>
                    <Col style={{padding: "2%"}}><Link to='/conductores'> <i className="bi bi-chevron-left"></i>Ver Conductores</Link></Col>
                    <Col xs={5} style={{textAlign: "center"}}> <h1 className="titulo"> { id ? 'Actualice Conductor' : 'Crear Conductor' } </h1> </Col>
                    <Col></Col>
                </Row>
                {conductor && (
                <Formik
                    initialValues={conductor}
                    validationSchema={ConductorSchema}
                    onSubmit={values => {
                        // console.log(values);
                        id ? actualizarConductor(values) : creaConductor(values)
                    }}
                    >
                        {({ errors, touched, getFieldProps }) => (
                            
                                <FormFormik style={{padding:"2% 10%", width:"50%", marginLeft:"25%"}}>                                
                                    
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Rut:</Form.Label>
                                        <Form.Control type="text"  name="rut" placeholder="Ingresar rut" value={conductor?.rut} {...getFieldProps('rut')} />
                                        {errors.rut && touched.rut ? (
                                                <div className="error-formulario">{errors.rut}</div>
                                        ) : null}
                                    </Form.Group>  
                                    
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Nombres:</Form.Label>
                                        <Form.Control type="text"  name="first_name" placeholder="Ingresar Nombre" value={conductor?.first_name} {...getFieldProps('first_name')} />
                                        {errors.first_name && touched.first_name ? (
                                                <div className="error-formulario">{errors.first_name}</div>
                                        ) : null}
                                    </Form.Group>        
                                    

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Apellidos:</Form.Label>
                                        <Form.Control type="text" name="last_name" placeholder="Ingresar Apellidos" value={conductor?.last_name}   {...getFieldProps('last_name')}/>
                                        {errors.last_name && touched.last_name ? (
                                                <div className="error-formulario">{errors.last_name}</div>
                                            ) : null}
                                    </Form.Group>
                                
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Fecha de nacimiento:</Form.Label>
                                        <Form.Control type="date" name="fechaNacimiento" value={conductor?.fechaNacimiento} {...getFieldProps('fechaNacimiento')}/>
                                        {errors.fechaNacimiento && touched.fechaNacimiento ? (
                                                <div className="error-formulario">{errors.fechaNacimiento}</div>
                                            ) : null}
                                    </Form.Group>
                                
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Estado:</Form.Label>
                                        <Form.Select aria-label="Default select example" value={conductor?.estado} {...getFieldProps('estado')}>
                                            <option value=""> seleccione una opción</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </Form.Select>
                                        {errors.estado && touched.estado ? (
                                                <div className="error-formulario">{errors.estado}</div>
                                        ) : null}
                                    </Form.Group>
                                    
                                    <Row>
                                        <Col></Col>
                                        <Col xs={5} style={{textAlign: "center"}} >
                                        <Button variant="primary" type="submit" className="boton">
                                            { id ? 'Actualizar' : 'Crear' }
                                        </Button>
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                    
                                
                                </FormFormik>

                            
                        )}
                        
                </Formik>
                 )} 
            </Container>
        </div>
    );
}

export default CrearEditarConductor;
