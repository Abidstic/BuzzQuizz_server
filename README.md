# Running the Repository

Follow these steps to set up and run the repository on your local machine:

## Step 1: Install Dependencies

### npm install

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

PORT= `<port-number>`

JWT_SECRET= `<your-secret-key>`

Replace `<port-number>` with the desired port number for your application and `<your-secret-key>` with your JWT secret key.

## Step 3: Update NPM Scripts

If you prefer using Nodemon for automatic server restarts during development, add the following script to your `package.json` file:

```json
"scripts": {
    "start": "nodemon server.js"
}
```

## Step 4: Send API Request to create a admin

Manually send an API request to the following endpoint:

POST [http://localhost:<port>/api/user/register](http://localhost:<port>/api/user/register)

Replace <port> with the port number you specified in the .env file.

In the request payload, include the following JSON object with the userRole set to admin:

```json
{
    "userRole": "admin"
}
```

## Step 5: Start the Server

Start the server by running:

### npm start

or

### node server.js
