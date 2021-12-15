
import './App.css';
import AppRouter from './routes/AppRouter';
import { UsuarioProvider } from './context/UsuarioContext';

function App() {
  return (
    <>
      <UsuarioProvider>
        <AppRouter/>
      </UsuarioProvider>
    </>
  );
}

export default App;
