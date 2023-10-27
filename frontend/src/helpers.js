/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export const apiCallPost = (path, body, globalToken) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'Authorization': (globalToken !== null) ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject(body.error);
            } else {
                resolve(body);
            }
        });
    }
    );
}

export const apiCallPut = (path, body, globalToken) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'Authorization': (globalToken !== null) ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject(body.error);
            } else {
                resolve(body);
            }
        });
    }
    );
}

export const apiCallGet = (path, globalToken) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': (globalToken !== null) ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject(body.error);
            } else {
                resolve(body);
            }
        });
    }
    );
}

export const apiCallDelete = (path, globalToken) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': (globalToken !== null) ? `Bearer ${globalToken}` : undefined
            }
        })
        .then((response) => response.json())
        .then((body) => {
            if (body.error) {
                reject(body.error);
            } else {
                resolve(body);
            }
        });
    }
    );
}

export const convertISOString = (isoString) => {
    const startDate = new Date(isoString);
    return startDate.toString().substring(4,24);
}

export const removeAllChildNodes = (parent) => {
    if (parent === null) {
        return;
    }

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
