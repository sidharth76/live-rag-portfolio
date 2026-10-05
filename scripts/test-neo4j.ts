import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const uri = process.env.NEO4J_URI!;
  const username = process.env.NEO4J_USERNAME!;
  const password = process.env.NEO4J_PASSWORD!;
  const database = process.env.NEO4J_DATABASE || "neo4j";

  console.log("Neo4j configuration:");
  console.log("URI:", uri);
  console.log("Username:", username);
  console.log("Database:", database);
  console.log("Password present:", !!password);

  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
  );

  try {
    console.log("\nTesting Neo4j connectivity...");

    await driver.verifyConnectivity();

    console.log("✅ Neo4j authentication successful!");

    const session = driver.session({ database });

    try {
      const result = await session.run("RETURN 1 AS result");

      console.log(
        "✅ Database query successful:",
        result.records[0].get("result").toString()
      );
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error("\n❌ Neo4j connection failed:");
    console.error(error);
  } finally {
    await driver.close();
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});