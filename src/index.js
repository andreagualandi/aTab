

/* 
const rssContainer = document.getElementById('rss');




function createRssItem(descr) {
    const html = `<div class="rss-item">${descr}</div>`;

    rssContainer.insertAdjacentHTML('afterbegin', html);
}

createRssItem('eccoci quaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa asdasdasdasdasd          adasdadads');
createRssItem('eccoci qua');  */

// --- RSS ---
const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
const feedUrl = 'https://www.oasport.it/feed/';



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
                    let temp = document.importNode(document.getElementById('template-rss-item').content, true);
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



// Event listener for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
    chrome.tabs.create({ url: event.srcElement.href });
    return false;
}

// Given an array of URLs, build a DOM list of these URLs in the
// browser action popup.
function buildPopupDom(mostVisitedURLs) {
    /* const popupDiv = document.getElementById('mostVisited_div');
    var ol = popupDiv.appendChild(document.createElement('ol'));
 */
    const tileElement = document.getElementById('tile');

    for (var i = 0; i < mostVisitedURLs.length; i++) {
        /* var li = ol.appendChild(document.createElement('li'));
        var a = li.appendChild(document.createElement('a'));
        a.href = mostVisitedURLs[i].url;
        a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
        a.addEventListener('click', onAnchorClick);
 */
        const fragTile = createTile(mostVisitedURLs[i].title, mostVisitedURLs[i].url);
        tileElement.appendChild(fragTile);
    }
}

function createTile(title, url) {
    const fragment = document.createDocumentFragment();
    let template = document.importNode(document.getElementById('template-tile-item').content, true);

    let t = template.querySelector.bind(template)


    t('a').textContent = title;
    t('a').href = url;
    fragment.appendChild(template)
    return fragment;
}


chrome.topSites.get(buildPopupDom);