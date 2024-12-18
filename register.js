const registerForm = document.querySelector('.register-form');
const registerEmailInput = document.querySelector('.register-email-input');
const registerUsernameInput = document.querySelector('.register-username-input');
const registerPasswordInput = document.querySelector('.register-password-input');
const registerErrorMessage = document.querySelector('.register-error-message');
const registerSubmitButton = document.querySelector('.register-submit-button');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (registerEmailInput.value === '' || registerUsernameInput.value === '' || registerPasswordInput.value === '') {
        alert('Por favor, rellena todos los campos');
        return;
    }

    try{
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: registerEmailInput.value, userName: registerUsernameInput.value, password: registerPasswordInput.value }),
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            alert('Registro exitoso');
            window.location.replace('index.html');
        }   else {
            console.log(data);
            registerErrorMessage.textContent = data.message;
            registerErrorMessage.classList.remove('hidden');
        }
    }catch (error) {
        console.log(error);
    }

});