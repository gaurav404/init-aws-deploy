import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";
/* ROUTES IMPORT */
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
/* CONFIGURATION */
dotenv.config();
const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "Example Express API documented with Swagger",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Todo: {
        type: "object",
        properties: {
          id: { type: "string", example: "abc123" },
          title: { type: "string", example: "Buy milk" },
          done: { type: "boolean", example: false },
        },
        required: ["title"],
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./index.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

// Reads .env (by default from the current working directory).
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Cross-Origin-Resource-Policy: cross-origin
app.use(cors());
app.use(morgan("common"));

/* ROUTES */

app.use('/tenant', authMiddleware(['tenant']), tenantRoutes);

app.use('/manager', authMiddleware(['manager']), managerRoutes);


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs-json", (_req, res) => res.json(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World4");
});
/* READ .ENV */
const port = Number(process.env.PORT) || 3000;

/* SERVER */
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port2 ${port}`);
});