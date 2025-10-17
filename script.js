// !! IMPORTANTE: SUBSTITUA AS DUAS URLs ABAIXO !!
// 1. A URL do seu App da Web do Google Sheets (para ENVIAR dados)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXd371n1TCvJac0QkVV3vJuO4IrmEawBywpoTbMY4/dev';

// 2. A URL da sua planilha publicada como CSV (para LER os dados)
const URL_PLANILHA_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVxhYr4ms2LGmiD1WNwSaHVuNUMHTisj3N4PB_osZuyH73XSZYst4kEynEh8JEMAWRH9nCHNNmnQQy/pub?output=csv';

const form = document.getElementById('form-avaliacao');
const submitButton = document.getElementById('submit-button');
const sendingMessage = document.getElementById('sending-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitButton.style.display = 'none';
    sendingMessage.style.display = 'block';

    fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            alert('Obrigado! Sua avaliação foi enviada com sucesso.');
            form.reset();
            carregarAvaliacoes(); // Recarrega as avaliações para mostrar a nova
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente.');
        })
        .finally(() => {
            submitButton.style.display = 'block';
            sendingMessage.style.display = 'none';
        });
});

function carregarAvaliacoes() {
    const secaoAvaliacoes = document.getElementById('secao-avaliacoes');

    fetch(URL_PLANILHA_CSV)
        .then(response => response.text())
        .then(data => {
            secaoAvaliacoes.innerHTML = ''; 
            const linhas = data.split('\n').slice(1);

            if (linhas.length === 0 || (linhas.length === 1 && linhas[0].trim() === '')) {
                 secaoAvaliacoes.innerHTML = '<p>Ainda não há avaliações. Seja o primeiro!</p>';
                 return;
            }

            linhas.reverse().forEach(linha => {
                if (linha.trim() === '') return;

                const colunas = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(field => field.replace(/"/g, ''));
                const data = colunas[0];
                const nome = colunas[1];
                const nota = parseInt(colunas[2]);
                const comentario = colunas[3];

                if(nome) {
                    const divAvaliacao = document.createElement('div');
                    divAvaliacao.className = 'avaliacao';
                    divAvaliacao.innerHTML = `
                        <p><strong>${nome}</strong> - ${'⭐'.repeat(nota)}</p>
                        <p>"${comentario}"</p>
                        <small>${new Date(data).toLocaleDateString('pt-BR')}</small>
                    `;
                    secaoAvaliacoes.appendChild(divAvaliacao);
                }
            });
        })
        .catch(error => {
            console.error("Erro ao carregar avaliações:", error);
            secaoAvaliacoes.innerHTML = '<p>Não foi possível carregar as avaliações.</p>';
        });
}

document.addEventListener('DOMContentLoaded', carregarAvaliacoes);
