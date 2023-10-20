const loadChannels = () => {
    apiCallGet('channel', {}, true)
    .then((body) => {
        const channels = body;
        console.log(channels);
    })
    .catch((msg) => {
        alert(msg);
    })
}