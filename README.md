# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
EXPENSE-TRACKER using REACT

# OVERVIEW:
The Expense Tracker is a React-based web application designed to help users efficiently manage, categorize, and visualize their daily financial transactions.
It allows users to register, log in securely, and maintain personalized expense data in the browser. Users can add, delete, and categorize transactions, monitor their balance, and analyze financial trends through interactive charts.
# FEATURES:
-	Users login, Registeration authentication.
-	Add income and expense transactions with category.
-	Delete existing transactions.
-	Dynamic balance and summary display.
-	Line charts for monthly income/expense trends.
-	Pie charts for category wise spendings.
-	Real time data update via React state.
-	Clean and responsive UI.
# TECH-STACK:
-	Frontend-framework: React.js
-	Routing: React Router DOM
-	Charts: Recharts
-	Animation: CountUp.js
-	Styling: CSS
-	Language: JavaScript
# PROJECT STRUCTURE:
Expense-tracker
-	Public/
o	Index.html
-	Src/
o	Components/
	Navbar.jsx
	Balance.jsx
	IncomeExpenses.jsx
	AddTransaction.jsx
	Transaction.jsx
	TransactionList.jsx
	Charts.jsx

o	Pages/
	Home.jsx
	AddExpenses.jsx
	History.jsx
	Login.jsx
	Register.jsx
o	App.jsx
o	Acc.css
o	Main.jsx
# PROJECT OVERVIEW:
App.jsx:
-	Root component managing global state(transactions).
-	Handles adding and deleting transactions.
-	Defines routes for Home, Add Expenses, Log In, Register, and History pages.
Navbar.jsx
-	Provides navigation across pages.
-	Contains links of Home/ Add Expenses/ History.
Home.jsx:
-	Displays user balance, income / expense summary, and charts.
AddTransaction.jsx:
-	Form allowing users to input new transaction details (text, amount, and category).
Transaction.jsx:
-	Displays individual transaction items with delete option.
TransactionList.jsx:
-	Lists all transactions dynamically from state.
IncomeExpenses.jsx:
-	Calculate total income and total expense separately.
Balance.jsx:
-	Displays overall balance using CountUp animation.
Charts.jsx:
-	Renders two Recharts visualizations:
o	Line Chart: Monthly income / expenses.
o	Pie Chart: Expenses by category.
Login.jsx:
-	Allows users to log in using their registered email and password.
-	Validates the user with credentials from local storage.
Register.jsx:
-	Allows new users to create account using email and password.
-	Validates the input format and empty fields.
-	Redirects to Log In page after successful registration.
# FUTURE ENHANCEMENTS:
-	Add backend for real user authentication and database.
-	Enable CSV export for financial reports.
-	Include budget alerts.
