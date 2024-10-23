import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

describe("API Endpoint Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(mongodbURL, { dbName: "dfsa" });
  });

  const postPaymentRequest = (paymentData) =>
    request(app).post("/api/payment/make").send(paymentData);

  it("should return success message for POST /api/payment/make with valid name and payment", async () => {
    const validPaymentData = {
      name: "Jon Snow",
      payment: 100, // Assuming payment is a number
    };

    const response = await postPaymentRequest(validPaymentData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("payment_done");
    expect(response.body.payment_done).toHaveProperty(
      "name",
      validPaymentData.name
    );
    expect(response.body.payment_done).toHaveProperty(
      "payment",
      validPaymentData.payment
    );
  });

  it("should return 400 error for POST /api/payment/make with missing fields", async () => {
    const invalidPaymentData = {
      name: "Jon Snow",
      // Payment is missing
    };

    const response = await postPaymentRequest(invalidPaymentData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required");
  });

  it("should return 400 error for POST /api/payment/make with both fields missing", async () => {
    const invalidPaymentData = {
      // Both name and payment are missing
    };

    const response = await postPaymentRequest(invalidPaymentData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required");
  });

  afterAll(async () => {
    // Clean up and close MongoDB connection
    try {
      // await Payment.deleteOne({ name: "Jon Snow" }); // Cleanup if necessary
    } catch (err) {
      console.log(err);
    } finally {
      await mongoose.connection.close();
    }
  });
});
