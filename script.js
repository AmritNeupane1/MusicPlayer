const music=document.querySelector('audio');
const progressContainer=document.getElementById('progress-container');
const progress=document.getElementById('progress');
const currentTimeEl=document.getElementById('current-time');
const durationEl=document.getElementById('duration');
const prevbt=document.getElementById('prev');
const playbt=document.getElementById('play');
const nextbt=document.getElementById('next');
const image=document.querySelector('img');

const title=document.getElementById('title');
const artist=document.getElementById('artist');
const musicList=document.getElementById('music-list')
const showListBtn=document.getElementById('show-list');
const hideListBtn=document.getElementById('close');




//Music
const songs=[
    {
        name:'give-me-a-smile',
        displayName:'Give Me A Smile',
        artist:'By Free Music'
    },
    {
        name:'jacinto-1',
        displayName:'Electric Chill Machine',
        artist:'jacinto Design'
    },
    {
        name:'metric-1',
        displayName:'Front Row ',
        artist:'Metric/jacinto Design'
    },
    {
        name:'faded',
        displayName:'Faded ',
        artist:'Alan Walker'

    },
    {
        name:'summer',
        displayName:"Summer",
        artist:"Bensound"
    },
    {
        name:'music-2',
        displayName:"Ikson - Anywhere",
        artist:"Ikson"
    }

]

//check play or Not
let isplay=false;
//play
function playSong(){
    isplay=true;
    playbt.classList.replace('fa-play','fa-pause');
    playbt.setAttribute('title','Pause');
    music.play();
    playingNow();
}
function pauseSong(){
    isplay=false;
    playbt.classList.replace('fa-pause','fa-play');
    playbt.setAttribute('title','Play');
    music.pause();
}
//play and pause event listeners

playbt.addEventListener('click',function() { isplay ? pauseSong() : playSong()});


//update DOM

function loadSong(song){
    title.textContent=song.displayName;
    artist.textContent=song.artist;
    music.src=`music/${song.name}.mp3`;
    image.src=`img/${song.name}.jpg`;
}
//current song
let songIdx=0;

//Next song Function
function nextSong(){
   
    songIdx++;
    if(songIdx>=songs.length){
        songIdx=0;
    }
    loadSong(songs[songIdx]);
    playSong();
}
//prev song function
function prevSong(){
   
    songIdx--;
    if(songIdx<0){
        songIdx=parseInt(songs.length-1);
    }
    loadSong(songs[songIdx]);
    playSong();
}
function uddateProgressbar(e){
    if(isplay){
        const{duration,currentTime}=e.srcElement;
        
        //update progress bar width
        const progresspercent=(currentTime/duration)*100;
        progress.style.width=`${progresspercent}%`;
        //calculate duration
        const durationminutes=Math.floor(duration/60);
        let durationsec=Math.floor(duration%60);
        if(durationsec<10){
            durationsec=`0${durationsec}`;
        }
       
        //delaying element nan
        if(durationsec){
            durationEl.textContent=`${durationminutes}:${durationsec}`;
        }
        //current time
        const currentminutes=Math.floor(currentTime/60);
        let currentsec=Math.floor(currentTime%60);
        if(currentsec<10){
            currentsec=`0${currentsec}`;
        }
        currentTimeEl.textContent=`${currentminutes}:${currentsec}`;
    }
}
function setprogressbar(e){
    const width=this.clientWidth;
    
    const clickX=e.offsetX;
    
    const{duration}=music;
    if(width){
    music.currentTime=((clickX/width)*duration);
    }

}
//prev and next event listner
prevbt.addEventListener('click',prevSong);
nextbt.addEventListener('click',nextSong);

//update time
music.addEventListener('timeupdate',uddateProgressbar)
progressContainer.addEventListener('click',setprogressbar);
music.addEventListener('ended',()=>{
    let getText=repeatbtn.innerText;
    switch(getText){
        case 'repeat':
           nextSong();
            break;
        case "repeat_one":
           music.currentTime=0;
           loadSong(songs[songIdx]);
           playSong();
            break;   
        case "shuffle":
            let randIdx=Math.floor((Math.random()*songs.length)+1);
            songIdx=randIdx;
            loadSong(songs[songIdx]);
            playSong();
            break;       
    }
});

//repeat shuffle part
const repeatbtn=document.getElementById('repeat');
repeatbtn.addEventListener('click',()=>{
    let getText=repeatbtn.innerText;
    switch(getText){
        case 'repeat':
            repeatbtn.innerText="repeat_one";
            repeatbtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatbtn.innerText="shuffle" ;
            repeatbtn.setAttribute("title","Playback suffle");
            break;   
        case "shuffle":
            repeatbtn.innerText="repeat" ;
            repeatbtn.setAttribute("title","Playlist looped");
            break;       
    }
});
showListBtn.addEventListener('click',()=>{
    musicList.classList.toggle("show");
});
hideListBtn.addEventListener('click',()=>{
    showListBtn.click();
});

//list adding
const ulTag=document.querySelector("ul");
// adding songs from songs object
for(let i=0;i<songs.length;i++){
    let liTag=`<li li-index="${i}">
                <div class="row" >
                <span>${songs[i].displayName}</span>
                 <p>${songs[i].artist}</p>
                </div>
                <audio class="${songs[i].name}" src="music/${songs[i].name}.mp3"></audio>
                <span id="${songs[i].name}" class=audio-duration>3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);
   
    let liAudioDuration=ulTag.querySelector(`#${songs[i].name}`);
    let liAudioTag=ulTag.querySelector(`.${songs[i].name}`);
   
    liAudioTag.addEventListener('loadeddata',()=>{
        let duration=liAudioTag.duration;
        const durationminutes=Math.floor(duration/60);
        let durationsec=Math.floor(duration%60);
        if(durationsec<10){
            durationsec=`0${durationsec}`;
        }
            liAudioDuration.innerText=`${durationminutes}:${durationsec}`;
            liAudioDuration.setAttribute("t-duration",`${durationminutes}:${durationsec}`)
    });
}
//play perticular song when click 
const allLiTags=ulTag.querySelectorAll('li');


function playingNow(){
    for(let j=0;j<allLiTags.length;j++){
        let audioTag=allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove('playing');
            let adduaration=audioTag.getAttribute("t-duration");
            audioTag.innerText=adduaration;
        }
        if(allLiTags[j].getAttribute('li-index')==songIdx){
            allLiTags[j].classList.add('playing');
            audioTag.innerText="Playing";
        }
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}

function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    songIdx=getLiIndex;
    loadSong(songs[songIdx]);
    playSong();
}
