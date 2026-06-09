import mysql from "mysql2/promise";

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "klassic",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}

export default pool;