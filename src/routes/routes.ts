import z from "zod";
import { FastfifyTypedInstance } from "../types";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface User {
  id: string;
  name: string;
  telephone: string;
  email: string;
  password: string;
}

export default function routes(app: FastfifyTypedInstance): void {
  // Route handler for fetching users
  app.get("/users", {
    schema: {
      description: "Fetch users",
      tags: ["users"],
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            telephone: z.string(),
          })
        ),
      },
    },
    handler: async () => {
      let users: User[] = [];
      try {
        users = await prisma.user.findMany();
      } catch (error) {
        // console.error("Error getting users:", error);
      }
      return users;
    },
  });

  app.post(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["users"],
        body: z.object({
          name: z.string(),
          telephone: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              id: z.string(),
              name: z.string(),
              telephone: z.string(),
              email: z.string().email(),
            })
            .describe("User created successfully"),
        },
      },
    },
    // This route handler creates a new user
    async (request, reply) => {
      const { name, telephone, email, password } = request.body;
      // let id: string = randomUUID();

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const newUser = await prisma.user.create({
          data: {
            name: name,
            email: email,
            telephone: telephone,
            password: hashedPassword,
          },
        }); // Exclude password from the response

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  );

  app.put(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        body: z.object({
          name: z.string(),
          password: z.string(),
          email: z.string().email(),
        }),
        description: "Updates the user data",
      },
    },
    async (req, reply) => {
      const { id } = req.params as unknown as { id: string };
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (user) {
          const { password, ...rest } = user; // Destructure and exclude password
          return rest; // Return the remaining properties
        } else {
          return user;
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    }
  );

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
