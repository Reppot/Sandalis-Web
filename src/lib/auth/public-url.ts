export function getPublicAppUrl(): string {
  const configured = process.env.PUBLIC_APP_URL?.trim();

  return (
    configured ||
    (process.env.NODE_ENV === "production"
      ? "https://sandalis-web-mtbf.onrender.com"
      : "http://localhost:3000")
  ).replace(/\/+$/, "");
}
