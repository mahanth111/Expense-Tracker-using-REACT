import { render, screen } from "@testing-library/react";
import TransactionList from "../components/TransactionList";

test("renders transaction list", () => {
  const transactions = [{ id: 1, text: "Rent", amount: -100 }];
  render(<TransactionList transactions={transactions} onDelete={() => {}} />);
  expect(screen.getByText(/Rent/i)).toBeInTheDocument();
});
