import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from "./routes/routes";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const PORT = parseInt(process.env.APP_PORT || "3000", 10); // Use 3000 as a fallback

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  // exposeHeadRoutes: true,
  openapi: {
    info: {
      title: "Typed API",
      version: "0.1.0",
      description: "My awesome API",
    }, // Add a general description here
  },
  transform: jsonSchemaTransform,
});

/**
 * @description Serves the main application page (index.html).
 * @route GET /
 * @returns {string} 200 - The main application page.
 * @returns {string} 500 - Error loading page.
 * @tags Static
 * @example response - 200 - The main application page.
 **/
app.register(fastifyStatic, {
  root: path.join(__dirname, "./"),
  prefix: "/",
});

app.get("/", async (req, res) => {
  try {
    await res.sendFile("./src/index.html");
  } catch (err) {
    console.error("Error sending index.html:", err);
    res.status(500).send("Error loading page"); // Consider a more user-friendly error response
  }
});

app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.register(routes);

app.listen({ port: PORT }, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
