
(() => {
    console.log("Starting WhatsApp listener setup...");


    let prev_text = "";

    function showSuggestion(suggestionText) {
        const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');
        if (!messageBox || !suggestionText) {
            return;
        }
        const userText = messageBox.innerText;
        const parent = messageBox.parentElement;
        const overlayId = 'ghost-text-overlay';
        parent.style.position = 'relative';
        let overlay = document.querySelector(`#${overlayId}`);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = overlayId;
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

        const hiddenTextSpan = `<span class="hidden-text">${userText.replace(/\s/g, '&nbsp;')}</span>`;


        const suggestionSpan = `<span class="suggestion-text">${suggestionText}</span>`;


        overlay.innerHTML = hiddenTextSpan+ suggestionSpan;

    }
    function hideSuggestion() {
        const overlay = document.querySelector('#ghost-text-overlay');
        if (overlay) {
            overlay.remove();
        }
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


            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();
            const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(suggestion);

            showSuggestion(suggestion);


        } catch (error) {
            console.error(error);
        }
    }


    function detectTabKey(event) {
        const suggestion = document.querySelector('#ghost-text-overlay');
        const suggestionSpan = suggestion?.querySelector('.suggestion-text');
        if (event.key === 'Tab' && suggestionSpan) {
            console.log('Hii');
            event.preventDefault(); 

            const suggestionText = suggestionSpan.textContent;
            hideSuggestion();
            const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');
             
            if (messageBox) {

                messageBox.focus();
                
                document.execCommand('insertText', false, ' ' + suggestionText);
                hideSuggestion(); 
               
            } else {
                console.error("Message box not found.");
            }
            activeElem = document.activeElement;

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

    const processChange = debounce(main, 2000);


    function inputListener(event) {
        const suggestion = document.querySelector('.ghost-text-overlay');
        if(suggestion){
        suggestion.remove();
        }
        const text = event.target.textContent;
        console.log("Input detected:", text);
        processChange(text);

    }


    function setupListener() {
        const messageBox = document.querySelector('footer div[contenteditable="true"][data-tab="10"]');

        if (messageBox && !messageBox.dataset.listenerAttached) {
            messageBox.addEventListener('input', inputListener);

            messageBox.addEventListener('keydown', detectTabKey);
            messageBox.dataset.listenerAttached = 'true';
            console.log("Input listener and tab listener attached successfully!");
        }
    }


    function observeWhatsAppApp() {
        const target = document.querySelector('#app');
        if (!target) {
            console.warn("#app not found, retrying in 1s...");
            setTimeout(observeWhatsAppApp, 1000);
            return;
        }


        const observer = new MutationObserver(setupListener);
        observer.observe(target, { childList: true, subtree: true });

        console.log("MutationObserver is active and will remain active.");


        setupListener();
    }


    observeWhatsAppApp();

})();
