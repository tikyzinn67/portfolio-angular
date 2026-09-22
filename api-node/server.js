const express = require('express');
const cors = require('cors');

const app = express();
const PORTA = 3000;

app.use(cors());

const projetos = [
    {
        id: 1,
        nome: 'Meu Portfolio',
        descricao: 'Portfolio desenvolvido nas aulas de Desenvolvimento Web II.',
        tecnologias: 'Angular, TypeScript, PHP, MariaDB',
        link_github: 'https://github.com/tikyzinn67/portfolio-angular',
        ano: 2026
    },
    {
        id: 2,
        nome: '2026-DWII',
        descricao: 'Projetos e atividades desenvolvidos na disciplina de Desenvolvimento Web II.',
        tecnologias: 'PHP, MariaDB, Angular, TypeScript',
        link_github: 'https://github.com/tikyzinn67/2026-DWII',
        ano: 2026
    },
    {
        id: 3,
        nome: 'Area de Gestao do Portfolio',
        descricao: 'Area para cadastrar, editar e excluir projetos do portfolio.',
        tecnologias: 'Angular, TypeScript, PHP, MariaDB',
        link_github: 'https://github.com/tikyzinn67/portfolio-angular',
        ano: 2026
    }
];

const tecnologias = [
    {
        nome: 'HTML',
        categoria: 'Front-end',
        descricao: 'Estrutura das paginas web.',
        ano_criacao: 1993
    },
    {
        nome: 'CSS',
        categoria: 'Front-end',
        descricao: 'Estilizacao das paginas web.',
        ano_criacao: 1996
    },
    {
        nome: 'PHP',
        categoria: 'Back-end',
        descricao: 'Linguagem utilizada para desenvolvimento da API.',
        ano_criacao: 1995
    },
    {
        nome: 'MariaDB',
        categoria: 'Banco de dados',
        descricao: 'Banco de dados utilizado pelo portfolio.',
        ano_criacao: 2009
    },
    {
        nome: 'Angular',
        categoria: 'Front-end',
        descricao: 'Framework utilizado para desenvolver o portfolio.',
        ano_criacao: 2016
    },
    {
        nome: 'TypeScript',
        categoria: 'Linguagem',
        descricao: 'Linguagem utilizada no desenvolvimento Angular.',
        ano_criacao: 2012
    }
];

app.get('/', (req, res) => {
    res.send('API do Portfolio em Node: no ar');
});

app.get('/api/projetos', (req, res) => {
    res.json(projetos);
});

app.get('/api/tecnologias', (req, res) => {
    res.json(tecnologias);
});

app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});