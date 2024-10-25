/** tests for companies routes */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", function () {
  
    test("It should respond with an array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      "companies": [
        { code: "apple", name: "Apple" },
        { code: "ibm", name: "IBM" },
      ],
    });
  });
});

describe("GET /apple", function () {
  test("It should return company info", async function () {
    const response = await request(app).get("/companies/apple");
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "Apple",
        description: "Maker of OSX.",
        invoices: [1, 2],
      },
    });
  });

  test("It should return 404 for no such company", async function () {
    const response = await request(app).get("/companies/blargh");
    expect(response.status).toEqual(404);
  });
});

describe("POST /", function () {
  test("It should add a company", async function () {
    const response = await request(app)
      .post("/companies")
      .send({ name: "JerseyMikes", description: "Sliced" });

    expect(response.body).toEqual({
      company: {
        code: "jerseymikes",
        name: "JerseyMikes",
        description: "Sliced",
      },
    });
  });

  test("It should return 500 for conflict", async function () {
    const response = await request(app)
      .post("/companies")
      .send({ name: "Apple", description: "Huh?" });

    expect(response.status).toEqual(500);
  });
});

describe("PUT /", function () {
  test("It should modify a company", async function () {
    const response = await request(app)
      .put("/companies/apple")
      .send({ name: "AppleEdit", description: "NewApple" });

    expect(response.body).toEqual({
      "company": {
        code: "apple",
        name: "AppleEdit",
        description: "NewApple",
      },
    });
  });

  test("It should return 404 for no such company", async function () {
    const response = await request(app)
      .put("/companies/blargh")
      .send({ name: "blargh" });

    expect(response.status).toEqual(404);
  });

  test("It should return 500 for missing data", async function () {
    const response = await request(app).put("/companies/apple").send({});

    expect(response.status).toEqual(500);
  });
});

describe("DELETE /", function () {
  test("It should delete a company", async function () {
    const response = await request(app).delete("/companies/apple");

    expect(response.body).toEqual({ status: "deleted" });
  });

  test("It should return 404 for no-such-company", async function () {
    const response = await request(app).delete("/companies/blargh");

    expect(response.status).toEqual(404);
  });
});
