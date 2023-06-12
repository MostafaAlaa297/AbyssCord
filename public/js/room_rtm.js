let handleMemberJoined = async (memberId) =>{    
    let {name} = await rtmClient.getUserAttributesByKeys(memberId, ['name'])
    let totalMembers = await channel.getMembers()
    updateTotalMembers(totalMembers)
    addMemberToDom(memberId)

    addBotMessageToDom(`Welcome to the Abyss! ${name}`)
}

let handleMemberLeft = async (memberId) =>{
    removeMemberFromDom(memberId)
    let totalMembers = await channel.getMembers()
    updateTotalMembers(totalMembers)
}

let addMemberToDom = async (memberId) =>{
    let {name} = await rtmClient.getUserAttributesByKeys(memberId, ['name'])

    let memberWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${memberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>
    </div>`

    memberWrapper.insertAdjacentHTML('beforeend', memberItem)
}

let updateTotalMembers = async (members) =>{
     document.getElementById('members__count').innerText = members.length
}

let handleChannelMessage = async (messageData, MemberId) => {
    console.log('A new message was received')
    let data = JSON.parse(messageData.text)
    
    if(data.type === 'chat'){
        addMessageToDom(data.displayName, data.message)
    }

    if(data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove( )
        
        for(let i = 0; i < VideoFrames.length; i++){
            VideoFrames[i].style.height = '300px'
            VideoFrames[i].style.width = '300px'
          }
    }
}

let channelMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type': 'chat', 'message': message, 'displayName': displayName})})

    addMessageToDom(displayName, message)
    e.target.reset()
}

let getAllMembers = async () =>{
    let members = await channel.getMembers()
    console.log(members);
    updateTotalMembers(members)

    for (let i = 0; members.length > i; i++){
        addMemberToDom(members[i])
        console.log(`all members received ${members[i]}`)
    }
}

let removeMemberFromDom = async (memberId) => {
    let memberWrapper = document.getElementById(`member__${memberId}__wrapper`)
    let memberName = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${memberName} has left the Abyss!`)
    
    memberWrapper.remove()
}

let addMessageToDom = (name, message) => {
    let messageWrapper = document.getElementById("messages")

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                            </div>`
    messageWrapper.insertAdjacentHTML('beforeend', newMessage)
    let lastMessage = messageWrapper.querySelector("#messages .message__wrapper:last-child")
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}

let addBotMessageToDom = (botMessage) => {
    let messageWrapper = document.getElementById("messages")

    let bot_message = `<div class="message__wrapper">
        <div class="message__body__bot">
            <strong class="message__author__bot">🤖 Abyss Bot</strong>
            <p class="message__text__bot">${botMessage}</p>
        </div>
    </div>`
    messageWrapper.insertAdjacentHTML('beforeend', bot_message)

    let lastMessage = messageWrapper.querySelector("#messages .message__wrapper:last-child")
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}

let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener(`beforeunload`, leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', channelMessage)