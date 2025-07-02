const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { WebSocketServer } = require("ws");
const http = require("http");
const fs = require("fs");
const mqtt = require("mqtt");

// Initialize
dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({  server, path: "/ws" });

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const Error = require("./middleware/error");
const ParentRoute = require("./routes/parent");
const ChildrenRoute = require("./routes/children");
const AdminRoute = require("./routes/admin");
///api/admin/create-admin
app.use("/api/parent", ParentRoute);
app.use("/api/children", ChildrenRoute);
app.use("/api/admin", AdminRoute);
app.use(Error);

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_MONGO_URL)
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.log("❌ Mongo Error:", err);
  });

// ===================
// MQTT + WebSocket
// ===================

const awsEndpoint = process.env.AWS_IOT_ENDPOINT;
const topic = process.env.MQTT_TOPIC || "sensor/data";

const mqttOptions = {
  key: fs.readFileSync(process.env.AWS_KEY_PATH),
  cert: fs.readFileSync(process.env.AWS_CERT_PATH),
  ca: fs.readFileSync(process.env.AWS_CA_PATH),
  protocol: "mqtts",
  clientId: "NodeJSClient",
};

let latestData = { temperature: 0, humidity: 0, mq2: 0 };

const mqttClient = mqtt.connect(`mqtts://${awsEndpoint}`, mqttOptions);

mqttClient.on("connect", () => {
  console.log("✅ Connected to AWS IoT Core");
  mqttClient.subscribe(topic, (err) => {
    if (err) console.error("❌ MQTT Subscribe Error:", err);
    else console.log(`📡 Subscribed to ${topic}`);
  });
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    latestData = data;
    broadcastToClients(data);
  } catch (err) {
    console.error("❌ MQTT message parse error:", err);
  }
});

mqttClient.on("error", (err) => {
  console.error("❌ MQTT Error:", err);
});

function broadcastToClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

// Optional endpoint to get latest sensor data
app.get("/api/sensor/latest", (req, res) => {
  res.json(latestData);
});

// Start Server
const port = process.env.PORT || 8000;
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
