import NoSleepApp from './no-sleep-js'; 
import { isOldIOS } from './detect'; 

jest.mock('./detect', () => ({
  isOldIOS: jest.fn(),
}));

describe('NoSleepApp', () => {
  let noSleep;

  beforeEach(() => {
    isOldIOS.mockReset();
    noSleep = new NoSleepApp();
  });

  afterEach(() => {
    noSleep.disable();
  });

  test('should initialize correctly', () => {
    expect(noSleep.isEnabled).toBe(false);
    expect(noSleep._wakeLock).toBeNull();
    expect(noSleep.visibilityListener).toBeDefined();
  });

  test('should enable Wake Lock when supported', async () => {
    global.navigator.wakeLock = {
      request: jest.fn().mockResolvedValue({
        addEventListener: jest.fn(),
        release: jest.fn(),
      }),
    };

    await noSleep.enable();

    expect(global.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
    expect(noSleep.isEnabled).toBe(true);
  });

  test('should handle Wake Lock API failure', async () => {
    global.navigator.wakeLock = {
      request: jest.fn().mockRejectedValue(new Error('Wake Lock not supported')),
    };

    try {
      await noSleep.enable();
    } catch (error) {
      expect(error.message).toBe('Wake Lock not supported');
      expect(noSleep.isEnabled).toBe(false);
    }
  });

  test('should enable iOS hack for old iOS devices', () => {
    isOldIOS.mockReturnValue(true);

    noSleep.enable();

    expect(noSleep.noSleepTimer).toBeDefined();
    expect(noSleep.isEnabled).toBe(true);
  });

  test('should handle enabling video playback on unsupported devices', async () => {
    noSleep.noSleepElement = { play: jest.fn().mockResolvedValue() };
    
    isOldIOS.mockReturnValue(false);

    await noSleep.enable();

    expect(noSleep.noSleepElement.play).toHaveBeenCalled();
    expect(noSleep.isEnabled).toBe(true);
  });

  test('should disable Wake Lock correctly', () => {
    const releaseMock = jest.fn();
    global.navigator.wakeLock = {
      request: jest.fn().mockResolvedValue({
        addEventListener: jest.fn(),
        release: releaseMock,
      }),
    };

    noSleep.enable();
    expect(noSleep.isEnabled).toBe(true);

    noSleep.disable();
    expect(releaseMock).toHaveBeenCalled();
    expect(noSleep.isEnabled).toBe(false);
  });

  test('should disable iOS hack for old devices correctly', () => {
    isOldIOS.mockReturnValue(true);

    noSleep.enable();
    expect(noSleep.isEnabled).toBe(true);
    expect(noSleep.noSleepTimer).toBeDefined();

    noSleep.disable();
    expect(noSleep.noSleepTimer).toBeNull();
    expect(noSleep.isEnabled).toBe(false);
  });

  test('should handle disabling video playback', () => {
    noSleep.noSleepElement = { pause: jest.fn() };

    noSleep.enable();
    expect(noSleep.isEnabled).toBe(true);

    noSleep.disable();
    expect(noSleep.noSleepElement.pause).toHaveBeenCalled();
    expect(noSleep.isEnabled).toBe(false);
  });

  test('should correctly manage Wake Lock release event', async () => {
    const releaseMock = jest.fn();
    global.navigator.wakeLock = {
      request: jest.fn().mockResolvedValue({
        addEventListener: (event, handler) => {
          if (event === 'release') {
            handler(); 
          }
        },
        release: releaseMock,
      }),
    };

    await noSleep.enable();
    expect(noSleep.isEnabled).toBe(true);

    noSleep._onWakeLockRelease();
    expect(releaseMock).toHaveBeenCalled();
  });
});
