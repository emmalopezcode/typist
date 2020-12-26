
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


