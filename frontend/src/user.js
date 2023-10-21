import { apiCallGet, apiCallPost } from './helpers.js';

export const getUserName = (userId, creator, globalToken) => {
    apiCallGet(`user/${userId}`, globalToken)
    .then((body) => {
        creator.textContent = `Creator: ${body.name}`;
    })
    .catch((msg) => {
        alert(msg);
    })
}