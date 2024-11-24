const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 8080;

// Middleware de rate limiting (Limite de 5 requisições por minuto)
const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minuto
    max: 100,  // Limite de 5 requisições
    message: 'Você excedeu o limite de requisições, tente novamente mais tarde.',
});

// Aplica o rate limiter para todas as rotas
app.use(limiter);

// Função simulando chamada externa
async function externalService() {
    return 'Resposta da chamada externa';
}

// Rota que faz a chamada simulada
app.get('/api/ratelimit', async (req, res) => {
    try {
        const result = await externalService();
        res.send(result);
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

//Função para exceder o limite de requisições
async function simulateRateLimit() {
    const axios = require('axios'); // Biblioteca para realizar requisições HTTP
    const url = `http://localhost:${port}/api/ratelimit`;

    for (let i = 1; i <= 101; i++) { //Laço de 1 a 101 (excedente a 100)
        try {
            const response = await axios.get(url);
            console.log(`Requisição ${i}: ${response.data}`);
        } catch (error) {
            console.error(`Requisição ${i}: ${error.response?.data || error.message}`);
        }
    }
}


// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});