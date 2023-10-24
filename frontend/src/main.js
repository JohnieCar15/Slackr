import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { apiCallGet, apiCallPost } from './helpers.js';
import { createChannelJoinPage, createChannelPage } from './channel.js';
import { getUserName } from './user.js';

export let globalToken = null;
export let globalUserId = null;

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const loadDashboard = () => {
    apiCallGet('channel', globalToken)
    .then((body) => {
        const publicChannels = document.getElementById('public-channels');
        removeAllChildNodes(publicChannels);

        const privateChannels = document.getElementById('private-channels');
        removeAllChildNodes(privateChannels);

        for (const channel of body.channels) {
            // console.log(channel);
            if (channel.members.includes(globalUserId) || !channel.private) {
                const channelDiv = document.createElement('a');
                channelDiv.textContent = `${channel.name}`;
                channelDiv.setAttribute('style', 'display: block');
                channelDiv.setAttribute('href', '#');
                channelDiv.addEventListener('click', () => {
                    showPage(`channel-${channel.id}`)
                })

                if (channel.private) {
                    privateChannels.appendChild(channelDiv);
                } else {
                    publicChannels.appendChild(channelDiv);
                }
            }


            if (!channel.private) {
                if (channel.members.includes(globalUserId)) {
                    createChannelPage(channel, false, globalUserId, globalToken);
                } else {
                    createChannelJoinPage(channel, globalUserId, globalToken);
                }
            } else {
                if (channel.members.includes(globalUserId)) {
                    createChannelPage(channel, false, globalUserId, globalToken);
                }
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
            globalUserId = parseInt(userId);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            showPage('dashboard');
        })
        .catch((msg) => {
            alert(msg);
        })
    }
});

document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    apiCallPost('auth/login', {
        email: email,
        password: password
    }, globalToken)
    .then((body) => {
        const {token, userId} = body;
        globalToken = token;
        globalUserId = parseInt(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
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
        localStorage.removeItem('userId', null);
        showPage('register');
    });
});

document.getElementById('create-channel-submit').addEventListener('click', () => {
    const name = document.getElementById('create-channel-name')
    const description = document.getElementById('create-channel-description');
    const privateChannel = document.getElementById('create-channel-private');

    apiCallPost('channel', {
        name: name.value,
        description: description.value,
        private: privateChannel.checked
    }, globalToken)
    .then(() => {
        name.value = '';
        description.value = '';
        privateChannel.checked = true;
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

const localUserId = localStorage.getItem('userId');
if (localUserId !== null) {
    globalUserId = parseInt(localUserId);
}

if (globalToken === null) {
    showPage('register');
} else {
    showPage('dashboard');
}
