import request from "supertest";
import { httpServer } from "../server";

describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("GET / ", () => {
  test("It should respond with an array of users", async () => {
    const response = await request(httpServer).get("/users");
    expect(response.body).toEqual(["Elie", "Matt", "Joel", "Michael"]);
    expect(response.statusCode).toBe(200);
  });
});

export {};
