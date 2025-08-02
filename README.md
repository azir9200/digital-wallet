# 💸 Digital Wallet API

A secure and role-based digital wallet backend system inspired by mobile wallet platforms like bKash or Nagad. Built with Express.js, TypeScript, and MongoDB, the system supports three distinct user roles: Admin, User, and Agent.

---

## 🎯 Project Overview

This API enables users to register, manage wallets, and perform financial transactions like adding money, withdrawing, and sending funds. It emphasizes security, modularity, and real-world transactional consistency.

---

## 🔑 Roles & Capabilities

User: User can Add money, Withdraw,send money,
Agent: Agent can Cash-in, cash-out for users, view commission history,
Admin: Admin will be able to View all users/agents/wallets/transactions, block/unblock wallets, approve/suspend agents.

## ✅ Features

- 🔐 JWT Authentication with password hashing
- 🎭 Role-based Authorization Middleware
- 🏦 Wallet auto-creation during registration
- 🔁 Fully trackable Transaction System
- 💸 Cash-in/Cash-out support via Agents
- 🧱 Modular Project Structure
- 🧪 Postman-tested API Endpoints
- 📄 Clean and professional README
- 🎥 Video walkthrough (submission requirement)

## 📦 Project Structure

src/app
├── modules/
│ ├── auth/ # Register, Login
│ ├── user/ # Interface, model, service, controller and routes
│ ├── wallet/ # Wallet creation & operations
│ └── transaction/ # Transaction records & validation
├── middlewares/ # Auth, Error, Validation, RBAC
├── config/ # DB, app configs
├── utils/ # QueryBuilder, helper functions
├── constants/ # Enum and static values
├── app.ts # Express app setup
└── server.ts # App entry point

## API Endpoints Summary

## User Routes

POST /user/register  
GET /user/all-users  
GET /user/all-agents  
GET /user/:id  
PATCH /user/action/:id  
PATCH /user/agents/:id  
PATCH /user/:id  
DELETE /user/:id

## Auth Routes

POST /auth/login  
POST /auth/refresh-token  
POST /auth/logout

## Wallet Routes

GET /wallets/  
GET /wallets/getMe  
PATCH /wallets/:id  
DELETE /wallets/

## Transaction Routes

POST /transactions/transfer  
POST /transactions/addMoney  
POST /transactions/withdraw  
POST /transactions/cashOut  
GET /transactions/  
POST /transactions/cash-out  
GET /transactions/my/:id  
PATCH /transactions/admin/wallets/block/:id  
DELETE /transactions/:id

More detailed routes are documented link below in the Postman collection.

## ⚙️ Setup Instructions

# Clone the repo

git clone https://github.com/your-username/digital-wallet-api.git  
cd digital-wallet-api

# Install dependencies

npm install

# Configure .env

PORT=5000  
DATABASE_URL=mongodb://localhost:27017/digital-wallet  
JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN=1d

🔗 Links
Video Link : https://youtu.be/1UhuyhLqAfc
Github Link: https://github.com/azir9200/digital-wallet
Deploy Link:
postman-testing Link: https://universal-shuttle-584590.postman.co/workspace/My-Workspace~34727b33-1c05-4c7c-8c6f-5d7be558cbea/collection/30664357-4bf42d6a-ebc6-4e63-bdd6-436732069927?action=share&creator=30664357

```

```
