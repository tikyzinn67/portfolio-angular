import { useState } from 'react';
import API from './api.js';

function NovoProjeto({ token }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');

  async function salvar(e) {
    e.preventDefault();
    setAviso('');
    setErro('');
    try {
      const resposta = await fetch(API + '/api/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ nome: nome, descricao: descricao, tecnologias: tecnologias }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro);
      }
      setAviso('Projeto ' + dados.id + ' cadastrado.');
      setNome('');
      setDescricao('');
      setTecnologias('');
    } catch (falha) {
      setErro('Não deu para salvar: ' + falha.message);
    }
  }

  return (
    <form onSubmit={salvar}>
      <h3>Novo projeto</h3>
      <label>
        Nome
        <input
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </label>
      <label>
        Descrição
        <textarea
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </label>
      <label>
        Tecnologias
        <input
          name="tecnologias"
          value={tecnologias}
          onChange={(e) => setTecnologias(e.target.value)}
        />
      </label>
      <button type="submit">Salvar</button>
      {aviso && <p className="aviso">{aviso}</p>}
      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}

export default NovoProjeto;