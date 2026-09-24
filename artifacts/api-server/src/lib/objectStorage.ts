import { randomUUID } from "node:crypto";

const SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const parts = normalized.split("/");
  if (parts.length < 3 || !parts[1] || !parts.slice(2).join("/")) throw new Error("Invalid object path");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

async function signObjectUrl(bucketName: string, objectName: string, method: "GET" | "PUT"): Promise<string> {
  const response = await fetch(`${SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_name: bucketName,
      object_name: objectName,
      method,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Object storage signing failed: ${response.status}`);
  const body = await response.json() as { signed_url?: string };
  if (!body.signed_url) throw new Error("Object storage returned no signed URL");
  return body.signed_url;
}

export function getPrivateObjectDir(): string {
  const value = process.env.PRIVATE_OBJECT_DIR;
  if (!value) throw new Error("PRIVATE_OBJECT_DIR is not configured");
  return value.replace(/\/$/, "");
}

export async function createImageUploadUrl(): Promise<{ uploadURL: string; objectPath: string }> {
  const { bucketName, objectName } = parseObjectPath(`${getPrivateObjectDir()}/uploads/${randomUUID()}`);
  return {
    uploadURL: await signObjectUrl(bucketName, objectName, "PUT"),
    objectPath: `/objects/${objectName}`,
  };
}

export async function createImageReadUrl(objectPath: string): Promise<string> {
  if (!objectPath.startsWith("/objects/")) throw new Error("Invalid object path");
  const { bucketName, objectName } = parseObjectPath(`${getPrivateObjectDir()}/${objectPath.slice("/objects/".length)}`);
  return signObjectUrl(bucketName, objectName, "GET");
}

export async function verifyUploadedImage(objectPath: string, contentType: string, expectedSize: number): Promise<boolean> {
  const response = await fetch(await createImageReadUrl(objectPath), { signal: AbortSignal.timeout(30_000) });
  if (!response.ok || !response.body) return false;
  const contentLength = Number(response.headers.get("content-length") ?? expectedSize);
  if (!Number.isFinite(contentLength) || contentLength !== expectedSize || expectedSize > 10 * 1024 * 1024) return false;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length !== expectedSize) return false;
  if (contentType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === "image/png") return bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index]);
  if (contentType === "image/gif") return new TextDecoder().decode(bytes.slice(0, 4)) === "GIF8";
  if (contentType === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return false;
}