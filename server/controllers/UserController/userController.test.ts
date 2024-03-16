import request from 'supertest';
import User from "../../models/User";
import { faker } from "@faker-js/faker";
import kernel from "../../kernel";
import {
  TestUserDto,
  TestUpdateDto,
  TestLoginDto,
} from "../../interface/test.interface";

describe("User Controller", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    const userData: TestUserDto = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      stateOfResidence: faker.location.state(),
      address: faker.location.streetAddress(),
      password: faker.internet.password(),
    };
    const newUser = await User.create(userData);
    userId = newUser._id;

    //Login to get auth token
    const signInData: TestLoginDto = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(kernel)
      .post("/api/v1/user/login")
      .send(signInData);

    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  it("should create a new user", async () => {
    const newUser: TestUserDto = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      stateOfResidence: faker.location.state(),
      password: faker.internet.password(),
    };

    const response: any = await request(kernel)
      .post("/api/v1/user/")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.phone).toBe(newUser.phone);
  });

  it("should update user profile", async () => {
    const updatedUser: TestUpdateDto = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      address: faker.location.streetAddress(),
      stateOfResidence: faker.location.state(),
    };

    const response: any = await request(kernel)
      .put(`/api/v1/user/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(updatedUser.firstname);
    expect(response.body.lastname).toBe(updatedUser.lastname);
    expect(response.body.stateOfResidence).toBe(updatedUser.stateOfResidence);
    expect(response.body.address).toBe(updatedUser.address);
  });

  it("should get list of users", async () => {
    const response: any = await request(kernel)
      .get("/api/v1/user/list-users")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a single user", async () => {
    const response: any = await request(kernel)
      .get(`/api/v1/user/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
    expect(response.body).toHaveProperty("email");
  });
});
