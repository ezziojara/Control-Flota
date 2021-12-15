import React, { useContext, useState } from 'react'
import { Formik, Form as FormFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { UsuarioContext } from '../context/UsuarioContext'
import { useHistory } from 'react-router-dom'

    

const Formulario = ({ esLogin, setEsLogin }) => {

    const { setUsuario } = useContext(UsuarioContext);
    const history = useHistory();

    const [usuarioRegistro, setUsuarioRegistro] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
        .min(2, 'nombre debe tener más de 2 caracteres')
        .required('Campo requerido'),
        email: Yup.string().email('Email incorrecto')
        .required('Campo requerido'),
        password: Yup.string()
        .min(4, 'Debe tener minimo 4 caracteres')
        .required('Campo requerido'),
        confirmPassword: Yup.string()
        .min(4, 'Debe tener minimo 4 caracteres')
        .required('Campo requerido')
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
    });

    const LoginSchema = Yup.object().shape({
        
        email: Yup.string().email('Email incorrecto')
        .required('Campo requerido'),
        password: Yup.string()
        .min(4, 'Debe tener minimo 4 caracteres')
        .required('Campo requerido'),
    });




    const createUsuario = async (values) => {
        try{
            await axios.post('http://localhost:8000/api/aut/registrar',values);

            // setUsuarioRegistro ({
            //     name: '',
            //     email: '',
            //     password: '',
            //     confirmPassword: ''
            // })

            setEsLogin(true)

            history.push("/login");

            Swal.fire(
                'Good job!',
                'Se ha creado el usuario',
                'success'
            )
            
            

            
            // console.log("create:", create.statusText)

        }catch(err){
            //  console.log('waa',err.response.data.error.code)

            
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error.message
                })
            

            
            // console.log("prueba:", err.response.data.error.message)
        }
    }

    const autenticaUsuario = async (values) => {
        try{
            const usuario = await axios.post('http://localhost:8000/api/aut/login',values);

            // console.log("axios", usuario.data.usuario);
            setUsuario(usuario.data.usuario)
            localStorage.setItem('usuario', JSON.stringify(usuario.data.usuario));

            history.push("/");

        }catch(err){
            // console.log("Error", err.response);
            err.response.status === 401 ?
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error
                })
            :
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo problemas'
                })
        }
    }


    return (
        <div>
            
            <Formik
                initialValues={usuarioRegistro}
                validationSchema={esLogin ? LoginSchema : SignupSchema}
                onSubmit={values => {
                    // console.log(values);
                    esLogin ? autenticaUsuario(values) : createUsuario(values)
                }}
                >
                    {({ errors, touched, getFieldProps }) => (
                        
                            <FormFormik>
                                {
                                    !esLogin ? 
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text"  name="name" placeholder="Ingresar Nombre" value={usuarioRegistro?.name} {...getFieldProps('name')} />
                                        {errors.name && touched.name ? (
                                                <div className="error-formulario">{errors.name}</div>
                                            ) : null}
                                    </Form.Group>
                                    :''
                                }

                                <Form.Group className="mb-3" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Ingresar Email" value={usuarioRegistro?.email}   {...getFieldProps('email')}/>
                                {errors.email && touched.email ? (
                                        <div className="error-formulario">{errors.email}</div>
                                    ) : null}
                                </Form.Group>
                            
                                <Form.Group className="mb-3" >
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Ingresar Contraseña" value={usuarioRegistro?.password} {...getFieldProps('password')}/>
                                {errors.password && touched.password ? (
                                        <div className="error-formulario">{errors.password}</div>
                                    ) : null}
                                </Form.Group>
                                {
                                    !esLogin ? 
                                        <Form.Group className="mb-3" >
                                        <Form.Label>Confirmar Contraseña</Form.Label>
                                        <Form.Control type="password" name="confirmPassword" placeholder="Ingresar Confirmar Contraseña" value={usuarioRegistro?.confirmPassword}  {...getFieldProps('confirmPassword')}/>
                                        {errors.confirmPassword && touched.confirmPassword ? (
                                                <div className="error-formulario">{errors.confirmPassword}</div>
                                            ) : null}
                                        </Form.Group>
                                    :''
                                }
                                <Button variant="primary" type="submit" className="boton">
                                {esLogin ? 'iniciar sesion' : 'registrar'}
                                </Button>
                            
                            </FormFormik>

                        
                    )}
                    
            </Formik>
        </div>
    );
}

export default Formulario;