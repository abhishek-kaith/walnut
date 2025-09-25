# AWS Polly TTS Setup

This document explains how to set up AWS Polly for high-quality text-to-speech in the game.

## Quick Setup

### 1. Get AWS Credentials
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Create an IAM user with Polly permissions
3. Generate access keys

### 2. Environment Variables
Add these to your `.env` file:

```bash
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

### 3. Test the Setup
Check if it's working:
```bash
curl http://localhost:3000/api/tts
```

Should return `"configured": true` when AWS credentials are set.

## Available Voices

The API supports these AWS Polly neural voices:
- **Joanna** (US Female) - Default
- **Matthew** (US Male)
- **Emma** (UK Female) 
- **Brian** (UK Male)
- **Ivy** (US Child)
- **Amy** (UK Female)
- **Kendra** (US Female)
- **Justin** (US Male Child)
- And more...

## Fallback Behavior

If AWS Polly is not configured or fails:
- ✅ Automatically falls back to Web Speech API
- ✅ No interruption to user experience
- ✅ Works offline with browser voices

## Features

- 🎵 **High Quality**: Neural voices sound natural
- ⚡ **Fast**: Cached responses for better performance
- 🎛️ **Speed Control**: 0.5x, 1x, 2x playback speeds
- 🔊 **SSML Support**: Advanced speech control
- 📱 **Mobile Friendly**: Works on all devices

## Cost

AWS Polly pricing:
- Neural voices: ~$16 per 1M characters
- Standard voices: ~$4 per 1M characters
- Free tier: 5M characters/month for 12 months

For a typical game session (~2000 characters), cost is less than $0.03.