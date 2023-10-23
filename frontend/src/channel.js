import { apiCallGet, apiCallPost, apiCallPut } from './helpers.js';
import { getUserName } from './user.js';
import { getMessages, sendMessage } from './message.js';
import { showPage } from './main.js';

const editChannel = (channelId, name, description, globalToken) => {
    const channelName = document.getElementById(`channel-${channelId}-name`)
    const channelDescription = document.getElementById(`channel-${channelId}-description`)

    apiCallPut(`channel/${channelId}`, {
        name: name,
        description: description
    }, globalToken)
    .then(() => {
        channelName.textContent = name;
        channelDescription.textContent = description;
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const createChannelJoinPage = (channel, globalUserId, globalToken) => {
    const page = document.getElementById(`page-channel-${channel.id}`)
    if (page !== null) {
        page.remove();
    }

    const channelPage = document.createElement('div');
    channelPage.id = `page-channel-${channel.id}`
    channelPage.classList.add('page-block');

    const joinButton = document.createElement('button');
    joinButton.textContent = 'Join this channel';
    joinButton.addEventListener('click', () => {
        joinChannel(channel, globalUserId, globalToken);
    })

    channelPage.appendChild(joinButton);

    const goBack = document.createElement('button');
    goBack.textContent = 'Go back to dashboard'
    goBack.addEventListener('click', () => {
        showPage('dashboard');
    })
    goBack.setAttribute('style', 'display: block');
    channelPage.appendChild(goBack);

    document.getElementById('main').appendChild(channelPage);
}

export const createChannelPage = (channel, isShowPage, globalUserId, globalToken) => {
    apiCallGet(`channel/${channel.id}`, globalToken)
    .then((body) => {
        const page = document.getElementById(`page-channel-${channel.id}`)
        if (page !== null) {
            page.remove();
        }

        const channelPage = document.createElement('div');
        channelPage.id = `page-channel-${channel.id}`
        channelPage.classList.add('page-block');

        const nameHeader = document.createElement('h3');
        nameHeader.textContent = `Channel name:`;
        channelPage.appendChild(nameHeader);

        const name = document.createElement('p');
        name.id = `channel-${channel.id}-name`
        name.textContent = body.name;
        channelPage.appendChild(name);

        const descriptionHeader = document.createElement('h3');
        descriptionHeader.textContent = `Channel description:`;
        channelPage.appendChild(descriptionHeader);
        const description = document.createElement('p');
        description.id = `channel-${channel.id}-description`
        description.textContent = body.description;
        channelPage.appendChild(description);


        const isPrivateHeader = document.createElement('h3');
        isPrivateHeader.textContent = `Private/Public channel:`;
        channelPage.appendChild(isPrivateHeader);
        const isPrivate = document.createElement('p');
        isPrivate.textContent = body.private ? 'Private' : 'Public'
        channelPage.appendChild(isPrivate);

        const creatorHeader = document.createElement('h3');
        creatorHeader.textContent = `Creator:`;
        channelPage.appendChild(creatorHeader);
        const creator = document.createElement('p');
        getUserName(body.creator, creator, globalToken);
        channelPage.appendChild(creator);

        const createdAtHeader = document.createElement('h3');
        createdAtHeader.textContent = `Created at:`;
        channelPage.appendChild(createdAtHeader);
        const createdAt = document.createElement('p');
        const date = body.createdAt.substring(0,10).split('-');
        createdAt.textContent = `Created at: ${date[2] + '/' + date[1] + '/' + date[0]}`;
        channelPage.appendChild(createdAt);

        const editNameDiv = document.createElement('div');
        editNameDiv.style.border = '1px solid black';
        editNameDiv.style.paddingBottom = '40px';
        editNameDiv.style.marginBottom = '10px';

        const editNameHeader = document.createElement('h3');
        editNameHeader.textContent = 'Edit the channel name here:'
        editNameDiv.appendChild(editNameHeader)
        const editName = document.createElement('textarea');
        editNameDiv.appendChild(editName)
        const editNameSubmit = document.createElement('button');
        editNameSubmit.textContent = 'submit'
        editNameSubmit.addEventListener('click', () => {
            editChannel(channel.id, editName.value, description.textContent, globalToken);
            editName.value = '';
        })
        editNameDiv.appendChild(editNameSubmit)

        channelPage.appendChild(editNameDiv);

        const editDescriptionDiv = document.createElement('div');
        editDescriptionDiv.style.border = '1px solid black';
        editDescriptionDiv.style.paddingBottom = '40px';

        const editDescriptionHeader = document.createElement('h3');
        editDescriptionHeader.textContent = 'Edit the channel description here:'
        editDescriptionDiv.appendChild(editDescriptionHeader)
        const editDescription = document.createElement('textarea');
        editDescriptionDiv.appendChild(editDescription)
        const editDescriptionSubmit = document.createElement('button');
        editDescriptionSubmit.textContent = 'submit'
        editDescriptionSubmit.addEventListener('click', () => {
            editChannel(channel.id, name.textContent, editDescription.value, globalToken);
            editDescription.value = '';
        })
        editDescriptionDiv.appendChild(editDescriptionSubmit)

        channelPage.appendChild(editDescriptionDiv);


        const messagesDiv = document.createElement('div');
        messagesDiv.style.border = '1px solid red';
        messagesDiv.style.paddingBottom = '40px';
        channelPage.appendChild(messagesDiv);

        getMessages(channel, 0, messagesDiv, globalUserId, globalToken);


        const sendMessagesDiv = document.createElement('div');
        const sendMessageHeader = document.createElement('h3');
        sendMessageHeader.textContent = 'Send a message:'
        sendMessagesDiv.appendChild(sendMessageHeader);

        const sendMessageVal = document.createElement('textarea');
        sendMessagesDiv.appendChild(sendMessageVal);
        const sendMessageSubmit = document.createElement('button');
        sendMessageSubmit.textContent = 'submit'
        sendMessageSubmit.addEventListener('click', () => {
            sendMessage(channel, sendMessageVal.value, undefined, messagesDiv, globalUserId, globalToken);
            sendMessageVal.value = '';
        })
        sendMessagesDiv.appendChild(sendMessageSubmit);

        channelPage.appendChild(sendMessagesDiv);


        const leave = document.createElement('button');
        leave.textContent = 'Leave the channel'
        leave.addEventListener('click', () => {
            leaveChannel(channel, globalToken);
        })
        leave.setAttribute('style', 'display: block');
        channelPage.appendChild(leave);


        const goBack = document.createElement('button');
        goBack.textContent = 'Go back to dashboard'
        goBack.addEventListener('click', () => {
            showPage('dashboard');
        })
        goBack.setAttribute('style', 'display: block');
        channelPage.appendChild(goBack);

        document.getElementById('main').appendChild(channelPage);

        if (isShowPage) {
            showPage(`channel-${channel.id}`);
        }

    })
    .catch((msg) => {
        alert(msg);
    })
}

const joinChannel = (channel, globalUserId, globalToken) => {
    apiCallPost(`channel/${channel.id}/join`, {}, globalToken)
    .then((body) => {
        createChannelPage(channel, true, globalUserId, globalToken);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const leaveChannel = (channel, globalToken) => {
    apiCallPost(`channel/${channel.id}/leave`, {}, globalToken)
    .then((body) => {
        showPage('dashboard');
    })
    .catch((msg) => {
        alert(msg);
    })
}