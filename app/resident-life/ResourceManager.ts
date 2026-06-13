/**
 * ResourceManager.ts
 * Hospital resource constraints for Resident Life Simulator
 */

export interface HospitalResource {
  id: string;
  name: string;
  total: number;
  available: number;
  queue: ResourceQueueItem[];
}

export interface ResourceQueueItem {
  patientId: string;
  patientName: string;
  procedureName: string;
  timeRemaining: number;
  totalTime: number;
  priority: 'stat' | 'urgent' | 'routine';
}

export interface ResourceState {
  ctScanner: HospitalResource;
  icuBeds: HospitalResource;
  monitoredBeds: HospitalResource;
  ventilators: HospitalResource;
  labProcessing: number; // 1.0 = normal speed, 0.5 = half speed (night)
  bloodBank: number; // units available
}

export function createInitialResources(shiftType: 'morning' | 'night' | 'weekend'): ResourceState {
  return {
    ctScanner: {
      id: 'ct',
      name: 'CT Scanner',
      total: 1,
      available: 1,
      queue: [],
    },
    icuBeds: {
      id: 'icu',
      name: 'ICU Beds',
      total: shiftType === 'night' ? 4 : 6,
      available: shiftType === 'night' ? 3 : 5,
      queue: [],
    },
    monitoredBeds: {
      id: 'monitored',
      name: 'Monitored Beds',
      total: shiftType === 'weekend' ? 8 : 12,
      available: shiftType === 'weekend' ? 4 : 8,
      queue: [],
    },
    ventilators: {
      id: 'vent',
      name: 'Ventilators',
      total: 4,
      available: 3,
      queue: [],
    },
    labProcessing: shiftType === 'night' ? 0.6 : 1.0,
    bloodBank: shiftType === 'weekend' ? 8 : 15,
  };
}

export function updateResourceState(state: ResourceState, elapsedMinutes: number): ResourceState {
  const newState = { ...state };

  // Update CT queue
  newState.ctScanner = {
    ...state.ctScanner,
    queue: state.ctScanner.queue
      .map(item => ({ ...item, timeRemaining: item.timeRemaining - 1 }))
      .filter(item => item.timeRemaining > 0),
    available: state.ctScanner.queue.length === 0 ? 1 : 0,
  };

  // Update lab processing - results ready
  // This is handled in ShiftManager via resultTime

  return newState;
}

export function requestResource(
  state: ResourceState,
  resourceId: string,
  patientId: string,
  patientName: string,
  procedureName: string,
  estimatedTime: number,
  priority: 'stat' | 'urgent' | 'routine' = 'urgent'
): { success: boolean; waitTime: number; message: string; updatedState: ResourceState } {
  const newState = { ...state };
  let resource: HospitalResource;

  switch (resourceId) {
    case 'ct':
      resource = { ...state.ctScanner };
      break;
    case 'icu':
      resource = { ...state.icuBeds };
      break;
    case 'ventilator':
      resource = { ...state.ventilators };
      break;
    case 'monitored':
      resource = { ...state.monitoredBeds };
      break;
    default:
      return { success: false, waitTime: 0, message: 'Unknown resource', updatedState: state };
  }

  if (resource.available > 0) {
    // Resource available immediately
    const queueItem: ResourceQueueItem = {
      patientId,
      patientName,
      procedureName,
      timeRemaining: estimatedTime,
      totalTime: estimatedTime,
      priority,
    };

    resource.queue = [...resource.queue, queueItem];
    resource.available = Math.max(0, resource.total - resource.queue.length);

    // Update state
    switch (resourceId) {
      case 'ct': newState.ctScanner = resource; break;
      case 'icu': newState.icuBeds = resource; break;
      case 'ventilator': newState.ventilators = resource; break;
      case 'monitored': newState.monitoredBeds = resource; break;
    }

    return {
      success: true,
      waitTime: 0,
      message: `${resource.name} available. ${procedureName} started.`,
      updatedState: newState,
    };
  }

  // Resource busy - calculate wait time
  const totalWait = resource.queue.reduce((sum, item) => sum + item.timeRemaining, 0);
  const queueItem: ResourceQueueItem = {
    patientId,
    patientName,
    procedureName,
    timeRemaining: totalWait + estimatedTime,
    totalTime: estimatedTime,
    priority,
  };

  resource.queue = [...resource.queue, queueItem];

  switch (resourceId) {
    case 'ct': newState.ctScanner = resource; break;
    case 'icu': newState.icuBeds = resource; break;
    case 'ventilator': newState.ventilators = resource; break;
    case 'monitored': newState.monitoredBeds = resource; break;
  }

  return {
    success: false,
    waitTime: totalWait,
    message: `⚠️ ${resource.name} occupied. Wait time: ~${totalWait} minutes. ${resource.queue.length} patient(s) ahead.`,
    updatedState: newState,
  };
}

export function releaseResource(
  state: ResourceState,
  resourceId: string,
  patientId: string
): { updatedState: ResourceState; message: string } {
  const newState = { ...state };
  let resource: HospitalResource;

  switch (resourceId) {
    case 'ct': resource = { ...state.ctScanner }; break;
    case 'icu': resource = { ...state.icuBeds }; break;
    case 'ventilator': resource = { ...state.ventilators }; break;
    case 'monitored': resource = { ...state.monitoredBeds }; break;
    default: return { updatedState: state, message: 'Unknown resource' };
  }

  resource.queue = resource.queue.filter(item => item.patientId !== patientId);
  resource.available = Math.max(0, resource.total - resource.queue.length);

  switch (resourceId) {
    case 'ct': newState.ctScanner = resource; break;
    case 'icu': newState.icuBeds = resource; break;
    case 'ventilator': newState.ventilators = resource; break;
    case 'monitored': newState.monitoredBeds = resource; break;
  }

  return {
    updatedState: newState,
    message: `${resource.name} freed. ${resource.available} now available.`,
  };
}

export function getResourceStatusText(state: ResourceState): string[] {
  const status: string[] = [];

  status.push(`CT: ${state.ctScanner.available > 0 ? '✅ Available' : `⏳ ${state.ctScanner.queue.length} in queue (~${state.ctScanner.queue.reduce((s, i) => s + i.timeRemaining, 0)}min wait)`}`);
  status.push(`ICU: ${state.icuBeds.available}/${state.icuBeds.total} beds available`);
  status.push(`Monitored: ${state.monitoredBeds.available}/${state.monitoredBeds.total} beds`);
  status.push(`Ventilators: ${state.ventilators.available}/${state.ventilators.total} free`);
  status.push(`Lab: ${state.labProcessing === 1.0 ? 'Normal' : 'Delayed (night shift)'}`);
  status.push(`Blood Bank: ${state.bloodBank} units`);

  return status;
}

export function getLabDelay(shiftType: 'morning' | 'night' | 'weekend'): number {
  switch (shiftType) {
    case 'night': return 1.7; // 70% slower
    case 'weekend': return 1.3; // 30% slower
    default: return 1.0;
  }
}
