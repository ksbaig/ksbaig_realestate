import { useCallback, useState } from 'react'
import { ConversationProvider, useConversation } from '@elevenlabs/react'
import { Mic, PhoneOff } from 'lucide-react'

const agentId = 'agent_1401m58ddf0ke3m8zf5n6rf9snej'

function VoiceAgentContent() {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const conversation = useConversation({
    onError: (message) => setError(typeof message === 'string' ? message : 'Connection error. Please try again.'),
  })
  const isLive = conversation.status === 'connected'

  const startConversation = useCallback(async () => {
    setError(null)
    setConnecting(true)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not available in this browser.')
      }

      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphone.getTracks().forEach((track) => track.stop())
      await conversation.startSession({ agentId, connectionType: 'webrtc' })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not start. Please allow microphone access.')
    } finally {
      setConnecting(false)
    }
  }, [conversation])

  return (
    <div className="voice-card">
      <button
        className={`voice-button${isLive && conversation.isSpeaking ? ' voice-button--speaking' : ''}`}
        type="button"
        disabled={connecting}
        aria-label={isLive ? 'End voice conversation' : 'Start voice conversation'}
        onClick={() => (isLive ? void conversation.endSession() : void startConversation())}
      >
        {isLive ? <PhoneOff size={32} aria-hidden="true" /> : <Mic size={34} aria-hidden="true" />}
      </button>
      <p className="voice-title">
        {connecting ? 'Connecting…' : isLive ? (conversation.isSpeaking ? 'Agent is speaking…' : 'Listening…') : 'Tap to talk'}
      </p>
      <p className="voice-hint">{isLive ? 'Tap the button to end the call' : 'Microphone access required'}</p>
      {error && <p className="voice-error" role="alert">{error}</p>}
    </div>
  )
}

function VoiceAgent() {
  return (
    <ConversationProvider>
      <VoiceAgentContent />
    </ConversationProvider>
  )
}

export default VoiceAgent
