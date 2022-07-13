# Discord Bot

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

## Optional

Install sapphire cli

```bash
npm install -g @sapphire/cli
```

Create command using sapphire cli

```bash
sapphire generate command [command name] 
```
