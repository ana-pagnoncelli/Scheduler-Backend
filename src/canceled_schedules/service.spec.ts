import mongoose from "mongoose";
import { CanceledSchedule, CanceledSchedulesType } from "./model";
import { updateCanceledSchedule, addCanceledSchedule } from "./service";
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

describe("addCanceledSchedule", () => {
  beforeEach(async () => {
    // Clean up any existing data before each test
    await CanceledSchedule.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await CanceledSchedule.deleteMany({});
  });

  it("should create a new canceled schedule with correct properties", async () => {
    const scheduleInfo = {
      scheduleHour: "14:30",
      scheduleDay: "2023-05-15",
      userEmail: "test@example.com"
    };

    await addCanceledSchedule(scheduleInfo);

    // Verify the schedule was created in the database
    const createdSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: "14:30",
      day: "2023-05-15"
    });

    expect(createdSchedule).toBeDefined();
    expect(createdSchedule?.id).toBe("2023-05-15_14:30");
    expect(createdSchedule?.day).toBe("2023-05-15");
    expect(createdSchedule?.hour_of_the_day).toBe("14:30");
    expect(createdSchedule?.users_list).toEqual(["test@example.com"]);
  });

  it("should create a schedule with the correct unique ID format", async () => {
    const scheduleInfo = {
      scheduleHour: "09:00",
      scheduleDay: "2023-12-25",
      userEmail: "christmas@example.com"
    };

    await addCanceledSchedule(scheduleInfo);

    const createdSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: "09:00",
      day: "2023-12-25"
    });

    expect(createdSchedule?.id).toBe("2023-12-25_09:00");
  });

  it("should handle long user email addresses", async () => {
    const longEmail = "very.long.email.address.that.might.test.edge.cases@verylongdomainname.com";
    const scheduleInfo = {
      scheduleHour: "08:15",
      scheduleDay: "2023-07-04",
      userEmail: longEmail
    };

    await addCanceledSchedule(scheduleInfo);

    const createdSchedule = await CanceledSchedule.findOne({
      hour_of_the_day: "08:15",
      day: "2023-07-04"
    });

    expect(createdSchedule).toBeDefined();
    expect(createdSchedule?.users_list).toEqual([longEmail]);
  });

  it("should create multiple schedules independently", async () => {
    const scheduleInfo1 = {
      scheduleHour: "10:00",
      scheduleDay: "2023-08-01",
      userEmail: "first@example.com"
    };

    const scheduleInfo2 = {
      scheduleHour: "11:00",
      scheduleDay: "2023-08-01",
      userEmail: "second@example.com"
    };

    await addCanceledSchedule(scheduleInfo1);
    await addCanceledSchedule(scheduleInfo2);

    const schedule1 = await CanceledSchedule.findOne({
      hour_of_the_day: "10:00",
      day: "2023-08-01"
    });

    const schedule2 = await CanceledSchedule.findOne({
      hour_of_the_day: "11:00",
      day: "2023-08-01"
    });

    expect(schedule1).toBeDefined();
    expect(schedule2).toBeDefined();
    expect(schedule1?.id).toBe("2023-08-01_10:00");
    expect(schedule2?.id).toBe("2023-08-01_11:00");
    expect(schedule1?.users_list).toEqual(["first@example.com"]);
    expect(schedule2?.users_list).toEqual(["second@example.com"]);
  });

  it("should handle edge case times like midnight and noon", async () => {
    const midnightSchedule = {
      scheduleHour: "00:00",
      scheduleDay: "2023-09-15",
      userEmail: "midnight@example.com"
    };

    const noonSchedule = {
      scheduleHour: "12:00",
      scheduleDay: "2023-09-15",
      userEmail: "noon@example.com"
    };

    await addCanceledSchedule(midnightSchedule);
    await addCanceledSchedule(noonSchedule);

    const midnight = await CanceledSchedule.findOne({
      hour_of_the_day: "00:00",
      day: "2023-09-15"
    });

    const noon = await CanceledSchedule.findOne({
      hour_of_the_day: "12:00",
      day: "2023-09-15"
    });

    expect(midnight).toBeDefined();
    expect(noon).toBeDefined();
    expect(midnight?.id).toBe("2023-09-15_00:00");
    expect(noon?.id).toBe("2023-09-15_12:00");
  });

  it("should not throw error when creating schedule with same time but different day", async () => {
    const scheduleInfo1 = {
      scheduleHour: "16:30",
      scheduleDay: "2023-10-01",
      userEmail: "october@example.com"
    };

    const scheduleInfo2 = {
      scheduleHour: "16:30",
      scheduleDay: "2023-10-02",
      userEmail: "nextday@example.com"
    };

    await expect(addCanceledSchedule(scheduleInfo1)).resolves.not.toThrow();
    await expect(addCanceledSchedule(scheduleInfo2)).resolves.not.toThrow();

    const schedule1 = await CanceledSchedule.findOne({
      hour_of_the_day: "16:30",
      day: "2023-10-01"
    });

    const schedule2 = await CanceledSchedule.findOne({
      hour_of_the_day: "16:30",
      day: "2023-10-02"
    });

    expect(schedule1).toBeDefined();
    expect(schedule2).toBeDefined();
    expect(schedule1?.id).toBe("2023-10-01_16:30");
    expect(schedule2?.id).toBe("2023-10-02_16:30");
  });

  it("should throw error when trying to create schedule with conflicting ID", async () => {
    const scheduleInfo1 = {
      scheduleHour: "14:00",
      scheduleDay: "2023-11-15",
      userEmail: "first@example.com"
    };

    const scheduleInfo2 = {
      scheduleHour: "14:00",
      scheduleDay: "2023-11-15", // Same day and hour = same ID
      userEmail: "second@example.com"
    };

    // First schedule should be created successfully
    await expect(addCanceledSchedule(scheduleInfo1)).resolves.not.toThrow();

    // Second schedule with same ID should throw an error
    await expect(addCanceledSchedule(scheduleInfo2)).rejects.toThrow();

    // Verify only one schedule exists in the database
    const schedules = await CanceledSchedule.find({
      hour_of_the_day: "14:00",
      day: "2023-11-15"
    });

    expect(schedules).toHaveLength(1);
    expect(schedules[0]?.users_list).toEqual(["first@example.com"]);
  });
});
