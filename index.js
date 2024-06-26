const { Client } = require('discord-rpc');

const { token, userId, appId } = require('./config.json');

const HEADERS = {cookie:'.ROBLOSECURITY='+token};
/** @type {Client} */
var client;

function getStatus() {
    return new Promise((resolve_status,reject_status)=>{
        fetch('https://presence.roblox.com/v1/presence/users',{
            method: 'POST',
            body: JSON.stringify({
                userids: [ userId ]
            }),
            headers: HEADERS
        })
        .then(
            response => response.json()
        )
        .then(
            json => {
                resolve_status((json.userPresences||[]).find(p=>p.userPresenceType==2));
            }
        )
        .catch(reject_status);
    });
}

function getGameIcon(placeId) {
    let url = new URL(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${encodeURIComponent(placeId)}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
    return new Promise((resolve_icon,reject_icon)=>{
        fetch(url,{
            method: 'GET',
            headers: HEADERS
        }).then(
            response => {
                response.json()
                    .then(
                        json => resolve_icon(json.data?.[0]?.imageUrl)
                    )
                    .catch(reject_icon)
                ;
            }
        ).catch(
            reject_icon
        );
    });
}

function getPrivateServerData(placeId) {
    let url = new URL(`https://games.roblox.com/v1/games/${encodeURIComponent(placeId)}/private-servers?sortOrder=1&limit=10`);
    return new Promise((resolve_data,reject_data)=>{
        fetch(url,{
            method: 'GET',
            headers: HEADERS
        })
        .then(
            response => response.json()
        )
        .then(
            json => {
                if (json.data)
                    resolve_data(json.data[0]);
                else
                    resolve_data(null);
            }
        )
        .catch(reject_data);
    });
}

function getServerData(placeId) {
    let url = new URL(`https://games.roblox.com/v1/games/${encodeURIComponent(placeId)}/servers/1?sortOrder=1&excludeFullGames=true&limit=10`);
    return new Promise((resolve_data,reject_data)=>{
        fetch(url,{
            method: 'GET',
            headers: HEADERS
        })
        .then(
            response => response.json()
        )
        .then(
            json => {
                if (json.data)
                    resolve_data(json.data[0]);
                else
                    resolve_data(null);
            }
        )
        .catch(reject_data);
    });
}

function loginRPC() {
    return new Promise(async (resolve_login) => {
        if (!client) {
            client = new Client({transport:'ipc'});
            client.once('ready',()=>{
                return resolve_login(null);
            });
            client.once('disconnected',()=>{
                client.destroy();
                client = undefined;
            });
            try {
                await client.login({clientId:appId});
            } catch (e) {
                client.destroy();
                client = undefined;
                console.error(e);
                return resolve_login(e);
            }
        }
        else
            resolve_login(null);
    });
}

/**
 * @param {import('discord-rpc').Presence} presence
 */
async function setPresence(presence) {
    const err = await loginRPC();
    if (err) return {err};
    return {result:await client.setActivity(presence)};
}

async function clearPresence() {
    if (client) 
        return await client.clearActivity();
}

(async()=>{

    let startTimestamp = null;

    for (;;) {

        await new Promise(r=>setTimeout(r,2000));

        try {

            let status = await getStatus();

            if (status) {

                if (!startTimestamp)
                    startTimestamp = Date.now();

                /** @type {import('discord-rpc').Presence} */
                let presence = {
                    details: status.lastLocation,
                    largeImageText: status.lastLocation,
                    smallImageKey: 'roblox',
                    startTimestamp
                }

                const placeId = status.placeId||status.rootPlaceId;
                
                let icon = await getGameIcon(placeId);
                if (icon) {
                    presence.largeImageKey = icon;
                }

                let server = await getServerData(placeId) || await getPrivateServerData(placeId);
                if (server) {
                    presence.partySize = server.playing;
                    presence.partyMax = server.maxPlayers;
                    presence.state = (server.players?.length||0)>1 ? `${server.players.length-1} friend${server.players.length-1==1?'':'s'}` : 'Playing';
                }
                
                const {err} = await setPresence(presence);
                if (err)
                    console.log(err);

            } else {

                startTimestamp = null;
                await clearPresence();

            }

        } catch (e) {

            console.error(e);

        }

    }

})();