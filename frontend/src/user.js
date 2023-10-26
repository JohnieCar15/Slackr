import { apiCallGet, apiCallPost } from './helpers.js';
import { DEFAULT_PROFILE } from './config.js';
import { showPage, globalToken, globalUserId } from './main.js';

export const getUserName = (userId, creator) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        creator.textContent = body.name;
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const getUserImage = (userId, image) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        if (body.image === null) {
            image.src = DEFAULT_PROFILE;
        } else {
            image.src = body.image;
        }
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const getAllUsers = () => {
    apiCallGet('user', globalToken)
    .then((body) => {
        console.log(body)
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const createUserProfile = (userId) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        console.log(body)
        const userDiv = document.createElement('div');
        userDiv.classList.add('page-block');
        userDiv.classList.add('container');
        userDiv.id = `page-user-${userId}`

        const profilePhoto = document.createElement('img');
        if (body.image === null) {
            profilePhoto.src = DEFAULT_PROFILE;
        } else {
            profilePhoto.src = body.image;
        }

        userDiv.appendChild(profilePhoto);

        const name = document.createElement('h2');
        name.textContent = body.name;
        userDiv.appendChild(name);


        const bio = document.createElement('p');
        if (body.bio !== null) {
            bio.textContent = body.bio;
        }
        userDiv.appendChild(bio);

        const email = document.createElement('p');
        email.textContent = body.email;
        userDiv.appendChild(email);

        if (userId === globalUserId) {
            const editDetails = document.createElement('form');

            const editName = addFormComponent('name', '', userId)
            editDetails.appendChild(editName)

            const editBio = addFormComponent('bio', '', userId)
            editDetails.appendChild(editBio)

            const editEmail = addFormComponent('email', 'email', userId)

            editDetails.appendChild(editEmail)


            const editPassword = addFormComponent('password', 'password', userId)
            editDetails.appendChild(editPassword)

            const editPasswordConfirm = addFormComponent('confirmPassword', 'password', userId)
            editDetails.appendChild(editPasswordConfirm)

            userDiv.appendChild(editDetails);
        }

        const goBack = document.createElement('button');
        goBack.textContent = 'Go back to dashboard'
        goBack.addEventListener('click', () => {
            showPage('dashboard');
        })
        goBack.setAttribute('style', 'display: block');
        userDiv.appendChild(goBack);

        document.getElementById('main').appendChild(userDiv);

    })
    .catch((msg) => {
        alert(msg);
    })
}

const addFormComponent = (name, type, userId) => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('input-group')
    mainDiv.classList.add('mb-3')

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('aria-describedby', `${userId}-bruh`)
    input.setAttribute('type', type)
    mainDiv.appendChild(input);

    const toggleDiv = document.createElement('div');
    toggleDiv.classList.add('input-group-append')


    const toggle = document.createElement('span');
    toggle.id = `${userId}-bruh`
    // toggle.classList.add('bi')
    // toggle.classList.add('bi-eye-slash')
    toggle.textContent = 'WTF!!!'
    toggleDiv.appendChild(toggle);
    mainDiv.appendChild(toggleDiv)


    return mainDiv;
}