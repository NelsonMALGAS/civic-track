import "dotenv/config";
import path from "node:path";
import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: path.resolve(process.cwd(), "db/migrations"),
    });

    console.log("Migration completed!");
  } catch (error) {
    console.error("Error during migrations:", error);
    process.exit(1);
  }
};

main();
