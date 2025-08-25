import request from "supertest";
import { httpServer } from "../setupTests";
import {
  scheduleData,
  scheduleDataWithOneUser,
  scheduleWithMissingData,
  updatedScheduleData
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";
import { addScheduleInUsers } from "./schedulesController";

describe("Schedules", () => {
  describe("POST / ", () => {
    it("Should create a schedule when all required fields are given", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(response.statusCode).toBe(201);
    });
    it("Should not create a schedule when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleWithMissingData);
      expect(response.statusCode).toBe(500);
    });
    it("Should not create a schedule when the same hour and day are given", async () => {
      const response = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("This schedule already exists");
    });
  });

  describe("GET /byId/:id ", () => {
    it("Should return the searched schedule", async () => {
      await request(httpServer).post("/schedules").send(scheduleData);
      const response = await request(httpServer).get("/schedules/byId/1");
      expect(response.body).toMatchObject(scheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /all ", () => {
    it("Should return the all the schedules", async () => {
      await request(httpServer).post("/schedules").send(scheduleData);
      const response = await request(httpServer).get("/schedules/all");
      expect(response.body).toMatchObject([scheduleData]);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the schedule updated", async () => {
      const response = await request(httpServer)
        .put("/schedules/1")
        .send(updatedScheduleData);
      expect(response.body).toMatchObject(updatedScheduleData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the schedule", async () => {
      const response = await request(httpServer).delete("/schedules/1");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT addUser/:userEmail/InSchedule/:scheduleId ", () => {
    it("Should update the schedule and the user", async () => {
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      await request(httpServer).post("/schedules").send(scheduleData);

      await request(httpServer).put(
        `/schedules/addUser/${userData.email}/InSchedule/${scheduleData.id}`
      );

      const response = await request(httpServer).put(
        `/schedules/addUser/${userData2.email}/InSchedule/${scheduleData.id}`
      );

      expect(response.body).toMatchObject(updatedScheduleData);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject({
        ...userData,
        fixed_schedules: [
          {
            id: "1",
            week_day: "MONDAY",
            hour_of_the_day: "18:00"
          }
        ]
      });
    });
  });

  describe("PUT removeUser/:userEmail/FromSchedule/:scheduleId ", () => {
    it("Should update the schedule and the user", async () => {
      const response = await request(httpServer).put(
        `/schedules/removeUser/${userData.email}/FromSchedule/${scheduleData.id}`
      );

      expect(response.body).toMatchObject(scheduleDataWithOneUser);
      expect(response.statusCode).toBe(200);

      const userResponse = await request(httpServer).get(
        `/users/${userData.email}`
      );

      expect(userResponse.body).toMatchObject(userData);
    });
  });

  describe("addScheduleInUsers", () => {
    it("Should add schedule to all users in users_list", async () => {
      // Create test users first
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      // Create a schedule with users
      const scheduleWithUsers = {
        ...scheduleData,
        users_list: [userData.email, userData2.email]
      };

      // Call the function directly
      await addScheduleInUsers(scheduleWithUsers);

      // Verify that both users now have the schedule in their fixed_schedules
      const user1Response = await request(httpServer).get(`/users/${userData.email}`);
      const user2Response = await request(httpServer).get(`/users/${userData2.email}`);

      expect(user1Response.body.fixed_schedules).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: scheduleWithUsers.id,
            hour_of_the_day: scheduleWithUsers.hour_of_the_day,
            week_day: scheduleWithUsers.week_day
          })
        ])
      );

      expect(user2Response.body.fixed_schedules).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: scheduleWithUsers.id,
            hour_of_the_day: scheduleWithUsers.hour_of_the_day,
            week_day: scheduleWithUsers.week_day
          })
        ])
      );
    });

    it("Should handle empty users_list gracefully", async () => {
      const scheduleWithNoUsers = {
        ...scheduleData,
        users_list: []
      };

      // Should not throw an error
      await expect(addScheduleInUsers(scheduleWithNoUsers)).resolves.not.toThrow();
    });

    it("Should handle single user in users_list", async () => {
      // Create test user
      await request(httpServer).post("/users").send(userData);

      const scheduleWithOneUser = {
        ...scheduleData,
        users_list: [userData.email]
      };

      await addScheduleInUsers(scheduleWithOneUser);

      // Verify the user has the schedule
      const userResponse = await request(httpServer).get(`/users/${userData.email}`);
      
      expect(userResponse.body.fixed_schedules).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: scheduleWithOneUser.id,
            hour_of_the_day: scheduleWithOneUser.hour_of_the_day,
            week_day: scheduleWithOneUser.week_day
          })
        ])
      );
    });

    it("Should preserve existing fixed_schedules when adding new ones", async () => {
      // Create test user (delete first if exists to ensure clean state)
      try {
        await request(httpServer).delete(`/users/${userData.email}`);
      } catch (error) {
        // User doesn't exist, which is fine
      }
      await request(httpServer).post("/users").send(userData);

      // Add first schedule
      const firstSchedule = {
        ...scheduleData,
        id: "1",
        users_list: [userData.email]
      };

      await addScheduleInUsers(firstSchedule);

      // Add second schedule
      const secondSchedule = {
        ...scheduleData,
        id: "2",
        week_day: "TUESDAY",
        users_list: [userData.email]
      };

      await addScheduleInUsers(secondSchedule);

      // Verify user has both schedules
      const userResponse = await request(httpServer).get(`/users/${userData.email}`);
      
      expect(userResponse.body.fixed_schedules).toHaveLength(2);
      expect(userResponse.body.fixed_schedules).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: firstSchedule.id,
            hour_of_the_day: firstSchedule.hour_of_the_day,
            week_day: firstSchedule.week_day
          }),
          expect.objectContaining({
            id: secondSchedule.id,
            hour_of_the_day: secondSchedule.hour_of_the_day,
            week_day: secondSchedule.week_day
          })
        ])
      );
    });

    it("Should handle non-existent users gracefully", async () => {
      const scheduleWithNonExistentUsers = {
        ...scheduleData,
        users_list: ["nonexistent@test.com", "another@test.com"]
      };

      // Should not throw an error even with non-existent users
      await expect(addScheduleInUsers(scheduleWithNonExistentUsers)).resolves.not.toThrow();
    });
  });
});
