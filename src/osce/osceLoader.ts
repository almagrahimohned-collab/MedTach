// osceLoader.ts - OSCE Station Loader
// Created: 2026-06-11
// Updated: 2026-06-11 - Fetch from GitHub (online)

import { OSCEStation, OSCEIndex, CircuitConfig } from './osceTypes';

// ============================================================
// CONFIGURATION
// ============================================================

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main/osce';

// ============================================================
// OSCE LOADER CLASS
// ============================================================

export class OSCELoader {
  private stationCache: Map<string, OSCEStation> = new Map();
  private indexCache: OSCEIndex | null = null;

  /**
   * Load the master index file from GitHub
   */
  async loadIndex(): Promise<OSCEIndex> {
    if (this.indexCache) return this.indexCache;

    try {
      const url = `${GITHUB_RAW_BASE}/index.json`;
      console.log('Fetching index from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const index: OSCEIndex = await response.json();
      this.indexCache = index;
      console.log('Index loaded:', index.total_stations, 'stations');
      return index;
    } catch (error) {
      console.error('Failed to load OSCE index:', error);
      throw new Error('Could not load OSCE index file. Check internet connection.');
    }
  }

  /**
   * Load a single station by ID from GitHub
   */
  async loadStation(stationId: string): Promise<OSCEStation> {
    // Check cache first
    if (this.stationCache.has(stationId)) {
      console.log('Loading from cache:', stationId);
      return this.stationCache.get(stationId)!;
    }

    try {
      // First load index to find filename
      const index = await this.loadIndex();
      const stationInfo = index.stations.find(s => s.id === stationId);
      
      if (!stationInfo) {
        throw new Error(`Station not found in index: ${stationId}`);
      }

      const filename = stationInfo.filename;
      const url = `${GITHUB_RAW_BASE}/stations/${filename}`;
      console.log('Fetching station from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const station: OSCEStation = await response.json();
      
      // Cache it
      this.stationCache.set(stationId, station);
      console.log('Station loaded:', station.title);
      return station;
    } catch (error) {
      console.error(`Failed to load station ${stationId}:`, error);
      throw new Error(`Could not load station: ${stationId}. Check internet connection.`);
    }
  }

  /**
   * Load multiple stations at once
   */
  async loadStations(stationIds: string[]): Promise<OSCEStation[]> {
    const stations: OSCEStation[] = [];
    for (const id of stationIds) {
      const station = await this.loadStation(id);
      stations.push(station);
    }
    return stations;
  }

  /**
   * Load all stations from index
   */
  async loadAllStations(): Promise<OSCEStation[]> {
    const index = await this.loadIndex();
    const ids = index.stations.map(s => s.id);
    return this.loadStations(ids);
  }

  /**
   * Get stations by specialty
   */
  async getStationsBySpecialty(specialty: string): Promise<OSCEStation[]> {
    const index = await this.loadIndex();
    const filtered = index.stations.filter(s => s.specialty === specialty);
    return this.loadStations(filtered.map(s => s.id));
  }

  /**
   * Get stations by difficulty
   */
  async getStationsByDifficulty(difficulty: string): Promise<OSCEStation[]> {
    const index = await this.loadIndex();
    const filtered = index.stations.filter(s => s.difficulty === difficulty);
    return this.loadStations(filtered.map(s => s.id));
  }

  /**
   * Load a circuit (collection of stations in order)
   */
  async loadCircuit(circuitId: string): Promise<{
    config: CircuitConfig;
    stations: OSCEStation[];
  }> {
    const index = await this.loadIndex();
    const circuit = index.circuits.find(c => c.id === circuitId);
    
    if (!circuit) {
      throw new Error(`Circuit not found: ${circuitId}`);
    }

    const stations = await this.loadStations(circuit.stations);
    
    return {
      config: circuit,
      stations
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.stationCache.clear();
    this.indexCache = null;
  }

  /**
   * Get cached station count
   */
  get cacheSize(): number {
    return this.stationCache.size;
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

let defaultLoader: OSCELoader | null = null;

export function getOSCELoader(): OSCELoader {
  if (!defaultLoader) {
    defaultLoader = new OSCELoader();
  }
  return defaultLoader;
}

export default OSCELoader;
