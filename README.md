
# Event-Ticket-Booking-System

This application is a **Node.js-based service** designed for **event ticket booking** with  **token-based authentication** . It allows users to  **register, log in, and manage event tickets** , including  **creating, listing, and purchasing tickets** . The system ensures **secure and efficient traffic handling** with a built-in **rate limiter** to prevent  **denial-of-service (DoS) attacks** . Additionally, the application is  **containerized using Docker** , enabling  **scalability and seamless deployment** .

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Docker](#docker)
- [Unit Test](#docker)
- [Rate Limiting](#rate-limiting)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v12.x or higher)
- npm (v10.x or higher)
- Docker
- Docker Compose
- Redis
- relics for log (Not mandatory, Remove import from app.ts/js and remove newrelic.js if you do not have relic cred. on db)

### Installation

1. Clone the repository:

   https://github.com/temitopeAdeyemo/Event-Ticket-Booking-System.git
   cd store-manager

   ```

   ```
2. Install dependencies:

   ```bash
   npm i
   ```

## Usage

To start the application in development mode: (Configure the .env variables from the .env-xample)

```bash
  yarn start:dev
```

## Docker

The application is containerized using Docker. To run the application in a Docker container: (Configure the .env variables from the .env-xample)

1. Ensure Docker is running on your machine.
2. Navigate to the Docker directory:

   ```bash
    cd docker
   ```
3. Run the following command to build and start the containers:

   ```bash
   docker-compose up
   ```

## Unit Test

The application is unit tested with jest. Test can be run using. (Connection to redis instance is needed for test to pass.). Run the following commands, leaving the redis local instance opened if you are connected to redis locally.

```bash
npm run test 
```

## Rate Limiting

The application includes a rate limiter to control traffic and protect against denial-of-service (DoS) attacks, also to control access to list of controlled endpoints(/book , /cancel) to avoid racing .The traffic rate is controlled depending on the endpoint, where traffics to endpoints that writes or modify data are more controlled.

These settings help mitigate potential DoS attacks by limiting the number of requests a client can make in a specified time frame.
