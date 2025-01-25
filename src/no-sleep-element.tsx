/**
 * @fileoverview NoSleepElement is a utility class that creates and manages a hidden video element
 * to prevent devices from entering sleep mode when the Wake Lock API is not available.
 */

import { webm, mp4 } from './files';

// Type definitions for the video source MIME types
type VideoSourceType = 'webm' | 'mp4';

/**
 * Class to manage a hidden video element that prevents devices from sleeping.
 */
export default class NoSleepElement {
  private noSleepVideo: HTMLVideoElement;

  constructor() {
    /**
     * The hidden video element used to prevent sleep.
     * @type {HTMLVideoElement}
     */
    this.noSleepVideo = document.createElement('video');
    this.noSleepVideo.setAttribute('playsinline', ''); // Prevents video from using fullscreen by default.
    
    this._addSourceToVideo(this.noSleepVideo, 'webm', webm);
    this._addSourceToVideo(this.noSleepVideo, 'mp4', mp4);
  }

  /**
   * Adds a source to the video element.
   * @private
   * @param {HTMLVideoElement} video The video element to which the source is added.
   * @param {VideoSourceType} type The MIME type of the video source (e.g., "webm" or "mp4").
   * @param {string} dataURI The data URI of the video source.
   */
  private _addSourceToVideo(video: HTMLVideoElement, type: VideoSourceType, dataURI: string): void {
    const source = document.createElement('source');
    source.src = dataURI;
    source.type = `video/${type}`;
    video.appendChild(source);
  }

  /**
   * Sets up a listener for the `loadedmetadata` event on the video element.
   * This ensures the video behaves correctly based on its duration.
   */
  setMetadataListener(): void {
    this.noSleepVideo.addEventListener('loadedmetadata', this._onVideoLoadedMetadata.bind(this));
  }

  /**
   * Handles the `loadedmetadata` event of the video.
   * Configures the video to either loop or adjust playback position based on its duration.
   * @private
   */
  private _onVideoLoadedMetadata(): void {
    if (this.noSleepVideo.duration <= 1) {
      this.noSleepVideo.setAttribute('loop', 'true');
    } else {
      this.noSleepVideo.addEventListener('timeupdate', this._onVideoTimeUpdate.bind(this));
    }
  }

  /**
   * Handles the `timeupdate` event of the video.
   * Prevents the video from playing beyond a certain point by resetting the playback position.
   * @private
   */
  private _onVideoTimeUpdate(): void {
    if (this.noSleepVideo.currentTime > 0.5) {
      this.noSleepVideo.currentTime = Math.random(); // Resets to a random time to maintain activity.
    }
  }

  /**
   * Plays the video to keep the device awake.
   * @returns {Promise<void>} Resolves when playback successfully starts.
   */
  play(): Promise<void> {
    return this.noSleepVideo.play();
  }

  /**
   * Pauses the video, stopping its effect of preventing sleep.
   */
  pause(): void {
    this.noSleepVideo.pause();
  }
}
