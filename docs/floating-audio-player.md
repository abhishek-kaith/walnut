# Floating Audio Player - Production Ready TTS Integration

## Overview

The Floating Audio Player is a modern, production-ready component designed for seamless TTS (Text-to-Speech) integration in the personality assessment game. It provides a non-intrusive floating widget that maintains excellent UX while offering comprehensive audio playback controls.

## Features

### 🎨 Modern Design
- **Floating Widget**: Compact, non-intrusive design that doesn't hinder readability
- **Expandable Interface**: Collapses to a small button, expands to show full controls
- **Glass Morphism**: Modern backdrop blur with semi-transparent background
- **Responsive Sizes**: Small, medium, and large variants for different use cases
- **Flexible Positioning**: 4 corner positions (top/bottom + left/right)

### 🔊 Audio Controls
- **Play/Pause**: Smart state management with visual feedback
- **Progress Bar**: Clickable seek functionality with hover effects  
- **Volume Control**: Integrated volume slider in expanded state
- **Time Display**: Current time and total duration
- **Auto-collapse**: Automatically collapses after inactivity (except when playing)

### 🌐 TTS API Integration
- **Flexible Configuration**: Support for multiple TTS providers
- **Loading States**: Visual feedback during API calls and audio loading
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Retry Logic**: Automatic retry on transient failures
- **Caching**: Blob URL management for efficient audio handling

### ♿ Accessibility
- **Keyboard Support**: Full keyboard navigation support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **High Contrast**: Ensures visibility in all theme modes

## Usage

### Basic Integration

```tsx
import { FloatingAudioPlayer } from "@/components/floating-audio-player";

<FloatingAudioPlayer
  text="Your text to be converted to speech"
  dayNumber={1}
  sceneNumber={2}
  ttsConfig={{
    endpoint: "/api/tts",
    voice: "en-US-AriaNeural",
    speed: 1.0,
    pitch: 1.0,
  }}
  position="bottom-right"
  size="md"
/>
```

### Configuration Options

```tsx
interface FloatingAudioPlayerProps {
  text?: string;                    // Text to convert to speech
  dayNumber: number;               // Day identifier
  sceneNumber?: number;            // Scene identifier (optional)
  ttsConfig?: TTSConfig;           // TTS service configuration
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";      // Widget size
  className?: string;              // Additional CSS classes
}

interface TTSConfig {
  endpoint: string;                // TTS API endpoint
  apiKey?: string;                // API key for authentication
  voice?: string;                 // Voice identifier
  speed?: number;                 // Speech speed (0.5 - 2.0)
  pitch?: number;                 // Voice pitch (0.5 - 2.0)
}
```

## TTS Provider Integration

### Azure Cognitive Services Speech

```typescript
// In /app/api/tts/route.ts
const azureKey = process.env.AZURE_SPEECH_KEY;
const azureRegion = process.env.AZURE_SPEECH_REGION;

const ssml = `
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="${voice}">
      <prosody rate="${speed}" pitch="${pitch > 1 ? '+' : ''}${((pitch - 1) * 100).toFixed(0)}%">
        ${text}
      </prosody>
    </voice>
  </speak>
`;

const response = await fetch(
  `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
  {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": azureKey,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
    },
    body: ssml,
  }
);
```

### OpenAI TTS

```typescript
const response = await fetch("https://api.openai.com/v1/audio/speech", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "tts-1",
    input: text,
    voice: "alloy",
    speed: speed,
  }),
});
```

### ElevenLabs

```typescript
const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: "POST",
  headers: {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
  },
  body: JSON.stringify({
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
      speed: speed,
    }
  }),
});
```

## State Management

### Audio States
- `idle`: Initial state, ready to fetch audio
- `fetching`: Making API request to TTS service
- `loading`: Audio file is loading
- `playing`: Audio is currently playing
- `paused`: Audio is paused
- `error`: Error occurred (API, loading, or playback)

### State Transitions
```
idle → fetching → loading → paused/playing
  ↓        ↓        ↓         ↓
error ← error ← error ← error
```

## Styling & Customization

### Size Variants
```css
/* Small: Compact for mobile */
sm: collapsed: w-12 h-12, expanded: w-80 h-20

/* Medium: Standard desktop */
md: collapsed: w-14 h-14, expanded: w-96 h-24

/* Large: Prominent display */
lg: collapsed: w-16 h-16, expanded: w-[28rem] h-28
```

### Custom Styling
```tsx
<FloatingAudioPlayer
  className="custom-audio-player shadow-2xl border-2 border-purple-500"
  // ... other props
/>
```

### CSS Variables
The component uses CSS variables for theming:
- `--color-primary`: Primary background color
- `--color-rpg-gold`: Accent color for buttons and progress

## Performance Optimization

### Lazy Loading
- Audio is only fetched when user initiates playback
- Blob URLs are cleaned up automatically
- Component auto-collapses to reduce memory usage

### Caching Strategy
- Browser caches audio blobs automatically
- Consider implementing API-level caching for repeated requests
- Use service workers for offline playback capabilities

## Accessibility Features

### Keyboard Navigation
- `Space/Enter`: Play/Pause toggle
- `Arrow Keys`: Seek forward/backward (when expanded)
- `Escape`: Collapse widget
- `Tab`: Navigate between controls

### Screen Reader Support
- Descriptive ARIA labels for all interactive elements
- Live regions for state announcements
- Semantic HTML structure

## Error Handling

### API Errors
- Network timeouts
- Authentication failures
- Rate limiting
- Invalid text input

### Audio Errors
- Codec not supported
- File corruption
- Playback restrictions
- Device limitations

### User Feedback
- Visual error indicators
- Retry mechanisms  
- Graceful degradation
- Helpful error messages

## Environment Variables

```env
# Azure Speech Services
AZURE_SPEECH_KEY=your_azure_key
AZURE_SPEECH_REGION=your_region

# OpenAI TTS
OPENAI_API_KEY=your_openai_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key
```

## Deployment Considerations

### Security
- Validate all input text
- Implement rate limiting
- Use HTTPS for all requests
- Sanitize user content

### Monitoring
- Track TTS API usage and costs
- Monitor error rates and types
- Analyze user engagement metrics
- Performance monitoring for large texts

### Cost Optimization
- Cache frequently requested audio
- Implement text preprocessing (remove redundant content)
- Use cheaper TTS models for development
- Monitor and alert on usage spikes

## Browser Compatibility

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Android Chrome 80+
- **Features Used**: Web Audio API, Fetch API, CSS Grid, CSS Custom Properties

## Testing

### Unit Tests
```bash
npm test -- floating-audio-player
```

### Integration Tests
```bash
npm test -- api/tts
```

### E2E Tests
```bash
npm run e2e -- audio-player
```

## Migration Guide

### From GameAudioPlayer
1. Replace component import
2. Update props structure
3. Configure TTS endpoint
4. Test audio functionality

```tsx
// Before
<GameAudioPlayer
  audioSrc="/sample.wav"
  dayNumber={day}
  sceneNumber={scene}
/>

// After  
<FloatingAudioPlayer
  text={sceneText}
  dayNumber={day}
  sceneNumber={scene}
  ttsConfig={{ endpoint: "/api/tts" }}
/>
```

This floating audio player provides a modern, accessible, and production-ready solution for TTS integration in your personality assessment game.