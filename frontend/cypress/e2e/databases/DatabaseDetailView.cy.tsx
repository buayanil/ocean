describe("DatabaseDetailView Test", () => {
    const loginApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/auth/signin"; // Login endpoint
    const userApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/user"; // User data endpoint
    const databasesApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/databases"; // Get databases endpoint
    const databasesRolesApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/databases/1/roles";
    const invitationsApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/databases/1/invitations";
    const usersApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/users";
    const database1ApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/databases/1";
    const checkRolesAvailabilityApiUrl = "http://databases.f4.htw-berlin.de:9000/v1/roles/_availability_";
    const rolesApiUrl ="http://databases.f4.htw-berlin.de:9000/v1/roles"

    beforeEach(() => {
        // Intercept login API call
        // @ts-ignore
        cy.intercept("POST", loginApiUrl, {
            statusCode: 200,
            body: {
                token: "mocked-jwt-token",
                user: { id: 1, name: "Test User", email: "testuser@example.com" },
            },
        }).as("signinRequest");

        // Intercept user API call
        // @ts-ignore
        cy.intercept("GET", userApiUrl, {
            statusCode: 200,
            body: {
                id: 1,
                username: "TestUser",
                firstName: "Test",
                lastName: "User",
                mail: "testuser@example.com",
                employeeType: "Admin",
            },
        }).as("getUser");

        // @ts-ignore
        cy.intercept("GET", databasesApiUrl, {
            statusCode: 200,
            body: [
                { id: 1, name: "Test Database 1", engine: "P", createdAt: 1737991327596, userId: 1 },
                { id: 2, name: "Test Database 2", engine: "M", createdAt: 1737905926459, userId: 2},
            ],
        }).as("getDatabases");

        // @ts-ignore
        cy.intercept("GET", database1ApiUrl, {
            statusCode: 200,
            body: {
                id: 1,
                userId: 1,
                name: "Test Database 1",
                engine: "P",
                createdAt: 1737991327596
            },
        }).as("getDatabase1");

        // Mock roles
        // @ts-ignore
        cy.intercept("GET", databasesRolesApiUrl, {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    username: "TestUser",
                    firstName: "Test",
                    lastName: "User",
                    mail: "testuser@example.com",
                    employeeType: "Admin",
                },
                {
                    id: 2,
                    username: "TestUser",
                    firstName: "Test",
                    lastName: "User",
                    mail: "testuser@example.com",
                    employeeType: "Student",
                },
            ],
        }).as("getRoles");

        // Mock invitations
        // @ts-ignore
        cy.intercept("GET", invitationsApiUrl, {
            statusCode: 200,
            body: [{ id: 1, userId: 2 }],
        }).as("getInvitations");

        // Mock users
        // @ts-ignore
        cy.intercept("GET", usersApiUrl, {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    username: "TestUser",
                    firstName: "Test",
                    lastName: "User",
                    mail: "testuser@example.com",
                    employeeType: "Admin",
                },
                {
                    id: 2,
                    username: "OtherUser",
                    firstName: "Other",
                    lastName: "User",
                    mail: "otheruser@example.com",
                    employeeType: "Admin",
                },
            ],
        }).as("getUsers");

        // @ts-ignore
        cy.intercept("DELETE", database1ApiUrl, {
            statusCode: 200,
        }).as("deleteDatabase1");

        // Intercept availability check API call
        // @ts-ignore
        cy.intercept("POST", checkRolesAvailabilityApiUrl, (req) => {
            req.reply({
                statusCode: 200,
                body: { availability: true },
            });
        }).as("checkAvailability");

        // Intercept availability check API call
        // @ts-ignore
        cy.intercept("POST", rolesApiUrl, (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    "instanceId": 0,
                    "roleName": "new_role"
                },
            });
        }).as("createRole");
    });

    it("shows DatabaseList when databases exist", () => {
        // Visit the login page
        cy.visit("http://localhost:5173/login");

        // Log in with valid credentials
        cy.get('input[name="username"]').type("testuser");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
        cy.get('a[href="/databases/"]').click();

        cy.wait("@getDatabases");

        // Click on the first database
        cy.contains('p', 'Test Database 1').click();

        // Verify navigation to the database details page
        cy.url().should("include", "/databases/1");
        // Wait for the API calls to complete
        cy.wait("@getRoles");
        cy.wait("@getInvitations");
        cy.wait("@getUsers");

        // Verify the database details are displayed
        cy.contains("Test Database 1").should("exist");
        cy.contains("PostgreSQL").should("exist");

        // Verify the tabs
        cy.contains("Overview").should("exist");
        cy.contains("Users").should("exist");
        cy.contains("Invitations").should("exist");

        // Switch to Users tab
        cy.contains("Users").click();
        cy.contains("Add new user").should("exist");

        // Switch to Invitations tab
        cy.contains("Invitations").click();
        cy.contains("Invite other people").should("exist");

        // Switch back to Overview tab
        cy.get('div.whitespace-nowrap.cursor-pointer').contains('Overview').click();
        cy.contains("Test Database").should("exist");

        // Open delete modal
        cy.contains('button', 'Actions').click();

        cy.contains("Delete").click();

        // Confirm delete
        cy.contains('button', 'Delete').click();

        // Verify the delete request
        cy.wait("@deleteDatabase1").its("response.statusCode").should("eq", 200);

        // Verify redirection
        cy.url().should("include", "/databases");

        cy.contains('p', 'Test Database 1').click();

        // Switch to Users tab
        cy.contains("Users").click();

        // Add a new user role
        cy.contains("Add new user").click();
        cy.get('input[name="roleName"]').type("new_role"); // Replace with actual input name
        cy.wait(1000)
        cy.get('button.bg-indigo-600').contains('Create').click();

        // Verify the role creation request
        cy.wait("@createRole").its("response.statusCode").should("eq", 200);

    });
});
