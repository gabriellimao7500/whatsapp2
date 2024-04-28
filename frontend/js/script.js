// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")


// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMassages = chat.querySelector(".chat__messages")


const user = {
    id:"",
    name:"",
    color:""
}

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message__self")
    div.innerHTML = content

    return div
}
const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message__other")
    span.classList.add("message__sender")
    
    div.appendChild(span)

    span.innerHTML = sender

    span.style.color = senderColor

    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex] 
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content} = JSON.parse(data)

    const message = userId == user.id 
    ? createMessageSelfElement(content,userName,userColor) 
    : createMessageOtherElement(content,userName,userColor)

    chatMassages.appendChild(message)

    message.scrollIntoView()
}

const handleLogin = (e) => {
    e.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()
    
    login.style.display = "none "
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")

    websocket.onmessage = processMessage
}

const sendMenssage = (e) => {
    e.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }
    
    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMenssage)