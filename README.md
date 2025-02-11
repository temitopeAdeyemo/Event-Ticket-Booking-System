# Event Ticket Booking System

This application is a **Node.js-based service** designed for **event ticket booking** with  **token-based authentication** . It allows users to  **register, log in, and manage event tickets** , including  **creating, listing, and purchasing tickets** . The system ensures **secure and efficient traffic handling** with a built-in **rate limiter** to prevent  **denial-of-service (DoS) attacks** .Table of Contents

* [Getting Started]()
* [Installation]()
* [Usage]()
* [Docker](.)
* [Unit Test]()
* [Rate Limiting]()
* [Concurrency Handling]()
* [Error Handling]()

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

* Node.js
* npm
* Docker
* Docker Compose
* Redis
* relics for log (Not mandatory, Remove import from app.ts/js and remove newrelic.js if you do not have relic cred.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/temitopeAdeyemo/Event-Ticket-Booking-System.git
   cd event-ticket-booking-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application in development mode: (Configure the `.env` variables from the `.env-xample`)

```bash
  yarn start:dev
```

## Docker

The application is containerized using Docker. To run the application in a Docker container:

1. Ensure Docker is running on your machine.
2. Rename the .env-xample file to .env without editing the file content.
3. Navigate to the Docker directory:
   ```bash
   cd docker
   ```
4. Run the following command to build and start the containers:
   ```bash
   docker compose up
   ```

## Unit Test

The application is unit tested with Jest. Tests can be run using the following command. Ensure Redis is running locally if needed. (This requires that all .env variables are set.)

```bash
npm run test 
```

NOTE: You can run the test using `docker compose up`. Except that after the test runs successfuly, the server starts which is fine.

## Rate Limiting

The application includes a **rate limiter** to control traffic and protect against denial-of-service (DoS) attacks. It also controls access to critical endpoints (`/book`, `/cancel`) to prevent race conditions. The rate limiter ensures fair usage by controlling traffic based on endpoint sensitivity.

## Concurrency Handling

The application uses transaction and locking to control concurrency handling. This is done on booking amd cancelling of events, preventing users from double booking of tickets.

## Design Choices

#### 1. **Monolithic Architecture (Factory Pattern)**

* The application is **structured for future scalability** and can be refactored into a microservices setup.
* Uses **Docker and Redis** for distributed processing and caching and rate limiting control

#### 2. **Concurrency and Safety**

* Implements **atomic operations and locking mechanisms** to prevent double-booking of tickets.
* Uses **Redis-based locks ( rate limiting)** to maintain database consistency, controlling the number of booking and cancellation a user can make in a sec.

### 3. **Rate Limiting for Fairness**

* Rate limiter **prevents abuse** of API endpoints.
* Different rate limits are applied based on user token or endpoint accessed .

### 4. **Logging**

* The application uses **Winston** for logging and saves logs to the file system.
* Logs are organized  **by date** , with each day's logs stored in a separate folder.
* Each user's logs are saved in a  **directory named after their email** .
* General system logs are stored in a dedicated **"General Logs"** directory.
* The application also uses **Relic** to store and monitor logs in the cloud.

### 5. **Error Handling for Resilience**

* The applicationUses middleware to catch  **uncaught exceptions and rejected promises** .

### 6. **Scalability and Maintainability**

* The project is designed to **handle high traffic** and can be easily extended.
* Uses **modular and structured coding principles** for maintainability.

# API DOCUMENTATION

##### Click [HERE](https://documenter.getpostman.com/view/26421274/2sAYX9oLyf) for the API docs
