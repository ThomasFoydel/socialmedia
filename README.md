<div align="center"> <h1>social media</h1> </div>

### A MERN stack app with basic social media functionality! [live demo here](http://mernsocialmedia.xyz/)

MERNSocialMedia.xyz allows users to create accounts, manage profiles, make posts, like and comment, send/accet/reject friend requests, send live chat messages to friends. This project is built with node/express, mongodb, socketio, react, and the react-spring animation library. This project uses a bcrypt and json web token based authentication flow and a redux state management flow.

<img src="/client/src/imgs/screenshot.jpg" width="100%" >

I created this project to build fluency in the MERN stack, particularly in building and consuming RESTful APIs for CRUD functionality. I also wanted to work on authentication, animation, and web socket live chat features. The two obstacles I ran into ended up being:

1. Uploading and storing images, solved by storing them in binary using mongodb's gridFS
2. Getting the integrationg of socketio chat features with react components right to avoid infinite rerenders/maximum depth exceeded errors

These challenges inspired my next project, http://socketchat.xyz, which focused primarily on chat features and images uploads.

### To run on your machine:

1. clone or download and unzip
2. open terminal from the root folder of the project and run `npm i` then `cd client` then `npm i` again and then `cd ..`
3. start the project with `npm run dev` or, alternatively, first start the backend server with `npm start` and then open a second terminal and run `cd client` followed by `npm start`
4. project front-end should be running at http://localhost:3000 and back-end running at http://localhost:8000
5. socketio chat connection string in client/src/components/chat/chatcontainer must be changed to the url that backend is running on, it is currently set to `` `?token=${token}` `` for production so it needs to be set to `` `http://localhost:8000?token=${token}` `` for use in a local environment
