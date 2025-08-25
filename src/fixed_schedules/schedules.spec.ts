import request from "supertest";
import { httpServer } from "../setupTests";
import {
  scheduleData,
  scheduleDataWithOneUser,
  scheduleWithMissingData,
  updatedScheduleData
} from "./fixtures";
import { userData, userData2 } from "../users/fixtures";
import { addScheduleInUsers, removeScheduleFromUsers } from "./schedulesController";

describe("Schedules", () => {
  // Clean up database before each test
  beforeEach(async () => {
    // Clear all schedules and users before each test
    try {
      await request(httpServer).delete("/schedules/1");
    } catch (error) {
      // Schedule doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete("/schedules/2");
    } catch (error) {
      // Schedule doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete(`/users/${userData.email}`);
    } catch (error) {
      // User doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete(`/users/${userData2.email}`);
    } catch (error) {
      // User doesn't exist, which is fine
    }
  });

  // Clean up database after each test
  afterEach(async () => {
    // Clear all schedules and users after each test
    try {
      await request(httpServer).delete("/schedules/1");
    } catch (error) {
      // Schedule doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete("/schedules/2");
    } catch (error) {
      // Schedule doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete(`/users/${userData.email}`);
    } catch (error) {
      // User doesn't exist, which is fine
    }
    try {
      await request(httpServer).delete(`/users/${userData2.email}`);
    } catch (error) {
      // User doesn't exist, which is fine
    }
  });

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
      // First create a schedule
      const firstResponse = await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      expect(firstResponse.statusCode).toBe(201);
      
      // Wait a bit to ensure the first schedule is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then try to create the same schedule again
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
      // First create a schedule to update
      await request(httpServer)
        .post("/schedules")
        .send(scheduleData);
      
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
      // First create users and schedule
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);
      await request(httpServer).post("/schedules").send(scheduleData);
      
      // Add both users to the schedule
      await request(httpServer).put(
        `/schedules/addUser/${userData.email}/InSchedule/${scheduleData.id}`
      );
      await request(httpServer).put(
        `/schedules/addUser/${userData2.email}/InSchedule/${scheduleData.id}`
      );

      // Now remove one user
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

  describe("removeScheduleFromUsers", () => {
    it("Should remove schedule from all users in users_list", async () => {
      // Create test users first
      await request(httpServer).post("/users").send(userData);
      await request(httpServer).post("/users").send(userData2);

      // Create a schedule with users and add it to them first
      const scheduleWithUsers = {
        ...scheduleData,
        users_list: [userData.email, userData2.email]
      };

      // Add the schedule to users first
      await addScheduleInUsers(scheduleWithUsers);

      // Verify that both users have the schedule
      let user1Response = await request(httpServer).get(`/users/${userData.email}`);
      let user2Response = await request(httpServer).get(`/users/${userData2.email}`);

      expect(user1Response.body.fixed_schedules).toHaveLength(1);
      expect(user2Response.body.fixed_schedules).toHaveLength(1);

      // Now remove the schedule from users
      await removeScheduleFromUsers(scheduleWithUsers);

      // Verify that both users no longer have the schedule
      user1Response = await request(httpServer).get(`/users/${userData.email}`);
      user2Response = await request(httpServer).get(`/users/${userData2.email}`);

      expect(user1Response.body.fixed_schedules).toHaveLength(0);
      expect(user2Response.body.fixed_schedules).toHaveLength(0);
    });

    it("Should handle empty users_list gracefully", async () => {
      const scheduleWithNoUsers = {
        ...scheduleData,
        users_list: []
      };

      // Should not throw an error
      await expect(removeScheduleFromUsers(scheduleWithNoUsers)).resolves.not.toThrow();
    });

    it("Should handle single user in users_list", async () => {
      // Create test user
      await request(httpServer).post("/users").send(userData);

      const scheduleWithOneUser = {
        ...scheduleData,
        users_list: [userData.email]
      };

      // Add the schedule first
      await addScheduleInUsers(scheduleWithOneUser);

      // Verify the user has the schedule
      let userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(1);

      // Now remove the schedule
      await removeScheduleFromUsers(scheduleWithOneUser);

      // Verify the user no longer has the schedule
      userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(0);
    });

    it("Should preserve other fixed_schedules when removing specific ones", async () => {
      // Create test user
      await request(httpServer).post("/users").send(userData);

      // Add first schedule
      const firstSchedule = {
        ...scheduleData,
        id: "1",
        users_list: [userData.email]
      };

      // Add second schedule
      const secondSchedule = {
        ...scheduleData,
        id: "2",
        week_day: "TUESDAY",
        users_list: [userData.email]
      };

      // Add both schedules to user
      await addScheduleInUsers(firstSchedule);
      await addScheduleInUsers(secondSchedule);

      // Verify user has both schedules
      let userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(2);

      // Remove only the first schedule
      await removeScheduleFromUsers(firstSchedule);

      // Verify user still has the second schedule but not the first
      userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(1);
      expect(userResponse.body.fixed_schedules[0]).toMatchObject({
        id: secondSchedule.id,
        hour_of_the_day: secondSchedule.hour_of_the_day,
        week_day: secondSchedule.week_day
      });
    });

    it("Should handle non-existent users gracefully", async () => {
      const scheduleWithNonExistentUsers = {
        ...scheduleData,
        users_list: ["nonexistent@test.com", "another@test.com"]
      };

      // Should not throw an error even with non-existent users
      await expect(removeScheduleFromUsers(scheduleWithNonExistentUsers)).resolves.not.toThrow();
    });

    it("Should handle users with no fixed_schedules", async () => {
      // Create test user (which starts with no fixed_schedules)
      await request(httpServer).post("/users").send(userData);

      const scheduleWithUser = {
        ...scheduleData,
        users_list: [userData.email]
      };

      // Should not throw an error when trying to remove from user with no schedules
      await expect(removeScheduleFromUsers(scheduleWithUser)).resolves.not.toThrow();

      // Verify user still has no fixed_schedules
      const userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(0);
    });

    it("Should handle multiple schedules with same ID in users_list", async () => {
      // Create test user
      await request(httpServer).post("/users").send(userData);

      const scheduleWithUsers = {
        ...scheduleData,
        users_list: [userData.email, userData.email] // Same user twice
      };

      // Add the schedule first
      await addScheduleInUsers(scheduleWithUsers);

      // Verify the user has the schedule (will have 2 since same user is listed twice)
      let userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(2);

      // Now remove the schedule
      await removeScheduleFromUsers(scheduleWithUsers);

      // Verify the user no longer has the schedule
      userResponse = await request(httpServer).get(`/users/${userData.email}`);
      expect(userResponse.body.fixed_schedules).toHaveLength(0);
    });
  });
});
