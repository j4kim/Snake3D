function initCanvas() {
    var canvas = document.getElementById("webgl-canvas");
    var bonus = document.getElementById("bonus");
    var cc = document.getElementById("canvas-container");
    var menu = document.getElementById("game-menu");
    var container = document.getElementById("container");
    var w = window.innerWidth;
    var h = window.innerHeight;

    a = Math.min(w, h) * 0.7;
    canvas.width = canvas.height = a;
    bonus.style.width = cc.style.width = cc.style.height = a + 'px';
    bonus.style.top = (a / 2 - 20) + 'px';
    // menu.style.left = menu.style.top = a / 4 + 'px';
    container.style.maxWidth = a + 'px';

    loadScores();

    handleScroll(cc);

    initWebGL();
}

window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev) {
    // 32 -> spacebar
    if (ev.keyCode == 32) {
        togglePause();
        return;
    }

    var keyToDir = {
        // les clés doivent être des strings, la conversion int->str se fait automatiquement
        "87": "back",                // 87 -> W
        "65": "left", "37": "left",  // 65 -> A, 37 -> left arrow
        "83": "front",               // 83 -> S
        "68": "right", "39": "right",// 68 -> D, 39 -> right arrow
        "38": "up",                  // 38 -> up arrow
        "40": "down"                 // 40 -> down arrow
    };
    changeDirection(keyToDir[ev.keyCode]);
}

function handleScroll(scrollZone) {

    myScroll = new IScroll(scrollZone, {
        tap: true,
        mouseWheel: true,
        preventDefault: false
    });

    myScroll.on('scrollEnd', function () {
        if (gameover) return;
        // Si l'événement provient de la roulette, c'est l'attribut directionX (pourquoi X ? je ne sais pas)
        // qui détermine la direction
        // Sinon si l'événement vient d'un swipe du doigts, on regarde dans l'attribut distY le chemin parcouru en Y
        if (this.directionX == 1 || this.distY > 50) {
            changeDirection("front");
        } else if (this.directionX == -1 || this.distY < -50) {
            changeDirection("back");
        }
    });

    scrollZone.addEventListener('tap', function (e) {
        if (gameover) return;
        var w = parseInt(this.style.width);
        var left = e.pageX - this.getBoundingClientRect().left;
        var top = e.pageY - this.getBoundingClientRect().top;
        var right = w - left;
        var bottom = w - top;
        if (getStandardDeviation([left, top, right, bottom], 1) / w < 0.1) {
            e.stopPropagation();
            togglePause();
            return;
        }
        var choices = [
            {dist: left, direction: "left"},
            {dist: top, direction: "up"},
            {dist: bottom, direction: "down"},
            {dist: right, direction: "right"}
        ];
        var min = choices[0];
        choices.forEach(function (choice) {
            if (choice.dist < min.dist)
                min = choice
        });
        changeDirection(min.direction);
    }, false);
}

function togglePause() {
    if (gameover) return;
    paused = !paused;
    serpent.pause(paused);
    if (paused) var dis = "block";
    else var dis = "none";
    pauseMenu.style.display = dis;
}

function restart() {
    if (paused)
        togglePause();
    initScene();
    document.getElementById("envoyer").disabled = false;
}

function toggleHelp() {
    help = document.getElementById("help");
    if (help.style.display == "block") {
        help.style.display = "none";
    } else {
        help.style.display = "block";
        if (!paused)
            togglePause();
    }
}

function toggleMute(btn_mute) {
    if (muted) {
        btn_mute.style.color = "red";
    } else {
        btn_mute.style.color = "blue";
    }
    muted = !muted;
}

document.getElementById("music").volume = 0.8;
function toggleMusic(btn_music) {
    var audio = document.getElementById("music");
    if (audio.volume == 0) {
        audio.volume = 0.8;
        btn_music.style.color = "red";
    } else {
        audio.volume = 0;
        btn_music.style.color = "blue";
    }
}

function displayMessage(msg) {
    document.getElementById("bonus").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("bonus").innerHTML = "";
    }, 1500);
}

function playSound(id) {
    if (muted)return;
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function loadScores() {
    makeCorsRequest("GET", "http://j4kim.nexgate.ch/snake3d/getScores.php").then(function (result) {
        document.getElementById("scores").innerHTML = result;
    });
}

document.getElementById("envoyer").addEventListener('click', function (e) {
    e.preventDefault();
    postScore();
});

function postScore() {
    var score = document.getElementById("gameover-score").innerHTML;
    var name = document.getElementById("nom").value;
    makeCorsRequest(
        "POST", "http://j4kim.nexgate.ch/snake3d/postScore.php",
        "score=" + score + "&name=" + name)
        .then(function (result) {
                document.getElementById("envoyer").disabled = true;
                loadScores();
        }
        );
}
