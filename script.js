// !! SUA URL CORRETA !!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycjhAeNpduY78URKfoHwOWBdzqielipfte7QaSsgHdahz5wlbiIvi8YESpM2YdOfCJ/exec';

const form = document.getElementById('form-avaliacao');
const submitButton = document.getElementById('submit-button');
const sendingMessage = document.getElementById('sending-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitButton.style.display = 'none';
    sendingMessage.style.display = 'block';

    fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form)})
        // PASSO 1: LÊ A RESPOSTA como JSON (CORREÇÃO APLICADA AQUI)
        .then(response => response.json())
        // PASSO 2: VERIFICA SE O SCRIPT DEU SUCESSO
        .then(data => {
            if (data.result === 'success') {
                alert('Obrigado! Sua avaliação foi enviada com sucesso.');
                form.reset();
            } else {
                // Se o script retornou JSON, mas com erro
                throw new Error(data.error || 'Erro desconhecido no Google Script.');
            }
        })
        // PASSO 3: TRATA QUALQUER ERRO DE REDE OU DO SCRIPT
        .catch(error => {
            console.error('Erro:', error.message);
            // Este é o único alerta de erro que deve aparecer
            alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente.');
        })
        .finally(() => {
            submitButton.style.display = 'block';
            sendingMessage.style.display = 'none';
        });
});
