function CardProjeto({ projeto }) {
  return (
    <article className="card">
      <h3>{projeto.nome}</h3>
      <p className="meta">{projeto.tecnologias} · {projeto.ano}</p>
      <p>{projeto.descricao}</p>
      {projeto.link_github && <a href={projeto.link_github}>Ver no GitHub</a>}
    </article>
  );
}

export default CardProjeto;