The Task

Your task is to build a frontend for a UNSW rip-off version of the popular messaging tool [Slack](https://slack.com/). If you haven't used this application before (or similar applications like Discord, Teams), we would recommend creating your own slack workspace to place around with the tool.

UNSW's rip-off of slack is called "Slackr". However, you don't have to build the entire application. You only have to build the frontend. The backend is already built for you as an express server built in NodeJS (see section 3.2).

Instead of providing visuals of what the frontend (your task) should look like, we intend are providing you with a number of clear and short requirements about expected features and behaviours.

The requirements describe a series of **screens**. Screens can be popups/modals, or entire pages. The use of that language is so that you can choose how you want it to be displayed. A screen is essentially a certain state of your web-based application.

### 2.1. Milestone 1 - Registration & Login (15%)

This focuses on the basic user interface to register and log in to the site.

#### 2.1.1. Login
 * When the user isn't logged in, the site shall present a login form that contains:
   * an email field (text)
   * a password field (password)
   * submit button to login
 * When the submit button is pressed, the form data should be sent to `POST /auth/login` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.

#### 2.1.2. Registration
 * When the user isn't logged in, the login form shall provide a link/button that opens the register form. The register form will contain:
   * an email field (text)
   * a name field (text)
   * a password field (password)
   * a confirm password field (password) - not passed to the backend, but an error should be thrown on submit if it doesn't match the other password
   * submit button to register
 * When the submit button is pressed, if the two passwords don't match the user should receive an error popup. If they do match, the form data should be sent to `POST /auth/register` to verify the credentials. If there is an error during registration an appropriate error should appear on the screen.

#### 2.1.3. Error Popup
 * Whenever the frontend or backend produces an error, there shall be an error popup on the screen with a message (either a message derived from the backend error response, or one meaningfully created on the frontend).
 * This popup can be closed/removed/deleted by pressing an "x" or "close" button.

### 2.2. Milestone 2 - Creating and viewing channels (10%)

Milestone 2 focuses on creating **channels**, and viewing the basic channel screen layout for a single channel.

#### 2.2.1 Viewing a list of channels
 * The application should present a list of all public channels created. This will be visible on every screen for a logged-in user.
 * The user should also be able to see a list of all private channels they have joined. This will be visible on every screen for a logged-in user.
 * The two types of channels should be distinguishable visually.
 * Selecting a channel should take the user to the single channel screen. This single channel screen should show the channel's messages and other features (implemented in `2.3`).
 * If a user has logged in, but has not selected a channel yet, there are no rules around what the main body of the screen should display (reminder: the list of channels should still be visible somewhere, in some form).

#### 2.2.2 Creating a new channel
 * Users should be able to create a new channel via some kind of form.
 * The trigger to display the form should be accessible on any screen with no more than 2 clicks.
 * Users should be able to enter the name, an optional description, and public/private channel type.
 * Note: the description should be optional for the user but the backend requires a description.

#### 2.2.3 Viewing and editing channel details
 * When viewing a single channel screen, certain information should be accessible/visible within 0-1 clicks.
 * This information includes the name of the channel, description, public/private setting, creation timestamp (as a time/date not as an ISO string, flexible to whatever you think is user-friendly), and name of the creator of the channel.
 * Users should be able to edit the channel's name and description in some way.
 * If the user is not a member of the channel, they do not need to see the channel details, but should be given a way to join the channel.
 * If the user is a member of the channel, there should be an option to leave the channel.

### 2.3. Milestone 3 - Channel messages (18%)

Milestone 3 focuses on the display and interaction of messages on a single channel screen.

#### 2.3.1 Viewing channel messages
 * The channel's messages can be viewed on each single channel screen.
 * Each message should display the sender's name and profile photo, and message timestamp (as a time/date not as an ISO string, flexible to whatever you think is user-friendly).
 * If the user has no profile photo, the frontend should use a default image.
 
#### 2.3.2 Message pagination
 * Users can page between sets of messages in the channel.
 * Note: you can ignore this if you properly implement infinite scroll in milestone 6.

#### 2.3.3 Sending messages
 * Users can send new messages from the single channel screen.
 * Once messages are sent, the channel messages should automatically update without requiring a page reload/refresh.
 * The frontend should validate the message so that empty strings or messages containing only whitespace cannot be sent.

#### 2.3.4 Deleting messages
 * Users can delete their own messages they see displayed from the single channel screen.
 * Once messages are deleted, the channel messages should automatically update without requiring a page reload/refresh.

#### 2.3.5 Editing messages
 * Users can edit their own messages they see displayed from the single channel screen.
 * Once messages are edited, there should be an indication that they have been edited, as well as the timestamp (as a time/date not as an ISO string, flexible to whatever you think is user-friendly).
 * The frontend should validate the message so that a user cannot edit a message to the same existing message.

#### 2.3.6 Reacting to messages
 * Users can react and unreact to messages.
 * You should provide at least 3 different reactions.
 * Reactions must be UTF-8 emojis.

#### 2.3.7 Pinning messages
 * Users can pin and unpin messages.
 * There should be a way for users to view all the channel's pinned messages at once. If the user is only on the first page of messages, but there is a pinned message on the third page, they should not have to navigate to the third page to see it.

### 2.4. Milestone 4 - Multi-user interactivity (10%)

Milestone 4 focuses on the interactions that come from having multiple users in the system.

#### 2.4.1 Inviting users to a channel
 * Users should be able to add other users to a channel from a modal. Users are visually identified by their name.
 * Users should be able to select multiple users to add at the same time.
 * When selecting the user(s), they must be displayed in alphabetical order of their name.

#### 2.4.2 User profiles
 * Within a single channel screen, if you click on a users' name on a given message, it should display their profile screen.
 * Their profile photo, name, bio, and email should be displayed on this screen.

#### 2.4.3 Viewing and editing user's own profile
 * On all logged in screens, there must be a way for the user to view their own profile screen.
 * On a user's own profile screen, they should also be able to see the field that allows them to enter a new password (they cannot see their current).
 * On a user's own profile screen, they should be able to toggle between viewing the new password they're entering in either plain text or hidden as a string of asterisks/dots of the correct length. It is hidden by default.
 * On a user's own profile screen, they can update their own profile, including name, bio, email, and password (as described above).
 * On a user's own profile screen, they should be able to upload and change their profile photo.

### 2.5. Milestone 5 - Photos in channels (7%)

Milestone 5 focuses on being able to upload and send photos as part of messages in a single channel screen.

#### 2.5.1 Sending photos in channels
 * Users should be able to upload and send photos in a single channel screen using the `POST /message/{channelId}`.
 * A message that contains an image does not include text as well.

#### 2.5.2 Viewing photos in channels
 * Photos in the channel messages should be displayed as small thumbnails, with the option to click to enlarge the image in a modal.
 * In the modal, there should be arrow buttons allowing the user to view other images sent in the channel.

## 3. Getting started

### 3.1. The Frontend

To work with your frontend code locally with the web server, you may have to run another web server to serve the frontend's static files.

To do this, run the following command once on your machine:

`$ npm install --global http-server`

Then whenever you want to start your server, run the following in your project's root folder:

`$ npx http-server frontend -p [port]`

Where `[port]` is the port you want to run the server on (e.g. `8080`). Any number is fine.

This will start up a second HTTP server where if you navigate to `http://localhost:8000` (or whatever URL/port it provides) it will run your `index.html` without any CORs issues.

### 3.2. The Backend

The backend server exists in your individual repository. After you clone this repo, you must run `npm install` in `backend` directory once.

To run the backend server, simply run `npm start` in the `backend` directory. This will start the backend.

To view the API interface for the backend you can navigate to the base URL of the backend (e.g. `http://localhost:5005`). This will list all of the HTTP routes that you can interact with.

We have provided you with a very basic starting database containing two users and one public channel with messages. You can look in `backend/database.json` to see the contents.

Your backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. If you want to reset the data in the backend to the original starting state, you can run `npm run reset` in the backend directory. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`. If you want to start with an empty database, you can run `npm run clear` in the backend directory.

Once the backend has started, you can view the API documentation by navigating to `http://localhost:[port]` in a web browser.

The port that the backend runs on (and that the frontend can use) is specified in `frontend/src/config.js`. You can change the port in this file. This file exists so that your frontend knows what port to use when talking to the backend.


No late submission are accepted.
