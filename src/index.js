document.getElementById('loader').classList.add('hide');

const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
const feedUrl = 'https://www.oasport.it/feed/';



const rssContainer = document.getElementById('rss');




function createRssItem(descr) {
    const html = `<div class="rss-item">${descr}</div>`;

    rssContainer.insertAdjacentHTML('afterbegin', html);
}

/* createRssItem('eccoci quaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa asdasdasdasdasd          adasdadads');
createRssItem('eccoci qua'); */

let frag = document.createDocumentFragment()
let hasBegun = true
let url = new URL(feedUrl)

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
                    let temp = document.importNode(document.querySelector('template').content, true);
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
                document.querySelector('output').textContent = '';
                hasBegun = false;
            }
            document.querySelector('output').appendChild(frag)
        })
    }).catch((e) => console.error('Error in fetching the RSS feed', e))
}