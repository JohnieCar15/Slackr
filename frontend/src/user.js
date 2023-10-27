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
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const createUserProfile = (userId) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
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
            const editDetails = document.createElement('form');

            const editName = createFormComponent('Name', 'text')
            editDetails.appendChild(editName[0])

            const editBio = createFormComponent('Bio', 'text')
            editDetails.appendChild(editBio[0])

            const editEmail = createFormComponent('Email', 'email')

            editDetails.appendChild(editEmail[0])


            const editPassword = createFormComponent('Password', 'password')
            editDetails.appendChild(editPassword[0])

            const editPasswordConfirm = createFormComponent('Confirm Password', 'password')
            editDetails.appendChild(editPasswordConfirm[0])

            const editProfile = createFormComponent('Profile Picture', 'file')
            editDetails.appendChild(editProfile[0])

            userDiv.appendChild(editDetails);

            const submit = document.createElement('button');
            submit.textContent = 'Submit';
            submit.addEventListener('click', () => {
                const fileInfo = editProfile[1].files[0]
                const email = editEmail[1].value
                const password = editPassword[1].value
                const confirmPassword = editPasswordConfirm[1].value
                const name = editName[1].value
                const bio = editBio[1].value

                if (password !== confirmPassword) {
                    alert('Passwords do not match!')
                } else {
                    try {
                        fileToDataUrl(fileInfo).then((image) => {
                            updateUserDetails(email, password, name, bio, image)
                        })
                        .catch((msg) => {
                            alert(msg)
                        })
                    } catch(err) {
                        if (fileInfo === undefined) {
                            updateUserDetails(email, password, name, bio, '')
                        } else {
                            alert(err)
                        }
                    }
                }
            })


            userDiv.appendChild(submit);
        }

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

export const createFormComponent = (displayName, type) => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('mb-3')

    const label = document.createElement('label');
    label.classList.add('form-label')
    label.classList.add('h6')
    label.textContent = displayName;

    mainDiv.appendChild(label);

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input-group')

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('type', type)

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


    return [mainDiv, input];
}