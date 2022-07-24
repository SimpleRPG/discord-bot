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

Configure Database: PostgreSQL required

Create PostgreSQL database with username=`postgres` password=`postres` databasename=`postgres` to match the DATABASE_URL value in .env. You can modify it however you want as long as you know what you are doing.

Then run to apply tables to the database

```bash
npx prisma db push
```

Seed default data to the database

```bash
npx prisma db seed
```


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
