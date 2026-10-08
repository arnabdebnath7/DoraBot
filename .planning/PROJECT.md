# Project: DoraBot

## Overview
DoraBot is an autonomous personal AI companion inspired by Doraemon, featuring 4D Pocket Gadgets, Mini-Doras, and intelligent free smart model routing through OmniRoute and OpenRouter.

## Requirements & Scope
- **4D Pocket Gadget Engine**: Anywhere Door, Bamboo Copter, Memory Bread, Translation Gummy, Time Machine, Small Light.
- **Mini-Doras Modes**: Prime (Classic), Red Turbo (Code/Architect), Yellow Creative (Ideation), Green Analyst (Deep Knowledge).
- **Free Smart Brain**: Automatic load balancing across `openrouter/free`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`, `google/gemma-4-31b-it:free`, `nvidia/nemotron-3.5-lightning:free`.
- **Firebase Auth**: Google Sign-In with popup/redirect and offline demo sandbox mode.
- **Disk Safety**: Continuous disk watchdog to keep `/home` partition strictly under 4.0GB.
