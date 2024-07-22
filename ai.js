const chatInput = document.querySelector(".chat-input textarea");
const sendChatBTn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLI = (message, className) => {
    //Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"><i class='bx bx-bot'></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLI) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLI.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user",content: userMessage}]
        })
    }

    //Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again later.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage)return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


    //Append the user's message to the chatbox
    chatbox.appendChild(createChatLI(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() =>{
        //Display "Thinking..." while waiting for the response
        const incomingChatLI = createChatLI("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse();
    }, 600);
}

chatInput.addEventListener("input", () => {
    //Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    //If Enter key is pressed is pressed without shift key and the window 
    //width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    } 
});

sendChatBTn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
