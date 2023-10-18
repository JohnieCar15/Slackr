import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl} from './helpers.js';

let globalToken = null;

const loadDashboard = () => {
    apiCallGet('channel', {}, true);
};

const showPage = (pageName) => {
    for (const page of document.querySelectorAll('.page-block')) {
        page.style.display = 'none';
    }
    document.getElementById(`page-${pageName}`).style.display = 'block';
    if (pageName === 'dashboard') {
        loadDashboard();
    }
}

const apiCallPost = (path, body, authed=false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'Authorization': authed ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject('Error!');
            } else {
                resolve(body);
            }
        });
    }
    );
}

const apiCallGet = (path, body, authed=false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authed ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject('Error!');
            } else {
                resolve(body);
            }
        });
    }
    );
}


document.getElementById('register-submit').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    if (password !== passwordConfirm) {
        alert('Passwords need to match');
    } else {
        apiCallPost('auth/register', {
            email: email,
            name: name,
            password: password
        })
        .then((body) => {
            const {token, userId} = body;
            globalToken = token;
            localStorage.setItem('token', token);
            showPage('dashboard');
        })
        .catch((msg) => {
            alert(msg);
        })
    }
});

document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    apiCallPost('auth/login', {
        email: email,
        password: password
    })
    .then((body) => {
        const {token, userId} = body;
        globalToken = token;
        localStorage.setItem('token', token);
        showPage('dashboard');
    })
    .catch((msg) => {
        alert(msg);
    })

});

document.getElementById('logout').addEventListener('click', () => {
    apiCallPost('auth/logout', {}, true)
    .then(() => {
        localStorage.removeItem('token', null);
        showPage('register');
    });
});

for (const redirect of document.querySelectorAll('.redirect')) {
    const newPage = redirect.getAttribute('redirect');
    redirect.addEventListener('click', () => {
        showPage(newPage);
    })
}

const localStorageToken = localStorage.getItem('token');
if (localStorageToken !== null) {
    globalToken = localStorageToken;
}

if (globalToken === null) {
    showPage('register');
} else {
    showPage('dashboard');
}
