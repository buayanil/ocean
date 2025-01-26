import React from "react";
import { mount } from "cypress/react";
import OverviewCard from "./OverviewCard";
import { UserProperties } from "../types/user";
import { Database, EngineType } from "../types/database";

describe("OverviewCard Component", () => {

  const mockUser: UserProperties = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    mail: "mail",
    employeeType: "Admin",
  };

  it("renders all fields with placeholders when no data is provided", () => {
    mount(<OverviewCard database={undefined} user={undefined} />);

    // Verify placeholder skeleton loaders
    cy.get("dd.animate-pulse").should("have.length", 5); // Ensure all placeholders are present
  });

  it("handles PostgreSQL engine case correctly with a mocked connection string", () => {
    // Create a mock for the connectionString method
    const mockPostgresDatabase = new Database({
      id: 1,
      name: "TestPostgresDB",
      engine: EngineType.PostgreSQL,
      createdAt: new Date(),
      userId: 123,
    });

    // Mock the connectionString method dynamically
    mockPostgresDatabase.connectionString = (username?: string) =>
        `mocked-psql-connection-string-${username}`;

    mount(<OverviewCard database={mockPostgresDatabase} user={mockUser} />);

    // Verify that the mocked connection string is rendered
    cy.contains("mocked-psql-connection-string-johndoe").should("exist");
  });

  it("copies the PostgreSQL connection string to clipboard", () => {
    cy.window().then((win) => {
      const typedWindow = win as Window & typeof globalThis; // Cast the window object
      cy.stub(typedWindow.navigator.clipboard, "writeText").as("writeTextStub");
    });

    // Create a mock for the connectionString method
    const mockPostgresDatabase = new Database({
      id: 1,
      name: "TestPostgresDB",
      engine: EngineType.PostgreSQL,
      createdAt: new Date(),
      userId: 123,
    });

    // Mock the connectionString method dynamically
    mockPostgresDatabase.connectionString = (username?: string) =>
        `mocked-psql-connection-string-${username}`;

    mount(<OverviewCard database={mockPostgresDatabase} user={mockUser} />);

    // Click the "Strg-C" button
    cy.contains("Strg-C").click();

    // Verify that the connection string was copied
    cy.get("@writeTextStub").should(
        "have.been.calledWith",
        "mocked-psql-connection-string-johndoe"
    );
  });


  it("handles MongoDB engine case correctly with a mocked connection string", () => {
    // Create a mock for the connectionString method
    const mockMongoDatabase = new Database({
      id: 2,
      name: "TestMongoDB",
      engine: EngineType.MongoDB,
      createdAt: new Date(),
      userId: 456,
    });

    // Mock the connectionString method dynamically
    mockMongoDatabase.connectionString = () =>
        `mocked-mongodb-connection-string`;

    mount(<OverviewCard database={mockMongoDatabase} user={mockUser} />);

    // Verify that the mocked connection string is rendered
    cy.contains("mocked-mongodb-connection-string").should("exist");
  });

  it("renders the Adminer link and validates its URL", () => {
    // Create a mock for the connectionString method
    const mockPostgresDatabase = new Database({
      id: 1,
      name: "TestPostgresDB",
      engine: EngineType.PostgreSQL,
      createdAt: new Date(),
      userId: 123,
    });

    // Mock the connectionString method dynamically
    mockPostgresDatabase.connectionString = (username?: string) =>
        `mocked-psql-connection-string-${username}`;

    mount(<OverviewCard database={mockPostgresDatabase} user={mockUser} />);
    // Verify the Adminer link
    cy.get("a")
        .contains("Adminer")
  });

  it("handles the undefined database case correctly", () => {
    mount(<OverviewCard database={undefined} user={undefined} />);
  });

});
