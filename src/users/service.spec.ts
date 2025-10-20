import mongoose from "mongoose";
import { User } from "./user";
import { checkIfUserExists, increaseClassesToRecover, decreaseClassesToRecover } from "./service";
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

describe("increaseClassesToRecover", () => {
  let testUser: InstanceType<typeof User>;

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
  it("should increase classes_to_recover by 1 when user exists and has existing classes", async () => {
    // Set initial classes_to_recover to 3
    testUser.classes_to_recover = 3;
    await testUser.save();

    const result = await increaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.classes_to_recover).toBe(4);
    
    // Verify the change was persisted in the database
    const updatedUser = await User.findOne({ email: "test@test.com" });
    expect(updatedUser?.classes_to_recover).toBe(4);
  });

  it("should set classes_to_recover to 1 when user exists but classes_to_recover is null/undefined", async () => {
    const result = await increaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.classes_to_recover).toBe(1);
    
    // Verify the change was persisted in the database
    const updatedUser = await User.findOne({ email: "test@test.com" });
    expect(updatedUser?.classes_to_recover).toBe(1);
  });

  it("should throw error when user does not exist", async () => {
    await expect(increaseClassesToRecover("nonexistent@test.com")).rejects.toThrow("User not found");
  });

  it("should return the updated user object", async () => {
    const result = await increaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.email).toBe("test@test.com");
    expect(result.name).toBe("Test User");
    expect(result.classes_to_recover).toBe(1);
  });
});

describe("decreaseClassesToRecover", () => {
  let testUser: InstanceType<typeof User>;

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

  it("should decrease classes_to_recover by 1 when user exists and has classes > 0", async () => {
    // Set initial classes_to_recover to 3
    testUser.classes_to_recover = 3;
    await testUser.save();

    const result = await decreaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.classes_to_recover).toBe(2);
    
    // Verify the change was persisted in the database
    const updatedUser = await User.findOne({ email: "test@test.com" });
    expect(updatedUser?.classes_to_recover).toBe(2);
  });

  it("should set classes_to_recover to 0 when user exists but classes_to_recover is 0", async () => {
    // Set initial classes_to_recover to 0
    testUser.classes_to_recover = 0;
    await testUser.save();

    const result = await decreaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.classes_to_recover).toBe(0);
    
    // Verify the change was persisted in the database
    const updatedUser = await User.findOne({ email: "test@test.com" });
    expect(updatedUser?.classes_to_recover).toBe(0);
  });

  it("should set classes_to_recover to 0 when user exists but classes_to_recover is null/undefined", async () => {
    const result = await decreaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.classes_to_recover).toBe(0);
    
    // Verify the change was persisted in the database
    const updatedUser = await User.findOne({ email: "test@test.com" });
    expect(updatedUser?.classes_to_recover).toBe(0);
  });

  it("should throw error when user does not exist", async () => {
    await expect(decreaseClassesToRecover("nonexistent@test.com")).rejects.toThrow("User not found");
  });

  it("should return the updated user object", async () => {
    // Set initial classes_to_recover to 2
    testUser.classes_to_recover = 2;
    await testUser.save();

    const result = await decreaseClassesToRecover("test@test.com");

    expect(result).toBeDefined();
    expect(result.email).toBe("test@test.com");
    expect(result.name).toBe("Test User");
    expect(result.classes_to_recover).toBe(1);
  });
});
