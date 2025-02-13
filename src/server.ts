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

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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

app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.register(routes);

// app.listen({ port: 3333 }).then(() => {
//   console.log(`Server running on port 3333 at http://localhost:3333`);
// });

app.listen({ port: 3333 }, () => {
  console.log("Server listening on port 3000");
});
