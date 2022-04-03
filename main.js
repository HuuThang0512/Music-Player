const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const  PLAYER_STORAGE_KEY = 'HT_MUSIC_PLAY';
const likeSong = $('.like')
const emptyHeart = $('.fa-regular.fa-heart')
const redHeart = $('.fa-solid.fa-heart')
const playBtn = $('.btn-toggle-play')
const playList = $('.playlist')
const audio = $('#audio')
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const progress = $('#progress')
const volume = $('#volume')
const nextBtn = $('.btn.btn-next')
const prevBtn = $('.btn.btn-prev')
const randomBtn = $('.btn.btn-random')
const repeatBtn = $('.btn.btn-repeat')
const audioCurrentTime = $('.audio__current-time')
const audioDurationTime = $('.audio__duration-time')
var app = {
    currentIndex: 0,
    _this: this,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
    isLiked: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Watermelon Sugar',
            singer: 'Harry Styles',
            path: './assest/music/Watermelon Sugar.mp3',
            image: 'https://f4.bcbits.com/img/a2890996789_10.jpg'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers',
            path: './assest/music/Closer.mp3',
            image: 'https://i1.sndcdn.com/artworks-000179073287-3ur3or-t500x500.jpg'
        },
        {
            name: 'Blinding Lights',
            singer: 'The Weekend',
            path: './assest/music/Blinding Lights.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2019/11/29/d/1/c/d/1575009224279_640.jpg'
        },
        {
            name: 'Old Town Road',
            singer: 'Lil Nas X',
            path: './assest/music/Old Town Road.mp3',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpMfthpUdq4fAuHoGyPv2nSydzydoCrva151aAfFoX9nkDEGeEDqwusVu21wZV-VD1rvU&usqp=CAU'
        },
        {
            name: 'Sorry',
            singer: 'Justin Bieber',
            path: './assest/music/Sorry.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/8/8f/Sorry_Justin_Bieber_Cover.jpg'
        },
        {
            name: 'See you again',
            singer: 'Wiz Khalifa ft. Charlie Puth',
            path: './assest/music/See You Again.mp3',
            image: 'https://c-cl.cdn.smule.com/rs-s23/arr/07/ae/0d640d9f-a8f2-4f67-8b4d-9a5a6dcbfef1.jpg'
        },
        {
            name: 'Cold Water',
            singer: 'Justin Bieber, Major Lazer',
            path: './assest/music/Cold Water.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2018/06/13/a/3/e/f/1528863713011_500.jpg'
        },
        {
            name: 'Thủ Đô Cypher',
            singer: 'RPT Orijinn, LOW G, RZMas, RPT MCK',
            path: './assest/music/Thủ Đô Cypher.mp3',
            image: 'data:image/jpeg;base64,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'
        },
        {
            name: 'Răng khôn',
            singer: 'Phí Phương Anh',
            path: './assest/music/Răng khôn.mp3',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/b/7/b/5/b7b5b99e4aa374702ce8ee64858a9bbb.jpg'
        },
        {
            name: 'Chạy về khóc với anh',
            singer: 'ERIK',
            path: './assest/music/Chạy về khóc với anh.mp3',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/cover/c/6/d/e/c6def069a1a885c41fe479358fa7c506.jpg'
        },
        
    ],

    // Render danh sách bài hát
    render: function() {
        const htmls = this.songs.map((song, index) => {
          return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= '${index}'>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        }
           )

    $('.playlist').innerHTML = htmls.join('')
    setTimeout(function () {
        const durationMin = Number.parseInt(audio.duration / 60)
        const durationSecond = Number.parseInt(audio.duration - 60*durationMin)
        if(Number.isNaN(durationMin) || Number.isNaN(durationSecond)) {
            audioDurationTime.innerHTML = `--:--`
        } else {
            if(durationSecond < 10) {
                audioDurationTime.innerHTML = `0${durationMin}:0${durationSecond}`
                } else {
                    audioDurationTime.innerHTML = `0${durationMin}:${durationSecond}`
                }
        }
    }, 1000)
    },

    definedProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lí các sự kiện
    handleEvent: function() {
        const _this = this
        const cdRotateAni = cd.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 15000,
            iterations: Infinity
        });
        cdRotateAni.pause()
        // Xử lí khi cuộn chuột
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollY;
            const newCdWidth = cdWidth - scrollTop/2;
            const ratioCd = newCdWidth / cdWidth
            cd.style.width = newCdWidth > 0 || !! Number.isNaN(newCdWidth) ? newCdWidth + 'px' : 0;
            cd.style.opacity = ratioCd;
            $('.control').style.paddingTop = (18 - scrollTop/10) + 'px'
            if(Number.isNaN(ratioCd)) {
                cd.style.setProperty('--size', `12px`)
            } else {
                cd.style.setProperty('--size', `${ratioCd*12}px`)
            }
        }

        // Xử lí khi người dùng thích bài hát
        likeSong.onclick = function () {
            $('.icon.active').classList.add('click-animate')
            _this.isLiked = !_this.isLiked
            _this.setConfig('liked', _this.isLiked)
            emptyHeart.classList.toggle('active', !_this.isLiked)
            redHeart.classList.toggle('active', _this.isLiked)
        }

        volume.oninput = function() {
            audio.volume = volume.value / 100
            _this.setConfig('volume', volume.value)
            if(audio.volume == 1) {
                volume.style.setProperty('--currentVolLength', `${volume.value - 1}%`)
            } else {
                volume.style.setProperty('--currentVolLength', `${volume.value}%`)
            }
            if(volume.value == 0) {
                _this.isMuted = true
            } else {
                _this.isMuted = false
            }
            $('.fa-volume-high').classList.toggle('active', !_this.isMuted)
            $('.fa-volume-xmark').classList.toggle('active', _this.isMuted)
        }

        // Xử lí khi bấm play
        playBtn.onclick = function() {
            // play/pause audio khi bấm play
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play()
            }
        }

        // Khi audio được phát
        audio.onplay = function() {
            $('.player').classList.add('playing')
            _this.isPlaying = true
            cdRotateAni.play()
            _this.scrollToActiveSong()
            setTimeout(function () {
                const durationMin = Number.parseInt(audio.duration / 60)
                const durationSecond = Number.parseInt(audio.duration - 60*durationMin)
                if(Number.isNaN(durationMin) || Number.isNaN(durationSecond)) {
                    audioDurationTime.innerHTML = `--:--`
                } else {
                    if(durationSecond < 10) {
                        audioDurationTime.innerHTML = `0${durationMin}:0${durationSecond}`
                        } else {
                            audioDurationTime.innerHTML = `0${durationMin}:${durationSecond}`
                        }
                }
            }, 300)
        }

        // Khi audio được pause
        audio.onpause = function() {
            $('.player').classList.remove('playing')
            _this.isPlaying = false
            cdRotateAni.pause()
        }

        // Xử lí thanh progress khi bài hát chạy 
        audio.ontimeupdate = function() {
            const progressCurrent = audio.currentTime / audio.duration*100
            const currentMin = Number.parseInt(audio.currentTime / 60)
            const currentSecond = Number.parseInt(audio.currentTime - 60*currentMin)
            // Núm thể hiện % bài hát
            if(Number.isNaN(progressCurrent)) {
                progress.value = 0
            } else {
                progress.value = progressCurrent
            }

            // Thanh màu thể hiện % bài hát
            if(Number.isNaN(progressCurrent)) {
                progress.style.setProperty('--currentProgLength', '0')
            } else {
                if(progressCurrent === 100) {
                    progress.style.setProperty('--currentProgLength', `${progressCurrent - 1}%`)
                } else
                progress.style.setProperty('--currentProgLength', `${progressCurrent}%`)
            }

            // Thời gian hiện tại của bài hát
            if(currentSecond < 10) {
            audioCurrentTime.innerHTML = `0${currentMin}:0${currentSecond}`
            } else {
                audioCurrentTime.innerHTML = `0${currentMin}:${currentSecond}`
            }

        }

        // Xử lí khi tua 
        progress.oninput = function(e) {
            const currentTimeSeek = e.target.value * audio.duration /100
            audio.currentTime = currentTimeSeek 
        }
        // Khi phát bài hát ngay trước
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            audio.play()

        }
        // Khi phát bài hát ngay sau
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            audio.play()

        }

        // Xử lí khi bật/ tắt random 
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)
        //    if(_this.isRandom) {
        //        if(_this.isRepeat) {
        //            _this.isRepeat = false
        //            repeatBtn.classList.toggle('active', _this.isRepeat)
        //        }
        //    }
        }
        // Xử lí phát lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
            // if(_this.isRandom) {
            //     _this.isRandom = false
            //     randomBtn.classList.toggle('active', _this.isRandom)
            // }
        }
        // Xử lí khi kết thúc bài hát
        audio.onended = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
            _this.render()
            audio.play()
        }

        // Lắng nghe sự kiện click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')) {
                    alert('Chức năng đang thử nghiệm')
                }
            }
        }
    },

    loadCurrentSong: function() {
        const headingSongName = $('header h2')
        const headingSingerName = $('header h1')
        const cdThumb = $('.cd-thumb')
        headingSongName.innerHTML = this.currentSong.name;
        headingSingerName.innerHTML = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
            // Thời lượng bài hát
        setTimeout(function () {
            const durationMin = Number.parseInt(audio.duration / 60)
            const durationSecond = Number.parseInt(audio.duration - 60*durationMin)
            if(Number.isNaN(durationMin) || Number.isNaN(durationSecond)) {
                audioDurationTime.innerHTML = `--:--`
            } else {
                if(durationSecond < 10) {
                    audioDurationTime.innerHTML = `0${durationMin}:0${durationSecond}`
                    } else {
                        audioDurationTime.innerHTML = `0${durationMin}:${durationSecond}`
                    }
            }
        }, 500)
        $('.dashboard').style.setProperty('--audioImage', `url(${this.currentSong.image})`)
        
    },

    loadConfig: function() {
        // Xử lí giá trị của các phần khi refresh
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        volume.value = this.config.volume
        this.isLiked = this.config.liked

        // Xử lí các hiệu ứng của các phần
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        if(audio.volume == 1) {
            volume.style.setProperty('--currentVolLength', `${volume.value - 1}%`)
        } else {
            volume.style.setProperty('--currentVolLength', `${volume.value}%`)
        }
        if(volume.value == 0) {
            this.isMuted = true
        } else {
            this.isMuted = false
        }
        $('.fa-volume-high').classList.toggle('active', !this.isMuted)
        $('.fa-volume-xmark').classList.toggle('active', this.isMuted)
        emptyHeart.classList.toggle('active', !this.isLiked)
        redHeart.classList.toggle('active', this.isLiked)
    },

    // Tua bài hát
    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        } 
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        } 
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({behavior: "smooth", block: "end"})
        }, 300)
    },

    start: function() {
        // Định nghĩa Properties
        this.definedProperties()

        // Render ra các bài hát
        this.render()

        this.loadConfig()

        // Tải thông tin bài hát đầu tiên vào Ui khi chạy ứng dụng
        this.loadCurrentSong()

        // Các sự kiện
        this.handleEvent()

        
    }
}
app.start()