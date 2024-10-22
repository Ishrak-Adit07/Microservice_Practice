import request from "supertest";
import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

const baseURL = "https://district12.xyz/down";
const authBaseURL = "https://district12.xyz/auth";

describe("API Endpoint Tests", () => {
  let webToken;

  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(mongodbURL, { dbName: "dfsa" });

    // Perform login to retrieve webToken
    const validLoginUser = {
      name: "Jon Snow",
      password: "jon"
    };

    const loginResponse = await request(authBaseURL)
      .post("/api/user/login")
      .send(validLoginUser);

    expect(loginResponse.statusCode).toBe(201);
    expect(loginResponse.body).toHaveProperty("webToken");

    webToken = loginResponse.body.webToken;
  });

  const postDownloadRequest = (userData) =>
    request(baseURL)
      .post("/api/download/make")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${webToken}`)
      .send(userData);

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