import z from "zod";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Interface representing a User.
 */
interface User {
  id: string;
  name: string;
  telephone: string;
  email: string;
  password: string;
}

/**
 * Registers routes for the Fastify application.
 *
 * @param app - The Fastify application instance.
 */
export default function routes(app: FastifyInstance): void {
  //ROUTE FOR TEST
  app.get("/test", async (req, reply) => {
    reply.send("Hello World");
  });

  /**
   * Route handler for fetching users.
   *
   * GET /users
   *
   * Query Parameters:
   * - name (optional): Filter users by name.
   * - email (optional): Filter users by email.
   * - telephone (optional): Filter users by telephone.
   *
   * Responses:
   * - 200: Array of users.
   * - 500: Error message.
   */
  app.get("/users", {
    schema: {
      tags: ["users"],
      querystring: z.object({
        name: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        telephone: z.string().optional().nullable(),
      }),
      description: "Fetch users",
      docs: {
        summary: "Retrieves a list of users.",
        description:
          "This endpoint fetches all users, optionally filtered by name, email, or telephone.",
      },
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            telephone: z.string(),
          })
        ),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      let users: User[] = [];
      try {
        if (Object.keys(req.query as object).length > 0) {
          const { name, email, telephone } = req.query as {
            name: string;
            email: string;
            telephone: string;
          };
          users = await prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: name, mode: "insensitive" } }, // Added insensitive mode
                { email: { contains: email, mode: "insensitive" } }, // Added insensitive mode
                { telephone: { contains: telephone } },
              ],
            },
          });
          reply.status(200).send(users);
        } else {
          users = await prisma.user.findMany();
          reply.status(200).send(users);
        }
      } catch (error: any) {
        console.error("Error getting users:", error);
        reply.status(500).send({ error: "Failed to get users" });
      }
    },
  });

  /**
   * Route handler for fetching a user by ID.
   *
   * GET /users/:id
   *
   * Path Parameters:
   * - id: The ID of the user to fetch.
   *
   * Responses:
   * - 200: User data.
   * - 404: User not found.
   * - 500: Error message.
   */
  app.get("/users/:id", {
    schema: {
      tags: ["users"],
      description: "Fetch user by id",
      docs: {
        summary: "Retrieves a list of users.",
        description: "This endpoint fetches a single one users by its ID.",
      },
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            telephone: z.string(),
          })
        ),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      const { id } = req.params as unknown as { id: string };
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        console.log("User:", user);

        if (user) {
          const { password: _, ...rest } = user; // Destructure and exclude password
          reply.status(200).send([rest]);
        } else {
          reply.status(404).send({ error: "User not found" });
        }
      } catch (error) {
        console.error("Error getting user:", error);
        reply.status(500).send({ error: "Failed to get user" });
      }
    },
  });

  /**
   * Route handler for updating a user by ID.
   *
   * PUT /users/:id
   *
   * Path Parameters:
   * - id: The ID of the user to update.
   *
   * Request Body:
   * - name: The new name of the user.
   * - password: The new password of the user.
   * - email: The new email of the user.
   * - telephone: The new telephone number of the user.
   *
   * Responses:
   * - 200: Updated user data.
   * - 500: Error message.
   */
  app.put(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        body: z.object({
          name: z.string(),
          password: z.string(),
          email: z.string().email(),
          telephone: z.string().max(9),
        }),
        description: "Updates the user data",
      },
    },
    async (req, reply) => {
      const { id } = req.params as unknown as { id: string };

      const { name, email, telephone } = req.body as unknown as {
        name: string;
        email: string;
        telephone: string;
      };
      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { name, email, telephone },
        });

        if (updatedUser) {
          const { password, ...rest } = updatedUser; // Destructure and exclude password
          return rest; // Return the remaining properties
        } else {
          return updatedUser;
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    }
  );

  /**
   * Route handler for deleting a user by ID.
   *
   * DELETE /users/:id
   *
   * Path Parameters:
   * - id: The ID of the user to delete.
   *
   * Responses:
   * - 204: No content.
   * - 404: User not found.
   * - 500: Error message.
   */
  app.delete(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        description: "Delete user",
        params: z.object({ id: z.string() }), // Validate params
        response: {
          204: z.null(), // 204 has no body
          404: z.object({ error: z.string() }).describe("Not Found"),
          500: z
            .object({ error: z.string() })
            .describe("Internal Server Error"),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as unknown as { id: string };
      try {
        await prisma.user.delete({
          where: { id },
        });
        reply.code(204).send();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  );
}
