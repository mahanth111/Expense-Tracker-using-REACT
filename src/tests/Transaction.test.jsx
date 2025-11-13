import { render, screen } from "@testing-library/react";
import Transaction from "../components/Transaction";

test("displays transaction text", () => {
  const transaction = { id: 1, text: "Groceries", amount: -50 };
  render(<Transaction transaction={transaction} onDelete={() => {}} />);
  expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
});
