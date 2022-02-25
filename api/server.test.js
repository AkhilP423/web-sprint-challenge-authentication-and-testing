const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");
const Jokes = require("../api/jokes/jokes-model");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("Auth Tests", () => {
  
  test("Successful registration, returns 200", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Anon", password: "123456" });
    expect(res.status).toBe(200);
  });

  test("Welcomes a new user.", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Anony", password: "1234567" });
    expect(res.body.message).toBe("Welcome, Anony");
  });

  test("Successful Login", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Anon", password: "123456" });
    expect(res.status).toBe(200);
  });

  test("401 if wrong info", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Akhil", password: "balls123" });
    expect(res.status).toBe(401);
  });
});

/*file should be finished, these are straightforward tests.*/