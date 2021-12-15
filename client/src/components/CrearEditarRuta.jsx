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

const CrearEditarRuta = () => {
    const { id } = useParams();
    const {usuario,setUsuario} = useContext(UsuarioContext);
    const history = useHistory();

    const RutaSchema = Yup.object().shape({
        inicio: Yup.string()
          .min(2, 'Debe tener minimo 2 caracteres')
          .required('Campo requerido'),
        fin: Yup.string()
          .min(2, 'Debe tener minimo 2 caracteres')
          .required('Campo requerido'),
        tipoCarga: Yup.string()
          .required('Campo requerido'),
        fechaSalida: Yup.date()
          .required('Campo requerido'),
        horaSalida: Yup.string()
          .required('Campo requerido'),
        fechaEntrada: Yup.date(),
        horaEntrada: Yup.string(),
        estado: Yup.string()
          .required('Campo requerido'),
        conductor_id: Yup.string()
          .required('Campo requerido'),
        
    });

    const [ruta, setRuta] = useState();
    const [conductores, setConductores] = useState([]);

    const getConductores = async () => {
        try{
            
            const conductoresRespuesta = await axios.get(`http://localhost:8000/api/conductores/empresa/${usuario._id}`,
            {
                headers: {
                    'token': usuario.token
            }
            });
 
            // console.log("conductor:", conductoresRespuesta.data.conductorList)
            setConductores(conductoresRespuesta.data.conductorList);
        }catch(err){
            // console.log("error:", err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'al traer los datos de conductores'
            })
        }
    }

    const getRuta = async () => {
        try{
            if(id){
                const rutaRespuesta = await axios.get(`http://localhost:8000/api/viajes/viaje/${id}`,
                {
                headers: {
                    'token': usuario.token
                }
                });

                
                // console.log("conductor:", rutaRespuesta.data.viaje)
                const objetoInicial = rutaRespuesta.data.viaje;
                if(objetoInicial.fechaEntrada === null){
                    objetoInicial.fechaEntrada = ''; 
                }

                objetoInicial.tipoCarga = objetoInicial.tipoCarga.toString();

                // console.log("objetoInicial:", objetoInicial)
                setRuta({...objetoInicial,fechaSalida:moment.utc(objetoInicial.fechaSalida).format("YYYY-MM-DD")
                        ,fechaEntrada:moment.utc(objetoInicial.fechaEntrada).format("YYYY-MM-DD")});
                
            }
            else{

                setRuta({
                    inicio: '',
                    fin: '',
                    tipoCarga: '',
                    fechaSalida: '',
                    horaSalida: '',
                    fechaEntrada: '',
                    horaEntrada: '',
                    estado: '',
                    conductor_id: ''
                })

            }

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
                    text: 'al traer los datos'
                })
            }
        }
    }

    useEffect(() => {
        getConductores();
        getRuta();
    },[id]);

    const cerrarSesion = () => {
        setUsuario(null);
        localStorage.clear();
    }


    const creaRuta = async (values) => {
        try{
            const rutaValues = {...values, empresa_id:usuario._id}
            await axios.post('http://localhost:8000/api/viajes/new',rutaValues,
            {
              headers: {
                'token': usuario.token
              }
            });

            // console.log("create:", create)

            Swal.fire(
                'Good job!',
                'Se ha creado la ruta',
                'success'
              )
              history.push("/");

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

    const actualizarRuta = async (values) => {
        try{
            
            await axios.put(`http://localhost:8000/api/viajes/update/${id}`,values,
            {
              headers: {
                'token': usuario.token
              }
            });

            Swal.fire(
                'Good job!',
                'Se ha actualizado la ruta',
                'success'
              )

              history.push("/");
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


    return(
        <div>
            <MainScreen />
            <Container>
                <Row>
                    <Col style={{padding: "2%"}}><Link to='/'> <i className="bi bi-chevron-left"></i>Ver Rutas</Link></Col>
                    <Col xs={5} style={{textAlign: "center"}}> <h1 className="titulo"> { id ? 'Actualizar Ruta' : 'Crear Ruta' } </h1> </Col>
                    <Col></Col>
                </Row>
                {ruta && (
                <Formik
                    initialValues={ruta}
                    validationSchema={RutaSchema}
                    onSubmit={values => {
                        // console.log(values);
                        id ? actualizarRuta(values) : creaRuta(values)
                    }}
                    >
                        {({ errors, touched, getFieldProps }) => (
                            
                                <FormFormik style={{padding:"2% 10%", width:"50%", marginLeft:"25%"}}> 
                                    
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Conductor:</Form.Label>
                                        <Form.Select aria-label="Default select example" value={ruta?.conductor_id} {...getFieldProps('conductor_id')}>
                                            <option value=""> seleccione un Conductor</option>
                                            {conductores?.map((conductor)=>{
                                                return <option key={conductor._id} value={conductor._id} >{`${conductor.first_name} ${conductor.last_name}`}</option>
                                            })}
                                        </Form.Select>
                                        {errors.conductor_id && touched.conductor_id ? (
                                                <div className="error-formulario">{errors.conductor_id}</div>
                                        ) : null}
                                    </Form.Group>



                                    <Form.Group className="mb-3" >
                                        <Form.Label>Lugar de Inicio:</Form.Label>
                                        <Form.Control type="text"  name="inicio" placeholder="Ingresar Lugar de Inicio" value={ruta?.inicio} {...getFieldProps('inicio')} />
                                        {errors.inicio && touched.inicio ? (
                                                <div className="error-formulario">{errors.inicio}</div>
                                        ) : null}
                                    </Form.Group>        
                                    

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Lugar de Fin:</Form.Label>
                                        <Form.Control type="text" name="last_name" placeholder="Ingresar Lugar de Llegada" value={ruta?.fin}   {...getFieldProps('fin')}/>
                                        {errors.fin && touched.fin ? (
                                                <div className="error-formulario">{errors.fin}</div>
                                            ) : null}
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tipo de Carga:</Form.Label>
                                        <Form.Control type="text" name="tipoCarga" placeholder="Ingresar Tipo de Carga" value={ruta?.tipoCarga}   {...getFieldProps('tipoCarga')}/>
                                        <p>Debe ir separado por coma</p>
                                        {errors.tipoCarga && touched.tipoCarga ? (
                                                <div className="error-formulario">{errors.tipoCarga}</div>
                                            ) : null}
                                    </Form.Group>
                                
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Fecha de Salida:</Form.Label>
                                        <Form.Control type="date" name="fechaSalida" value={ruta?.fechaSalida} {...getFieldProps('fechaSalida')}/>
                                        {errors.fechaSalida && touched.fechaSalida ? (
                                                <div className="error-formulario">{errors.fechaSalida}</div>
                                            ) : null}
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Hora de Salida:</Form.Label>
                                        <Form.Control type="time" name="horaSalida" value={ruta?.horaSalida} {...getFieldProps('horaSalida')}/>
                                        {errors.horaSalida && touched.horaSalida ? (
                                                <div className="error-formulario">{errors.horaSalida}</div>
                                            ) : null}
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Fecha de Entrada:</Form.Label>
                                        <Form.Control type="date" name="fechaEntrada" value={ruta?.fechaEntrada} {...getFieldProps('fechaEntrada')}/>
                                        {/* {errors.fechaEntrada && touched.fechaEntrada ? (
                                                <div>{errors.fechaEntrada}</div>
                                            ) : null} */}
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Hora de Entrada:</Form.Label>
                                        <Form.Control type="time" name="horaEntrada" value={ruta?.horaEntrada} {...getFieldProps('horaEntrada')}/>
                                        {/* {errors.horaEntrada && touched.horaEntrada ? (
                                                <div>{errors.horaEntrada}</div>
                                            ) : null} */}
                                    </Form.Group>
                                
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Estado:</Form.Label>
                                        <Form.Select aria-label="Default select example" value={ruta?.estado} {...getFieldProps('estado')}>
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

export default CrearEditarRuta;