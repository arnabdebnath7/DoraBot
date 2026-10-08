import { describe, it, expect } from 'vitest';
import { callLLM } from '../server/index';

describe('Live OpenRouter / OmniRoute Integration Test', () => {
  it('should successfully get a live completion from OpenRouter free smart pool', async () => {
    const messages = [
      {
        role: 'system',
        content: 'You are DoraBot. Respond cheerfully with a single short sentence mentioning dorayaki.',
      },
      {
        role: 'user',
        content: 'Hi DoraBot! What do you like to eat?',
      },
    ];

    const reply = await callLLM('openrouter/free', messages);
    expect(reply).toBeDefined();
    expect(reply.length).toBeGreaterThan(5);
    console.log('✨ Live DoraBot Response:', reply);
  }, 25000);

  it('should successfully get a live 4D Gadget completion from OmniRoute/OpenRouter', async () => {
    const messages = [
      {
        role: 'system',
        content: 'You are DoraBot using the Anywhere Door. Explain Tokyo in 1 short sentence.',
      },
      {
        role: 'user',
        content: 'Take me to Tokyo!',
      },
    ];

    const reply = await callLLM('openrouter/free', messages);
    expect(reply).toBeDefined();
    expect(reply.length).toBeGreaterThan(5);
    console.log('✨ Live Anywhere Door Response:', reply);
  }, 25000);
});
