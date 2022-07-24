# Discord Bot

[![Maintainability](https://api.codeclimate.com/v1/badges/60d8bd8be6d800426995/maintainability)](https://codeclimate.com/github/SimpleRPG/discord-bot/maintainability)

Install dependencies

```bash
npm install # or yarn
```

Setup .env file by copying .env.example and name the copy with .env

```bash
cp .env.example .env
```

Then, set value of `BOT_TOKEN` with your discord bot token.

Run the bot in development mode

```bash
npm run dev
```

Run the bot in production mode

```bash
npm run prod
```

## Tips

Create command using sapphire cli

```bash
npx sapphire generate command [command name]
```
