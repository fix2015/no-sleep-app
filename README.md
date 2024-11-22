# no-sleep-js

**no-sleep-js** is a simple yet powerful JavaScript library designed to solve a common problem: preventing devices from going to sleep during important activities like video playback or long-running tasks. Whether you’re building a media player, an interactive app, or a web-based experience where uninterrupted screen activity is crucial, **no-sleep-js** has got you covered.

## Why no-sleep-js?

As web developers, we’ve all faced the challenge of ensuring that our applications don’t get interrupted by the device entering sleep mode. On mobile and older devices, this can disrupt the user experience and cause unwanted delays. With **no-sleep-js**, you can keep the screen active, no matter the platform, without needing complex configurations or platform-specific hacks.

### Key Features:
- **Universal Device Support:** Works across modern browsers and older iOS devices.
- **Lightweight and Simple:** Easy to integrate with minimal configuration needed.
- **Cross-Platform Compatibility:** Handles wake lock and video playback to prevent sleep on all devices.
- **Performance Friendly:** Designed to prevent screen dimming and sleep without draining battery life unnecessarily.

## How It Works

**no-sleep-js** primarily uses the **Screen Wake Lock API** (when available) to keep the device screen active. For legacy devices, such as older iOS versions, it falls back to a simple video playback trick to keep the screen awake. This ensures that your app or site runs smoothly, no matter the device the user is on.

## Platform Support

**no-sleep-js** is fully compatible with both **iOS** and **Android** devices. Whether your users are on mobile phones or tablets, this library will keep their screens active during important tasks. The library automatically detects the platform and applies the most appropriate method to prevent the device from going to sleep.

## Installation

To install **no-sleep-js**, simply include it in your project via npm or yarn:

```bash
npm install no-sleep-js
```

or

```bash
yarn add no-sleep-js
```

Alternatively, you can directly include the `no-sleep.js` script in your HTML.

## Usage

To use **no-sleep-js**, you simply need to instantiate the library and call its `enable()` and `disable()` methods to start and stop preventing sleep mode:

```javascript
import NoSleepJs from 'no-sleep-js';

const noSleep = new NoSleepJs();

// Enable to prevent sleep
noSleep.enable();

// Disable to allow the device to go to sleep
noSleep.disable();
```

You can also check whether **no-sleep-js** is currently active:

```javascript
if (noSleep.isEnabled) {
  console.log('NoSleep is enabled');
} else {
  console.log('NoSleep is disabled');
}
```

## Why You Should Use no-sleep-js

In today’s world, where performance and user experience are critical, keeping a device from going to sleep can be essential for certain types of applications. Whether you're building an interactive video player, a gaming platform, or any web-based service that requires continuous screen activity, **no-sleep-js** provides a reliable solution. It’s built to be cross-browser and fully functional on both modern and older devices, ensuring your users won’t face interruptions during their experience.

## License

MIT License  
Copyright (c) 2024 Vitalii Semianchuk  

[LinkedIn Profile](https://www.linkedin.com/in/vitalii-semianchuk-9812a786/)
