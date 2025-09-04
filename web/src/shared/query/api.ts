export async function fetchJSON<T>(
  url: string,
  init?: RequestInit,
): Promise<T | undefined> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined;
  if (res.headers.get("content-length") === "0") return undefined;
  return res.json() as Promise<T>;
}
