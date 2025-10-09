
const apiKeyInput = document.getElementById("api-key-input");
const saveButton = document.getElementById("save-key-btn");
const statusMessage = document.getElementById("status-message");
const toneSelect = document.getElementById("tone-select");

function loadContent(){
    chrome.storage.local.get(['apiKey','tone'],(result)=>{
        if(result.apiKey){
            apiKeyInput.value=result.apiKey;
        }
        if(result.tone){
            toneSelect.value=result.tone;
        }
    });
}
function saveAPIKEY(){
    const apiKey = apiKeyInput.value;
    if(apiKey){
        chrome.storage.local.set({apiKey:apiKey},()=>{
            statusMessage.textContent="API Key saved!"
            setTimeout(() => {
        statusMessage.textContent = "";
      }, 2000);
    });
        
    }else{
        statusMessage.textContent="Please enter Gemini API KEY";
    }
}



function saveTone(){
    const tone = toneSelect.value;
    if(tone){
        chrome.storage.local.set({tone:tone},()=>{
            statusMessage.textContent+=" Tone selected!";
            setTimeout(() => {
        statusMessage.textContent = "";
      }, 2000);

        })
    }else{
        statusMessage.textContent+=" Please select proper tone";
    }
}
document.addEventListener('DOMContentLoaded', loadContent);
saveButton.addEventListener('click',saveAPIKEY); 
toneSelect.addEventListener('change',saveTone);







// const addNewBookmark = (bookmarksElement,bookmark) => {

//     const bookmarkTitleElement = document.createElement("div");
//     const newBookmarkElement = document.createElement("div");
//     const controlsElement = document.createElement("div");

//     bookmarkTitleElement.textContent=bookmark.desc;
//     bookmarkTitleElement.className="bookmark-title";
//     controlsElement.className="bookmark-controls";

//     newBookmarkElement.id = "bookmark-"+bookmark.time;
//     newBookmarkElement.className="bookmark";
//     newBookmarkElement.setAttribute("timestamp",bookmark.time);

//     setBookmarkAttributes("play",onPlay,controlsElement);
//     setBookmarkAttributes("delete",onDelete,controlsElement)

//     newBookmarkElement.appendChild(bookmarkTitleElement);
//     newBookmarkElement.appendChild(controlsElement);
//     bookmarksElement.appendChild(newBookmarkElement);
// };

// const viewBookmarks = (currentBookmarks) => {
//     const bookmarksElement = document.getElementById("bookmarks");
//     bookmarksElement.innerHTML="";

//     if(currentBookmarks.length >0){
//         for(let i = 0;i<currentBookmarks.length;i++){
//             const bookmark = currentBookmarks[i];
//             addNewBookmark(bookmarksElement);
//         }
//     }else{
//         bookmarksElement.innerHTML='<i class="row">No bookmarks to show /i>'
//     }
    
// };

// const onPlay = async e => {
//     const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");
//     const activeTab=await getActiveTabURL();

//     chrome.tabs.sendMessage(activeTab.id,{
//         type:"PLAY",
//         value:bookmarkTime
//     })
// };

// const onDelete = async e => {
//     const activeTab=await getActiveTabURL();
//     const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");
//     const bookmarkToDelete = document.getElementById("bookmark-"+bookmarkTime);

//     bookmarkToDelete.parentNode.removeChild(bookmarkToDelete);

//     chrome.tabs.sendMessage(activeTab,id,{
//         type:"DELETE",
//         value:bookmarkTime
//     },viewBookmarks);

// };

// const setBookmarkAttributes =  (src,addEventListener,contrlParentElement) => {
//     const controlElement = document.createElement("img");

//     controlElement.src="assets/"+src+".png";
//     controlElement.title = src;
//     controlElement.addEventListener("click",addEventListener);
//     contrlParentElement.appendChild(controlElement);
// };

// document.addEventListener("DOMContentLoaded",async () => {
//     const activeTab = await getActiveTabURL();
//     const queryParameters = activeTab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);
    
//     const currentVideo= urlParameters.get("v");

//     if(activeTab.url.includes("youtube.com/watch")&&currentVideo ){
//         chrome.storage.sync.get([currentVideo],(data)=>{
//             const currentVideoBookmarks= data[currentVideo]?JSON.parse(data[currentVideo]):[];

//             //viewBookmarks
//             viewBookmarks(currentVideoBookmarks);
//         })
//     }else{
//         const container = document.getElementsByClassName("container")[0];

//         container.innerHTML='<div> class="title">This is not a youtube video page.</div>'
//     }
// });


