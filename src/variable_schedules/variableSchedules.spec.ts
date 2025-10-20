import request from "supertest";
import { httpServer } from "../setupTests";
import {
  variableScheduleData,
  updatedVariableScheduleData,
  scheduleData2,
  scheduleData3
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";
import { scheduleData } from "../fixed_schedules/fixtures";
import { SchedulesReturn } from "./model";
import { VariableSchedule } from "./model";
import { User } from "../users";
import { Schedule } from "../fixed_schedules";
import { CanceledSchedule } from "../canceled_schedules";

describe("Variable Schedules", () => {
  beforeEach(async () => {
    // Clean up database before each test
    await VariableSchedule.deleteMany({});
    await User.deleteMany({});
    await Schedule.deleteMany({});
    await CanceledSchedule.deleteMany({});
  });
  describe("GET /:id ", () => {
    it("Should return the searched variable schedule", async () => {
      // First create a user
      await request(httpServer).post("/users").send(userData);
      
      // Create variable schedule using the new endpoint format
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: variableScheduleData.hour_of_the_day,
          day: variableScheduleData.day,
          userEmail: userData.email
        });
        
      const response = await request(httpServer).get("/variableSchedules/2023-04-20_18:00");
      expect(response.body).toMatchObject({
        id: "2023-04-20_18:00",
        day: "2023-04-20",
        hour_of_the_day: "18:00",
        users_list: [userData.email]
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the schedule updated", async () => {
      // First create a user and variable schedule
      await request(httpServer).post("/users").send(userData);
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "18:00",
          day: "2023-04-20",
          userEmail: userData.email
        });
        
      const response = await request(httpServer)
        .put("/variableSchedules/2023-04-20_18:00")
        .send(updatedVariableScheduleData);
      expect(response.body).toMatchObject(updatedVariableScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the variable schedule", async () => {
      // First create a user and variable schedule
      await request(httpServer).post("/users").send(userData);
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "18:00",
          day: "2023-04-20",
          userEmail: userData.email
        });
        
      const response = await request(httpServer).delete("/variableSchedules/2023-04-20_18:00");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT removeUser/:userEmail/FromVariableSchedule/:scheduleId ", () => {
    it("Should update the variable schedule and the user", async () => {
      // Create users with unique emails to avoid conflicts
      const user1 = { ...userData, email: "user3@test.com" };
      const user2 = { ...userData2, email: "user4@test.com" };
      
      await request(httpServer).post("/users").send(user1);
      await request(httpServer).post("/users").send(user2);
      
      // Create variable schedule with first user
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "18:00",
          day: "2023-04-20",
          userEmail: user1.email
        });
        
      // Add second user to the same schedule
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "18:00",
          day: "2023-04-20",
          userEmail: user2.email
        });

      const scheduleId = "2023-04-20_18:00";
      const response = await request(httpServer).put(
        `/variableSchedules/removeUser/${user1.email}/FromVariableSchedule/${scheduleId}`
      );

      expect(response.body).toMatchObject({
        id: scheduleId,
        day: "2023-04-20",
        hour_of_the_day: "18:00",
        users_list: [user2.email]
      });
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${user1.email}`
      );

      expect(userResponse.body).toMatchObject(user1);
    });
  });

  describe("GET variableSchedules/forAListOfDays ", () => {
    it("Should get the schedule for a list of days", async () => {
      const listOfDays = [
        { week_day: "MONDAY", date: "2023-04-20" },
        { week_day: "TUESDAY", date: "2023-04-21" }
      ];

      // Create users with unique emails to avoid conflicts
      const user1 = { ...userData, email: "user5@test.com" };
      const user2 = { ...userData2, email: "user6@test.com" };
      
      await request(httpServer).post("/users").send(user1);
      await request(httpServer).post("/users").send(user2);

      // Create fixed schedules with the correct user emails for different hours
      const fixedSchedule1 = { ...scheduleData, hour_of_the_day: "17:00", users_list: [user1.email] };
      const fixedSchedule2 = { ...scheduleData2, hour_of_the_day: "12:00", users_list: [user1.email] };
      const fixedSchedule3 = { ...scheduleData3, hour_of_the_day: "16:00", users_list: [] };
      
      await request(httpServer).post("/schedules").send(fixedSchedule1);
      await request(httpServer).post("/schedules").send(fixedSchedule2);
      await request(httpServer).post("/schedules").send(fixedSchedule3);

      // Create variable schedules using the new endpoint format
      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "18:00",
          day: "2023-04-20",
          userEmail: user1.email
        });

      await request(httpServer)
        .post("/variableSchedules")
        .send({
          hour: "15:00",
          day: "2023-04-21",
          userEmail: user2.email
        });

      const response = await request(httpServer)
        .post("/variableSchedules/get/forAListOfDays")
        .send(listOfDays);


      const result: Array<SchedulesReturn> = [
        {
          day: "2023-04-20",
          numberOfSpots: 2,
          availableSpots: 1,
          hours: [
            { hour: "17:00", numberOfSpots: 2, availableSpots: 1, usersList: [user1.email] }
          ]
        },
        {
          day: "2023-04-21",
          numberOfSpots: 4,
          availableSpots: 3,
          hours: [
            { hour: "12:00", numberOfSpots: 2, availableSpots: 1, usersList: [user1.email] },
            { hour: "16:00", numberOfSpots: 2, availableSpots: 2, usersList: [] }
          ]
        }
      ];

      expect(response.body).toMatchObject(result);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST / (addOrUpdateVariableSchedule)", () => {
    it("Should create a new variable schedule when none exists", async () => {
      // First create a user
      await request(httpServer).post("/users").send(userData);

      const newScheduleData = {
        hour: "14:00",
        day: "2023-05-15",
        userEmail: userData.email
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(newScheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Variable schedule added or updated");
    });

    it("Should update an existing variable schedule by adding a user", async () => {
      // Create users
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      // First, create a variable schedule with one user
      const firstScheduleData = {
        hour: "16:00",
        day: "2023-05-16",
        userEmail: userData.email
      };

      await request(httpServer)
        .post("/variableSchedules")
        .send(firstScheduleData);

      // Now add another user to the same schedule
      const secondScheduleData = {
        hour: "16:00",
        day: "2023-05-16",
        userEmail: userData2.email
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(secondScheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Variable schedule added or updated");
    });

    it("Should not add duplicate user to existing variable schedule", async () => {
      // Create user
      await request(httpServer).post("/users").send(userData);

      const scheduleData = {
        hour: "17:00",
        day: "2023-05-17",
        userEmail: userData.email
      };

      // First request to create the schedule
      await request(httpServer)
        .post("/variableSchedules")
        .send(scheduleData);

      // Second request with the same user (should not duplicate)
      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(scheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Variable schedule added or updated");
    });

    it("Should return error when user does not exist", async () => {
      const scheduleData = {
        hour: "18:00",
        day: "2023-05-18",
        userEmail: "nonexistent@example.com"
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(scheduleData);

      expect(response.statusCode).toBe(500);
    });

    it("Should handle missing required fields", async () => {
      const invalidScheduleData = {
        hour: "19:00",
        // Missing day and userEmail
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(invalidScheduleData);

      expect(response.statusCode).toBe(500);
    });

    it("Should handle empty request body", async () => {
      const response = await request(httpServer)
        .post("/variableSchedules")
        .send({});

      expect(response.statusCode).toBe(500);
    });

    it("Should decrease classes_to_recover when adding user to variable schedule", async () => {
      // Create user with classes_to_recover set to 3
      const userWithClasses = { ...userData, classes_to_recover: 3 };
      await request(httpServer).post("/users").send(userWithClasses);

      const scheduleData = {
        hour: "19:00",
        day: "2023-05-20",
        userEmail: userData.email
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(scheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Variable schedule added or updated");

      // Verify that classes_to_recover was decreased
      const userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.classes_to_recover).toBe(2);
    });

    it("Should return message when user was in canceled schedule", async () => {
      // Create user
      await request(httpServer).post("/users").send(userData);

      // Create a canceled schedule with the user using the correct format
      const canceledScheduleData = {
        hour: "20:00",
        day: "2023-05-19",
        userEmail: userData.email
      };

      await request(httpServer)
        .post("/canceledSchedules")
        .send(canceledScheduleData);

      // Try to add the same user to a variable schedule for the same time
      const scheduleData = {
        hour: "20:00",
        day: "2023-05-19",
        userEmail: userData.email
      };

      const response = await request(httpServer)
        .post("/variableSchedules")
        .send(scheduleData);

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("User was removed from canceled schedule");

      // Verify the user was removed from the canceled schedule
      const canceledScheduleResponse = await request(httpServer)
        .get("/canceledSchedules/2023-05-19_20:00");
      
      expect(canceledScheduleResponse.body.users_list).not.toContain(userData.email);
    });
  });
});
