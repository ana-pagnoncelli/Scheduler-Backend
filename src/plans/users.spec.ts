import request from "supertest";
import { httpServer } from "../setupTests";
import {
  planData,
  planData2,
  planDataWithMissingName,
  updatedPlanData
} from "./fixtures";

describe("Plans", () => {
  describe("POST / ", () => {
    it("Should create a plan when all required fields are given", async () => {
      const response = await request(httpServer).post("/plans").send(planData);
      expect(response.statusCode).toBe(200);
    });
    it("Should not create a plan when a field is missing", async () => {
      const response = await request(httpServer)
        .post("/plans")
        .send(planDataWithMissingName);
      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET / ", () => {
    it("Should return the all the plans", async () => {
      await request(httpServer).post("/plans").send(planData2);
      const response = await request(httpServer).get("/plans");
      expect(response.body).toMatchObject([planData, planData2]);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /:id ", () => {
    it("Should return the searched plan", async () => {
      const response = await request(httpServer).get(`/plans/${planData.id}`);
      expect(response.body).toMatchObject(planData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /:id ", () => {
    it("Should return the plan updated", async () => {
      const response = await request(httpServer)
        .put(`/plans/${planData.id}`)
        .send(updatedPlanData);
      expect(response.body).toMatchObject(updatedPlanData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /:id ", () => {
    it("Should delete the user", async () => {
      const response = await request(httpServer).delete(
        `/plans/${planData.id}`
      );
      expect(response.statusCode).toBe(200);
    });
  });
});
