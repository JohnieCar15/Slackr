import { apiCallGet, apiCallPost } from './helpers.js';
import { DEFAULT_PROFILE } from './config.js';
import { globalToken, globalUserId } from './main.js';

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