import React, { useContext , useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Table, Tag, Space, Pagination } from 'antd';
import { UsuarioContext } from '../context/UsuarioContext'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2';
import MainScreen from '../views/MainScreen';
import moment from 'moment';

const Rutas = () => {

    const {usuario,setUsuario} = useContext(UsuarioContext);
    const [rutasList, setRutasList] = useState();
    const history = useHistory()
    const columns = [
      
        {
          title: 'Conductor',
          dataIndex: 'conductor_id',
          key: 'conductor_id',
          render: (text, record) => (
            
            <label>{`${record?.conductor_id?.first_name} ${record?.conductor_id?.last_name}`}</label>
        
        ) ,
        },
        {
            title: 'Ruta de Inicio',
            dataIndex: 'inicio',
            key: 'inicio',
        },
        {
            title: 'Ruta de Fin',
            dataIndex: 'fin',
            key: 'fin',
        },
        {
          title: 'Fecha de Salida',
          dataIndex: 'fechaSalida',
          key: 'fechaSalida',
          render: (text, record) => (
            
               <label>{moment.utc(record.fechaSalida).format("DD/MM/YYYY")}</label>
            
           ),
        },
        {
          title: 'Hora de Salida',
          dataIndex: 'horaSalida',
          key: 'horaSalida',
        },
        {
          title: 'Fecha de Entrada',
          dataIndex: 'fechaEntrada',
          key: 'fechaEntrada',
          render: (text, record) => (
            
            <label>{moment.utc(record?.fechaEntrada).format("DD/MM/YYYY")}</label>
         
        ) ,
        },
        {
          title: 'Hora de Entrada',
          dataIndex: 'horaEntrada',
          key: 'horaEntrada',
        },
        {
          title: 'Carga',
          key: 'tipoCarga',
          dataIndex: 'tipoCarga',
          render: tipoCarga => (
            <>
              {tipoCarga.map((carga, id) => {
                
                return (
                  <Tag key={id}>
                    {carga}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Estado',
          dataIndex: 'estado',
          key: 'estado',
          render: (text, record) => (
           
              <label>{record.estado}</label>
          
          ),
        },
        {
          title: 'Acciones',
          key: 'acciones',
          render: (text, record) => (
            <Space size="middle">
                <Button variant="primary" onClick={()=> irDetalleRuta(record.key)} >Editar</Button>
                <Button variant="danger" onClick={()=> deleteRuta(record.key)}>Eliminar</Button>
            </Space>
          ),
        },
      ];

    const data = rutasList?.map((ruta)=> ({
      key:ruta._id,
      inicio: ruta.inicio,
      fin: ruta.fin,
      tipoCarga: ruta.tipoCarga,
      fechaSalida: ruta.fechaSalida,
      horaSalida: ruta.horaSalida,
      fechaEntrada: ruta.fechaEntrada,
      horaEntrada: ruta.horaEntrada,
      estado: ruta.estado,
      conductor_id: ruta.conductor_id
    }))

    const getRutasxUsuario = async () => {
      // console.log('token:',usuario.token)

        try{
            const Rutas = await axios.get(`http://localhost:8000/api/viajes/empresa/${usuario._id}`,
            {
              headers: {
                'token': usuario.token
              }
            });
            // console.log('Rutas', Rutas);
            
            setRutasList(Rutas.data.viajeList);

        }catch(err){
          //todo
            // console.log('err', err.response.status);
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

    const cerrarSesion = () => {
      setUsuario(null);
      localStorage.clear();
    }


    useEffect(() => {
        getRutasxUsuario();
    },[])

    const deleteRuta = async (id) => {
        try{
            await axios.delete(`http://localhost:8000/api/viajes/delete/${id}`,
            {
              headers: {
                'token': usuario.token
              }
            });
            // console.log("pirata", pirata);
            Swal.fire(
              'Good job!',
              'Se ha eliminado la ruta',
              'success'
            )
            getRutasxUsuario();
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
                text: 'al eliminar la ruta'
            })
          }
        }
    }

    const irDetalleRuta = (id) => {
        history.push(`/ingresar-ruta/${id}`);
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
            <Col xs={5} style={{textAlign: "center"}}><h1 className="titulo">Rutas</h1></Col>
            <Col style={{padding: "2%"}}><Link to='/ingresar-ruta'><i className="bi bi-plus-lg"></i> Agregar nuevo Ruta</Link></Col>
        </Row>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
        
        </Container>

        
    </>
    );
}

export default Rutas;