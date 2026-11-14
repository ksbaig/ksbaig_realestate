import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendInquiry } from "@/lib/agent.functions";

export function InquiryForm() {
  const send = useServerFn(sendInquiry);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      await send({
        data: {
          name: String(f.get("name")),
          phone: String(f.get("phone")),
          email: String(f.get("email") ?? ""),
          budget: String(f.get("budget") ?? ""),
          preferredContact: String(f.get("preferredContact")) as "phone",
          message: String(f.get("message")),
        },
      });
      setState("done");
      e.currentTarget?.reset();
    } catch {
      setState("error");
    }
  }

  const input = "w-full rounded-xl border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-8 shadow-glow sm:grid-cols-2">
      <input name="name" required maxLength={100} placeholder="Your name" className={input} />
      <input name="phone" required maxLength={30} placeholder="Phone / WhatsApp" className={input} />
      <input name="email" type="email" maxLength={150} placeholder="Email (optional)" className={input} />
      <input name="budget" maxLength={60} placeholder="Budget e.g. 50 lakh PKR" className={input} />
      <select name="preferredContact" className={`${input} sm:col-span-2`} defaultValue="phone">
        <option value="phone">Contact me by phone</option>
        <option value="whatsapp">Contact me on WhatsApp</option>
        <option value="email">Contact me by email</option>
      </select>
      <textarea name="message" required maxLength={2000} rows={4} placeholder="What are you looking for? (e.g. 5 marla plot, rented house, file merging)" className={`${input} sm:col-span-2`} />
      <button disabled={state === "sending"} className="rounded-full bg-brand px-7 py-3.5 font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60 sm:col-span-2">
        {state === "sending" ? "Sending…" : "Send Inquiry"}
      </button>
      {state === "done" && <p className="text-primary sm:col-span-2">Thank you! We will contact you shortly.</p>}
      {state === "error" && <p className="text-destructive sm:col-span-2">Sorry, something went wrong. Please try again.</p>}
    </form>
  );
}
