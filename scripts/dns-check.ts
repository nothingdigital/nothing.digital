import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";

const execFile = promisify(execFileCb);

const DOMAIN = "nothing.digital";

const RESOLVERS = ["8.8.8.8", "1.1.1.1", "9.9.9.9", "208.67.222.222"];

const QUERIES: Array<{ type: string; name: string }> = [
  { type: "A", name: DOMAIN },
  { type: "AAAA", name: DOMAIN },
  { type: "TXT", name: DOMAIN },
  { type: "NS", name: DOMAIN },
  { type: "CNAME", name: `www.${DOMAIN}` },
  { type: "MX", name: DOMAIN },
];

async function dig(resolver: string, type: string, name: string) {
  try {
    const { stdout } = await execFile("dig", [
      `@${resolver}`,
      name,
      type,
      "+short",
    ]);
    return stdout.trim() || "(no records)";
  } catch (error) {
    return `error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

async function main() {
  console.log(`DNS propagation check for ${DOMAIN}\n`);

  for (const query of QUERIES) {
    console.log(`--- ${query.type} ${query.name} ---`);
    for (const resolver of RESOLVERS) {
      const result = await dig(resolver, query.type, query.name);
      console.log(`  ${resolver}: ${result.replace(/\n/g, " | ")}`);
    }
    console.log();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
