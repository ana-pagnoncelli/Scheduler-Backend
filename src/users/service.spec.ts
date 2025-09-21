import mongoose from "mongoose";
import { User } from "./user";
import { checkIfUserExists } from "./service";
import { userData, userData2 } from "./fixtures";

describe("checkIfUserExists", () => {
  let testUser: mongoose.Document;

  beforeEach(async () => {
    // Clean up any existing data
    await User.deleteMany({});
    
    // Create a test user
    testUser = new User({
      name: "Test User",
      email: "test@test.com",
      password: "hashedPassword",
      age: 25,
      admin: false,
      phone: 1234567890,
      gender: "male",
      plan: "basic",
      classes_to_recover: 0,
      fixed_schedules: [],
      variable_schedules: [],
      canceled_schedules: []
    });
    
    await testUser.save();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  it("should return user when user exists", async () => {
    const result = await checkIfUserExists("test@test.com");

    expect(result).toBeDefined();
    expect(result.email).toBe("test@test.com");
    expect(result.name).toBe("Test User");
  });

  it("should throw error when user does not exist", async () => {
    await expect(checkIfUserExists("nonexistent@test.com")).rejects.toThrow("User not found");
  });
});
