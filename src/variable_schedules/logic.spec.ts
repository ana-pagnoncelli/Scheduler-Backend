import { getVariableScheduleInfo, variableScheduleUniqueId } from "./logic";
import { VariableScheduleInfo } from "./variableSchedule";

describe("Variable Schedules Logic", () => {
  describe("getVariableScheduleInfo", () => {
    it("should extract schedule information from request body", () => {
      const mockRequest = {
        body: {
          hour: "18:00",
          day: "MONDAY",
          userEmail: "test@example.com"
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "18:00",
        scheduleDay: "MONDAY",
        userEmail: "test@example.com"
      });
    });

    it("should handle request with different time formats", () => {
      const mockRequest = {
        body: {
          hour: "09:30",
          day: "TUESDAY",
          userEmail: "user@test.com"
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "09:30",
        scheduleDay: "TUESDAY",
        userEmail: "user@test.com"
      });
    });

    it("should handle request with different day formats", () => {
      const mockRequest = {
        body: {
          hour: "14:00",
          day: "WEDNESDAY",
          userEmail: "another@email.com"
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "14:00",
        scheduleDay: "WEDNESDAY",
        userEmail: "another@email.com"
      });
    });

    it("should handle request with empty strings", () => {
      const mockRequest = {
        body: {
          hour: "",
          day: "",
          userEmail: ""
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "",
        scheduleDay: "",
        userEmail: ""
      });
    });

    it("should handle request with special characters in email", () => {
      const mockRequest = {
        body: {
          hour: "12:00",
          day: "FRIDAY",
          userEmail: "user+tag@domain.co.uk"
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "12:00",
        scheduleDay: "FRIDAY",
        userEmail: "user+tag@domain.co.uk"
      });
    });

    it("should handle request with numeric values converted to strings", () => {
      const mockRequest = {
        body: {
          hour: "15:45",
          day: "SATURDAY",
          userEmail: "numeric123@test.org"
        }
      };

      const result: VariableScheduleInfo = getVariableScheduleInfo(mockRequest);

      expect(result).toEqual({
        scheduleHour: "15:45",
        scheduleDay: "SATURDAY",
        userEmail: "numeric123@test.org"
      });
    });
  });

  describe("variableScheduleUniqueId", () => {
    it("should create unique ID with day and hour separated by underscore", () => {
      const result = variableScheduleUniqueId("MONDAY", "18:00");
      
      expect(result).toBe("MONDAY_18:00");
    });

    it("should create unique ID with different day and hour combinations", () => {
      const result1 = variableScheduleUniqueId("TUESDAY", "09:30");
      const result2 = variableScheduleUniqueId("WEDNESDAY", "14:15");
      const result3 = variableScheduleUniqueId("THURSDAY", "20:45");
      
      expect(result1).toBe("TUESDAY_09:30");
      expect(result2).toBe("WEDNESDAY_14:15");
      expect(result3).toBe("THURSDAY_20:45");
    });

    it("should create unique ID with empty strings", () => {
      const result = variableScheduleUniqueId("", "");
      
      expect(result).toBe("_");
    });

    it("should create unique ID with special characters", () => {
      const result = variableScheduleUniqueId("FRIDAY", "12:00");
      
      expect(result).toBe("FRIDAY_12:00");
    });

    it("should create unique ID with weekend days", () => {
      const result1 = variableScheduleUniqueId("SATURDAY", "10:00");
      const result2 = variableScheduleUniqueId("SUNDAY", "16:30");
      
      expect(result1).toBe("SATURDAY_10:00");
      expect(result2).toBe("SUNDAY_16:30");
    });

    it("should create unique ID with midnight and noon times", () => {
      const result1 = variableScheduleUniqueId("MONDAY", "00:00");
      const result2 = variableScheduleUniqueId("TUESDAY", "12:00");
      
      expect(result1).toBe("MONDAY_00:00");
      expect(result2).toBe("TUESDAY_12:00");
    });

    it("should create unique ID with single digit hours", () => {
      const result1 = variableScheduleUniqueId("WEDNESDAY", "1:00");
      const result2 = variableScheduleUniqueId("THURSDAY", "9:30");
      
      expect(result1).toBe("WEDNESDAY_1:00");
      expect(result2).toBe("THURSDAY_9:30");
    });

    it("should create unique ID with 24-hour format", () => {
      const result1 = variableScheduleUniqueId("FRIDAY", "23:59");
      const result2 = variableScheduleUniqueId("SATURDAY", "00:01");
      
      expect(result1).toBe("FRIDAY_23:59");
      expect(result2).toBe("SATURDAY_00:01");
    });

    it("should ensure different combinations produce different IDs", () => {
      const id1 = variableScheduleUniqueId("MONDAY", "18:00");
      const id2 = variableScheduleUniqueId("MONDAY", "19:00");
      const id3 = variableScheduleUniqueId("TUESDAY", "18:00");
      
      expect(id1).not.toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id2).not.toBe(id3);
    });
  });
});
