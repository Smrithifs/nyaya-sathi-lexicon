import type { NextApiRequest, NextApiResponse } from "next";
console.log("Sending request to Indian Kanoon API");
console.log("Request body:", req.body);
console.log("Using token:", token);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.NEXT_PUBLIC_KANOON_API_KEY;
  if (!token) {
    return res.status(500).json({ error: "Indian Kanoon API token not set." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await fetch("https://api.indiankanoon.org/search/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
