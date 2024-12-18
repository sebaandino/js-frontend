const formLogin = document.querySelector('.profile-form');
const emailInput = document.querySelector('.profile-email-input');
const passwordInput = document.querySelector('.profile-password-input');
const profileContainer = document.querySelector('.profile-container');
const profileContainerContent = document.querySelector('.profile-container-content');

// LOGOUT

// async function logout() {
//     try {
//         const response = await fetch('http://localhost:8080/api/auth/logout', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const data = await response.text();

//         if (response.status === 200) {
//             console.log(data);
//             window.location.reload();
//         } else {
//             console.log('Logout Failed');
//             console.log(data);
//         }
//     }catch (error) {
//         console.log(error);
//     }
// }

// formLogin.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     logout();
// });

//LOGIN

async function login() {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(`http://localhost:8080/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        let result = await response.json();
        let role = result.role;

        if (role === "ROLE_USER") {
            alert("role user")
        } else if (role === "ROLE_ADMIN") {
            alert("role admin")
        } else {
            alert("Inicio de sesión fallido");
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Ocurrió un error durante el inicio de sesión");
    }
}

async function checkCookies() {
    try {
        let response = await fetch('http://localhost:8080/api/auth/check-cookies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        let data = await response.text();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    await login();
    await checkCookies();
});
