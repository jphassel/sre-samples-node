const express = require('express');
const { bulkhead } = require('cockatiel');
const axios = require('axios');
const app = express();
const port = 8080;

// Configurando bulkhead com cockatiel (Máximo de 2 requisições simultâneas)
const bulkheadPolicy = bulkhead(5);

// Função simulando chamada externa
async function externalService() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Resposta da chamada externa');
        }, 2000);  // Simula uma chamada que demora 2 segundos
    });
}

async function simulateRequests() {
    const url = 'http://localhost:8080/api/bulkhead';
    const totalRequests = 10; // Total de requisições

    const promises = Array.from({ length: totalRequests }, (_, i) =>
        axios.get(url)
            .then((res) => console.log(`Request ${i + 1}: ${res.data}`))
            .catch((err) => console.error(`Request ${i + 1}: ${err.response?.data || err.message}`))
    );
    await Promise.all(promises);
}

simulateRequests();

// Rota que faz a chamada simulada
app.get('/api/bulkhead', async (req, res) => {
    try {
        const result = await bulkheadPolicy.execute(() => externalService());
        res.send(result);
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});