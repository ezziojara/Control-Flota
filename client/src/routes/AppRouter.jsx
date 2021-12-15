import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom"
import Conductores from '../components/Conductores'
import CrearEditarConductor from '../components/CrearEditarConductor'
import CrearEditarRuta from '../components/CrearEditarRuta'
import Rutas from '../components/Rutas'
import LoginRegistarScreen from '../views/LoginRegistrarScreen'

const AppRouter = () => {
    return(
        <>
        <Router>
            <Switch>
                <Route exact path='/login'>
                    <LoginRegistarScreen />
                </Route>
                <Route exact path='/registrar'>
                    <LoginRegistarScreen />
                </Route>
                <Route exact path='/ingresar-conductor'>
                    <CrearEditarConductor/>
                </Route>
                <Route exact path='/ingresar-conductor/:id'>
                    <CrearEditarConductor/>
                </Route>
                <Route exact path='/ingresar-ruta'>
                    <CrearEditarRuta/>
                </Route>
                <Route exact path='/ingresar-ruta/:id'>
                    <CrearEditarRuta/>
                </Route>
                <Route exact path='/conductores'>
                    <Conductores/>
                </Route>
                
                <Route exact path='/'>
                    <Rutas/>
                </Route>

            </Switch>
        </Router>
        </>
    );
}
export default AppRouter;