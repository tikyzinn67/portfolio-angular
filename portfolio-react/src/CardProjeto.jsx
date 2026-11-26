import { useEffect, useState } from 'react';
import API from './api.js';

function Catalogo() {
  const [tecnologias, setTecnologias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function buscarTecnologias() {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch(API + '/api/tecnologias');
      if (!resposta.ok) {
        throw new Error('Não deu para carregar o catálogo de tecnologias.');
      }
      const dados = await resposta.json();
      setTecnologias(dados);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarTecnologias();
  }, []);

  if (carregando) {
    return (
      <section className="catalogo">
        <h2>Catálogo de tecnologias</h2>
        <p>Carregando catálogo de tecnologias...</p>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="catalogo">
        <h2>Catálogo de tecnologias</h2>
        <p className="erro">{erro}</p>
      </section>
    );
  }

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