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
import fastifyStatic from "@fastify/static";
// import fastifyStatic from "@fastify/static";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const PORT = parseInt(process.env.APP_PORT || "3000", 10); // Use 3000 as a fallback

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Typed API",
      version: "0.1.0",
      description: "My awesome API",
    },
  },
  transform: jsonSchemaTransform,
  // exposeHeadRoutes: true,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"), // Point to the *directory*
  prefix: "/", // Serve from the root URL
  index: "index.html", // Specify the index file name (important!)
  wildcard: false, // Important for single-page applications (SPAs)
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: 'full',
  },
  uiHooks: {
    onRequest: function (_, __, next) { next(); },
    preHandler: function (_, __, next) { next(); }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

app.register(routes);

// app.listen({ port: PORT }, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;
