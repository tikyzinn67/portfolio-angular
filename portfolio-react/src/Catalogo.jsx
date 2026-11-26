import { useEffect, useState } from 'react';
import API from './api.js';

function Catalogo() {
  const [tecnologias, setTecnologias] = useState([]);

  async function buscarTecnologias() {
    const resposta = await fetch(API + '/api/tecnologias');
    const dados = await resposta.json();
    setTecnologias(dados);
  }

  useEffect(() => {
    buscarTecnologias();
  }, []);

  return (
    <section className="catalogo">
      <h2>Catálogo de tecnologias</h2>
      <ul>
        {tecnologias.map((t) => (
          <li key={t.id}>
            {t.nome} ({t.categoria})
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Catalogo;