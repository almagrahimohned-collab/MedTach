# 🏥 MedTach Architecture

## Overview
MedTach is a clinical simulation platform built on a micro-kernel + plugin architecture.

## Layers

### 📦 Content Layer
- 250+ clinical cases across 14 specialties
- Image library with X-ray, CT, MRI, ECG, Ultrasound
- Lab reference database
- Content validation at build time

### 🧠 Clinical Layer
- HypothesisTracker: Tracks diagnostic reasoning
- FeedbackEngine: AI-powered performance analysis
- Cognitive bias detection

### ⚙️ Engine Layer
- **Micro-Kernel**: Orchestrator only (<100 lines)
- **EventBus**: Central messaging system
- **PluginRuntime**: Isolation + timeout protection
- **5 Action Plugins**: History, Exam, Investigation, Diagnosis, Treatment
- **Scoring Plugin**: Multi-factor performance scoring
- **HealthMonitor**: Plugin performance tracking
- **ExecutionTrace**: Full audit trail
- **ReplayEngine**: Deterministic session replay

### 🌐 Multiplayer Layer
- SessionManager: Turn-based + free mode
- Roles: Leader, Member, Observer
- In-session chat + action sharing

### 📊 Dashboard Layer
- Student performance analytics
- Cohort analytics
- Instructor intervention recommendations
- Data export (JSON/CSV)

### 📱 UI Layer
- DiagnosticRoom: Interactive case interface
- ResultScreen: Post-case analysis
- ReplayViewer: Timeline playback
- Reusable components: VitalsMonitor, ChatBubble, ActionBar, PhaseIndicator

## Design Principles
1. **Plugin Isolation**: No plugin-to-plugin communication
2. **Pure Functions**: Plugins return stateChanges, don't mutate
3. **Deterministic**: Same input + same seed = same result
4. **Offline-First**: SQLite caching + GitHub sync
5. **Small App Size**: Content loaded on demand

## Tech Stack
- React Native + Expo
- TypeScript
- SQLite (local cache)
- GitHub (content source)
- Supabase (auth + cloud data)

## File Count
- 30+ engine files
- 6 reusable components
- 3 AI modules
- 2 multiplayer modules
- 250 validated case files

## Build Status
✅ Architecture: Clean & Scalable
✅ Tests: Unit test suite ready
✅ CI/CD: GitHub Actions configured
✅ Documentation: Complete
