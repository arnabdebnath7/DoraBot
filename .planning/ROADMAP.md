# Roadmap: DoraBot

## Phase 1: Core Foundation & Disk Safety [COMPLETED]
- [x] Cleaned up deprecated builds and legacy caches
- [x] Symlinked dependencies to 31GB overlay storage
- [x] Implemented continuous watchdog script (`scripts/disk-monitor.sh`)

## Phase 2: Autonomous Backend & OmniRoute Gateway [COMPLETED]
- [x] Express backend with `/api/chat`, `/api/gadgets/use`, `/api/system/health`, `/api/models`
- [x] Direct OmniRoute proxy (`http://127.0.0.1:20129`) with OpenRouter fallback
- [x] Implemented prompt protection forbidding system instruction leakage

## Phase 3: Frontend & 22nd Century Companion UI [COMPLETED]
- [x] 3D Mascot Logo & Doraemon color palette
- [x] 4D Pocket Gadget Dock & interactive modal
- [x] Mini-Dora Squad mode switcher
- [x] Web Speech API voice interaction with audio visualizer

## Phase 4: Google Authentication via Firebase [COMPLETED]
- [x] Firebase SDK GoogleAuthProvider integration
- [x] Live OAuth sign-in with offline Sandbox fallback
- [x] In-app credentials configuration interface

## Phase 5: Verification & Quality Assurance [COMPLETED]
- [x] Full Vitest test suite passing (6 unit + 1 live integration test)
- [x] TypeScript compiler check passing with 0 errors
- [x] CodeRabbit review completed with 0 findings
