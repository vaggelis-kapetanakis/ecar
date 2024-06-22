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

describe("Chapter 5.4 The vehicle route", () => {
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

  describe("5.4 Sessions Per Vehicle route", () => {
    describe("5.4.1 /GET Get data with valid inputs", () => {
      it("Valid Vehicle and dates", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              VehicleID: "VehicleID",
              RequestTimestamp: "RequestTimestamp",
              PeriodFrom: "PeriodFrom",
              PeriodTo: "PeriodTo",
              TotalEnergyConsumed: "TotalEnergyConsumed",
              NumberOfVisitedPoints: "NumberOfVisitedPoints",
              NumberOfVehicleChargingSessions:
                "NumberOfVehicleChargingSessions",
              VehicleChargingSessionsList: "VehicleChargingSessionsList",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("VehicleChargingSessionsList");

            res.body.VehicleChargingSessionsList.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                SessionIndex: "SessionIndex",
                SessionID: "SessionID",
                EnergyProvider: "EnergyProvider",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                SessionCost: "SessionCost",
              });
            });
            done();
          });
      });
    });
    describe("5.4.2 /GET Get data invalid token", () => {
      it("Invalid token", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.3 /GET Get data no token", () => {
      it("No token", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20190909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.4 /GET Get data dateFrom > dateTo", () => {
      it("Date from > date to", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20190909";
        dateTo = "20180909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            res.body.should.have.property("message").eql("Bad Date order");
            done();
          });
      });
    });
    describe("5.4.5 /GET Get data empty response", () => {
      it("Empty response, no vehicle for given time period", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20000909";
        dateTo = "20010909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.6 /GET Get data invalid Vehicle ID", () => {
      it("Invalid Vehicle ID", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d";
        dateFrom = "20180909";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            res.body.should.have
              .property("message")
              .eql("Could not find a vehicle with the provided id");
            done();
          });
      });
    });
    describe("5.4.7 /GET Get data invalid format parameter", () => {
      it("Invalid format parameter", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=png";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}${format}`
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
    describe("5.4.8 /GET Get data with valid inputs and format=json", () => {
      it("With valid inputs and format=json", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=json";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}${format}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              VehicleID: "VehicleID",
              RequestTimestamp: "RequestTimestamp",
              PeriodFrom: "PeriodFrom",
              PeriodTo: "PeriodTo",
              TotalEnergyConsumed: "TotalEnergyConsumed",
              NumberOfVisitedPoints: "NumberOfVisitedPoints",
              NumberOfVehicleChargingSessions:
                "NumberOfVehicleChargingSessions",
              VehicleChargingSessionsList: "VehicleChargingSessionsList",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("VehicleChargingSessionsList");

            res.body.VehicleChargingSessionsList.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                SessionIndex: "SessionIndex",
                SessionID: "SessionID",
                EnergyProvider: "EnergyProvider",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                SessionCost: "SessionCost",
              });
            });
            done();
          });
      });
    });
    describe("5.4.9 /GET Get data with valid inputs and format=csv", () => {
      it("With valid inputs and format=csv", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20200909";
        format = "&format=csv";
        chai
          .request(url)
          .get(
            `/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}${format}`
          )
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            res.body.should.have
              .property("message")
              .eql("Write to vehicleResults.csv successfully!");
            done();
          });
      });
    });
    describe("5.4.10 /GET Get data with dayFrom input > 31", () => {
      it("With dayFrom input > 31", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180932";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.11 /GET Get data with dayTo input > 31", () => {
      it("With dayTo input > 31", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20200932";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.12 /GET Get data with monthFrom input > 12", () => {
      it("With monthFrom input > 12", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20181309";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.13 /GET Get data with monthTo input > 12", () => {
      it("With monthTo input > 12", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20201309";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.14 /GET Get data with dateTo > curDate", () => {
      it("With dateTo > curDate", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20220909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.15 /GET Get data with monthFrom with 30 days input 31", () => {
      it("With monthFrom with 30 days input 31", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20181131";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.16 /GET Get data with monthTo with 30 days input 31", () => {
      it("With monthTo with 30 days input 31", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20201131";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.17 /GET Get data with FebruaryFrom input > 28 while not 2020", () => {
      it("With FebruaryFrom input > 28 while not 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180229";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.18 /GET Get data with FebruaryTo input > 28 while not 2020", () => {
      it("With FebruaryTo input > 28 while not 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20190229";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.19 /GET Get data with FebruaryFrom input = 29 while 2020", () => {
      it("With FebruaryFrom input = 29 while 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20200229";
        dateTo = "20200629";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              VehicleID: "VehicleID",
              RequestTimestamp: "RequestTimestamp",
              PeriodFrom: "PeriodFrom",
              PeriodTo: "PeriodTo",
              TotalEnergyConsumed: "TotalEnergyConsumed",
              NumberOfVisitedPoints: "NumberOfVisitedPoints",
              NumberOfVehicleChargingSessions:
                "NumberOfVehicleChargingSessions",
              VehicleChargingSessionsList: "VehicleChargingSessionsList",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("VehicleChargingSessionsList");

            res.body.VehicleChargingSessionsList.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                SessionIndex: "SessionIndex",
                SessionID: "SessionID",
                EnergyProvider: "EnergyProvider",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                SessionCost: "SessionCost",
              });
            });
            done();
          });
      });
    });
    describe("5.4.20 /GET Get data with FebruaryTo input = 29 while 2020", () => {
      it("With FebruaryTo input = 29 while 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20200229";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
          .set("x-observatory-auth", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res).to.be.an("object");
            expect(res).to.have.nested.property("body").that.includes.all.keys({
              VehicleID: "VehicleID",
              RequestTimestamp: "RequestTimestamp",
              PeriodFrom: "PeriodFrom",
              PeriodTo: "PeriodTo",
              TotalEnergyConsumed: "TotalEnergyConsumed",
              NumberOfVisitedPoints: "NumberOfVisitedPoints",
              NumberOfVehicleChargingSessions:
                "NumberOfVehicleChargingSessions",
              VehicleChargingSessionsList: "VehicleChargingSessionsList",
            });
            expect(res)
              .to.have.nested.property("body")
              .to.have.nested.property("VehicleChargingSessionsList");

            res.body.VehicleChargingSessionsList.forEach((elt, index) => {
              expect(elt).to.have.all.keys({
                SessionIndex: "SessionIndex",
                SessionID: "SessionID",
                EnergyProvider: "EnergyProvider",
                StartedOn: "StartedOn",
                FinishedOn: "FinishedOn",
                EnergyDelivered: "EnergyDelivered",
                CostPerKWh: "CostPerKWh",
                SessionCost: "SessionCost",
              });
            });
            done();
          });
      });
    });
    describe("5.4.21 /GET Get data with FebruaryFrom input > 29 while 2020", () => {
      it("With FebruaryFrom input > 29 while 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20200230";
        dateTo = "20200609";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.22 /GET Get data with FebruaryTo input > 29 while 2020", () => {
      it("With FebruaryTo input > 29 while 2020", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "20190230";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.23 /GET Get data with invalid dateFrom length", () => {
      it("With invalid dateFrom length", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "201809090";
        dateTo = "20200909";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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
    describe("5.4.24 /GET Get data with invalid dateTo length", () => {
      it("With invalid dateTo length", (done) => {
        vehicleID = "430ca2cd-bd4b-482a-8776-85a8c7d3435c";
        dateFrom = "20180909";
        dateTo = "202009090";
        chai
          .request(url)
          .get(`/evcharge/api/SessionsPerEV/${vehicleID}/${dateFrom}/${dateTo}`)
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

  describe("5.4l. Logout /POST /logout Valid logout", () => {
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
