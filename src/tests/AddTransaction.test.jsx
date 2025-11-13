import { render, screen } from "@testing-library/react";
import AddTransaction from "../components/AddTransaction";

test("renders add transaction form", () => {
  render(<AddTransaction />);
  expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
});
