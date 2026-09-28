const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORTA = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('API do Portfolio em Node: no ar');
});

app.get('/api/projetos', async (req, res) => {
    try {
        const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id";

        const [projetos] = await pool.query(sql);

        res.json(projetos);
    } catch (erro) {
        res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

app.get('/api/projetos/:id', async (req, res) => {
    try {
        const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE id = ? AND status = 'publicado'";

        const [linhas] = await pool.execute(sql, [req.params.id]);

        if (linhas.length === 0) {
            return res.status(404).json({
                erro: 'Projeto nao encontrado'
            });
        }

        res.json(linhas[0]);
    } catch (erro) {
        res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

app.get('/api/tecnologias', async (req, res) => {
    try {
        const sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias WHERE status = 'ativo' ORDER BY categoria, nome";

        const [tecnologias] = await pool.query(sql);

        res.json(tecnologias);
    } catch (erro) {
        res.status(500).json({
            erro: 'Falha no servidor: ' + erro.message
        });
    }
});

app.listen(PORTA, () => {
    console.log('API no ar em http://localhost:' + PORTA);
});