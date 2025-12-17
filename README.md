# Smart Locker Server (Node.js + Express + SQLite)

## Quick Start (Windows)

### First Time Setup
1. Install the app via `SmartLocker Setup 0.1.1.exe`
2. Run `setup.bat` (in installation folder) to initialize database
3. Launch SmartLocker app

### Build Desktop App (.exe)
```bash
npm run build:win
```
Installer will be in `dist/SmartLocker Setup 0.1.1.exe`

---

## Manual Dev Setup
1. Install Node.js 18+.
2. Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./smartlocker.db"
PORT=4000
JWT_SECRET="your-secret-key"
BCRYPT_ROUNDS=10
```

3. Install deps:
```bash
npm install
```

4. Initialize database (creates tables + default admin):
```bash
npm run setup-db
```

5. Run dev:
```bash
npm run dev
```

6. Admin page:
- Open http://localhost:4000/admin.html
- Login with username or employee code + password (default: `admin` / `admin@123`)
- Admin/manager roles access management sections

## APIs

### Authentication
- **POST** `/api/auth/signup`  
  Body: `{ name, username?, password, userCode, role, pin? }`  
  Creates new user (can be called by admin/manager via form, or public)

- **POST** `/api/auth/login`  
  Body: `{ username?, userCode?, password }`  
  Login with username OR userCode + password. Returns token.

- **POST** `/api/auth/login-pin`  
  Body: `{ pin, username?, userCode? }`  
  PIN-only login (requires PIN set on account)

### User Management (Admin/Manager)
- **GET** `/api/users`  
  List all users

- **GET** `/api/users/:id`  
  Get user by ID

- **PUT** `/api/users/:id`  
  Update user (name, username, role, pin)

- **DELETE** `/api/users/:id`  
  Delete user (admin only)

### Products (Admin/Manager)
- **GET** `/api/products`  
  List all products

- **POST** `/api/products`  
  Create product  
  Body: `{ productName, productCode, location, quantity, description?, imageName? }`

- **PUT** `/api/products/:id`  
  Update product fields

- **DELETE** `/api/products/:id`  
  Delete product (admin only)

### Images (Admin/Manager)
- **POST** `/api/images`  
  Upload image  
  FormData: `file` (multipart), `productId?` (optional)

- **GET** `/api/images/:productId`  
  List images for product

- **DELETE** `/api/images/:id`  
  Delete image (admin/manager)

### History/Movement (All Authenticated Users)
- **GET** `/api/history/my`  
  User's own movement history  
  Query: `?from=ISO&to=ISO&limit=100`

- **GET** `/api/history/all`  
  All movements (admin/manager only)  
  Query: `?from=ISO&to=ISO&limit=100`

- **POST** `/api/history`  
  Record movement  
  Body: `{ userCode, productName, productCode, location, quantity }`

---

## Security & Features
- Passwords: bcrypt hash (10 rounds)
- JWT: 8-hour expiration
- Lockout: 5 failed login attempts → 5 min lockout
- Database: SQLite (in-memory with file persistence)
- Upload: Max 5MB per image
