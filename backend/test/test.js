const {app} = require("../server");
const request = require("supertest");
const process = require('process')

describe("User API", () => {
  let token;

  beforeAll((done) => {
    done();
  });

  describe("POST /auth/users", () => {
    it("registers a new Recruiter", async () => {
      const newUser = {
        type: "recruiter",
        name: "pranjal sharma",
        email: "pranjsalsskssvjbb.sharma@iiitb.ac.in",
        password: "1234588888",
        bio: "Hi i am recruiter",
        contactNumber: "+916260151299",
      };

      const response = await request(app).post("/auth/signup").send(newUser);
      expect(response.status).toBe(400);
    }, 20000);

    it("returns an error if required fields are missing", async () => {
      const newUser = {
        type: "recruiter",
        name: "pranjal sharma",
        email: "sharmapranjal@iiitb.ac.in",
        password: "1234688",
        bio: "Hi i am recruiter",
        contactNumber: "+916260101990",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(newUser)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    }, 20000);
  });

  describe("POST /auth/login", () => {
    it("logs in a user with valid credentials", async () => {
      const credentials = {
        email: "Utkarsh99.Shrivastava@gmail.com",
        password: "12345678",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("type");
    },2000);

    it("returns an error for invalid credentials", async () => {
      const credentials = {
        email: "Utkarsh99.Shrivasbvjftava@gmail.com",
        password: "123cvhd45678",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(credentials);

      expect(response.status).toBe(401);
    },20000);
  });

  afterAll(() => setTimeout(() => process.exit(), 1000));
});
