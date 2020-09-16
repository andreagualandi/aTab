// --- RSS ---
const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
let feedUrl = '';

function createRss() {
    //TODO load from storage
    const rssList = [
        'https://feeds.feedburner.com/skidrowgamesfeed',
    ];

    rssList.forEach(url => {
        createRssFeed(url);
    });

}

function createRssFeed(url) {
    feedUrl = url;
    let fragment = document.createDocumentFragment()
    const rssContainer = document.getElementById('rss-container');
    const feedTemplate = document.getElementById('template-rss-feed').content;

    const feed = document.importNode(feedTemplate, true);
    const t = feed.querySelector.bind(feed)
    t('h1').textContent = url;
    t('button').addEventListener('click', createRssItem);
    fragment.appendChild(feed)
    rssContainer.appendChild(fragment)
}


function createRssItem() {
    let frag = document.createDocumentFragment()
    let hasBegun = true
    const rssElement = document.getElementById('rss');
    const template = document.getElementById('template-rss-item').content;

    /* Fetch the RSS Feed */
    fetch(feedUrl).then((res) => {
        res.text().then((xmlTxt) => {
            /* Parse the RSS Feed and display the content */
            try {
                let doc = DOMPARSER(xmlTxt, "text/xml")
                doc.querySelectorAll('item').forEach((item) => {
                    let temp = document.importNode(template, true);
                    let i = item.querySelector.bind(item)
                    let t = temp.querySelector.bind(temp)
                    t('h2').textContent = !!i('title') ? i('title').textContent : '-'
                    t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : '#'
                    t('p').innerHTML = !!i('description') ? i('description').textContent : '-'
                    t('h3').textContent = 'RANDOM TEXT'
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

/* fetch(feedUrl).then((res) => {
        res.text().then((xmlTxt) => {
            var domParser = new DOMParser()
            let doc = domParser.parseFromString(xmlTxt, 'text/xml')
            doc.querySelectorAll('item').forEach((item) => {

           

                createRssItem(item.querySelector('title').textContent);
            })
        })
    }) */

createRss();

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

// --- SEARCH ---
function search() {
    const input = document.getElementById('search-input');


    document.getElementById('history-button').addEventListener('click', function (e) {
        document.getElementById('history-container').classList.add('show');
    })

    document.getElementById('btn-close').addEventListener('click', function (e) {
        document.getElementById('history-container').classList.remove('show');
    })

    const output = document.getElementById('out-history');
    let timeoutId = null;

    const result = [];

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

    input.addEventListener("input", (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            // Runs 1 second (1000 ms) after the last change    


            chrome.history.search({
                'text': input.value,              // Return every history item....
                'startTime': oneWeekAgo  // that was accessed less than one week ago.
            },
                function (historyItems) {
                    // For each history item, get details on all visits.
                    historyItems.forEach(item => {
                        const text = `${item.title} [${item.url}]`;
                        result.push(text);
                    });
                    output.value = result.join('\n');
                });





        }, 300);

    });
}

search();