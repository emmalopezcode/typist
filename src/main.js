//api call
function getText(query) {
    return fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${query}&explaintext=1&formatversion=2&format=json`)
        .then(res => { return res.text() })
        .then(
            (result) => {
                var obj = JSON.parse(result);
                var text = obj.query.pages[0].extract;
                return text;
            },
        );
}


function fillText() {
    console.log('fill text');

    require.config({
        waitSeconds: 2,
        paths: {
            text: 'text',
            json: 'json'
        }
    });
    require(['json!nouns.json'], (res) => {
        cursor = 0;
        var index = Math.floor(Math.random() * res.length);
        const chosenNoun = res[index];
        var textArea = document.getElementById('tb');
        getText(chosenNoun)
            .then((response) => {
                if (response.includes('to:') || response.includes('be:')) {
                    fillText();
                } else {
                    while (textArea.firstChild) {
                        textArea.removeChild(textArea.childNodes[0]);
                    }

                    for (const char of response) {
                        var newElement = document.createElement('span');
                        newElement.innerText = char;
                        textArea.append(newElement);
                    }
                }
            });


    });

}

var textArea = document.getElementById('tb');

var body = document.getElementById("bod");
var cursor = 0;
var activeSpan;
var wordcount = 0;
var incorrect = 0;
var correct = 0;

function newFont() {
    textArea.style.fontFamily = document.getElementById('fonts').value;
}

function start() {
    wordcount = 0;
    incorrect = 0;
    correct = 0;
    activeSpan = textArea.children[cursor];
    activeSpan.setAttribute('class', 'active');
    startTimer();
}

function startTimer() {
    var seconds = 60;

    var x = setInterval(function () {
        seconds--;
        document.getElementById("timer").innerHTML = seconds;

        if (seconds < 0) {
            clearInterval(x);
            var accuracy = Math.round((correct / (correct + incorrect)) * 100);
            alert(`you typed ${wordcount} words per minute with an accuracy of ${accuracy}%`);
            document.getElementById("timer").innerHTML = "";

        }
    }, 1000);
}


function typekey(e) {

    if (activeSpan && textArea.children[cursor + 1]) {
        if (e.keyCode === 37) {
            cursor--;
            activeSpan.setAttribute('class', 'inactive');
            activeSpan = textArea.children[cursor];
            activeSpan.setAttribute('class', 'active');
            return;

        }
        
        cursor++;
        activeSpan.setAttribute('class', 'inactive');


        if (activeSpan.innerHTML === ' ') {
            e.preventDefault();
            wordcount++;
        }

        if (e.key === activeSpan.innerText) {
            activeSpan.setAttribute('class', 'correct');
            correct++;
        } else {
            activeSpan.setAttribute('class', 'incorrect');
            incorrect++;
        }
        activeSpan = textArea.children[cursor];
        activeSpan.setAttribute('class', 'active');

    }

}

fillText();