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



## Features
- Company Registration
- User Authentication (JWT + Cookies)
- Company-based Multi-Tenant Data Isolation
- Role-Based Access Control (Admin/User)
- Transaction CRUD APIs
- Request Validation using Express Validator
- Pagination
- Transaction Filtering (Type & Category)


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



## Day 5

### Completed
- Designed Transaction schema
- Added Transaction model
- Created transaction request validation using express-validator
- Added validation rules for title, amount, type, category, and description
- Structured transaction module for upcoming CRUD implementation

### Tested
- Valid transaction payload
- Missing required fields
- Invalid transaction type
- Invalid amount
- Empty title/category validation

### Learned
- Designing scalable database schemas
- Validating request payloads using express-validator
- Separating schema design from business logic
- Planning backend modules before implementing CRUD APIs

### Next Goal
- Create Transaction API
- Protect Transaction routes using authentication middleware
- Implement Get Transactions API
- Restrict transactions based on companyId



## Day 6

### Completed
- Designed Transaction CRUD module
- Implemented Create Transaction API
- Implemented Get All Transactions API
- Implemented Get Single Transaction API
- Implemented Update Transaction API
- Implemented Delete Transaction API
- Added company-level data isolation for all transaction operations
- Connected Transaction routes with Express application
- Protected Transaction APIs using authentication middleware

### Tested
- Create transaction
- Get all transactions
- Get transaction by ID
- Update transaction
- Delete transaction
- Invalid transaction ID
- Unauthorized access
- Company ownership verification

### Learned
- Building complete RESTful CRUD APIs
- Securing multi-tenant data using company-based authorization
- Updating MongoDB documents safely
- Organizing scalable Express controllers and routes
- Designing backend modules using MVC architecture

### Next Goal
- Implement role-based authorization for Transaction APIs
- Add pagination, filtering, and search
- Populate transaction creator details
- Refactor controller logic for better code reuse



## Day 7
### Completed
- Applied role-based authorization to Transaction APIs
- Restricted create, update, and delete operations to admin users
- Kept read operations accessible to authenticated users
### Tested
- Admin access to Transaction CRUD
- Unauthorized access by non-admin users
- Access control responses
### Learned
- Implementing role-based access control (RBAC)
- Securing REST APIs using authorization middleware
### Next Goal
- Add pagination and filtering to transactions
- Populate transaction creator details
- Refactor transaction controller



## Day 8
### Completed
- Implemented pagination for Transaction listing
- Added transaction filtering by type (income/expense)
- Added transaction filtering by category
- Improved Transaction API response with pagination metadata
- Refactored transaction query logic using dynamic filters
### Tested
- Admin access to Create/Update/Delete APIs
- User access restrictions (403 Forbidden)
- Pagination using `page` and `limit` query parameters
- Filtering transactions by type
- Filtering transactions by category
- Combined filtering with pagination
### Learned
- Role-Based Access Control (RBAC) in Express
- Dynamic MongoDB query building
- Pagination using `skip()` and `limit()`
- Query parameters (`req.query`)
- Building scalable REST APIs
### Next Goal
- Search transactions by title
- Sort transactions by amount/date
- Dashboard analytics APIs (income, expense, balance)
- Multi-tenant database architecture (separate database per company)



## Day 9
### Completed
- Added search functionality for transactions using title
- Implemented Analytics controller
- Created Analytics routes
- Added Total Income API
- Added Total Expense API
- Added Current Balance API
- Protected Analytics APIs using authentication middleware
- Restricted Analytics APIs to admin users
### Tested
- Search transactions by title
- Case-insensitive search
- Total Income calculation
- Total Expense calculation
- Current Balance calculation
- Unauthorized access to analytics endpoints
### Learned
- MongoDB regular expression (`$regex`) queries
- Aggregation of financial data using MongoDB
- Building analytics endpoints
- Structuring separate modules for business insights
- Securing analytics using authentication and RBAC
### Next Goal
- Add date range filters for analytics
- Add monthly/yearly transaction reports
- Implement sorting by amount and date
- Refactor repeated ownership validation into reusable middleware
- Start implementing true multi-tenant architecture (separate database per company)



## Day 10
### Completed
- Added MongoDB indexes for Transaction model
- Optimized transaction queries for filtering and searching
- Implemented category-wise analytics endpoint using MongoDB Aggregation
- Improved backend performance with database indexing
- Enhanced analytics module for dashboard integration
### Tested
- Category analytics endpoint
- Indexed transaction queries
- Analytics response accuracy
### Learned
- MongoDB Indexing
- Aggregation Pipeline (`$match`, `$group`, `$sort`)
- Backend query optimization techniques
### Next Goal
- Monthly analytics API
- Recent transactions API
- Multi-database (database-per-company) architecture
- Dynamic database connection manager



## Day 11
### Completed
- Added `databaseName` field to Company schema
- Generated a unique database name during company registration
- Created a reusable tenant connection manager using `mongoose.createConnection()`
- Implemented connection caching for tenant databases
- Created a dynamic Transaction model for tenant databases
- Migrated Transaction creation to use company-specific databases
- Started the implementation of database-per-company multi-tenancy architecture
### Tested
- Company registration with generated database name
- Dynamic tenant connection creation
- Transaction creation using tenant-specific model
- Verified tenant database selection logic
### Learned
- Multi-tenant architecture using separate databases
- Dynamic Mongoose connections with `createConnection()`
- Model registration per database connection
- Connection caching for better performance
- Designing scalable SaaS backend architecture
### Next Goal
- Migrate remaining Transaction CRUD operations to tenant databases
- Move User model to tenant databases
- Refactor authentication middleware for tenant-aware user lookup
- Complete true database-per-company architecture



## Day 12
### Completed
- Refactored authentication flow to support tenant-specific databases
- Updated login process to authenticate users from their company's database
- Made authentication middleware tenant-aware
- Migrated all Transaction CRUD operations to use tenant-specific database connections
- Updated Analytics Controller to use tenant-specific Transaction models
- Removed cross-database `populate("companyId")` to avoid invalid population across separate MongoDB connections
- Implemented dynamic User and Transaction model loading per tenant connection
- Moved global error-handling middleware to the end of the Express middleware stack
- Improved overall multi-tenant architecture consistency
### Tested
- User registration in tenant database
- User login from tenant database
- Authentication using tenant-specific User model
- Transaction CRUD using isolated company databases
- Analytics endpoints using tenant-specific Transaction collections
- Authorization after tenant authentication
- Error handling after middleware refactoring
### Learned
- Building tenant-aware authentication systems
- Dynamic Mongoose connections using `createConnection()`
- Dynamic model registration with connection-specific models
- Limitations of `populate()` across different MongoDB connections
- Structuring controllers for complete database isolation
- Proper Express middleware ordering
- Designing scalable SaaS multi-tenant architectures
### Next Goal
- Implement Redis distributed locks for idempotent transaction processing
- Add unique request/event IDs to prevent duplicate requests
- Introduce MongoDB ACID transactions using sessions
- Implement automatic rollback for failed financial operations
- Begin Week 2 Idempotent Ledger implementation





## Day 13
### Completed
- Added Redis configuration using ioredis
- Created a reusable Redis client
- Implemented Idempotency middleware using `Idempotency-Key`
- Added distributed locking with Redis (`SET NX EX`)
- Generated unique `eventId` for every transaction using UUID
- Added `eventId` field to Transaction schema
- Implemented MongoDB multi-document transactions using sessions
- Created Audit model for transaction history
- Stored Transaction and Audit Log atomically inside the same MongoDB transaction
- Added Redis caching for Analytics APIs
- Implemented cache invalidation after Create, Update, and Delete transaction operations
- Structured backend for idempotent financial transaction processing
### Tested
- MongoDB transaction commit and rollback
- UUID event generation
- Audit log creation
- Analytics cache logic
- Cache invalidation workflow
> **Note:** Redis server installation and runtime testing are pending.
### Learned
- Redis fundamentals
- Idempotent API design
- Distributed locking using Redis
- UUID-based event tracking
- MongoDB ACID Transactions
- Multi-document transactions
- Audit logging
- Cache-aside pattern
- Cache invalidation strategies
### Next Goal
- Install and configure Redis locally
- Test idempotent transaction retries
- Verify distributed locking under concurrent requests
- Complete tenant isolation testing
- Begin Week 3 Analytics Pipeline