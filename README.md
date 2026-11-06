# KS Big Real Estate

A responsive React + TypeScript website for KS Big Real Estate, built with Vite. It includes the Al-Kabeer Town hero, service and plot sections, a browser-based ElevenLabs voice agent, and an inquiry form that prepares an email for the visitor to send.

Live website: https://ksbaig.github.io/ksbaig_realestate/

## Development

```sh
npm install
npm run dev
```

## Build and lint

```sh
npm run build
npm run lint
```

## Project structure

```text
public/                  Static public files
src/
  assets/                Website images
  components/
    InquiryForm.tsx      Inquiry form and email handoff
    VoiceAgent.tsx       ElevenLabs voice conversation
  App.tsx                Page sections and navigation
  App.css                Website layout and responsive styles
  index.css              Global styles and typography
  main.tsx               React entry point
```

The voice button connects to the ElevenLabs agent configured in `src/components/VoiceAgent.tsx` and requires microphone permission. Update the agent ID there if your deployed agent uses a different ID. The inquiry form opens the visitor's default email app; update its recipient and the contact details in `src/App.tsx` to your current business information.
