import { Route, Routes } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import Gestao from './Gestao.jsx';
import Inicio from './Inicio.jsx';
import NaoEncontrada from './NaoEncontrada.jsx';
import Rodape from './Rodape.jsx';

// App: o componente raiz. O cabecalho e o rodape ficam; o miolo depende do endereco.
function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <Rodape />
    </>
  );
}

export default App;