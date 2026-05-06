# Notification System Frontend

This is a modern web application built with **Next.js** that serves as the user interface for the Notification System.

## Project Overview

The Notification System allows users to:
- Submit notification messages.
- Categorize messages (Finance, Sports, Movies).
- View delivery logs and history.
- Manage user subscriptions (SMS, Email, Push).

---

## Prerequisites

Before running the frontend, ensure you have:
- **Node.js** (LTS version recommended)
- **The Backend Application** running at `http://localhost:8080`

---

## Getting Started

### 1. Setup the Backend

Ensure the backend system is running. Follow the instructions in the [Backend README](../notification-system/README.md).

Quick summary:
```bash
# In the notification-system directory
docker-compose up -d
./mvnw spring-boot:run
```

### 2. Setup the Frontend

In the `notification-frontend` directory, install the dependencies and start the development server:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)

---

## Environment Variables

If you need to point to a different backend URL, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## Learn More

To learn more about Next.js, take a look at the [Next.js Documentation](https://nextjs.org/docs).
