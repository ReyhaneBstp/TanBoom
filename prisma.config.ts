import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config();

export default defineConfig({
  schema: "server/prisma/schema.prisma",
});