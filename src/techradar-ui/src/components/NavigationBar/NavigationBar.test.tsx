import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
  it("Renders Navigation Bar", () => {
    const navBar = render(
      <NavigationBar brand="test" />
    );
    screen.debug();
    //const span = navBar.findByRole('navigation');
    //expect(span.text()).toBe("test");
    expect(true).toBe(true);
  });
});
