// ============================================
// Content Sync Service — GitHub + Local Sync
// ============================================

import ContentRepository from '../content/ContentRepository';

export interface SyncStatus {
  lastSync: number;
  version: string;
  casesDownloaded: number;
  imagesDownloaded: number;
  pendingUpdates: number;
  isSyncing: boolean;
  error?: string;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // milliseconds
  wifiOnly: boolean;
  maxCacheSize: number; // MB
}

export class ContentSyncService {
  private repository: ContentRepository;
  private config: SyncConfig;
  private status: SyncStatus;
  private syncTimer: any = null;
  private listeners: Array<(status: SyncStatus) => void> = [];

  constructor(config?: Partial<SyncConfig>) {
    this.repository = ContentRepository.getInstance();
    this.config = {
      autoSync: true,
      syncInterval: 3600000, // 1 hour
      wifiOnly: true,
      maxCacheSize: 100, // 100 MB
      ...config
    };
    this.status = {
      lastSync: 0,
      version: '0.0.0',
      casesDownloaded: 0,
      imagesDownloaded: 0,
      pendingUpdates: 0,
      isSyncing: false
    };
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.status });
    }
  }

  // Start auto-sync
  startAutoSync(): void {
    if (!this.config.autoSync) return;
    
    // Initial sync
    this.sync();
    
    // Periodic sync
    this.syncTimer = setInterval(() => {
      this.sync();
    }, this.config.syncInterval);
  }

  // Stop auto-sync
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // Perform full sync
  async sync(): Promise<SyncStatus> {
    if (this.status.isSyncing) return this.status;

    this.status.isSyncing = true;
    this.status.error = undefined;
    this.notify();

    try {
      // Check for updates
      const hasUpdates = await this.repository.checkForUpdates();
      
      if (hasUpdates) {
        // Download updated index
        const index = await this.repository.getCaseIndex();
        this.status.version = index.version;
        
        // Count cases
        this.status.casesDownloaded = await this.repository.getCacheSize();
        
        // Update sync time
        this.status.lastSync = Date.now();
        this.status.pendingUpdates = 0;
      }
    } catch (error: any) {
      this.status.error = error.message || 'Sync failed';
    } finally {
      this.status.isSyncing = false;
      this.notify();
    }

    return { ...this.status };
  }

  // Download specific case for offline use
  async downloadCase(caseId: string): Promise<boolean> {
    try {
      await this.repository.getCase(caseId);
      this.status.casesDownloaded = await this.repository.getCacheSize();
      this.notify();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Download case with images
  async downloadFullCase(caseId: string): Promise<boolean> {
    try {
      const caseData = await this.repository.getCase(caseId);
      
      // Download associated images
      if (caseData.meta?.images) {
        for (const imageId of caseData.meta.images) {
          await this.repository.downloadImage(imageId);
          this.status.imagesDownloaded++;
        }
      }
      
      this.status.casesDownloaded = await this.repository.getCacheSize();
      this.notify();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get cache size in MB
  async getCacheSizeMB(): Promise<number> {
    try {
      const FileSystem = require('expo-file-system');
      const info = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}cases/`
      );
      return info.exists ? (info.size || 0) / (1024 * 1024) : 0;
    } catch {
      return 0;
    }
  }

  // Clear cache
  async clearCache(): Promise<void> {
    await this.repository.clearCache();
    this.status.casesDownloaded = 0;
    this.status.imagesDownloaded = 0;
    this.notify();
  }

  // Get sync status
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  // Update config
  updateConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.autoSync && !this.syncTimer) {
      this.startAutoSync();
    } else if (!this.config.autoSync && this.syncTimer) {
      this.stopAutoSync();
    }
  }

  // Cleanup
  destroy(): void {
    this.stopAutoSync();
    this.listeners = [];
  }
}

export default ContentSyncService;
