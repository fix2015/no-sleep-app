/**
 * @fileoverview VisibilityListener is a utility class that listens for changes in
 * document visibility and fullscreen state, invoking a callback when these states change.
 */

/**
 * Class to listen for visibility and fullscreen changes in the document.
 * It triggers a callback when the document becomes visible or enters fullscreen mode.
 */
export default class VisibilityListener {
    /**
     * @param {Function} callback The callback function to invoke on visibility or fullscreen changes.
     */
    constructor(callback) {
      /**
       * @type {Function} The callback function to execute when the state changes.
       */
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
    _addListeners() {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
      document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    }
  
    /**
     * Handles the `visibilitychange` event.
     * Invokes the callback if the document is visible.
     */
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.callback();
      }
    }
  
    /**
     * Handles the `fullscreenchange` event.
     * Invokes the callback if the document enters fullscreen mode.
     */
    handleFullscreenChange() {
      if (document.fullscreenElement) {
        this.callback();
      }
    }
  
    /**
     * Removes the event listeners for visibility and fullscreen changes.
     */
    removeListeners() {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      document.removeEventListener("fullscreenchange", this.handleFullscreenChange);
    }
  }
  