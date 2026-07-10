# ledgerGuard-Infotact
LedgerGuard is a multi-tenant ledger management system where companies can register, manage employees, and securely track financial transactions. The backend is built with Node.js, Express, MongoDB, JWT Authentication, and follows a layered architecture.


## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- cookie-parser
- cors


### Day 1
#### Completed
- Initialized Express application
- Configured MongoDB connection using Mongoose
- Added environment configuration with dotenv
- Organized backend folder structure
- Configured Git and created backend branch
- Pushed initial backend setup to GitHub
#### Learned
- Async server startup
- Environment variable management
- Project initialization workflow
#### Next Goal
- Design Company schema
- Design User schema
- Implement JWT authentication



## Day 2
### Completed
- Company schema
- User schema
- Password hashing using bcrypt
- Company registration API
- User registration API
- ObjectId validation
- Company existence validation
- Duplicate user/company checks
### Tested
- Company registration
- User registration
- Invalid companyId
- Duplicate email
- Duplicate company
### Next Goal
- Login API
- JWT authentication
- Authentication middleware



## Day 3
### Completed
- Implemented JWT token generation
- User Login API
- User Logout API
- Protected Get Me API
- Authentication middleware
- Cookie-based authentication using cookie-parser
- Configured CORS for frontend integration
- Added JWT Secret, Token Expiry, and Client URL environment variables
- Refactored token generation into a reusable utility
- Improved authentication error handling
### Tested
- User login
- User logout
- Protected Get Me route
- Invalid credentials
- Invalid/expired JWT token
- Unauthorized access without token
### Next Goal
- Request validation using Express Validator
- Role-based authorization (Admin/Employee)
- Ledger and Transaction schema design
- CRUD APIs for Ledger module



## Day 4
### Completed
- Added request validation using express-validator
- Created reusable validation middleware
- Added user registration validation
- Added user login validation
- Added company registration validation
- Implemented role-based authorization middleware
- Improved duplicate company check using company name and email
- Centralized CLIENT_URL using config
- Refactored routes to use validation middleware
- Improved API response consistency
- Cleaned up authentication flow
### Tested
- User registration validation
- User login validation
- Company registration validation
- Invalid request handling
- Duplicate company name
- Duplicate company email
- Authorization middleware
### Learned
- Request validation with express-validator
- Building reusable middleware
- Role-based authorization
- Validation pipeline in Express
- Cleaner backend architecture
### Next Goal
- Design Transaction schema
- Build Transaction CRUD APIs
- Implement role-based access for transactions
- Add filtering and pagination