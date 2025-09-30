# ReviewBoard

A modern content review and management platform built with Next.js 15, TypeScript, and Tailwind CSS. This project demonstrates full-stack web development capabilities with authentication, risk assessment, and audit logging.

## 🚀 Features

### 🔐 Authentication
- NextAuth.js for Auth
- Google and GitHub OAuth integration
- JWT-based session management
- Secure and seamless user experience

### 📋 Content Management
- CRUD operations for support tickets
- Advanced filtering and search capabilities
- Real-time status updates for admins

### 🎯 Risk Assessment System
- Rule-based automatic risk scoring
- Customizable evaluation rules
- Transparent calculation methodology

### 📜 Audit Trail
- Comprehensive audit logs
- Full change history tracking
- Timestamped transactions

### 🎨 User Experience
- Dark/Light theme support
- Responsive design
- Intuitive, modern interface

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - App Router, SSR + CSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Responsive UI
- **shadcn/ui** - Accessible components
- **Radix UI** - Headless components
- **Lucide React** - Icons

### Backend & Database
- **Next.js API Routes** - RESTful endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL (Neon)** - Cloud, scalable database
- **NextAuth.js** - OAuth 2.0 authentication

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Prisma Migrate** - Database migrations

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard layout
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── tickets/       # Ticket management
│   │   └── audits/        # Audit logging
│   ├── auth/              # Authentication pages
│   ├── ticket/            # Ticket pages
│   ├── audits/            # Audit pages
│   ├── rules/             # Risk rules page
│   └── about/             # About page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── data-table.tsx    # Data table component
│   └── header.tsx        # Navigation header
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── user-context.tsx  # User state management
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tikh1/ReviewBoard
   cd reviewboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/reviewboard"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   or
   npm run build
   npm start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Risk Assessment Rules

The system automatically calculates risk scores based on:

### Base Scoring
- Fee 1,000-2,999: +10 points
- Fee 3,000-4,999: +25 points  
- Fee 5,000+: +50 points

### Tag Adjustments
- "Bug Report" or "Billing" tags: +20 points

### Risk Categories
- **Low**: Score < 25
- **Mid**: Score 25-49
- **High**: Score ≥ 50

## 🔧 API Endpoints

### Tickets
- `GET /api/tickets` - List tickets with filtering
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/[id]` - Get ticket details
- `PATCH /api/tickets/[id]` - Update ticket

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### Audits
- `GET /api/audits` - Get audit logs (admin only)

## 🎨 Theming

The application supports both light and dark themes with:
- CSS custom properties for consistent theming
- Tailwind CSS utilities
- Smooth theme transitions
- System preference detection

## 🔒 Security Features

- OAuth 2.0 authentication
- JWT-based sessions
- CSRF protection
- SQL injection prevention via Prisma
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

[Github: tikh1](https://github.com/tikh1)

Developed as a case study to showcase modern full-stack web development capabilities.