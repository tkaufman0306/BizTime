/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://tkaufman:tyson123@127.0.0.1:5432/biztime";
} else {
  DB_URI = "postgresql://tkaufman:tyson123@127.0.0.1:5432/biztime";
}

// postgresql://tkaufman:tyson123@127.0.0.1:5432/biztime

const client = new Client({
  connectionString: DB_URI,
});

client.connect();

module.exports = client;
