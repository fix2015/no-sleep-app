/**
 * @fileoverview NoSleepApp is a utility for preventing devices from sleeping 
 * by leveraging different strategies depending on platform capabilities.
 */

import VisibilityListener from './visibility-listener';
import NoSleepElement from './no-sleep-element';
import { isOldIOS } from './detect';

type NoSleepStrategy = 'wakeLock' | 'video' | 'legacy';

/**
 * Determines if the native Wake Lock API is supported.
 * @returns {boolean} True if Wake Lock API is supported.
 */
const isNativeWakeLockSupported = (): boolean => "wakeLock" in navigator;

/**
 * NoSleepApp prevents devices from entering sleep mode.
 * It uses the Wake Lock API, older iOS hacks, or video playback depending on device support.
 */
export default class NoSleepApp {
  private options: {
    strategy: NoSleepStrategy;
    retryInterval: number;
    fallbackEnabled: boolean;
  };

  private enabled: boolean;
  private _wakeLock: WakeLockSentinel | null = null; // Initialized to null
  private visibilityListener: VisibilityListener | null = null; // Initialized to null
  private noSleepTimer: NodeJS.Timeout | null = null; // Initialized to null
  private noSleepElement: NoSleepElement | null = null; // Initialized to null

  constructor(options: {
    strategy?: NoSleepStrategy;
    retryInterval?: number;
    fallbackEnabled?: boolean;
  } = {}) {
    const defaultOptions: { 
      strategy: NoSleepStrategy; 
      retryInterval: number; 
      fallbackEnabled: boolean; 
    } = {
      strategy: 'wakeLock', // Default strategy is wakeLock
      retryInterval: 10000,  // Default retry interval is 10 seconds
      fallbackEnabled: true, // Default fallback is enabled
    };

    this.options = { ...defaultOptions, ...options };
    this.enabled = false;

    if (isNativeWakeLockSupported() && this.options.strategy === 'wakeLock') {
      this.visibilityListener = new VisibilityListener(this.enable.bind(this));
    } else if (isOldIOS() && this.options.strategy === 'legacy') {
      this.noSleepTimer = null;
    } else {
      this.noSleepElement = new NoSleepElement();
      this.noSleepElement.setMetadataListener();
    }
  }

  /**
   * Checks if NoSleepApp is enabled.
   * @returns {boolean} True if NoSleepApp is enabled.
   */
  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enables the NoSleepApp functionality.
   * Uses the Wake Lock API, older iOS hack, or video playback as appropriate.
   * @returns {Promise<void>} Resolves when enabling is complete.
   * @throws {Error} Throws an error if enabling fails.
   */
  async enable(): Promise<void> {
    if (this.options.strategy === 'wakeLock' && isNativeWakeLockSupported()) {
      try {
        this._wakeLock = await navigator.wakeLock.request("screen");
        this.enabled = true;
        console.log("Wake Lock active.");
        this._wakeLock.addEventListener("release", this._onWakeLockRelease);
      } catch (err: unknown) {
        this.enabled = false;
        if (err instanceof Error) {
          console.error(`${err.name}, ${err.message}`);
        }
        throw err;
      }
    } else if (this.options.strategy === 'legacy' && isOldIOS()) {
      this._enableOldIOS();
    } else if (this.options.strategy === 'video') {
      await this._enableVideoPlayback();
    }
  }

  /**
   * Handles Wake Lock release events.
   * @private
   */
  private _onWakeLockRelease(): void {
    console.log("Wake Lock released.");
  }

  /**
   * Enables the older iOS-specific hack to prevent sleep.
   * This hack repeatedly refreshes the page.
   * @private
   */
  private _enableOldIOS(): void {
    this.disable();
    console.warn("NoSleep enabled for older iOS devices. This can interrupt active network requests.");
    this.noSleepTimer = setInterval(() => {
      if (!document.hidden) {
        window.location.href = window.location.href.split("#")[0];
        setTimeout(window.stop, 0);
      }
    }, 15000);
    this.enabled = true;
  }

  /**
   * Enables video playback to prevent sleep on devices without Wake Lock or old iOS.
   * @private
   * @returns {Promise<void>} Resolves when video playback is successfully started.
   * @throws {Error} Throws an error if video playback fails.
   */
  private async _enableVideoPlayback(): Promise<void> {
    try {
      await this.noSleepElement?.play();
      this.enabled = true;
    } catch (err: unknown) {
      this.enabled = false;
      console.error("Failed to start video playback:", err);
      throw err;
    }
  }

  /**
   * Disables NoSleepApp functionality.
   * Stops Wake Lock, iOS hack, or video playback depending on the platform.
   */
  disable(): void {
    if (this.options.strategy === 'wakeLock' && isNativeWakeLockSupported()) {
      if (this._wakeLock) {
        this._wakeLock.release();
      }
      this._wakeLock = null;
      if (this.visibilityListener) {
        this.visibilityListener.removeListeners();
      }
    } else if (this.options.strategy === 'legacy' && isOldIOS()) {
      if (this.noSleepTimer) {
        console.warn("NoSleep disabled for older iOS devices.");
        clearInterval(this.noSleepTimer);
        this.noSleepTimer = null;
      }
    } else if (this.options.strategy === 'video') {
      this.noSleepElement?.pause();
    }
    this.enabled = false;
  }
}
