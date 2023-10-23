import { apiCallGet, apiCallPost } from './helpers.js';
import { DEFAULT_PROFILE } from './config.js';

export const getUserName = (userId, creator, globalToken) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        creator.textContent = body.name;
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const getUserImage = (userId, image, globalToken) => {
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