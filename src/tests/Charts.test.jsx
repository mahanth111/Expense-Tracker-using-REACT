import { render } from "@testing-library/react";
import Charts from "../components/Charts";

test("renders charts component without crashing", () => {
  render(<Charts data={[]} />);
});
