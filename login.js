const url = 'https://66e7e6bbb17821a9d9da7058.mockapi.io/signup';
const btnLogin = document.getElementById('btn-login');
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorMessage = document.getElementById('error-password');


console.log('11')

btnLogin.addEventListener('click', function() {
    let usernameValue = username.value;
    let passwordValue = password.value;
    
    errorMessage.style.display = 'none';

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
           
            console.log(data)
            const user = data.find(item => item.username === usernameValue && item.password === passwordValue);

            if (user) {
                localStorage.setItem('Username', usernameValue);
                window.location.href = 'index.html'
            } else {
                errorMessage.textContent = 'Invalid username or password.';
                errorMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block'; 
        });
});


