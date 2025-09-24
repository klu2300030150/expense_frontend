# Expense Tracker Frontend

A modern expense tracker frontend built with Next.js, TypeScript, and shadcn/ui components.

## Features

- 📊 **Dashboard Overview**: Get a comprehensive view of your expenses and budgets
- 💰 **Expense Management**: Add, edit, and delete expenses with categories
- 📈 **Budget Tracking**: Set and monitor budgets for different categories
- 📊 **Insights & Analytics**: Visualize spending patterns and trends
- 🎨 **Modern UI**: Clean and responsive design with dark/light mode
- 🔌 **API Integration**: Ready to connect with Spring Boot backend

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/klu2300030150/expense_frontend.git
cd expense_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your API configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

This frontend is designed to work with a Spring Boot backend. The API configuration is in:

- `lib/api.ts` - API service layer with all endpoints
- `hooks/use-api.ts` - React hooks for data fetching and mutations
- `next.config.mjs` - API proxy configuration

### Available API Endpoints

- **Expenses**
  - `GET /api/expenses` - Get all expenses
  - `POST /api/expenses` - Create new expense
  - `PUT /api/expenses/{id}` - Update expense
  - `DELETE /api/expenses/{id}` - Delete expense

- **Budgets**
  - `GET /api/budgets` - Get all budgets
  - `POST /api/budgets` - Create new budget
  - `PUT /api/budgets/{id}` - Update budget
  - `DELETE /api/budgets/{id}` - Delete budget

- **Analytics**
  - `GET /api/analytics/spending-by-category` - Get spending by category
  - `GET /api/analytics/monthly-trends` - Get monthly trends
  - `GET /api/analytics/budget-comparison` - Get budget comparison

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Main dashboard
│   ├── expense-form.tsx  # Expense form
│   ├── expense-list.tsx  # Expense list
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-api.ts       # API hooks
│   └── ...
├── lib/                  # Utility libraries
│   ├── api.ts           # API service layer
│   └── utils.ts         # Helper utilities
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.