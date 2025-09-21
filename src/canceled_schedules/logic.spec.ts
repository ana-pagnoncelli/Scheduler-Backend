import { getCancelScheduleInfo, canceledScheduleUniqueId } from "./logic";
import { CancelScheduleInfo } from "./model";

describe("getCancelScheduleInfo", () => {
  it("should extract schedule information from request body correctly", () => {
    // Arrange
    const mockRequest = {
      body: {
        hour: "19:00",
        day: "2023-04-21",
        userEmail: "test@example.com"
      }
    };

    const expectedResult: CancelScheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "test@example.com"
    };

    // Act
    const result = getCancelScheduleInfo(mockRequest);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it("should handle empty string values", () => {
    // Arrange
    const mockRequest = {
      body: {
        hour: "",
        day: "",
        userEmail: ""
      }
    };

    const expectedResult: CancelScheduleInfo = {
      scheduleHour: "",
      scheduleDay: "",
      userEmail: ""
    };

    // Act
    const result = getCancelScheduleInfo(mockRequest);

    // Assert
    expect(result).toEqual(expectedResult);
  });



  it("should handle additional properties in request body", () => {
    // Arrange
    const mockRequest = {
      body: {
        hour: "19:00",
        day: "2023-04-21",
        userEmail: "test@example.com",
        extraProperty: "should be ignored",
        anotherProperty: 123
      }
    };

    const expectedResult: CancelScheduleInfo = {
      scheduleHour: "19:00",
      scheduleDay: "2023-04-21",
      userEmail: "test@example.com"
    };

    // Act
    const result = getCancelScheduleInfo(mockRequest);

    // Assert
    expect(result).toEqual(expectedResult);
  });

});

describe("canceledScheduleUniqueId", () => {
  it("should create a unique ID by combining schedule day and hour with underscore", () => {
    const scheduleDay = "2023-04-21";
    const scheduleHour = "19:00";
    const expectedId = "2023-04-21_19:00";

    const result = canceledScheduleUniqueId(scheduleDay, scheduleHour);
    expect(result).toBe(expectedId);
  });

  it("should return a string type", () => {
    const scheduleDay = "2023-04-21";
    const scheduleHour = "19:00";

    const result = canceledScheduleUniqueId(scheduleDay, scheduleHour);
    expect(typeof result).toBe("string");
  });
});
