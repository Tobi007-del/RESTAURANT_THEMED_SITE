const audios = document.querySelectorAll("audio")

for(const audio of audios) {
    if (audio.dataset.controls === "tastey-audio-controls") {
        const audioContainer = document.createElement('div')
        audioContainer.className = "audio-container paused"
        audioContainer.innerHTML = 
        `
        <div class="audio-container">
            <div class="audio-controls-container">
                <div>
                    <div class="audio-timeline-container" title="Adjust timeline">
                        <div class="audio-timeline">
                            <div class="audio-thumb-indicator"></div>
                        </div>
                    </div>
                    <button type="button" class="audio-play-pause-btn" title="Play/Pause">
                        <svg class="audio-play-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                        <svg class="audio-pause-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                        </svg>
                        <svg class="audio-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay" data-tooltip-position="top">
                            <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                        </svg> 
                    </button>
                </div>
                <div>
                    <div class="audio-duration-container">
                        <div class="audio-current-time">0.00</div>
                        /
                        <div class="audio-total-time">0.00</div>
                    </div>
                    <div class="audio-volume-container">
                        <button type="button" class="audio-mute-btn" title="Toggle Volume(m)">
                            <svg class="audio-volume-high-icon" data-tooltip-text="High Volume" data-tooltip-position="top">
                                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                            </svg>
                            <svg class="audio-volume-low-icon" data-tooltip-text="Low Volume" data-tooltip-position="top">
                                <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                            </svg>
                            <svg class="audio-volume-muted-icon" data-tooltip-text="Volume Muted" data-tooltip-position="top">
                                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                            </svg>
                        </button>
                        <input class="audio-volume-slider" type="range" min="0" max="100" step="any" title="Adjust Volume">
                    </div>
                </div>
            </div>
        </div>            
        `
        const parentDiv = audio.parentNode
        parentDiv.insertBefore(audioContainer, audio)
        audioContainer.append(audio)

        const playPauseBtn = audioContainer.querySelector(".audio-play-pause-btn"),
        muteBtn = audioContainer.querySelector(".audio-mute-btn"),
        currentTimeElem = audioContainer.querySelector(".audio-current-time"),
        totalTimeElem = audioContainer.querySelector(".audio-total-time"),
        volumeSlider = audioContainer.querySelector(".audio-volume-slider"),
        timelineContainer = audioContainer.querySelector(".audio-timeline-container"),
        svgs = audioContainer.querySelectorAll("svg")

        //resizing controls
        function controlsResize() {           
            let controlsSize = 25;
            // controlsSize = getComputedStyle(videoContainer).getPropertyValue("--controls-size")
            svgs.forEach(svg => {
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
                if(!svg.classList.contains("audio-replay-icon")) 
                    svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`)
            })
        }
        controlsResize()

        timelineContainer.addEventListener('pointerdown', e => {
            timelineContainer.setPointerCapture(e.pointerId)
            isScrubbing = true 
            toggleScrubbing(e)
            timelineContainer.addEventListener("pointermove", handleTimelineUpdate)
            timelineContainer.addEventListener("pointerup", e => {
                isScrubbing = false 
                toggleScrubbing(e)
                timelineContainer.removeEventListener("pointermove", handleTimelineUpdate)
                timelineContainer.releasePointerCapture(e.pointerId)
            }, { once:true })
        })

        //Timeline 
        let isScrubbing = false
        let wasPaused = audio.autoplay
        function toggleScrubbing(e) {
            const rect = timelineContainer.getBoundingClientRect()
            const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
            audioContainer.classList.toggle("scrubbing", isScrubbing)
            if (isScrubbing) {
                wasPaused = audio.paused
                audio.pause()
            } else {
                audio.currentTime = percent * audio.duration
                if (!wasPaused) {
                    audio.play()     
                }
            }

            handleTimelineUpdate(e)
        }

        function handleTimelineUpdate(e) {
            const rect = timelineContainer.getBoundingClientRect()
            const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
            if (isScrubbing) 
                timelineContainer.style.setProperty("--audio-progress-position", percent)
        }

        audio.addEventListener("loadeddata", () => totalTimeElem.textContent = formatDuration(audio.duration))

        audio.addEventListener("timeupdate", () => {
            currentTimeElem.textContent = formatDuration(audio.currentTime)
            const percent = audio.currentTime / audio.duration
            timelineContainer.style.setProperty("--audio-progress-position", percent)
            if (audio.currentTime < audio.duration) {
                audioContainer.classList.remove("replay")
            }
        })

        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
        })
        
        function formatDuration(time) {
            const seconds = Math.floor(time % 60)
            const minutes = Math.floor(time / 60) % 60
            const hours = Math.floor(time / 3600)
            if(hours === 0)
                return `${minutes}:${leadingZeroFormatter.format(seconds)}`
            else 
                return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
        }

        //Volume
        muteBtn.addEventListener("click", toggleMute)

        volumeSlider.addEventListener("input", e => {
            audio.volume = (e.target.value / 100)
            audio.muted = e.target.value === 0
        })

        function toggleMute() {
            audio.muted = !audio.muted
        }

        audio.addEventListener("volumechange", volumeState)

        function volumeState() {
            let { min, max , value, offsetWidth } = volumeSlider
            value = audio.volume * 100
            let volumeLevel = ""
            if (audio.muted || value === 0) {
                value = 0
                volumeLevel = "muted"
            } else if (value > (max/2)) {
                volumeLevel = "high"
            } else {
                volumeLevel = "low"
            }
            let volumePosition = `${((value - min) / (max - min)) * ((offsetWidth - 5) > 0 ? (offsetWidth - 5) : 55) }px`
            let volumePercent = `${((value-min) / (max - min)) * 100}%`
            volumeSlider.value = value
            volumeSlider.dataset.volume = `${value.toFixed()}`
            volumeSlider.style.setProperty("--audio-volume-position", volumePosition)
            volumeSlider.style.setProperty("--audio-volume-percent", volumePercent)
            audioContainer.dataset.volumeLevel = volumeLevel
        }

        volumeState()

        audio.addEventListener("ended", () => audioContainer.classList.add("replay"))

        playPauseBtn.addEventListener("click", togglePlay)

        function togglePlay() {
            audio.paused ? audio.play() : audio.pause()
        }

        audio.addEventListener("play", e => {
            for (const media of document.querySelectorAll('video, audio')) {
                if (media !== e.target) media.pause()
            }
            audioContainer.classList.remove("paused")

            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: e.currentTarget.dataset.mediaTitle,
                    artwork: [
                        {src: e.currentTarget.dataset.mediaArtwork}
                    ]
                })
    
                navigator.mediaSession.setActionHandler('play', ()=>{audio.play()})
                navigator.mediaSession.setActionHandler('pause', ()=>{audio.pause()})
                navigator.mediaSession.playbackState = 'playing'
            }
        })

        audio.addEventListener("pause", () => {
            audioContainer.classList.add("paused")
            if ('mediaSession' in navigator) 
                navigator.mediaSession.playbackState = 'paused'
        })

        const restraintTime = 3000
        let restraintIdTwo, hoverId
        volumeSlider.parentElement.addEventListener("mousemove", () => {
            hoverId = setTimeout(() => {
                if (volumeSlider.parentElement.matches(':hover')) {
                    volumeSlider.parentElement.classList.add("hover")
                    if (restraintIdTwo) clearTimeout(restraintIdTwo)
                    restraintIdTwo = setTimeout(() => {
                        volumeSlider.parentElement.classList.remove("hover")
                    }, restraintTime)                    
                }
            }, 250)
        })

        volumeSlider.parentElement.addEventListener("mouseup", () => {
            if (hoverId) clearTimeout(hoverId)
        })
    }
}