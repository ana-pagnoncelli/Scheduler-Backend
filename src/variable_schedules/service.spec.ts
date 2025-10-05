import mongoose from "mongoose";
import { VariableSchedule, VariableScheduleType } from "./model";
import { updateVariableSchedule, addVariableSchedule, handleAddOrUpdate } from "./service";

describe("Variable Schedules Service", () => {
  let testVariableSchedule: mongoose.Document & VariableScheduleType;

  beforeEach(async () => {
    // Clean up any existing data
    await VariableSchedule.deleteMany({});
    
    // Create a test variable schedule
    testVariableSchedule = new VariableSchedule({
      id: "MONDAY_18:00",
      day: "MONDAY",
      hour_of_the_day: "18:00",
      users_list: ["existing@user.com"]
    });
    
    await testVariableSchedule.save();
  });

  afterEach(async () => {
    // Clean up after each test
    await VariableSchedule.deleteMany({});
  });

  describe("updateVariableSchedule", () => {
    it("should add a new user to the users_list when user is not already in the list", async () => {
      const scheduleInfo = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "new@user.com"
      };

      const result = await updateVariableSchedule(testVariableSchedule, scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("existing@user.com");
      expect(result.users_list).toContain("new@user.com");
      expect(result.users_list.length).toBe(2);
      expect(result.day).toBe("MONDAY");
      expect(result.hour_of_the_day).toBe("18:00");
      expect(result.id).toBe("MONDAY_18:00");
    });

    it("should not add a user if they are already in the users_list", async () => {
      const scheduleInfo = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "existing@user.com" // This user is already in the list
      };

      const result = await updateVariableSchedule(testVariableSchedule, scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("existing@user.com");
      expect(result.users_list.length).toBe(1); // Should remain unchanged
      expect(result.day).toBe("MONDAY");
      expect(result.hour_of_the_day).toBe("18:00");
      expect(result.id).toBe("MONDAY_18:00");
    });

    it("should handle multiple users being added to the same schedule", async () => {
      // First, add one user
      const scheduleInfo1 = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "first@user.com"
      };

      await updateVariableSchedule(testVariableSchedule, scheduleInfo1);

      // Then add another user
      const scheduleInfo2 = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "second@user.com"
      };

      const result = await updateVariableSchedule(testVariableSchedule, scheduleInfo2);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("existing@user.com");
      expect(result.users_list).toContain("first@user.com");
      expect(result.users_list).toContain("second@user.com");
      expect(result.users_list.length).toBe(3);
    });

    it("should return the updated schedule from the database after adding a user", async () => {
      const scheduleInfo = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "database@user.com"
      };

      const result = await updateVariableSchedule(testVariableSchedule, scheduleInfo);

      // Verify the result matches what's in the database
      const dbSchedule = await VariableSchedule.findOne({
        hour_of_the_day: "18:00",
        day: "MONDAY"
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
      const emptySchedule = new VariableSchedule({
        id: "TUESDAY_20:00",
        day: "TUESDAY",
        hour_of_the_day: "20:00",
        users_list: []
      });
      
      await emptySchedule.save();

      const scheduleInfo = {
        scheduleHour: "20:00",
        scheduleDay: "TUESDAY",
        userEmail: "first@user.com"
      };

      const result = await updateVariableSchedule(emptySchedule, scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("first@user.com");
      expect(result.users_list.length).toBe(1);
    });

    it("should work with the same user email multiple times without duplication", async () => {
      const scheduleInfo = {
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "duplicate@user.com"
      };

      // Add the same user twice - first call
      await updateVariableSchedule(testVariableSchedule, scheduleInfo);
      
      // Get fresh document from database for second call
      const freshDocument = await VariableSchedule.findOne({
        hour_of_the_day: "18:00",
        day: "MONDAY"
      }) as mongoose.Document & VariableScheduleType;
      
      // Second call with fresh document should not add duplicate
      const result = await updateVariableSchedule(freshDocument, scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("existing@user.com");
      expect(result.users_list).toContain("duplicate@user.com");
      expect(result.users_list.length).toBe(2); // Should not duplicate
    });
  });

  describe("addVariableSchedule", () => {
    beforeEach(async () => {
      // Clean up any existing data before each test
      await VariableSchedule.deleteMany({});
    });

    afterEach(async () => {
      // Clean up after each test
      await VariableSchedule.deleteMany({});
    });

    it("should create a new variable schedule with correct properties", async () => {
      const scheduleInfo = {
        scheduleHour: "14:30",
        scheduleDay: "WEDNESDAY",
        userEmail: "test@example.com"
      };

      const result = await addVariableSchedule(scheduleInfo);

      expect(result).toBeDefined();
      expect(result.id).toBe("WEDNESDAY_14:30");
      expect(result.day).toBe("WEDNESDAY");
      expect(result.hour_of_the_day).toBe("14:30");
      expect(result.users_list).toEqual(["test@example.com"]);

      // Verify the schedule was created in the database
      const createdSchedule = await VariableSchedule.findOne({
        hour_of_the_day: "14:30",
        day: "WEDNESDAY"
      });

      expect(createdSchedule).toBeDefined();
      expect(createdSchedule?.id).toBe("WEDNESDAY_14:30");
      expect(createdSchedule?.day).toBe("WEDNESDAY");
      expect(createdSchedule?.hour_of_the_day).toBe("14:30");
      expect(createdSchedule?.users_list).toEqual(["test@example.com"]);
    });

    it("should create a schedule with the correct unique ID format", async () => {
      const scheduleInfo = {
        scheduleHour: "09:00",
        scheduleDay: "FRIDAY",
        userEmail: "friday@example.com"
      };

      const result = await addVariableSchedule(scheduleInfo);

      expect(result.id).toBe("FRIDAY_09:00");
    });

    it("should create multiple schedules independently", async () => {
      const scheduleInfo1 = {
        scheduleHour: "10:00",
        scheduleDay: "SATURDAY",
        userEmail: "first@example.com"
      };

      const scheduleInfo2 = {
        scheduleHour: "11:00",
        scheduleDay: "SATURDAY",
        userEmail: "second@example.com"
      };

      const result1 = await addVariableSchedule(scheduleInfo1);
      const result2 = await addVariableSchedule(scheduleInfo2);

      expect(result1.id).toBe("SATURDAY_10:00");
      expect(result2.id).toBe("SATURDAY_11:00");
      expect(result1.users_list).toEqual(["first@example.com"]);
      expect(result2.users_list).toEqual(["second@example.com"]);

      // Verify both schedules exist in database
      const schedule1 = await VariableSchedule.findOne({
        hour_of_the_day: "10:00",
        day: "SATURDAY"
      });

      const schedule2 = await VariableSchedule.findOne({
        hour_of_the_day: "11:00",
        day: "SATURDAY"
      });

      expect(schedule1).toBeDefined();
      expect(schedule2).toBeDefined();
    });

    it("should not throw error when creating schedule with same time but different day", async () => {
      const scheduleInfo1 = {
        scheduleHour: "16:30",
        scheduleDay: "MONDAY",
        userEmail: "monday@example.com"
      };

      const scheduleInfo2 = {
        scheduleHour: "16:30",
        scheduleDay: "TUESDAY",
        userEmail: "tuesday@example.com"
      };

      await expect(addVariableSchedule(scheduleInfo1)).resolves.not.toThrow();
      await expect(addVariableSchedule(scheduleInfo2)).resolves.not.toThrow();

      const schedule1 = await VariableSchedule.findOne({
        hour_of_the_day: "16:30",
        day: "MONDAY"
      });

      const schedule2 = await VariableSchedule.findOne({
        hour_of_the_day: "16:30",
        day: "TUESDAY"
      });

      expect(schedule1).toBeDefined();
      expect(schedule2).toBeDefined();
      expect(schedule1?.id).toBe("MONDAY_16:30");
      expect(schedule2?.id).toBe("TUESDAY_16:30");
    });

    it("should throw error when trying to create schedule with conflicting ID", async () => {
      const scheduleInfo1 = {
        scheduleHour: "14:00",
        scheduleDay: "WEDNESDAY",
        userEmail: "first@example.com"
      };

      const scheduleInfo2 = {
        scheduleHour: "14:00",
        scheduleDay: "WEDNESDAY", // Same day and hour = same ID
        userEmail: "second@example.com"
      };

      // First schedule should be created successfully
      await expect(addVariableSchedule(scheduleInfo1)).resolves.not.toThrow();

      // Second schedule with same ID should throw an error
      await expect(addVariableSchedule(scheduleInfo2)).rejects.toThrow();

      // Verify only one schedule exists in the database
      const schedules = await VariableSchedule.find({
        hour_of_the_day: "14:00",
        day: "WEDNESDAY"
      });

      expect(schedules).toHaveLength(1);
      expect(schedules[0]?.users_list).toEqual(["first@example.com"]);
    });
  });

  describe("handleAddOrUpdate", () => {
    beforeEach(async () => {
      // Clean up any existing data before each test
      await VariableSchedule.deleteMany({});
    });

    afterEach(async () => {
      // Clean up after each test
      await VariableSchedule.deleteMany({});
    });

    it("should add a new variable schedule when none exists", async () => {
      const scheduleInfo = {
        scheduleHour: "15:30",
        scheduleDay: "THURSDAY",
        userEmail: "newuser@example.com"
      };

      const result = await handleAddOrUpdate(scheduleInfo);

      expect(result).toBeDefined();
      expect(result.id).toBe("THURSDAY_15:30");
      expect(result.day).toBe("THURSDAY");
      expect(result.hour_of_the_day).toBe("15:30");
      expect(result.users_list).toEqual(["newuser@example.com"]);

      // Verify the schedule was created in the database
      const dbSchedule = await VariableSchedule.findOne({
        hour_of_the_day: "15:30",
        day: "THURSDAY"
      });
      expect(dbSchedule).toBeDefined();
      expect(dbSchedule?.users_list).toEqual(["newuser@example.com"]);
    });

    it("should update an existing variable schedule when one exists", async () => {
      // First, create an existing schedule
      const existingSchedule = new VariableSchedule({
        id: "FRIDAY_18:00",
        day: "FRIDAY",
        hour_of_the_day: "18:00",
        users_list: ["existing@user.com"]
      });
      await existingSchedule.save();

      const scheduleInfo = {
        scheduleHour: "18:00",
        scheduleDay: "FRIDAY",
        userEmail: "newuser@example.com"
      };

      const result = await handleAddOrUpdate(scheduleInfo);

      expect(result).toBeDefined();
      expect(result.id).toBe("FRIDAY_18:00");
      expect(result.day).toBe("FRIDAY");
      expect(result.hour_of_the_day).toBe("18:00");
      expect(result.users_list).toContain("existing@user.com");
      expect(result.users_list).toContain("newuser@example.com");
      expect(result.users_list.length).toBe(2);

      // Verify the schedule was updated in the database
      const dbSchedule = await VariableSchedule.findOne({
        hour_of_the_day: "18:00",
        day: "FRIDAY"
      });
      expect(dbSchedule).toBeDefined();
      expect(dbSchedule?.users_list).toContain("existing@user.com");
      expect(dbSchedule?.users_list).toContain("newuser@example.com");
    });

    it("should not add duplicate user when updating existing schedule", async () => {
      // Create an existing schedule with a user
      const existingSchedule = new VariableSchedule({
        id: "SATURDAY_12:00",
        day: "SATURDAY",
        hour_of_the_day: "12:00",
        users_list: ["duplicate@user.com"]
      });
      await existingSchedule.save();

      const scheduleInfo = {
        scheduleHour: "12:00",
        scheduleDay: "SATURDAY",
        userEmail: "duplicate@user.com" // Same user as existing
      };

      const result = await handleAddOrUpdate(scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("duplicate@user.com");
      expect(result.users_list.length).toBe(1); // Should not duplicate
    });

    it("should handle multiple calls to add different users to the same schedule", async () => {
      const scheduleInfo1 = {
        scheduleHour: "14:00",
        scheduleDay: "SUNDAY",
        userEmail: "first@user.com"
      };

      const scheduleInfo2 = {
        scheduleHour: "14:00",
        scheduleDay: "SUNDAY",
        userEmail: "second@user.com"
      };

      // First call should create new schedule
      const result1 = await handleAddOrUpdate(scheduleInfo1);
      expect(result1.users_list).toEqual(["first@user.com"]);

      // Second call should update existing schedule
      const result2 = await handleAddOrUpdate(scheduleInfo2);
      expect(result2.users_list).toContain("first@user.com");
      expect(result2.users_list).toContain("second@user.com");
      expect(result2.users_list.length).toBe(2);
    });

    it("should return the same result for identical subsequent calls", async () => {
      const scheduleInfo = {
        scheduleHour: "10:30",
        scheduleDay: "MONDAY",
        userEmail: "consistent@user.com"
      };

      const result1 = await handleAddOrUpdate(scheduleInfo);
      const result2 = await handleAddOrUpdate(scheduleInfo);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.id).toBe(result2.id);
      expect(result1.users_list).toEqual(result2.users_list);
      expect(result1.users_list.length).toBe(1); // Should not duplicate
    });

    it("should handle different days with same hour", async () => {
      const mondaySchedule = {
        scheduleHour: "09:00",
        scheduleDay: "MONDAY",
        userEmail: "monday@user.com"
      };

      const tuesdaySchedule = {
        scheduleHour: "09:00",
        scheduleDay: "TUESDAY",
        userEmail: "tuesday@user.com"
      };

      const mondayResult = await handleAddOrUpdate(mondaySchedule);
      const tuesdayResult = await handleAddOrUpdate(tuesdaySchedule);

      expect(mondayResult.id).toBe("MONDAY_09:00");
      expect(tuesdayResult.id).toBe("TUESDAY_09:00");
      expect(mondayResult.users_list).toEqual(["monday@user.com"]);
      expect(tuesdayResult.users_list).toEqual(["tuesday@user.com"]);
    });

    it("should handle different hours with same day", async () => {
      const morningSchedule = {
        scheduleHour: "09:00",
        scheduleDay: "WEDNESDAY",
        userEmail: "morning@user.com"
      };

      const eveningSchedule = {
        scheduleHour: "18:00",
        scheduleDay: "WEDNESDAY",
        userEmail: "evening@user.com"
      };

      const morningResult = await handleAddOrUpdate(morningSchedule);
      const eveningResult = await handleAddOrUpdate(eveningSchedule);

      expect(morningResult.id).toBe("WEDNESDAY_09:00");
      expect(eveningResult.id).toBe("WEDNESDAY_18:00");
      expect(morningResult.users_list).toEqual(["morning@user.com"]);
      expect(eveningResult.users_list).toEqual(["evening@user.com"]);
    });

    it("should handle empty users_list in existing schedule", async () => {
      // Create a schedule with empty users_list
      const emptySchedule = new VariableSchedule({
        id: "FRIDAY_20:00",
        day: "FRIDAY",
        hour_of_the_day: "20:00",
        users_list: []
      });
      await emptySchedule.save();

      const scheduleInfo = {
        scheduleHour: "20:00",
        scheduleDay: "FRIDAY",
        userEmail: "first@user.com"
      };

      const result = await handleAddOrUpdate(scheduleInfo);

      expect(result).toBeDefined();
      expect(result.users_list).toContain("first@user.com");
      expect(result.users_list.length).toBe(1);
    });
  });
});
