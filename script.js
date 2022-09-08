//Configs
const apiKey = "a1d81f055b6140de991cfc86933a5e1f"
const interval = 10;

//Global Variables
let newsSeparate = [];
let news = [];
let count = 0;

//Returns the smallest length of child elements
function getMinimumLength(arr){
    let minLen = 0;
    for(let i = 0 ; i<arr.length ; i++){
        let item = arr[i].articles;
        if(item.length > minLen){
            minLen = item.length;
        }
    }
    return minLen;
}

//Compile news by category for geral variable
async function populateNews(){
    for(let i = 0; i < getMinimumLength(newsSeparate); i++){
        for(let j = 0; j<newsSeparate.length; j++){
            news.push(newsSeparate[j]['articles'][i]);
        }
    }
}

//Return the actual date in format yyyy-mm-dd
function getActualDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = `${yyyy}-${mm}-${dd}`;

    return today;
}

//Execute the request with promisse
async function promissify(item) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `https://newsapi.org/v2/everything?q=${item}&language=pt&apiKey=${apiKey}&to=${getActualDate()}`,
            success: function (response) {
                newsSeparate.push(response);
                resolve();
            }
        });
    })
}

//run all initial configs
async function init(){
    await promissify('economia');
    await promissify('carro');
    await promissify('futebol');
    await populateNews();

    console.log('Requests have been completed');

    createSection(news[count]);
    setCreateInterval();
}

init();

//Create a section by notice object
function createSection(notice){
    let img = notice.urlToImage;
    let title = notice.title;
    let fonte = `Fonte: ${notice.source.name}, ${notice.author}`;

    let section = document.createElement('section');
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let p = document.createElement('p');

    h2.innerText = title;
    p.innerText = fonte;
    section.id=`section_${count}`;
    section.style.backgroundImage = `url('${img}')`;

    count++;

    div.appendChild(h2);
    div.appendChild(p);
    section.appendChild(div);

    document.getElementById('content').appendChild(section);
}

function scrollNextNews(){
    $("html, body").animate({ scrollLeft: document.body.offsetWidth * count }, 750);
    //window.scrollTo(document.body.offsetWidth * count , 0); 
}

//Create inteval for news
function setCreateInterval(){
    setInterval(()=>{
        createSection(news[count]);
        scrollNextNews();
    }, 1000 * interval)
}