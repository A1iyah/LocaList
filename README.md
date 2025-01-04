# DISCLAIMER -

Please note that due to frequent updates and changes in Rapid API's code, certain features in this application may not function as expected. While I am actively working to adapt the code and address these changes, Rapid API does not provide advance notifications regarding updates. As a result, I periodically review and revise the code to resolve any issues I identify.

This version of the application is not final and may undergo further updates to ensure optimal functionality. Thank you for your understanding.

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
