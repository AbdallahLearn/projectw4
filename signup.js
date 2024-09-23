const url = 'https://66e7e6bbb17821a9d9da7058.mockapi.io/signup';
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnSignup = document.getElementById('btn-signup');

btnSignup.addEventListener('click', function() {
    const errorUsername = document.getElementById('error-username');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');

    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const uppercasePattern = /[A-Z]/;


    
    if (!uppercasePattern.test(username.value)) {
        errorUsername.style.display = 'block';
        return;
    } else {
        errorUsername.style.display = 'none';
    }

  
    if (!email.value.match(emailReg)) {
        errorEmail.style.display = 'block';
        return;
    } else {
        errorEmail.style.display = 'none';
    }

    if (password.value.length <= 4) {
        errorPassword.style.display = 'block';
        return;
    } else {
        errorPassword.style.display = 'none';
    }

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        alert('Sign up successful! Now go to login.');
        window.location.href = 'login.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function login() {
    window.location.href = 'login.html';
}

function signup() {
    window.location.href = 'index.html';
}
