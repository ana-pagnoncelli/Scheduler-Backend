import mongoose from "mongoose";
import { CanceledSchedule, CanceledSchedulesType } from "./model";
import { updateCanceledSchedule } from "./service";
import { userData, userData2 } from "../users/fixtures";

describe("updateCanceledSchedule", () => {
  let testCanceledSchedule: mongoose.Document & CanceledSchedulesType;

  beforeEach(async () => {
    // Clean up any existing data
    await CanceledSchedule.deleteMany({});
    
    // Create a test canceled schedule
    testCanceledSchedule = new CanceledSchedule({
      id: "2023-04-21_19:00",
      day: "2023-04-21",
      hour_of_the_day: "19:00",
      users_list: ["existing@user.com"]
    });
    
    await testCanceledSchedule.save();
  });

  afterEach(async () => {
    // Clean up after each test
    await CanceledSchedule.deleteMany({});
  });

  it("should add a new user to the users_list when user is not already in the list", async () => {
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "new@user.com"
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list).toContain("new@user.com");
    expect(result.users_list.length).toBe(2);
    expect(result.day).toBe("2023-04-21");
    expect(result.hour_of_the_day).toBe("19:00");
    expect(result.id).toBe("2023-04-21_19:00");
  });

  it("should not add a user if they are already in the users_list", async () => {
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "existing@user.com" // This user is already in the list
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list.length).toBe(1); // Should remain unchanged
    expect(result.day).toBe("2023-04-21");
    expect(result.hour_of_the_day).toBe("19:00");
    expect(result.id).toBe("2023-04-21_19:00");
  });

  it("should handle multiple users being added to the same schedule", async () => {
    // First, add one user
    const scheduleInfo1 = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "first@user.com"
    };

    await updateCanceledSchedule(testCanceledSchedule, scheduleInfo1);

    // Then add another user
    const scheduleInfo2 = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "second@user.com"
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo2);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list).toContain("first@user.com");
    expect(result.users_list).toContain("second@user.com");
    expect(result.users_list.length).toBe(3);
  });

  it("should return the updated schedule from the database after adding a user", async () => {
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "database@user.com"
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);

    // Verify the result matches what's in the database
    const dbSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: "19:00",
      day: "2023-04-21"
    });

    expect(result).toBeDefined();
    expect(dbSchedule).toBeDefined();
    expect(result.id).toBe(dbSchedule?.id);
    expect(result.users_list).toEqual(dbSchedule?.users_list);
    expect(result.day).toBe(dbSchedule?.day);
    expect(result.hour_of_the_day).toBe(dbSchedule?.hour_of_the_day);
  });

  it("should handle empty users_list initially", async () => {
    // Create a schedule with empty users_list
    const emptySchedule = new CanceledSchedule({
      id: "2023-04-22_20:00",
      day: "2023-04-22",
      hour_of_the_day: "20:00",
      users_list: []
    });
    
    await emptySchedule.save();

    const scheduleInfo = {
      scheduleHour: "20:00",
      scheduleDay: "2023-04-22",
      userEmail: "first@user.com"
    };

    const result = await updateCanceledSchedule(emptySchedule, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("first@user.com");
    expect(result.users_list.length).toBe(1);
  });

  it("should work with the same user email multiple times without duplication", async () => {
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "duplicate@user.com"
    };

    // Add the same user twice - first call
    await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);
    
    // Get fresh document from database for second call
    const freshDocument = await CanceledSchedule.findOne({
      hour_of_the_day: "19:00",
      day: "2023-04-21"
    }) as mongoose.Document & CanceledSchedulesType;
    
    // Second call with fresh document should not add duplicate
    const result = await updateCanceledSchedule(freshDocument, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list).toContain("duplicate@user.com");
    expect(result.users_list.length).toBe(2); // Should not duplicate
  });

  it("should handle special characters in user email", async () => {
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "user+tag@example.com"
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list).toContain("user+tag@example.com");
    expect(result.users_list.length).toBe(2);
  });

  it("should handle long user email addresses", async () => {
    const longEmail = "very.long.email.address.that.might.test.edge.cases@verylongdomainname.com";
    const scheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: longEmail
    };

    const result = await updateCanceledSchedule(testCanceledSchedule, scheduleInfo);

    expect(result).toBeDefined();
    expect(result.users_list).toContain("existing@user.com");
    expect(result.users_list).toContain(longEmail);
    expect(result.users_list.length).toBe(2);
  });
});
