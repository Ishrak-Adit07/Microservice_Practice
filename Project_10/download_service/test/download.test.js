import request from "supertest";
// import app from "../app.js";
import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

const baseURL = "https://district12.xyz/auth";

describe("API Endpoint Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(mongodbURL, { dbName: "dfsa" });
  });

  const postDownloadRequest = (userData) => request(baseURL).post("/api/download/make").send(userData);

  it("should return success message for POST /api/download/make with valid name", async () => {
    const validUser = {
      name: "Jon Snow",
    };

    const response = await postDownloadRequest(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("download");
    expect(response.body.download).toHaveProperty("name", validUser.name);
  });

  it("should return 400 error for POST /api/download/make with missing name", async () => {
    const invalidUser = {
      // Name is missing
    };

    const response = await postDownloadRequest(invalidUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Name is required");
  });

  afterAll(async () => {
    // Clean up and close MongoDB connection
    try {
      // await Downloads.deleteOne({ name: "Jon Snow" }); // Cleanup if necessary
    } catch (err) {
      console.log(err);
    } finally {
      await mongoose.connection.close();
    }
  });
});