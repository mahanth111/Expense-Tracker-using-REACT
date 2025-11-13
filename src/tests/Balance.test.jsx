import { render, screen } from "@testing-library/react";
import Balance from "../components/Balance";

test("renders balance text", () => {
  render(<Balance total={500} />);
  expect(screen.getByText(/Balance/i)).toBeInTheDocument();
});
