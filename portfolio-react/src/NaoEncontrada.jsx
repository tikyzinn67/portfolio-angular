import { Link } from 'react-router-dom';

function NaoEncontrada() {
  return (
    <section className="nao-encontrada">
      <h2>Página não encontrada</h2>
      <p>Este endereço não existe no Portfólio.</p>
      <Link to="/">Voltar para o início</Link>
    </section>
  );
}

export default NaoEncontrada;