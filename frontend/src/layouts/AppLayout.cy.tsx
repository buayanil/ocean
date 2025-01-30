import React from "react";
import { mount } from "cypress/react";
import AppLayout, { AppLayoutProps } from "./AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import {navigation, SettingsNavigation} from "../constants/menu.";

const queryClient = new QueryClient();
const mockUser = { firstName: "John", lastName: "Doe", employeeType: "Staff" }; // Mock user with "Staff" permission

describe("AppLayout Tests", () => {
  const defaultProps: AppLayoutProps = {
    children: <div>Test Content</div>,
    selectedNavigation: "Overview",
  };

  beforeEach(() => {
    cy.intercept("GET", "/v1/user", { body: mockUser }).as("getUser");

    mount(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AppLayout {...defaultProps} />
            </Router>
          </QueryClientProvider>
        </Provider>
    );
  });

  it("renders all navigation items for users with permissions", () => {
    cy.wait("@getUser");
    navigation.forEach((item) => {
      if (item.requiredPermission === undefined || item.requiredPermission === mockUser.employeeType) {
        cy.contains(item.name).should("exist");
      } else {
        cy.contains(item.name).should("not.exist");
      }
    });
  });

  it("renders static sidebar on larger screens", () => {
    cy.viewport(1280, 800); // Desktop resolution
    cy.get("nav[aria-label='Sidebar']").should("exist");
    cy.get("button[aria-label='Open sidebar']").should("not.exist");
  });

  it("renders children content", () => {
    cy.contains("Test Content").should("exist");
  });

  it("handles profile dropdown actions", () => {
    // Open the profile dropdown
    cy.get("button").contains("Open user menu").click(); // Adjust the button text or accessibility label if needed

    // Verify the Settings link
    cy.contains("Settings")
        .should("exist") // Confirm the link is present
        .and("have.attr", "href", SettingsNavigation.to); // Verify the correct path

    // Click the Settings link and ensure navigation
    cy.contains("Settings").click({ force: true });
    cy.url().should("include", SettingsNavigation.to);
    cy.get("button").contains("Open user menu").click();

    // Verify the Logout button
    cy.contains("Logout")
        .should("exist") // Confirm the button is present
        .click(); // Trigger the logout action
  });
});
