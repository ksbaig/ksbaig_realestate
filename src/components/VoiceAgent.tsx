import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { useCallback, useState } from "react";
import { Mic, PhoneOff } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getAgentToken } from "@/lib/agent.functions";

export function VoiceAgent() {
  return (
    <ConversationProvider>
      <VoiceAgentInner />
    </ConversationProvider>
  );
}

function VoiceAgentInner() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getToken = useServerFn(getAgentToken);
  const conversation = useConversation({
    onError: (e) => setError(typeof e === "string" ? e : "Connection error"),
  });
  const live = conversation.status === "connected";

  const start = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      let token: string | null = null;
      try {
        token = (await getToken()).token;
      } catch {
        token = null; // fall back to public agent connection
      }
      if (token) {
        await conversation.startSession({ conversationToken: token, connectionType: "webrtc" });
      } else {
        await conversation.startSession({ agentId: "agent_1401m58ddf0ke3m8zf5n6rf9snej", connectionType: "webrtc" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start. Please allow the microphone.");
    } finally {
      setConnecting(false);
    }
  }, [conversation, getToken]);

  return (
    <div className="flex flex-col items-center rounded-3xl bg-deep p-12 text-deep-foreground shadow-glow">
      <button
        onClick={live ? () => conversation.endSession() : start}
        disabled={connecting}
        aria-label={live ? "End call" : "Start voice agent"}
        className="relative grid h-28 w-28 place-items-center rounded-full bg-brand disabled:opacity-70"
      >
        {live && conversation.isSpeaking && <span className="absolute inset-0 rounded-full bg-accent animate-ring" />}
        {live ? <PhoneOff className="relative h-11 w-11" /> : <Mic className="relative h-11 w-11" />}
      </button>
      <p className="mt-6 text-lg font-semibold">
        {connecting ? "Connecting…" : live ? (conversation.isSpeaking ? "Agent is speaking…" : "Listening…") : "Tap to talk"}
      </p>
      <p className="mt-1 text-sm text-deep-foreground/70">{live ? "Tap again to end the call" : "Microphone access required"}</p>
      {error && <p className="mt-3 text-sm text-accent">{error}</p>}
    </div>
  );
}
