/**
 * @fileoverview VisibilityListener is a utility class that listens for changes in
 * document visibility and fullscreen state, invoking a callback when these states change.
 */

/**
 * Type definition for the callback function.
 * @callback VisibilityCallback
 */
type VisibilityCallback = () => void;

/**
 * Class to listen for visibility and fullscreen changes in the document.
 * It triggers a callback when the document becomes visible or enters fullscreen mode.
 */
export default class VisibilityListener {
  private callback: VisibilityCallback;

  /**
   * @param {VisibilityCallback} callback The callback function to invoke on visibility or fullscreen changes.
   */
  constructor(callback: VisibilityCallback) {
    this.callback = callback;

    // Bind methods to the instance.
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);

    this._addListeners();
  }

  /**
   * Adds event listeners for visibility and fullscreen changes.
   * @private
   */
  private _addListeners(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
  }

  /**
   * Handles the `visibilitychange` event.
   * Invokes the callback if the document is visible.
   */
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.callback();
    }
  }

  /**
   * Handles the `fullscreenchange` event.
   * Invokes the callback if the document enters fullscreen mode.
   */
  private handleFullscreenChange(): void {
    if (document.fullscreenElement) {
      this.callback();
    }
  }

  /**
   * Removes the event listeners for visibility and fullscreen changes.
   */
  removeListeners(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
  }
}
