
(() => {
    console.log("Starting WhatsApp listener setup...");


    let prev_text = "";

    function showSuggestion(suggestionText) {
        const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');
        if (!messageBox || !suggestionText) {
            return;
        }
        const parent = messageBox.parentElement;
        parent.style.position = 'relative';
        let overlay = document.querySelector('#ghost-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ghost-suggestion';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.color = 'rgba(150,150,150,0.6)';
            overlay.style.pointerEvents = 'none';
            overlay.style.whiteSpace = 'pre-wrap';
            overlay.style.wordBreak = 'break-word';
            overlay.style.zIndex = '10';
            parent.appendChild(overlay);
        }
        const style = getComputedStyle(messageBox);
        overlay.style.fontSize = style.fontSize;
        overlay.style.fontFamily = style.fontFamily;
        overlay.style.lineHeight = style.lineHeight;
        overlay.style.padding = style.padding;
        overlay.style.width = style.width;
        overlay.style.height = style.height;

        overlay.textContent = suggestionText;

    }
    async function main(text) {

        console.log(`Debounced: Preparing to call AI for: "${text}"`);
        try {
            if (text.trim().length < 3) {
                return;
            }
            if (text === prev_text) {
                return;
            }
            prev_text = text;

            const settings = await chrome.storage.local.get(['apiKey', 'tone']);
            const { apiKey = "", tone = "Casual" } = settings;
            //let tone = settings.tone || "Casual";
            if (!apiKey) {
                console.warn("API key not received");
                return;

            }
            //loadContent();
            if (!tone) {
                tone = "Casual";
            }

            const prompt = `You are an expert writing assistant integrated into a messaging app. Your primary goal is to provide natural, concise, and contextually relevant one to two word completions for the user's text.

Task: Complete the user's sentence or phrase.

Constraints:
1. Adhere strictly to the following tone: ${tone}
2. The completion must be grammatically correct.
3. Provide ONLY the suggested completion text. Do not repeat the user's original text in your response.

User's text: "${text}"

Completion:`;


            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await response.json();
            const suggestion = data.choices?.[0]?.message?.content
            console.log(suggestion);

            showSuggestion(suggestion);


        } catch (error) {
            console.error(error);
        }
    }
    //document.addEventListener('keyup', detectTabKey);

    function detectTabKey(event) {
        const suggestion = document.querySelector('#ghost-suggestion');
        if (event.key === 'Tab' && suggestion) {

            const suggestionText = suggestion.textContent;
            const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');

            if (messageBox) {
                // 2. Focus the input field. This is often a necessary step.
                messageBox.focus();
                const event = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: ' ' + suggestionText
                });
                document.execCommand('insertText', false, ' ' + suggestionText); // fallback
                messageBox.dispatchEvent(event);
            } else {
                console.error("Message box not found.");
            }
            activeElem = document.activeElement;
            //return true;
            console.log('Tab detected');
        }
    }


    function debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const processChange = debounce(main, 3000);

    // The function to run when the user types
    function inputListener(event) {
        // .textContent is slightly more efficient than .innerText
        const text = event.target.textContent;
        console.log("Input detected:", text);
        processChange(text);

    }

    // A function to find the message box and attach the listener.
    // This will be called by the observer every time the page changes.
    function setupListener() {
        const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');

        if (messageBox && !messageBox.dataset.listenerAttached) {
            messageBox.addEventListener('input', inputListener);

            messageBox.addEventListener('keydown', detectTabKey);
            messageBox.dataset.listenerAttached = 'true';
            console.log("Input listener and tab listener attached successfully!");
        }
    }

    // This function finds the main #app and starts the observer
    function observeWhatsAppApp() {
        const target = document.querySelector('#app');
        if (!target) {
            console.warn("#app not found, retrying in 1s...");
            setTimeout(observeWhatsAppApp, 1000);
            return;
        }

        // The observer's job is to call setupListener whenever the page structure changes.
        // It should NOT disconnect.
        const observer = new MutationObserver(setupListener);
        observer.observe(target, { childList: true, subtree: true });

        console.log("MutationObserver is active and will remain active.");

        // Attempt to attach the listener immediately in case the element is already present.
        setupListener();
    }

    // Start the entire process
    observeWhatsAppApp();

})();
