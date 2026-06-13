// ============================================
// Multiplayer Session Manager
// ============================================

export type SessionRole = 'leader' | 'member' | 'observer';
export type SessionStatus = 'waiting' | 'active' | 'paused' | 'completed';

export interface Participant {
  id: string;
  name: string;
  role: SessionRole;
  score: number;
  joinedAt: number;
  lastActionAt: number;
  isActive: boolean;
}

export interface SessionAction {
  id: string;
  participantId: string;
  action: string;
  timestamp: number;
  casePhase: string;
}

export interface SessionState {
  id: string;
  caseId: string;
  status: SessionStatus;
  participants: Participant[];
  actions: SessionAction[];
  startedAt: number;
  pausedAt?: number;
  completedAt?: number;
  maxParticipants: number;
  turnBased: boolean;
  currentTurn?: string;
  chat: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'action' | 'system';
}

export class SessionManager {
  private sessions: Map<string, SessionState> = new Map();
  private listeners: Map<string, Array<(state: SessionState) => void>> = new Map();

  // Create a new session
  createSession(
    caseId: string,
    hostId: string,
    hostName: string,
    config: { maxParticipants?: number; turnBased?: boolean } = {}
  ): SessionState {
    const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    const session: SessionState = {
      id,
      caseId,
      status: 'waiting',
      participants: [{
        id: hostId,
        name: hostName,
        role: 'leader',
        score: 0,
        joinedAt: Date.now(),
        lastActionAt: Date.now(),
        isActive: true
      }],
      actions: [],
      startedAt: Date.now(),
      maxParticipants: config.maxParticipants || 5,
      turnBased: config.turnBased || false,
      chat: [{
        id: `sys_${Date.now()}`,
        participantId: 'system',
        participantName: 'System',
        message: `Session created by ${hostName}. Case: ${caseId}`,
        timestamp: Date.now(),
        type: 'system'
      }]
    };

    this.sessions.set(id, session);
    return session;
  }

  // Join a session
  joinSession(sessionId: string, participantId: string, name: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    if (session.status !== 'waiting') return null;
    if (session.participants.length >= session.maxParticipants) return null;
    if (session.participants.find(p => p.id === participantId)) return null;

    const participant: Participant = {
      id: participantId,
      name,
      role: 'member',
      score: 0,
      joinedAt: Date.now(),
      lastActionAt: Date.now(),
      isActive: true
    };

    session.participants.push(participant);
    session.chat.push({
      id: `sys_${Date.now()}`,
      participantId: 'system',
      participantName: 'System',
      message: `${name} joined the session`,
      timestamp: Date.now(),
      type: 'system'
    });

    this.notifyListeners(sessionId, session);
    return session;
  }

  // Start the session
  startSession(sessionId: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    session.status = 'active';
    if (session.turnBased) {
      session.currentTurn = session.participants[0].id;
    }

    session.chat.push({
      id: `sys_${Date.now()}`,
      participantId: 'system',
      participantName: 'System',
      message: 'Session started! Begin the case.',
      timestamp: Date.now(),
      type: 'system'
    });

    this.notifyListeners(sessionId, session);
    return session;
  }

  // Submit an action
  submitAction(sessionId: string, participantId: string, action: string, casePhase: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (session.status !== 'active') return null;

    // Check turn if turn-based
    if (session.turnBased && session.currentTurn !== participantId) return null;

    const sessionAction: SessionAction = {
      id: `act_${Date.now()}`,
      participantId,
      action,
      timestamp: Date.now(),
      casePhase
    };

    session.actions.push(sessionAction);

    // Update participant
    const participant = session.participants.find(p => p.id === participantId);
    if (participant) {
      participant.lastActionAt = Date.now();
    }

    // Rotate turn if turn-based
    if (session.turnBased) {
      const currentIndex = session.participants.findIndex(p => p.id === participantId);
      const nextIndex = (currentIndex + 1) % session.participants.length;
      session.currentTurn = session.participants[nextIndex].id;
    }

    session.chat.push({
      id: `act_${Date.now()}`,
      participantId,
      participantName: participant?.name || 'Unknown',
      message: action,
      timestamp: Date.now(),
      type: 'action'
    });

    this.notifyListeners(sessionId, session);
    return session;
  }

  // Send chat message
  sendMessage(sessionId: string, participantId: string, message: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const participant = session.participants.find(p => p.id === participantId);
    
    session.chat.push({
      id: `msg_${Date.now()}`,
      participantId,
      participantName: participant?.name || 'Unknown',
      message,
      timestamp: Date.now(),
      type: 'chat'
    });

    this.notifyListeners(sessionId, session);
    return session;
  }

  // Complete session
  completeSession(sessionId: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.status = 'completed';
    session.completedAt = Date.now();

    session.chat.push({
      id: `sys_${Date.now()}`,
      participantId: 'system',
      participantName: 'System',
      message: 'Session completed!',
      timestamp: Date.now(),
      type: 'system'
    });

    this.notifyListeners(sessionId, session);
    return session;
  }

  // Get session state
  getSession(sessionId: string): SessionState | null {
    return this.sessions.get(sessionId) || null;
  }

  // List active sessions
  listSessions(): SessionState[] {
    return Array.from(this.sessions.values()).filter(s => 
      s.status === 'waiting' || s.status === 'active'
    );
  }

  // Subscribe to session updates
  subscribe(sessionId: string, listener: (state: SessionState) => void): () => void {
    if (!this.listeners.has(sessionId)) {
      this.listeners.set(sessionId, []);
    }
    this.listeners.get(sessionId)!.push(listener);
    
    return () => {
      const listeners = this.listeners.get(sessionId) || [];
      this.listeners.set(sessionId, listeners.filter(l => l !== listener));
    };
  }

  private notifyListeners(sessionId: string, state: SessionState): void {
    const listeners = this.listeners.get(sessionId) || [];
    listeners.forEach(l => l(state));
  }

  // Cleanup completed sessions
  cleanup(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (session.status === 'completed' && session.completedAt && 
          now - session.completedAt > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}

export default SessionManager;
