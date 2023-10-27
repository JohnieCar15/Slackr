import { apiCallGet, apiCallPost, apiCallPut, fileToDataUrl, convertISOString } from './helpers.js';
import { getUserName, createFormComponent } from './user.js';
import { getMessages, sendMessage } from './message.js';
import { showPage, globalToken, globalUserId } from './main.js';
import { DEFAULT_PROFILE } from './config.js';

export let pageCounter = 0;

const editChannel = (channelId, name, description) => {
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

export const createChannelJoinPage = (channel) => {
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
        joinChannel(channel, globalUserId);
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

export const createChannelPage = (channel, isShowPage) => {
    apiCallGet(`channel/${channel.id}`, globalToken)
    .then((body) => {
        const page = document.getElementById(`page-channel-${channel.id}`)
        if (page !== null) {
            page.remove();
        }

        const channelPage = document.createElement('div');
        channelPage.id = `page-channel-${channel.id}`
        channelPage.classList.add('page-block');
        channelPage.classList.add('container')

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
        getUserName(body.creator, creator);
        channelPage.appendChild(creator);

        const createdAtHeader = document.createElement('h3');
        createdAtHeader.textContent = `Created at:`;
        channelPage.appendChild(createdAtHeader);
        const createdAt = document.createElement('p');
        createdAt.textContent = convertISOString(body.createdAt);
        channelPage.appendChild(createdAt);

        const editNameDiv = document.createElement('div');
        editNameDiv.style.paddingBottom = '40px';
        editNameDiv.style.marginBottom = '10px';

        const editNameHeader = document.createElement('h3');
        editNameHeader.textContent = 'Edit the channel name here:'
        editNameDiv.appendChild(editNameHeader)

        const editName = createFormComponent('Channel Name', 'text')[0]
        editNameDiv.appendChild(editName)


        const editNameSubmit = document.createElement('button');
        editNameSubmit.textContent = 'Submit'
        editNameSubmit.addEventListener('click', () => {
            editChannel(channel.id, editName[1].value, description.textContent);
            editName[1].value = '';
        })
        editNameDiv.appendChild(editNameSubmit)

        channelPage.appendChild(editNameDiv);

        const editDescriptionDiv = document.createElement('div');
        editDescriptionDiv.style.paddingBottom = '40px';

        const editDescriptionHeader = document.createElement('h3');
        editDescriptionHeader.textContent = 'Edit the channel description here:'
        editDescriptionDiv.appendChild(editDescriptionHeader)


        const editDescription = createFormComponent('Description', 'text');
        editDescriptionDiv.appendChild(editDescription[0])


        const editDescriptionSubmit = document.createElement('button');
        editDescriptionSubmit.textContent = 'Submit'
        editDescriptionSubmit.addEventListener('click', () => {
            editChannel(channel.id, name.textContent, editDescription[1].value);
            editDescription[1].value = '';
        })
        editDescriptionDiv.appendChild(editDescriptionSubmit)

        channelPage.appendChild(editDescriptionDiv);

        const pinnedMessagesDiv = document.createElement('div');
        pinnedMessagesDiv.style.paddingBottom = '40px';

        channelPage.appendChild(pinnedMessagesDiv);

        const messagesDiv = document.createElement('div');
        messagesDiv.style.paddingBottom = '40px';

        channelPage.appendChild(messagesDiv);

        const pageBackward = document.createElement('button');
        pageBackward.textContent = 'Previous page';
        pageBackward.addEventListener('click', () => {
            if (pageCounter - 25 < 0) {
                return;
            }

            getMessages(channel, pageCounter -= 25, messagesDiv, pinnedMessagesDiv);
        })

        channelPage.appendChild(pageBackward);

        const pageForward = document.createElement('button');
        pageForward.textContent = 'Next page';
        pageForward.addEventListener('click', () => {
            getMessages(channel, pageCounter += 25, messagesDiv, pinnedMessagesDiv);
        })

        channelPage.appendChild(pageForward);

        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);

        const sendMessageHeader = document.createElement('h3');
        sendMessageHeader.textContent = 'Send a message:'
        channelPage.appendChild(sendMessageHeader);

        const sendMessageText = createFormComponent('Message', 'text')
        channelPage.appendChild(sendMessageText[0]);

        const sendMessageImage = createFormComponent('Photo', 'file')
        channelPage.appendChild(sendMessageImage[0]);

        const sendMessageSubmit = document.createElement('button');
        sendMessageSubmit.textContent = 'Submit'
        sendMessageSubmit.addEventListener('click', () => {
            try {
                fileToDataUrl(sendMessageImage[1].files[0]).then((image) => {
                    sendMessage(channel, sendMessageText[1].value, image, messagesDiv, pinnedMessagesDiv);
                    sendMessageText[1].value = '';
                })
                .catch((msg) => {
                    alert(msg)
                })
            } catch(err) {
                if (sendMessageImage[1].files[0] === undefined) {
                    sendMessage(channel, sendMessageText[1].value, '', messagesDiv, pinnedMessagesDiv);
                } else {
                    alert(err)
                }
            }
        })
        channelPage.appendChild(sendMessageSubmit)


        const leave = document.createElement('button');
        leave.textContent = 'Leave the channel'
        leave.addEventListener('click', () => {
            leaveChannel(channel);
        })
        leave.setAttribute('style', 'display: block');
        channelPage.appendChild(leave);

        document.getElementById('main').appendChild(channelPage);

        if (isShowPage) {
            showPage(`channel-${channel.id}`);
        }

    })
    .catch((msg) => {
        alert(msg);
    })
}

const joinChannel = (channel) => {
    apiCallPost(`channel/${channel.id}/join`, {}, globalToken)
    .then((body) => {
        createChannelPage(channel, true);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const leaveChannel = (channel) => {
    apiCallPost(`channel/${channel.id}/leave`, {}, globalToken)
    .then((body) => {
        showPage('dashboard');
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const inviteToChannel = () => {
    for (const checkbox of document.querySelectorAll('.user-checkbox')) {
        for (const radio of document.querySelectorAll('.channel-radio')) {
            if (checkbox.checked && radio.checked) {
                apiCallPost(`channel/${radio.getAttribute('channel-id')}/invite`, {
                    userId: parseInt(checkbox.getAttribute('user-id'))
                }, globalToken)
                .then((body) => {
                })
                .catch((msg) => {
                    alert(msg);
                })
            }

        }
    }
}