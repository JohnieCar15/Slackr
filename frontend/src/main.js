import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { apiCallGet, apiCallPost, removeAllChildNodes } from './helpers.js';
import { createChannelJoinPage, createChannelPage, inviteToChannel } from './channel.js';
import { getUserName, getAllUsers, createUserProfile } from './user.js';

export let globalToken = null;
export let globalUserId = null;


export const loadDashboard = () => {
    const inviteModal = document.getElementById('inviteModal');
    inviteModal.textContent = '';


    apiCallGet('user', globalToken)
    .then((body) => {
        const usersHeader = document.createElement('h1');
        usersHeader.classList.add('fs-6')
        usersHeader.textContent = 'Available users:';
        inviteModal.appendChild(usersHeader);

        const users = body.users;

        for (let i = 0; i < users.length; i++) {
            createUserProfile(users[i].id);

            if (users[i].id !== globalUserId) {
                const userDiv = document.createElement('div');
                userDiv.classList.add('form-check');

                const userCheckbox = document.createElement('input');
                userCheckbox.classList.add('form-check-input');
                userCheckbox.classList.add('user-checkbox');
                userCheckbox.setAttribute('user-id', users[i].id)
                userCheckbox.type = 'checkbox';
                userCheckbox.id = `modal-checkbox-${users[i].id}`

                userDiv.appendChild(userCheckbox);

                const userLabel = document.createElement('label');
                userLabel.classList.add('form-check-label');
                userLabel.setAttribute('for', `modal-checkbox-${users[i].id}`);
                getUserName(users[i].id, userLabel);
                userDiv.appendChild(userLabel);

                inviteModal.appendChild(userDiv);
            }
        }

        apiCallGet('channel', globalToken)
        .then((body) => {
            const publicChannels = document.getElementById('public-channels');
            removeAllChildNodes(publicChannels);

            const privateChannels = document.getElementById('private-channels');
            removeAllChildNodes(privateChannels);

            const channelsHeader = document.createElement('h1');
            channelsHeader.classList.add('fs-6')
            channelsHeader.textContent = 'Available channels:';
            inviteModal.appendChild(channelsHeader);

            for (const channel of body.channels) {
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

                    const channeModalDiv = document.createElement('div');
                    channeModalDiv.classList.add('form-check');

                    const channelModalInput = document.createElement('input');
                    channelModalInput.classList.add('form-check-input');
                    channelModalInput.classList.add('channel-radio');
                    channelModalInput.setAttribute('channel-id', channel.id);
                    channelModalInput.type = 'radio';
                    channelModalInput.name = 'modal-radio';
                    channelModalInput.id = `modal-radio-${channel.id}`;

                    channeModalDiv.appendChild(channelModalInput);

                    const channelModalLabel = document.createElement('label');
                    channelModalLabel.classList.add('form-check-label');
                    channelModalLabel.setAttribute('for', `modal-radio-${channel.id}`);
                    channelModalLabel.textContent = channel.name;

                    channeModalDiv.appendChild(channelModalLabel);

                    inviteModal.appendChild(channeModalDiv);

                }


                if (!channel.private) {
                    if (channel.members.includes(globalUserId)) {
                        createChannelPage(channel, false);
                    } else {
                        createChannelJoinPage(channel);
                    }
                } else {
                    if (channel.members.includes(globalUserId)) {
                        createChannelPage(channel, false);
                    }
                }

            }

            const inviteModalSubmit = document.createElement('button');
            inviteModalSubmit.classList.add('btn');
            inviteModalSubmit.classList.add('btn-primary');
            inviteModalSubmit.textContent = 'Submit'
            inviteModalSubmit.addEventListener('click', () => {
                inviteToChannel();
                inviteModalSubmit.classList.remove('btn-primary');
                inviteModalSubmit.classList.add('btn-success');
            })

            inviteModal.appendChild(inviteModalSubmit);


        })
        .catch((msg) => {
            alert(msg);
        })
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

document.getElementById('show-profile').addEventListener('click', () => {
    showPage(`user-${globalUserId}`)
})

document.getElementById('show-dashboard').addEventListener('click', () => {
    showPage('dashboard')
})

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