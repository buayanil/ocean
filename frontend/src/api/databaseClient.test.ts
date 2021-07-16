import { DatabaseValidation } from "./databaseClient";

describe("DatabaseValidation", () => {
  const fixture = {
    id: 1,
    name: "foo",
    engine: "P",
    createdAt: 1626424141926,
  };

  describe("databaseSchema", () => {
    test("validates the correct date", async () => {
      const actual = await DatabaseValidation.getDatabaseSchema.isValid(
        fixture
      );
      expect(actual).toBeTruthy();
    });
  });

  describe("getAllDatabasesSchema", () => {
    test("validates the correct date", async () => {
      const actual = await DatabaseValidation.getAllDatabasesSchema.isValid([
        fixture,
      ]);
      expect(actual).toBeTruthy();
    });
  });

  describe("createDatabaseSchema", () => {
    test("validates the correct date", async () => {
      const actual = await DatabaseValidation.createDatabaseSchema.isValid(
        fixture
      );
      expect(actual).toBeTruthy();
    });
  });
});
