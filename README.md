# Backend Stackoverflow Clone

This is a project to clone the basic functionality of the Stack Overflow website, implemented in Node.js and Express.js as the backend. It includes RESTful endpoints for creating, reading, updating, and deleting questions and answers, as well as for user registration and authentication.

## Project Setup

To set up the project, you need to follow these steps:

1. Clone the repository on your local machine using the command `git clone https://github.com/Zheone9/backend-stackoverflow-clone.git`
2. Install the project dependencies using the command `npm install`
3. Create a `.env` file in the root of the project and configure the following environment variables:

    MONGODB_URI=

    JWT_SECRET= 

4. Start the server using the command `npm start`. The server will be available on port `8080` by default.

## Available Endpoints

The following RESTful endpoints are available on the server:

- `GET /api/questions/public`: returns all the available questions in the database for users who are not logged in.
- `GET /api/questions/`: returns all the available questions in the database for users who are logged in.
- `POST /api/questions/create`: creates a new question in the database ID
- `PATCH /api/questions/vote`: Used for voting on a specific question by providing its ID and the type of vote (e.g. "upvote" or "downvote"). The corresponding score is updated on the server.
- `POST /api/auth`: authenticates the provided user and returns a JWT token
- `POST /api/auth/new`: creates a new user in the database
- `GET /api/auth/renew`: renew the JWT Token

Note that some endpoints require authentication using JWT. To authenticate a request, you need to include the JWT token in the `x-access-token` header of the request.

## Technologies Used

- Node.js and Express.js as the web server and application framework
- MongoDB as the NoSQL database
- Mongoose as the ODM for interacting with MongoDB
- JWT for user authentication
- Zod for validating input data and schemas

## Contribution

If you want to contribute to this project, you can create a fork of the repository and submit a pull request with your proposed changes. Please make sure to follow the contribution and code style guidelines defined in the project.

## License

This project is available under the MIT license. Please see the `LICENSE` file for more details.
