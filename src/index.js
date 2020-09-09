// --- RSS ---
const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
const feedUrl = 'https://feeds.feedburner.com/skidrowgamesfeed';



document.getElementById('refresh-button').onclick = function () {
    /* fetch(feedUrl).then((res) => {
        res.text().then((xmlTxt) => {
            var domParser = new DOMParser()
            let doc = domParser.parseFromString(xmlTxt, 'text/xml')
            doc.querySelectorAll('item').forEach((item) => {

           

                createRssItem(item.querySelector('title').textContent);
            })
        })
    }) */

    let frag = document.createDocumentFragment()
    let hasBegun = true
    let url = new URL(feedUrl)
    const rssElement = document.getElementById('rss');
    const template = document.getElementById('template-rss-item').content;

    /* Fetch the RSS Feed */
    fetch(feedUrl).then((res) => {
        res.text().then((xmlTxt) => {
            /* Parse the RSS Feed and display the content */
            try {
                let doc = DOMPARSER(xmlTxt, "text/xml")
                let heading = document.createElement('h1')
                heading.textContent = url.hostname
                frag.appendChild(heading)
                doc.querySelectorAll('item').forEach((item) => {
                    let temp = document.importNode(template, true);
                    let i = item.querySelector.bind(item)
                    let t = temp.querySelector.bind(temp)
                    t('h2').textContent = !!i('title') ? i('title').textContent : '-'
                    t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : '#'
                    t('p').innerHTML = !!i('description') ? i('description').textContent : '-'
                    t('h3').textContent = url.hostname
                    frag.appendChild(temp)
                })
            } catch (e) {
                console.error('Error in parsing the feed', e);
            }
            if (hasBegun) {
                rssElement.textContent = '';
                hasBegun = false;
            }
            rssElement.appendChild(frag)
        })
    }).catch((e) => console.error('Error in fetching the RSS feed', e))
}

// --- TILES: TOP SITES ---

function createTiles(mostVisitedURLs) {
    const tileElement = document.getElementById('tile');
    const fragment = document.createDocumentFragment();
    const template = document.getElementById('template-tile-item').content;


    for (let i = 0; i < mostVisitedURLs.length; i++) {
        console.log(mostVisitedURLs);
        const tile = document.importNode(template, true);
        const t = tile.querySelector.bind(tile)
        t('a').href = mostVisitedURLs[i].url;
        t('span').textContent = mostVisitedURLs[i].title;
        t('img').src = "chrome://favicon/size/24/" + mostVisitedURLs[i].url;
        fragment.appendChild(tile)
    }

    tileElement.appendChild(fragment);
}


chrome.topSites.get(createTiles);

// --- NOTES ---

function createNotes() {
    const textArea = document.getElementById('notes');
    const notes = localStorage.getItem("notes");

    textArea.value = notes;
    let timeoutId = null;
    textArea.addEventListener("input", (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            // Runs 1 second (1000 ms) after the last change    
            localStorage.setItem("notes", textArea.value);
        }, 1000);

    });
}

createNotes();