const configDb = {
  host: process.env.DB_HOST || "mongodb://127.0.0.1",
  port: process.env.DB_PORT || "27017",
  name: process.env.DB_NAME || "Ecommerce",
  url: process.env.DATABASE_URL
};

module.exports = configDb;
