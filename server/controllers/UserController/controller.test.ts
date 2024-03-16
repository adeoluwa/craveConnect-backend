import request from "supertest";
import User from "../../models/User";
import UserController from "./user.controller";
import kernel from "../../kernel";
import { faker } from "@faker-js/faker";
import { ObjectId } from "mongoose";

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});

describe("POST /api/v1/user", () => {
  it("should create a new user", async () => {
    const userData = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      stateOfResidence: faker.location.state(),
      address: faker.location.streetAddress(),
      password: faker.internet.password(),
    };
  });
});
