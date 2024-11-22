import NoSleepElement from './no-sleep-element'; 
import { webm, mp4 } from './files.js';

jest.mock('./files.js', () => ({
  webm: 'data:video/webm;base64,webmdata',
  mp4: 'data:video/mp4;base64,mp4data',
}));

describe('NoSleepElement', () => {
  let noSleepElement;

  beforeEach(() => {
    noSleepElement = new NoSleepElement();
  });

  test('should create a video element with correct attributes', () => {
    expect(noSleepElement.noSleepVideo).toBeInstanceOf(HTMLVideoElement);
    expect(noSleepElement.noSleepVideo.hasAttribute('playsinline')).toBe(true);
  });

  test('should add webm and mp4 sources to the video element', () => {
    const sources = noSleepElement.noSleepVideo.getElementsByTagName('source');
    
    expect(sources.length).toBe(2);
    expect(sources[0].src).toBe(webm);
    expect(sources[0].type).toBe('video/webm');
    expect(sources[1].src).toBe(mp4);
    expect(sources[1].type).toBe('video/mp4');
  });

  test('should set the metadata listener', () => {
    const addEventListenerSpy = jest.spyOn(noSleepElement.noSleepVideo, 'addEventListener');
    
    noSleepElement.setMetadataListener();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('loadedmetadata', expect.any(Function));
  });

  test('should loop the video if its duration is less than or equal to 1 second', () => {
    noSleepElement.noSleepVideo.duration = 0.5; 
    const setAttributeSpy = jest.spyOn(noSleepElement.noSleepVideo, 'setAttribute');
    
    noSleepElement._onVideoLoadedMetadata();
    
    expect(setAttributeSpy).toHaveBeenCalledWith('loop', true);
  });

  test('should add a timeupdate event listener if video duration is greater than 1 second', () => {
    noSleepElement.noSleepVideo.duration = 2; 
    const addEventListenerSpy = jest.spyOn(noSleepElement.noSleepVideo, 'addEventListener');
    
    noSleepElement._onVideoLoadedMetadata();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('timeupdate', expect.any(Function));
  });

  test('should reset the video time to a random value on timeupdate', () => {
    noSleepElement.noSleepVideo.currentTime = 0.6;
    const setCurrentTimeSpy = jest.spyOn(noSleepElement.noSleepVideo, 'currentTime', 'set');
    
    noSleepElement._onVideoTimeUpdate();
    
    expect(setCurrentTimeSpy).toHaveBeenCalledWith(expect.any(Number));
  });

  test('should play the video when play is called', async () => {
    const playSpy = jest.spyOn(noSleepElement.noSleepVideo, 'play').mockResolvedValue();
    
    await noSleepElement.play();
    
    expect(playSpy).toHaveBeenCalled();
  });

  test('should pause the video when pause is called', () => {
    const pauseSpy = jest.spyOn(noSleepElement.noSleepVideo, 'pause');
    
    noSleepElement.pause();
    
    expect(pauseSpy).toHaveBeenCalled();
  });
});
