# Nest JSON

This is a Application Programmed Interface (API) built in **TypeScript**, **NestJS**, and **PostgreSQL**.

## Features

- **Documention page**: Can be seen in the browser at `http://<host>:<port>/api-doc`.

## Installation

1. **Environment Setup**:

   - Rename `.env.example` to `.env`, and configure it with your database connection details and JWT secret.

   Example `.env` content:

   ```bash
   PORT=6754
   DATABASE_URL=postgresql://admin:qwerty@postgres:5432/nest_json?schema=public
   SECRET=my-secret
   ```

2. **Install Ndoe and Dependencies**:

   - Install the dependencies listed in `package.json`:
     ```bash
     $ npm install
     ```

3. **Hot Reloading** (optional but recommended):

   - For hot reloading use this command:
     ```bash
     $ npm run start:dev
     ```

4. **Process Migration**:

   - To process migrations use this command:
     ```bash
     $ npx prisma generate
     then
     $ npx prisma db push
     ```

5. **Build the Application**:
   - Once the dependencies are installed, build the app:
     ```bash
     $ npm run build
     ```

## Running the App

There are several commands to run the application on production:

1. **Run on Production**:

   - Use this command to watch for changes in your CSS:
     ```bash
     $ npm run start:migrate:prod
     ```

## Development Tools

- **NestJS**: For building the backend.
- **PostgreSQL**: For storing data.
- **Prisma ORM**: For database migrations and connection.
- **Docker**: For running containers.

## Deployment using Docker (Optional)

You can also deploy this application using Docker. Here’s how you can build and run the app in containers:

### Build the Docker Image

```bash
$ docker-compose build
```

### Run the Container

```bash
$ docker-compose up
```

To run the container in the background:

```bash
$ docker-compose up -d
```

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.
