const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;

var token;
let stationID;
let pointID;
let dateFrom;
let dateTo;
let format;
let vehicleID;
let providerID;

const url = "http://localhost:8765";

chai.use(chaiHttp);

/* process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; */

describe("Chapter 5.6 The provider route", () => {
  describe("0. Login", () => {
    describe("1. /PATCH /login Invalid Username", () => {
      it("Invalid username", (done) => {
        chai
          .request(url)
          .patch("/evcharge/api/login")
          .set("content-type", "application/x-www-form-urlencoded")
          .send({ username: "invalidname", password: "owner5594" })
          .end((err, res, body) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("Invalid credentials, could not log you in.");
            done();
          });
      });
    });
    describe("2. /PATCH /login Invalid Password", () => {
      it("Invalid password", (done) => {
        chai
          .request(url)
          .patch("/evcharge/api/login")
          .set("content-type", "application/x-www-form-urlencoded")
          .send({ username: "owner5594", password: "invalidpassword" })
          .end((err, res, body) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("Invalid credentials, could not log you in.");
            done();
          });
      });
    });
    describe("3. /PATCH /login Invalid Both", () => {
      it("Invalid username and password", (done) => {
        chai
          .request(url)
          .patch("/evcharge/api/login")
          .set("content-type", "application/x-www-form-urlencoded")
          .send({ username: "invalidusername", password: "invalidpassword" })
          .end((err, res, body) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("Invalid credentials, could not log you in.");
            done();
          });
      });
    });
    describe("4. /PATCH /login Valid login", () => {
      it("Valid credentials", (done) => {
        chai
          .request(url)
          .patch("/evcharge/api/login")
          .set("content-type", "application/x-www-form-urlencoded")
          .send({ username: "owner850", password: "owner850" })
          .end((err, res, body) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              userId: "userId",
              email: "email",
              username: "username",
              lastCharge: "lastCharge",
              token: "token",
              type: "type",
            });
            token = res.body.token;
            done();
          });
      });
    });
  });

  describe("5.6 Sessions Per Provider route", () => {
    describe("5.6.1 /GET Get data with valid inputs", () => {
      it("Valid Provider and dates", (done) => {
        providerID = "1451";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              provider: "provider",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("provider");

            res.body.provider.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                ProviderID: "ProviderID",
                ProviderName: "ProviderName",
                StationID: "StationID",
                SessionID: "SessionID",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                TotalCost: "TotalCost",
                VehicleID: "VehicleID",
              });
            });
            done();
          });
      });
    });
    describe("5.6.2 /GET Get data invalid token", () => {
      it("Invalid token", (done) => {
        providerID = "1451";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer 123321312312`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(401);
            res.body.should.have
              .property("message")
              .eql("Authentication failed");
            done();
          });
      });
    });
    describe("5.6.3 /GET Get data no token", () => {
      it("No token", (done) => {
        providerID = "1451";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(401);
            res.body.should.have
              .property("message")
              .eql("Authentication failed");
            done();
          });
      });
    });
    describe("5.6.4 /GET Get data dateFrom > dateTo", () => {
      it("Date from > date to", (done) => {
        providerID = "1451";
        dateFrom = "20190909";
        dateTo = "20180909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            res.body.should.have.property("message").eql("Bad Date order");
            done();
          });
      });
    });
    describe("5.6.5 /GET Get data empty response", () => {
      it("Empty response, no provider for given time period", (done) => {
        providerID = "1451";
        dateFrom = "20000909";
        dateTo = "20010909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(402);
            res.body.should.have
              .property("message")
              .eql("Could not find sessions for selected period");
            done();
          });
      });
    });
    describe("5.6.6 /GET Get data invalid Provider ID", () => {
      it("Invalid Provider ID", (done) => {
        providerID = "43124142";
        dateFrom = "20180909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            res.body.should.have
              .property("message")
              .eql("Could not find a provider with the current id.");
            done();
          });
      });
    });
    describe("5.6.7 /GET Get data invalid format parameter", () => {
      it("Invalid format parameter", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=png";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}${format}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            res.body.should.have
              .property("message")
              .eql(
                "Invalid format parameter input, correct format is yyyymmdd and then json or csv."
              );
            done();
          });
      });
    });
    describe("5.6.8 /GET Get data with valid inputs and format=json", () => {
      it("With valid inputs and format=json", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=json";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}${format}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              provider: "provider",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("provider");

            res.body.provider.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                ProviderID: "ProviderID",
                ProviderName: "ProviderName",
                StationID: "StationID",
                SessionID: "SessionID",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                TotalCost: "TotalCost",
                VehicleID: "VehicleID",
              });
            });
            done();
          });
      });
    });
    describe("5.6.9 /GET Get data with valid inputs and format=csv", () => {
      it("With valid inputs and format=csv", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=csv";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}${format}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("Write to providerResults.csv successfully!");
            done();
          });
      });
    });
    describe("5.6.10 /GET Get data with dayFrom input > 31", () => {
      it("With dayFrom input > 31", (done) => {
        providerID = "1451";
        dateFrom = "20180932";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("There are no more than 31 days in a month");
            done();
          });
      });
    });
    describe("5.6.11 /GET Get data with dayTo input > 31", () => {
      it("With dayTo input > 31", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20200932";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("There are no more than 31 days in a month");
            done();
          });
      });
    });
    describe("5.6.12 /GET Get data with monthFrom input > 12", () => {
      it("With monthFrom input > 12", (done) => {
        providerID = "1451";
        dateFrom = "20181309";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("There are no more than 12 months in a year");
            done();
          });
      });
    });
    describe("5.6.13 /GET Get data with monthTo input > 12", () => {
      it("With monthTo input > 12", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20201309";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("There are no more than 12 months in a year");
            done();
          });
      });
    });
    describe("5.6.14 /GET Get data with dateTo > curDate", () => {
      it("With dateTo > curDate", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20220909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.15 /GET Get data with monthFrom with 30 days input 31", () => {
      it("With monthFrom with 30 days input 31", (done) => {
        providerID = "1451";
        dateFrom = "20181131";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.16 /GET Get data with monthTo with 30 days input 31", () => {
      it("With monthTo with 30 days input 31", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20201131";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.17 /GET Get data with FebruaryFrom input > 28 while not 2020", () => {
      it("With FebruaryFrom input > 28 while not 2020", (done) => {
        providerID = "1451";
        dateFrom = "20180229";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.18 /GET Get data with FebruaryTo input > 28 while not 2020", () => {
      it("With FebruaryTo input > 28 while not 2020", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20190229";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.19 /GET Get data with FebruaryFrom input = 29 while 2020", () => {
      it("With FebruaryFrom input = 29 while 2020", (done) => {
        providerID = "1451";
        dateFrom = "20200229";
        dateTo = "20200629";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              provider: "provider",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("provider");

            res.body.provider.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                ProviderID: "ProviderID",
                ProviderName: "ProviderName",
                StationID: "StationID",
                SessionID: "SessionID",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                TotalCost: "TotalCost",
                VehicleID: "VehicleID",
              });
            });
            done();
          });
      });
    });
    describe("5.6.20 /GET Get data with FebruaryTo input = 29 while 2020", () => {
      it("With FebruaryTo input = 29 while 2020", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20200229";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              provider: "provider",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("provider");

            res.body.provider.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                ProviderID: "ProviderID",
                ProviderName: "ProviderName",
                StationID: "StationID",
                SessionID: "SessionID",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                TotalCost: "TotalCost",
                VehicleID: "VehicleID",
              });
            });
            done();
          });
      });
    });
    describe("5.6.21 /GET Get data with FebruaryFrom input > 29 while 2020", () => {
      it("With FebruaryFrom input > 29 while 2020", (done) => {
        providerID = "1451";
        dateFrom = "20200230";
        dateTo = "20200609";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.22 /GET Get data with FebruaryTo input > 29 while 2020", () => {
      it("With FebruaryTo input > 29 while 2020", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "20190230";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Invalid Date");
            done();
          });
      });
    });
    describe("5.6.23 /GET Get data with invalid dateFrom length", () => {
      it("With invalid dateFrom length", (done) => {
        providerID = "1451";
        dateFrom = "201809090";
        dateTo = "20200909";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have.property("message").eql("Bad Date length");
            done();
          });
      });
    });
    describe("5.6.24 /GET Get data with invalid dateTo length", () => {
      it("With invalid dateTo length", (done) => {
        providerID = "1451";
        dateFrom = "20180909";
        dateTo = "202009090";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerProvider/${providerID}/${dateFrom}/${dateTo}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql(
                "Correct format is yyyymmdd + '&format=' and then csv or json."
              );
            done();
          });
      });
    });
  });

  describe("5.6l. Logout /POST /logout Valid logout", () => {
    it("Valid token", (done) => {
      chai
        .request(url)
        .post("/evcharge/api/logout")
        .set("x-observatory-auth", `Bearer ${token}`)
        .end((err, res, body) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res).to.be.an("object");
          res.body.should.have.property("message").eql("User logged out");
          done();
        });
    });
  });
});
