# Task Manager App

Task Manager App is a mobile application built with React Native and Expo that helps users manage their tasks efficiently. It supports features like task creation, updating, deleting, and marking tasks as completed. The app also includes a calendar view to help users keep track of their tasks.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features
- User Authentication (Login, Sign Up, Forgot Password, Reset Password)
- Task Management (Create, Read, Update, Delete)
- Task Completion and Restoration
- Calendar View for Task Management
- Font Size Customization

## Installation
To get started with the Task Manager App, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/farzadsnj/ifn666A3.git
    cd ifn666A3
    ```

2. **Install dependencies:**
    ```sh
    npm install
    cd TaskManager
    npm install
    ```

3. **Set up the environment variables:**
    Create a `.env` file in the root directory of the project and add the following:
    ```plaintext
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_HOST=your_db_host
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the server:**
    ```sh
    npm i nodemon
    nodemon ifn666a3/server.js
    ```

5. **Start the Expo development server:**
    ```sh
    npx expo start
    ```

## Usage
1. **Run the Expo development server:**
    ```sh
    npx expo start
    ```
   This will open the Expo Developer Tools in your browser.

2. **Open the app:**
   You can open the app on an Android emulator, iOS simulator, or your physical device using the Expo Go app.

## Environment Variables
The app requires the following environment variables to be set:

- `DB_USER`: Your database username.
- `DB_PASSWORD`: Your database password.
- `DB_NAME`: Your database name.
- `DB_HOST`: Your database host.
- `JWT_SECRET`: Your JWT secret key.

These variables should be set in a `.env` file in the root directory of the project.

## API Documentation
The Task Manager app uses a REST API for backend services. The following endpoints are available:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `POST /api/auth/forgot-password`: Request password reset.
- `POST /api/auth/reset-password`: Reset the password.
- `GET /api/tasks`: Retrieve all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task.

### Sample API Requests
- **Register User:**
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser", "email":"test@example.com", "password":"Password123!"}' http://localhost:5000/api/auth/register
    ```

- **Login User:**
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{"identifier":"testuser", "password":"Password123!"}' http://localhost:5000/api/auth/login
    ```

- **Create Task:**
    ```sh
    curl -X POST -H "Content-Type: application/json" -H "x-auth-token: your_jwt_token" -d '{"title":"New Task", "description":"Task description", "dueDate":"2024-05-30 12:00"}' http://localhost:5000/api/tasks
    ```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

