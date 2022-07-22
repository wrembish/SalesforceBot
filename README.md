# SalesforceBot
creating a discord bot with Salesforce connection to store data

`**NOTE**` This code requires a node version that includes the new global fetch method `**NOTE**`
* Node 17.5 requires the --experimental-fetch flag to use the feature (**Wasn't tested in 17.5 so keep that in mind**)
* Node 18.6.0 does not require a flag (**This is the version I am developing and testing with**)

## Environment Variables
* TOKEN="BOT TOKEN GOES HERE"
* CLIENT_ID="BOT OAUTH CLIENT ID GOES HERE"
* GUILD_ID="GUILD ID FOR SERVER TO DEPLOY SLASH COMMANDS TO GOES HERE"
* SF_CONSUMER_KEY="SF CONNECTED APP CONSUMER KEY GOES HERE"
* SF_CONSUMER_SECRET="SF CONNECTED APP CONSUMER SECRET GOES HERE"
* SF_USERNAME="SF ACCOUNT TO LOG IN WITH Username GOES HERE"
* SF_PASSWORD="PASSWORD FOR ABOVE ACCOUNT GOES HERE"
* SF_SECURITY_TOKEN="SECURITY TOKEN FOR ABOVE ACCOUNT GOES HERE"

## How To Run
* First create the Environment Variables from above.
  * CLIENT_ID and GUILD_ID are important if you want to run slash commands on a discord server
* Run `node deploy-commands.js` once the Environment Variables are set to deploy slash commands to your server
* Run `node index.js` to run the bot
