import { apiCallGet, apiCallPost, apiCallPut} from './helpers.js';
import { getUserName } from './user.js';
import { showPage } from './main.js'

export const loadChannels = (globalToken) => {
    apiCallGet('channel', globalToken)
    .then((body) => {

        const publicChannels = document.getElementById('public-channels');
        publicChannels.textContent = '';

        const privateChannels = document.getElementById('private-channels');
        privateChannels.textContent = '';

        for(const channel of body.channels) {
            const channelDiv = document.createElement('div');
            channelDiv.textContent = `Channel: ${channel.name}`;
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
}

const editChannel = (channelId, name, description, globalToken) => {
    const channelName = document.getElementById(`channel-${channelId}-name`);
    const channelDescription = document.getElementById(`channel-${channelId}-description`);
    apiCallPut(`channel/${channelId}`, {
        name: name === null ? channelName : name,
        description: description === null ? channelDescription : description
    }, globalToken)
    .then(() => {
        if (description === null) {
            channelName.textContent = 'Name: ' + name;
        } else {
            channelDescription.textContent = 'Description: ' + description;
        }
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const createChannelPage = (channel, globalToken) => {
    apiCallGet(`channel/${channel.id}`, globalToken)
    .then((body) => {
        const channelPage = document.createElement('div');
        channelPage.id = `page-channel-${channel.id}`
        channelPage.classList.add('page-block');

        const name = document.createElement('p');
        name.id = `channel-${channel.id}-name`
        name.textContent = `Name: ${body.name}`;
        channelPage.appendChild(name);

        const editNameHeader = document.createElement('p');
        editNameHeader.textContent = 'Edit the name here:'
        channelPage.appendChild(editNameHeader)
        const editName = document.createElement('textarea');
        channelPage.appendChild(editName)
        const editNameSubmit = document.createElement('button');
        editNameSubmit.textContent = 'submit'
        editNameSubmit.addEventListener('click', () => {
            editChannel(channel.id, editName.value, null, globalToken);
        })

        channelPage.appendChild(editNameSubmit)

        const description = document.createElement('p');
        description.id = `channel-${channel.id}-description`
        description.textContent = `Description: ${body.description}`;
        channelPage.appendChild(description);

        const editDescriptionHeader = document.createElement('p');
        editDescriptionHeader.textContent = 'Edit the description here:'
        channelPage.appendChild(editDescriptionHeader)
        const editDescription = document.createElement('textarea');
        channelPage.appendChild(editDescription)
        const editDescriptionSubmit = document.createElement('button');
        editDescriptionSubmit.textContent = 'submit'
        editDescriptionSubmit.addEventListener('click', () => {
            editChannel(channel.id, null, editDescription.value, globalToken);
        })

        channelPage.appendChild(editDescriptionSubmit)

        const isPrivate = document.createElement('p');
        isPrivate.textContent = body.private ? 'Private channel' : 'Public channel'
        channelPage.appendChild(isPrivate);

        const creator = document.createElement('p');
        getUserName(body.creator, creator, globalToken);
        channelPage.appendChild(creator);

        const createdAt = document.createElement('p');
        const date = body.createdAt.substring(0,10).split('-');
        createdAt.textContent = `Created at: ${date[2] + '/' + date[1] + '/' + date[0]}`;
        channelPage.appendChild(createdAt);

        const goBack = document.createElement('button');
        goBack.textContent = 'Go back to dashboard'
        goBack.addEventListener('click', () => {
            showPage('dashboard');
        })
        channelPage.appendChild(goBack);

        document.getElementById('main').appendChild(channelPage);


    })
    .catch((msg) => {
        alert(msg);
    })
}