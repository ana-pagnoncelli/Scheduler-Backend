import { nextClass } from "./usersLogic";
import { UserType } from "./user";
import { WeekDay } from "../fixed_schedules/schedule";

describe("nextClass", () => {
  const mockUser: UserType = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    age: 25,
    admin: false,
    phone: 1234567890,
    fixed_schedules: [
      {
        id: "schedule1",
        hour_of_the_day: "09:00",
        week_day: "MONDAY" as WeekDay,
      },
      {
        id: "schedule2",
        hour_of_the_day: "14:00",
        week_day: "WEDNESDAY" as WeekDay,
      },
    ],
    variable_schedules: [
      {
        id: "var1",
        hour_of_the_day: "10:00",
        day: "2024-01-15", // Monday
      },
      {
        id: "var2",
        hour_of_the_day: "16:00",
        day: "2024-01-20", // Saturday
      },
    ],
    canceled_schedules: [
      {
        id: "cancel1",
        hour_of_the_day: "09:00",
        day: "2024-01-08", // Tuesday
      },
    ],
  };

  it("should return the next class date for a user with fixed schedules", async () => {
    const referenceDate = "2024-01-01"; // Monday
    
    const result = nextClass(referenceDate, mockUser);

    expect(result).toBe("2024-01-01");
  });

  it("should handle user with variable and canceled schedules", async () => {
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, mockUser);

    expect(result).toBe("2024-01-01");
  });

  it("should return a variable date", async () => {
    const referenceDate = "2024-01-14";
    
    const result = nextClass(referenceDate, mockUser);

    // Should return a valid date string
    expect(result).toBe("2024-01-15");
  });

  it("should handle user with no fixed schedules", async () => {
    const userWithNoFixedSchedules: UserType = {
      ...mockUser,
      fixed_schedules: [],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithNoFixedSchedules);

    // Should still work with only variable schedules
    expect(result).toBe("2024-01-15");
  });

  it("should handle user with no variable schedules", async () => {
    const userWithNoVariableSchedules: UserType = {
      ...mockUser,
      variable_schedules: [],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithNoVariableSchedules);

    // Should work with only fixed schedules
    expect(result).toBe("2024-01-01");
  });

  it("should handle user with no canceled schedules", async () => {
    const userWithNoCanceledSchedules: UserType = {
      ...mockUser,
      canceled_schedules: [],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithNoCanceledSchedules);

    // Should work without canceled schedules
    expect(result).toBe("2024-01-01");
  });

  it("should handle user with no schedules at all", async () => {
    const userWithNoSchedules: UserType = {
      ...mockUser,
      fixed_schedules: [],
      variable_schedules: [],
      canceled_schedules: [],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithNoSchedules);

    // Should handle empty schedules gracefully
    expect(result).toBeUndefined();
  });

  it("should handle different weekdays correctly", async () => {
    const userWithDifferentWeekdays: UserType = {
      ...mockUser,
      fixed_schedules: [
        {
          id: "schedule1",
          hour_of_the_day: "09:00",
          week_day: "FRIDAY" as WeekDay,
        },
        {
          id: "schedule2",
          hour_of_the_day: "14:00",
          week_day: "SUNDAY" as WeekDay,
        },
      ],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithDifferentWeekdays);

    // Should work with different weekdays
    expect(result).toBe("2024-01-05");
  });

  it("should handle edge case with single fixed schedule", async () => {
    const userWithSingleSchedule: UserType = {
      ...mockUser,
      fixed_schedules: [
        {
          id: "schedule1",
          hour_of_the_day: "09:00",
          week_day: "TUESDAY" as WeekDay,
        },
      ],
      variable_schedules: [],
      canceled_schedules: [],
    };
    const referenceDate = "2024-01-01";
    
    const result = nextClass(referenceDate, userWithSingleSchedule);

    // Should work with single schedule
    expect(result).toBe("2024-01-02");
  });
});
