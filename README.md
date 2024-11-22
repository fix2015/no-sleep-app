# 🌙 no-sleep-app

**no-sleep-app** is a lightweight, powerful JavaScript library designed to prevent devices from going to sleep during crucial tasks. Whether you’re developing a media player, an interactive app, or a seamless web experience, **no-sleep-app** ensures your application keeps the screen active across all platforms.

---

## 🌟 Why no-sleep-app?

As developers, maintaining an uninterrupted user experience is paramount. However, devices often go into sleep mode during long-running tasks or media playback, disrupting users. **no-sleep-app** offers a seamless, cross-platform solution with minimal configuration.

---

### Key Features

- **Universal Device Support:** Works across modern browsers and older iOS devices.
- **Lightweight and Simple:** Easy to integrate with minimal configuration needed.
- **Cross-Platform Compatibility:** Handles wake lock and video playback to prevent sleep on all devices.
- **Performance Friendly:** Designed to prevent screen dimming and sleep without draining battery life unnecessarily.

---

## ⚙️ How It Works

**no-sleep-app** uses the **Screen Wake Lock API** (when available) to keep the device screen active. For legacy devices, such as older iOS versions, it falls back to a simple video playback trick. This ensures reliable performance, no matter the device or platform.

---

## 📱 Platform Support

**no-sleep-app** is fully compatible with both **iOS** and **Android** devices. Whether your users are on mobile phones or tablets, this library will keep their screens active during important tasks. The library automatically detects the platform and applies the most appropriate method to prevent the device from going to sleep.

---

## 🚀 Installation

Install **no-sleep-app** via npm or yarn:

```bash
npm install no-sleep-app
```

or

```bash
yarn add no-sleep-app
```

Alternatively, you can include the `no-sleep-app.js` script directly in your HTML.

---

## 📖 Usage

To use **no-sleep-app**, instantiate the library and call its `enable()` and `disable()` methods to start and stop preventing sleep mode:

```javascript
import NoSleepApp from 'no-sleep-app';

const noSleep = new NoSleepApp();

// Enable to prevent sleep
noSleep.enable();

// Disable to allow the device to go to sleep
noSleep.disable();
```

Check whether **no-sleep-app** is currently active:

```javascript
if (noSleep.isEnabled) {
  console.log('NoSleep is enabled');
} else {
  console.log('NoSleep is disabled');
}
```
