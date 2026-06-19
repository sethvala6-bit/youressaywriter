# Your Essay Writer

A complete, production-ready academic writing service platform.

## 🚀 Features

- **Complete Ordering System**: From order creation to delivery
- **Stripe Payment Integration**: Secure payment processing
- **User Authentication**: Sign up, sign in, password recovery
- **Customer Dashboard**: Order management and tracking
- **Writer Dashboard**: Order bidding and essay submission
- **Admin Panel**: Full platform management
- **Real-time Tracking**: Order status updates
- **Review System**: Customer reviews and ratings
- **Revision Policy**: 14-day free revision window
- **Live Chat Support**: Tawk.to integration
- **Analytics**: GA4, Facebook Pixel, Microsoft Clarity

## 📋 Tech Stack

- **Frontend**: React 18 + Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Payment**: Stripe
- **File Storage**: AWS S3 / Cloudflare R2
- **Email**: Resend
- **Real-time**: Socket.io

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account
- AWS S3 bucket (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/sethvala6-bit/youressaywriter.git
cd youressaywriter

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Setup database
npm run prisma:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utilities and helpers
├── styles/           # Global styles
└── types/            # TypeScript types
```

## 📄 License

MIT
