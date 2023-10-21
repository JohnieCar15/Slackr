import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { apiCallGet, apiCallPost } from './helpers.js';
import { createChannelPage, loadChannels } from './channel.js';

let globalToken = null;

const loadDashboard = () => {
    apiCallGet('channel', globalToken)
    .then((body) => {

        const publicChannels = document.getElementById('public-channels');
        publicChannels.textContent = '';

        const privateChannels = document.getElementById('private-channels');
        privateChannels.textContent = '';

        for (const channel of body.channels) {
            const channelDiv = document.createElement('a');
            channelDiv.textContent = `Channel: ${channel.name}`;
            channelDiv.setAttribute('style', 'display: block');
            channelDiv.setAttribute('href', '#');
            createChannelPage(channel, globalToken);
            channelDiv.addEventListener('click', () => {
                showPage(`channel-${channel.id}`)
            })
            // channelDetails(channel.id, globalToken);

            if (channel.private) {
                privateChannels.appendChild(channelDiv);
            } else {
                publicChannels.appendChild(channelDiv);
            }
        }
    })
    .catch((msg) => {
        alert(msg);
    })




};

export const showPage = (pageName) => {
    for (const page of document.querySelectorAll('.page-block')) {
        page.style.display = 'none';
    }
    document.getElementById(`page-${pageName}`).style.display = 'block';
    if (pageName === 'dashboard') {
        loadDashboard();
    }
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
        }, globalToken)
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
    }, globalToken)
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
    apiCallPost('auth/logout', {}, globalToken)
    .then(() => {
        localStorage.removeItem('token', null);
        showPage('register');
    });
});

document.getElementById('create-channel-submit').addEventListener('click', () => {
    const name = document.getElementById('create-channel-name').value;
    const description = document.getElementById('create-channel-description').value;
    const privateChannel = document.getElementById('create-channel-private').checked;

    const result = apiCallPost('channel', {
        name: name,
        description: description,
        private: privateChannel
    }, globalToken)
    .then(() => {
        showPage('dashboard');
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
