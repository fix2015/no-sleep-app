import VisibilityListener from './visibility-listener'; 

describe('VisibilityListener', () => {
  let visibilityListener;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    visibilityListener = new VisibilityListener(mockCallback);
  });

  afterEach(() => {
    visibilityListener.removeListeners();
  });

  test('should add event listeners for visibilitychange and fullscreenchange', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    visibilityListener = new VisibilityListener(mockCallback);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
  });

  test('should invoke the callback when document visibility changes to "visible"', () => {
    document.visibilityState = 'visible';
    visibilityListener.handleVisibilityChange();
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should not invoke the callback when document visibility changes to "hidden"', () => {
    document.visibilityState = 'hidden';
    visibilityListener.handleVisibilityChange();
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should invoke the callback when entering fullscreen', () => {
    document.fullscreenElement = document.documentElement;
    visibilityListener.handleFullscreenChange();
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should not invoke the callback when exiting fullscreen', () => {
    document.fullscreenElement = null;
    visibilityListener.handleFullscreenChange();
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should remove event listeners when removeListeners is called', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    visibilityListener.removeListeners();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
  });
});
