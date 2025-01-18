/**
 * @fileoverview NoSleepElement is a utility class that creates and manages a hidden video element
 * to prevent devices from entering sleep mode when the Wake Lock API is not available.
 */

import { webm, mp4 } from './files.js';

/**
 * Class to manage a hidden video element that prevents devices from sleeping.
 */
export default class NoSleepElement {
  constructor() {
    /**
     * @type {HTMLVideoElement} The hidden video element used to prevent sleep.
     */
    this.noSleepVideo = document.createElement("video");
    this.noSleepVideo.setAttribute("playsinline", ""); // Prevents video from using fullscreen by default.
    
    this._addSourceToVideo(this.noSleepVideo, "webm", webm);
    this._addSourceToVideo(this.noSleepVideo, "mp4", mp4);
  }

  /**
   * Adds a source to the video element.
   * @private
   * @param {HTMLVideoElement} video The video element to which the source is added.
   * @param {string} type The MIME type of the video source (e.g., "webm" or "mp4").
   * @param {string} dataURI The data URI of the video source.
   */
  _addSourceToVideo(video, type, dataURI) {
    const source = document.createElement("source");
    source.src = dataURI;
    source.type = `video/${type}`;
    video.appendChild(source);
  }

  /**
   * Sets up a listener for the `loadedmetadata` event on the video element.
   * This ensures the video behaves correctly based on its duration.
   */
  setMetadataListener() {
    this.noSleepVideo.addEventListener("loadedmetadata", this._onVideoLoadedMetadata.bind(this));
  }

  /**
   * Handles the `loadedmetadata` event of the video.
   * Configures the video to either loop or adjust playback position based on its duration.
   * @private
   */
  _onVideoLoadedMetadata() {
    if (this.noSleepVideo.duration <= 1) {
      this.noSleepVideo.setAttribute("loop", true);
    } else {
      this.noSleepVideo.addEventListener("timeupdate", this._onVideoTimeUpdate.bind(this));
    }
  }

  /**
   * Handles the `timeupdate` event of the video.
   * Prevents the video from playing beyond a certain point by resetting the playback position.
   * @private
   */
  _onVideoTimeUpdate() {
    if (this.noSleepVideo.currentTime > 0.5) {
      this.noSleepVideo.currentTime = Math.random(); // Resets to a random time to maintain activity.
    }
  }

  /**
   * Plays the video to keep the device awake.
   * @returns {Promise<void>} Resolves when playback successfully starts.
   */
  play() {
    return this.noSleepVideo.play();
  }

  /**
   * Pauses the video, stopping its effect of preventing sleep.
   */
  pause() {
    this.noSleepVideo.pause();
  }
}
