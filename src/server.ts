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
  routePrefix: "/docs",
  exposeRoute: true,
  transform: jsonSchemaTransform,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"), // Point to the *directory*
  prefix: "/", // Serve from the root URL
  // Optionally, add these for better handling of index files:
  index: "index.html", // Specify the index file name (important!)
  // This option is important to serve static files correctly, especially with SPA.
  // It will make sure that if the user requests a path that is not a file, it will serve index.html
  // This is crucial for SPA to handle the routing on the client side.
  wildcard: false, // Important for single-page applications (SPAs)
});

// app.get("/", (req, res) => {
//   //D:\Projectos\others\api\public\index.html
//   console.log(path.join(__dirname, "../public/index.html"));
//   res.status(200).send("HEllo word");
// });

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  static: {
    //url: '/static', //this is optional
    prefix: "/docs",
  },
});

app.register(routes);

// app.listen({ port: PORT }, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});
