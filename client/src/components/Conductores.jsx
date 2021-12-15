import React, { useContext , useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Table, Space,  Pagination } from 'antd';
import { UsuarioContext } from '../context/UsuarioContext'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2';
import MainScreen from '../views/MainScreen';
import moment from 'moment';

const Conductores = () => {


    const {usuario,setUsuario} = useContext(UsuarioContext);
    const [conductorList, setConductorList] = useState();
    const history = useHistory()

    const columns = [
        {
            title: 'Nombres',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Apellidos',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
          title: 'Fecha de Nacimiento',
          dataIndex: 'fechaNacimiento',
          key: 'fechaNacimiento',
          render: (text, record) => (
            
               <label key="3">{moment.utc(record.fechaNacimiento).format("DD/MM/YYYY")}</label>
            
           ),
        },
        {
          title: 'Estado',
          dataIndex: 'estado',
          key: 'estado',
          render: (text, record) => (
           
              <label key="1">{record.estado}</label>
          
          ),
        },
        {
          title: 'Acciones',
          key: 'acciones',
          render: (text, record) => (
            
            <Space size="middle">
                <Button variant="primary" key="1" onClick={()=> irDetalleConductor(record.key)} >Editar</Button>
                <Button variant="danger" key="2" onClick={()=> deleteConductor(record.key)}>Eliminar</Button>
            </Space>
            
          ),
        },
      ];

    const data = conductorList?.map((conductor)=> ({
        key:conductor._id,
        first_name: conductor.first_name,
        last_name: conductor.last_name,
        fechaNacimiento: conductor.fechaNacimiento,
        estado: conductor.estado
      }))

    const getConductoresxUsuario = async () => {
    //   console.log('token:',usuario.token)

        try{
            const conductores = await axios.get(`http://localhost:8000/api/conductores/${usuario._id}`,
            {
              headers: {
                'token': usuario.token
              }
            });
            // console.log('Rutas', Rutas);
            setConductorList(conductores.data.condutorList);

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
                    text: 'al traer los datos de conductores'
                })
            }
        }
    }

    useEffect(() => {
        getConductoresxUsuario();
    },[])

    const cerrarSesion = () => {
        setUsuario(null);
        localStorage.clear();
    }

    const deleteConductor = async (id) => {
        try{
            await axios.delete(`http://localhost:8000/api/conductores/delete/${id}`,
            {
              headers: {
                'token': usuario.token
              }
            });
            // console.log("pirata", pirata);
            Swal.fire(
                'Good job!',
                'Se ha eliminado el conductor',
                'success'
              )
            getConductoresxUsuario();
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
                    text: 'al eliminar conductor'
                })
            }
        }
    }

    const irDetalleConductor = (id) => {
        history.push(`/ingresar-conductor/${id}`);
    }

    return ( 
    <>
        <MainScreen />
        <Container>
        {/* <Row className="justify-content-md-center">
            <Col md="auto"><h1>Piratas</h1></Col>
        </Row> */}
        <Row>
            <Col></Col>
            <Col xs={5} style={{textAlign: "center"}}><h1 className="titulo">Conductores</h1></Col>
            <Col style={{padding: "2%"}}><Link to='/ingresar-conductor'><i className="bi bi-plus-lg"></i> Agregar nuevo Conductor</Link></Col>
        </Row>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }}/>
        
        </Container>

        
    </>
    );
}

export default Conductores;