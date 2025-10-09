

AI Writing Assistant for WhatsApp Web
A Chrome extension that provides real-time, context-aware "ghost text" suggestions powered by generative AI, directly within the WhatsApp Web interface.

This tool helps users compose clearer,tone-appropriate messages by offering intelligent auto-completions that can be accepted with a single keystroke


Features
Real-Time Ghost Text: Get intelligent, unobtrusive suggestions as you type.

Tone Adaptation: Easily switch between different writing tones (e.g., Formal, Casual, Friendly) via the extension popup.

Seamless Integration: Accept suggestions with the Tab key, making the workflow fast and intuitive.

Secure & Private: Uses the "Bring Your Own Key" (BYOK) model. Your API key is stored securely in your browser's local storage and is never sent to a third-party server.

Optimized for Performance: Uses debouncing and caching to minimize API calls, ensuring a smooth experience and staying within free-tier rate limits.

🛠️ Technology Stack
Platform: Google Chrome Extension (Manifest V3)

Core Logic: Plain JavaScript (ES6+)

Browser APIs:

chrome.storage for secure local storage.

MutationObserver for reliably detecting dynamic DOM elements.

Styling: CSS3

AI Service: Third-party generative AI models via OpenRouter

🚀 Installation & Setup
This extension is not yet on the Chrome Web Store, so you will need to load it manually in Developer Mode.

Part 1: Loading the Extension
Download or clone this repository to your local machine.

Open Google Chrome and navigate to chrome://extensions.

In the top-right corner, toggle on "Developer mode".

Click the "Load unpacked" button that appears on the top-left.

Select the project folder you downloaded in Step 1.

The AI Writing Assistant should now appear in your list of extensions. Pin it to your toolbar for easy access.

Part 2: Setting Up Your API Key
The extension requires you to provide your own free API key from a provider like OpenRouter.

Go to OpenRouter.ai and sign in or create a new account.

Navigate to your account Keys page.

Click "Create Key" to generate a new API key. Copy this key.

Return to Chrome and click on the AI Writing Assistant icon in your toolbar to open the popup.

Paste your copied API key into the input box and click "Save".

The extension is now ready to use!

✍️ How to Use
Open whatsapp web and navigate to any chat.

Click the extension's icon in the toolbar to select your desired writing tone.

Start typing in the message box.

As you pause, a gray "ghost text" suggestion will appear after your cursor.

To accept the suggestion, press the Tab key.

To ignore the suggestion, simply continue typing, and it will disappear.
