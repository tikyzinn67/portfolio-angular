import { useState, useEffect } from 'react';
import API from './api.js';
import NovoProjeto from './NovoProjeto.jsx';

function Gestao() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') ?? '');
  const [erro, setErro] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [erroLista, setErroLista] = useState('');

  async function carregarProjetos() {
    setErroLista('');
    try {
      const resposta = await fetch(API + '/api/projetos');
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao carregar projetos');
      }
      setProjetos(dados);
    } catch (falha) {
      setErroLista('Não deu para listar: ' + falha.message);
    }
  }

  useEffect(() => {
    if (token) {
      carregarProjetos();
    }
  }, [token]);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    try {
      const resposta = await fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro);
      }
      localStorage.setItem('token', dados.token);
      setToken(dados.token);
    } catch (falha) {
      setErro('Não deu para entrar: ' + falha.message);
    }
  }

  function sair() {
    localStorage.removeItem('token');
    setToken('');
    setProjetos([]);
  }

  async function excluir(id) {
    setErroLista('');
    try {
      const resposta = await fetch(API + '/api/projetos/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      if (!resposta.ok) {
        const dados = await resposta.json();
        throw new Error(dados.erro || 'A API recusou a exclusão');
      }
      setProjetos(projetos.filter((p) => p.id !== id));
    } catch (falha) {
      setErroLista('Não deu para excluir: ' + falha.message);
    }
  }

  if (!token) {
    return (
      <section className="gestao">
        <h2>Gestão</h2>
        <form onSubmit={entrar}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              name="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
        {erro && <p className="erro">{erro}</p>}
      </section>
    );
  }

  return (
    <section className="gestao">
      <h2>Gestão</h2>
      <p>Você entrou. O token está guardado.</p>
      <NovoProjeto token={token} aoCadastrar={carregarProjetos} />

      <h3>Projetos cadastrados</h3>
      {erroLista && <p className="erro">{erroLista}</p>}
      <ul>
        {projetos.map((projeto) => (
          <li key={projeto.id}>
            <strong>{projeto.nome}</strong> ({projeto.ano}) —{' '}
            <button type="button" onClick={() => excluir(projeto.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <button onClick={sair}>Sair</button>
    </section>
  );
}

export default Gestao;