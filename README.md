# Roblox Presence

Displays the Roblox game you're currently playing with rich presence.

# Setup

## Creating The Configuration File
Create a file in this folder named *config.json*, open it and paste this inside it:
```json
{
    "token": "",
    "userId": 0,
    "appId": ""
}
```

## Creating The Discord App
Go to https://discord.com/developers/applications, and click on *New Application* at the top right corner.
Then you can name your app *Roblox*, it will be shown at the top of the activity.
After this, copy the number under *Application ID*, and paste it inside *config.json* in `appId`.

## Getting Your Roblox User Id
Go to your Roblox profile, copy the number after *roblox.com/users/*, and paste it inside *config.json* in `userId`.

## Getting Your Roblox Token
Open the devtools by pressing <kbd>F12</kbd>, then press <kbd>Ctrl</kbd>+<kbd>P</kbd> followed by <kbd>\></kbd> and then search for *Show Application*. After this, open the *Cookies* panel under the *Storage* section, copy the contents of the *.ROBLOSECURITY* cookie and paste them in *config.json* in `token`.

Now you should be able to run the project with `npm start`.