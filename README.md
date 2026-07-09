# ledgerGuard-Infotact

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