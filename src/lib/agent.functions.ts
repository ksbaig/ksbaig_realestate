import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AGENT_ID = "agent_1401m58ddf0ke3m8zf5n6rf9snej";

export const getAgentToken = createServerFn({ method: "POST" }).handler(async () => {
  const key = process.env["ELEVENLABS_API_KEY"];
  if (!key) throw new Error("Voice agent is not configured");
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": key } },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`ElevenLabs token failed [${res.status}]: ${body}`);
    throw new Error(`Voice agent unavailable [${res.status}]`);
  }
  const { token } = (await res.json()) as { token: string };
  return { token };
});

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(150).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional(),
  preferredContact: z.enum(["phone", "whatsapp", "email"]).default("phone"),
  message: z.string().trim().min(1).max(2000),
});

export const sendInquiry = createServerFn({ method: "POST" })
  .inputValidator((d) => inquirySchema.parse(d))
  .handler(async ({ data }) => {
    const url = process.env["N8N_WEBHOOK_URL"];
    if (!url) throw new Error("Inquiry service not configured");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "Lovable" }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`n8n webhook failed [${res.status}]: ${body}`);
      throw new Error(`Could not send inquiry [${res.status}]`);
    }
    return { ok: true };
  });
