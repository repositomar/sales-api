## Description
Sales API
## Requirements
* Docker
* NVM

## First steps Backend
> **Create `.env` file at the root backend project with the environment variables:**

```sh
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=salesuser
DB_PASSWORD=salespassword
DB_NAME=salesdb

```
> **Run the following command to run `MySQL` in docker container:**
```bash
$ docker-compose up -d
```
> **Run the following commands to setup node environment:**

This will install the node version required for this project.
```bash
$ nvm install 
```

This will set as current node version the required version for this project.
```bash
$ nvm use 
```

This will install the project dependencies.
```bash
$ npm install
```
## Running the BackEnd app
This command will start the server, the application will run on `port 3000`

```bash
# development
$ npm run start:dev
```

## Getting started
> **Open browser in `http://localhost:3000/docs` to see swagger**


## BackEnd endPoints
> A `sales-api.postman_collection.json` file with a postman collection is attached to the root project, showing the operation of each endpoint.
### Create item
> It is necessary to send Json body in the request with the `name`, `brand` and `price`.

```bash
Verb: POST
http://localhost:3000/item
```

### Get all items
> This returns all the item from `MySQL`.

```bash
Verb: GET
http://localhost:3000/item
```

### Get item by itemId
> It is necessary to send Path Variable `itemId`.

```bash
Verb: GET
http://localhost:3000/item/:itemId
```

### Update item by itemId
> It is necessary to send Path Variable `itemId` and Json body with the `stock`, `isActive` or `name` of the item to update.

```bash
Verb: PUT
http://localhost:3000/item/:itemId
```

```
## Further work
* Do integration tests.
* Cache the API response to improve performance and have faster response times.