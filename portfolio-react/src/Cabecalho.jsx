import { Link } from 'react-router-dom';


function Cabecalho() {
  return (
    <header>
      <h1>Portfólio de Murilo Moura</h1>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/gestao">Gestão</Link>
      </nav>
    </header>
  );
}

export default Cabecalho;