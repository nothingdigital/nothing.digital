import https from "node:https";
import tls from "node:tls";

const DOMAIN = "nothing.digital";

function getHeaders(): Promise<Record<string, string | string[] | undefined>> {
  return new Promise((resolve, reject) => {
    https
      .get(`https://${DOMAIN}/`, { method: "HEAD" }, (res) => {
        res.resume();
        resolve(res.headers);
      })
      .on("error", reject);
  });
}

function getTlsInfo(): Promise<{
  protocol?: string | null;
  cipher?: string | null;
  certificate?: tls.DetailedPeerCertificate;
}> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: DOMAIN,
        port: 443,
        servername: DOMAIN,
      },
      () => {
        const certificate = socket.getPeerCertificate(true);
        const protocol = socket.getProtocol();
        const cipher = socket.getCipher().name;
        socket.end();
        resolve({ protocol, cipher, certificate });
      },
    );
    socket.setTimeout(5000, () => socket.destroy());
    socket.on("error", reject);
  });
}

function formatDate(date?: Date | string) {
  if (!date) return "unknown";
  return new Date(date).toISOString();
}

async function main() {
  console.log(`SSL/TLS smoke check for ${DOMAIN}\n`);

  const headers = await getHeaders();
  const hsts = headers["strict-transport-security"];
  console.log(`HSTS header: ${hsts ?? "(missing)"}`);

  const { protocol, cipher, certificate } = await getTlsInfo();
  console.log(`Protocol: ${protocol ?? "unknown"}`);
  console.log(`Cipher: ${cipher ?? "unknown"}`);
  console.log(`Subject: ${certificate?.subject?.CN ?? "unknown"}`);
  console.log(`Issuer: ${certificate?.issuer?.O ?? "unknown"}`);
  console.log(`Not before: ${formatDate(certificate?.valid_from)}`);
  console.log(`Not after: ${formatDate(certificate?.valid_to)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
