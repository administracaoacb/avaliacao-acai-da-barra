// !! SUAS URLs CORRETAS !!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycjhAeNpduY78URKfoHwOWBdzqielipfte7QaSsgHdahz5wlbiIvi8YESpM2YdOfCJ/exec';

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

// NOVA FUNÇÃO PARA FORMATAR A DATA CORRETAMENTE
function formatarData(dataString) {
  try {
    // Tenta primeiro parsear como ISO (o novo formato)
    if (dataString.includes('T')) {
      const dataObj = new Date(dataString);
      return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    // Se não for ISO, é o formato antigo que já dava erro
    return 'Data Inválida'; 
  } catch (e) {
    return 'Data Inválida';
  }
}

function carregarAvaliacoes() {
    const secaoAvaliacoes = document.getElementById('secao-avaliacoes');

    // ** LINHA CORRIGIDA ABAIXO PARA EVITAR O CACHE **
    // Adicionamos um carimbo de data/hora para garantir que o navegador busque os dados mais recentes.
    const urlParaBuscar = URL_PLANILHA_CSV + '&timestamp=' + new Date().getTime();

    fetch(urlParaBuscar) // Usamos a nova URL anti-cache
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
                    
                    // LINHA ABAIXO FOI ATUALIZADA
                    divAvaliacao.innerHTML = `
                        <p><strong>${nome}</strong> - ${'⭐'.repeat(nota)}</p>
                        <p>"${comentario}"</p>
                        <small>${formatarData(data)}</small> 
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
