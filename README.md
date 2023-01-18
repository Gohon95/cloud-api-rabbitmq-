# Api Backend

## Requirements

In order to run this project correctly, you need to have the following installed:

```
node ^16.18.0
npm ^8.19.2
docker ^20.10.21
docker compose ^2.12.2
```

## Installation

To **initialize** the project, use these commands

```bash
npm install # install node dependencies
cp .env.dist.development .env # create .env and modify variables as needed
mkdir upload # create the upload folder for images or specify another path in the .env
```

To **start** the database and create all tables, use these commands

```bash
docker compose up api-cloud-db # start the database container
npm run dev:create # create the database
npm run dev:migrate # create all tables (scripts in database/migrations)
npm run dev:seed # populate technical tables and add an admin user
```

Then to **run** the server, use this command

```bash
npm start # start the production server
npm run dev # or start the server in development environment
```
