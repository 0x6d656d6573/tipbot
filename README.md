# Freyala (XYA) Discord Bot

![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/Freyala-Crypto/tipbot.svg?label=version) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Requirements

- [Node.js](http://nodejs.org/) (>=12.0.0)
- MariaDB
- [Discord](https://discordapp.com/) account

## Installation

### Create a discord bot

Visit the [Discord developers page](https://discord.com/developers) and create a new bot. Instructions on how to make a Discord bot can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

### Install the project

Clone this repo on your server

```shell
git clone git@github.com:Freyala-Crypto/tipbot.git
```

Install the node dependencies

```shell
npm i
```

And finally copy `.env.example` to `.env`

```shell
cp .env.example .env
```

### Artifact
Replace `artifact.json` with your contract abi JSON

### Configure dotenv

Update the `.env` values. This table explains what variable is used for what

#### Discord

Key | Type | Example | Description
--- | --- | --- | ---
TOKEN | string | LKDJI98789dhs8KJNKJYDuuyysdfJ.skJJHjb_33.KJHKjhkjhKJH87JHguIYbBJy-DKkd8db
MESSAGE_PREFIX | string | !f
ERROR_REPORTING_USERS | string | @Gydo or @Tailchakra
OWNER_ID | string (comma seperated) | 234567898765432234
BLACKLIST | string (comma seperated) | 234567898765432234
BOT_WALLET_ADDRESS | string | 0x89y92...38jhu283h9
BOT_WALLET_PRIVATE_KEY | string | 934ccbaec7...45980bf2dae
COOLDOWN | integer | 20000

#### Database

Key | Type | Example | Description
--- | --- | --- | ---
DB_HOST | string | localhost
DB_DIALECT | string | mariadb
DB_USER | string | root
DB_PASSWORD | string | |
DB_NAME | string | xya_bot

#### Cypher

Key | Type | Example | Description
--- | --- | --- | ---
CYPHER_SECRET | string | foobar

#### Token

Key | Type | Example | Description
--- | --- | --- | ---
CONTRACT_ADDRESS | string | 0x89y92...38jhu283h9
SYMBOL | string | XYA
CURRENCY_DECIMALS | integer | 18
NETWORK_EXPLORER | string | https://explorer.harmony.one/#
RPC_URL | string | https://s0.hmy.com
VIPER_PAIR_ID | string | 0x89y92...38jhu283h9

#### Colors

Key | Type | Example | Description
--- | --- | --- | ---
COLOR_PRIMARY | string | #7FCA49
COLOR_INFO | string | #0EA5E9
COLOR_ERROR | string | #FF0000

#### Price embed

Key | Type | Example | Description
--- | --- | --- | ---
PRICE_EMBED_TITLE | string | XYA
PRICE_EMBED_THUMBNAIL | string | https://freyala.com/_nuxt/icons/icon_64x64.5f6a36.png
PRICE_EMBED_CHART_LINK | string | https://www.freyala.com/chart
PRICE_EMBED_URL | string | https://www.freyala.com/chart
PRICE_EMBED_FOOTER | string | Source: Viperswap

### Start the bot

After the configuration you are ready to start the bot.

#### Node command

The simplest way of starting the bot is using the `node` command

```shell
node bot.js
```

To prevent the bot from going offline you can start the node in a screen

```shell
screen -S Bot
node bot.js
```

Followed by `ctrl` + `a` `ctrl` + `d` to detach the screen.

To open the screen again

```shell
screen -r Bot
```

#### Alternatives

Alternatively if you want auto reload when files are updated, monitoring etc you can use one of these packages

##### Nodemon

[Nodemon website](https://nodemon.io/)

```shell
screen -S Bot
nodemon bot.js
```

##### PM2

[PM2 website](https://pm2.keymetrics.io/)

```shell
pm2 start bot.js --name Bot --watch
```

## Roadmap

Visit the [GitHub project](https://github.com/orgs/freyala/projects/1) for the roadmap

## License

MIT License

Copyright (c) 2021 Gydo Makkinga Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
