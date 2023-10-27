import { apiCallGet, apiCallPost, apiCallPut, fileToDataUrl } from './helpers.js';
import { DEFAULT_PROFILE } from './config.js';
import { showPage, loadDashboard, globalToken, globalUserId } from './main.js';

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
        // console.log(body)
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const createUserProfile = (userId) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        // console.log(body)
        const prevUserPage = document.getElementById(`page-user-${userId}`)
        if (prevUserPage !== null) {
            prevUserPage.remove();
        }

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

        profilePhoto.setAttribute('object-fit', 'contain')
        profilePhoto.style.width = '100px'
        profilePhoto.style.height = '100px'

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
            console.log(`Making ${userId}'s profile`)
            const editDetails = document.createElement('form');

            const editName = addFormComponent('name', 'Name', 'text', userId)
            editDetails.appendChild(editName)

            const editBio = addFormComponent('bio', 'Bio', 'text', userId)
            editDetails.appendChild(editBio)

            const editEmail = addFormComponent('email', 'Email', 'email', userId)

            editDetails.appendChild(editEmail)


            const editPassword = addFormComponent('password', 'Password', 'password', userId)
            editDetails.appendChild(editPassword)

            const editPasswordConfirm = addFormComponent('confirm-password', 'Confirm Password', 'password', userId)
            editDetails.appendChild(editPasswordConfirm)

            const file = addFormComponent('profile', 'Profile Picture', 'file', userId)
            editDetails.appendChild(file)

            userDiv.appendChild(editDetails);

            const submit = document.createElement('button');
            submit.textContent = 'Submit';
            submit.addEventListener('click', () => {
                const file = document.getElementById(`profile-${userId}`).files[0]
                const email = document.getElementById(`email-${userId}`).value
                const password = document.getElementById(`password-${userId}`).value
                const confirmPassword = document.getElementById(`confirm-password-${userId}`).value
                const name = document.getElementById(`name-${userId}`).value
                const bio = document.getElementById(`bio-${userId}`).value

                if (password !== confirmPassword) {
                    alert('Passwords do not match!')
                } else {
                    try {
                        fileToDataUrl(file).then((image) => {
                            updateUserDetails(email, password, name, bio, image)
                        })
                        .catch((msg) => {
                            alert(msg);
                        })
                    } catch {
                        updateUserDetails(email, password, name, bio, '')
                    }
                }
            })


            userDiv.appendChild(submit);
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

const updateUserDetails = (email, password, name, bio, image) => {
    apiCallPut('user', {
        email: email === '' ? undefined : email,
        password: password === '' ? undefined : password,
        name: name === '' ? undefined : name,
        bio: bio === '' ? undefined : bio,
        image: image === '' ? undefined : image
    }, globalToken)
    .then((body) => {
        showPage('dashboard')
    }).catch((msg) => {
        alert(msg);
    })
}

const addFormComponent = (name, displayName, type, userId) => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('mb-3')

    const label = document.createElement('label');
    label.classList.add('form-label')
    label.textContent = displayName;

    mainDiv.appendChild(label);

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input-group')

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', type)
    input.id = `${name}-${userId}`

    inputDiv.appendChild(input);

    if (type == 'password') {
        const toggle = document.createElement('i');
        toggle.classList.add('bi');
        toggle.classList.add('bi-eye-slash')
        toggle.classList.add('input-group-text')
        toggle.style.cursor = 'pointer'

        toggle.addEventListener('click', () => {
            const visibility = input.getAttribute('type');
            if (visibility === 'password') {
                input.setAttribute('type', 'text')
                toggle.classList.remove('bi-eye-slash')
                toggle.classList.add('bi-eye')
            } else {
                input.setAttribute('type', 'password')
                toggle.classList.remove('bi-eye')
                toggle.classList.add('bi-eye-slash')
            }
        })


        inputDiv.appendChild(toggle)
    }

    mainDiv.appendChild(inputDiv)


    return mainDiv;
}