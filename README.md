# Roblox Presence

Displays the Roblox game you're currently playing with rich presence.

# Setup

## Getting Your User Id
Go to your Roblox profile, copy the number after `https://www.roblox.com/users/`, and paste it inside *config.json* in `"userId":`.

## Getting Your Token
Open the devtools by pressing <kbd>F12</kbd>, then press <kbd>Ctrl</kbd>+<kbd>P</kbd> followed by <kbd>\></kbd> and then search for *Show Application*. After this, open the *Cookies* panel under the *Storage* section, copy the contents of the *.ROBLOSECURITY* cookie and paste them in *config.json* in `"token":`.

Now you should be able to run the project with `npm start`.