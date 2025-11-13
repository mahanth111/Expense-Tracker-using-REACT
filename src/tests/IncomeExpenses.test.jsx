import { render, screen } from "@testing-library/react";
import IncomeExpenses from "../components/IncomeExpenses";

test("renders income and expense labels", () => {
  render(<IncomeExpenses income={200} expense={100} />);
  expect(screen.getByText(/Income/i)).toBeInTheDocument();
  expect(screen.getByText(/Expense/i)).toBeInTheDocument();
});
