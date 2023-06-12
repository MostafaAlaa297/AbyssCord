let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

let displayFrame = document.getElementById('stream__box')
let VideoFrames = document.getElementsByClassName('video__container')
let userIdDisplayFrame = null;

let expandVideoFrame = (e) => {
  let child = displayFrame.children[0]
  if(child){
    document.getElementById('streams__container').appendChild(child)
  }
  
  displayFrame.style.display = 'block'
  displayFrame.appendChild(e.currentTarget)
  userIdDisplayFrame = e.currentTarget.id
  
  for(let i = 0; i < VideoFrames.length; i++)
  {
    if(VideoFrames[i].id != userIdDisplayFrame){
      VideoFrames[i].style.height = '100px'
      VideoFrames[i].style.width = '100px'
    }
  }
}

for(let i = 0; i < VideoFrames.length; i++)
{
  VideoFrames[i].addEventListener('click', expandVideoFrame)
}

let hideDisplayFrame = () => {
  userIdDisplayFrame = null
  displayFrame.style.display = null
  
  let child = displayFrame.children[0]
  document.getElementById('streams__container').appendChild(child)

  for(let i = 0; i < VideoFrames.length; i++){
    VideoFrames[i].style.height = '300px'
    VideoFrames[i].style.width = '300px'
  }
}

displayFrame.addEventListener('click', hideDisplayFrame)