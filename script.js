const apiKey = "AIzaSyCQwQGHKsfANuWOoDD-XFz-GG86y6li714"; // Your actual API key
const form = document.querySelector('#chat-form');
const chatLog = document.querySelector('#response-log');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const chatInput = document.querySelector('input[name="chat"]');
    const chatText = chatInput.value.trim();

    if (chatText === "") return; // Do nothing if input is empty

    // Custom response for "What is your name?"
    if (chatText.toLowerCase() === "what is your name") {
        const customResponse = "My name is AHMED_XD. I am today's your assistant.";
        chatLog.innerHTML += `<div class="message">${chatText}</div>`;
        chatLog.innerHTML += `<div class="response">${customResponse}</div>`;
        chatInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;
        return;
    }

    try {
        // Display user message in the chat
        const userMessage = `<div class="message">${chatText}</div>`;
        chatLog.innerHTML += userMessage;

        // Create payload for API request
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: chatText }
                    ]
                }
            ]
        };

        // Send request to Google's generative AI API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        let responseText = data.candidates[0].content.parts[0].text;

        // Fix the highlighting and bold text by handling ***text*** for <h3> and **text** for <b> tags
        responseText = responseText.replace(/\*\*\*(.*?)\*\*\*/g, "<h3>$1</h3>"); // Highlight text
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // Bold text

        // Display AI response in the chat
        const aiResponse = `<div class="response">${responseText}</div>`;
        chatLog.innerHTML += aiResponse;

    } catch (error) {
        console.error("Error:", error);
        chatLog.innerHTML += `<div class="response">Sorry, there was an error.</div>`;
    } finally {
        // Clear input field after submission
        chatInput.value = '';
        // Scroll to the bottom of the chat log
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});