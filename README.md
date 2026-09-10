# Microblogging Platform

A simple full-stack microblogging web app built with React, Spring Boot, and PostgreSQL, fully containerized with Docker.

## Features
- User registration and authentication
- Create, view, and interact with posts
- REST API communicating between React and Spring Boot
- Reverse proxy setup with Nginx so frontend and backend run on a single port

## Tech Stack
- Frontend: React (Vite), Nginx
- Backend: Spring Boot (Java 21), Spring Data JPA
- Database: PostgreSQL 16
- Infrastructure: Docker, Docker Compose, AWS EC2 (Ubuntu)

## Project Structure
- `backend/` - Spring Boot source code and Dockerfile
- `frontend/` - React source code, Nginx config, and Dockerfile
- `docker-compose.yml` - Multi-container setup
- `.env` - Database environment variables (not committed)

## Getting Started Locally

### Prerequisites
- Docker Desktop installed and running
- Git

### 1. Clone the repository
```bash
git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Configure environment variables
Create a `.env` file in the root directory:
```ini
DB_NAME=appdb
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 3. Run the application
```bash
docker compose up --build
```

Once the containers finish building and start up, open your browser at:
`http://localhost`

To stop the containers:
```bash
docker compose down
```

## Deployment
The application is deployed on an AWS EC2 instance running Ubuntu. Docker Compose orchestrates the containers with Nginx serving static assets and proxying `/api` requests to Spring Boot, keeping database ports closed to the public internet.
