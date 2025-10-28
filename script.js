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
        .then(response => {
            alert('Obrigado! Sua avaliação foi enviada com sucesso.');
            form.reset();
            // AQUI NÃO TERÁ MAIS A CHAMADA para carregarAvaliacoes()
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
