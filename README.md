# Run client locally:

1. `cd client` then run `npm i`
2. run `npm run dev`

# Run server locally:

1. `cd server` then run `npm i`
2. Update .env file with your MONGO_URI + PORT
3. run `node`, then:

- `require('crypto').randomBytes(64).toString('hex')` -> save it in ACCESS_TOKEN_SECRET + REFRESH_TOKEN_SECRET + EXPIRATION_TIME_IN_HOURS (.env)

4. run `npm start`

# To run mongo locally:

1. Install Docker software from here - https://docs.docker.com/get-docker/
2. Run Docker software on your computer
3. in terminal run - `docker run --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:latest`
4. Update in .env file - MONGO_URI=mongodb://localhost:27017

- (To kill the mongo - run `docker ps`, then copy the id under the CONTAINER_ID, then run `docker kill <THE-ID-YOU-COPIED>`)
