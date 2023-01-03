const button = document.querySelector('#button');
const audioElement = document.querySelector('#audio');
const subText = document.querySelector('#sub-text');
const subArText = document.querySelector('#sub-ar-text');

//translate the Joke from En to Ar
async function translateToAribaic(joke) {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.append("from", "en");
        encodedParams.append("to", "ar");
        encodedParams.append("text",`${joke}`);
        
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '75d8aed30amshef5707169be2f6cp1c9fb9jsn70761b5e5d41',
                'X-RapidAPI-Host': 'translo.p.rapidapi.com'
            },
            body: encodedParams
        };
        
        const APIUrl = 'https://translo.p.rapidapi.com/api/v3/translate';
        const response = await fetch(APIUrl, options);
        const data = await response.json();
        console.log(data[0]);
        subArText.innerText = `AR-SUB: ${data.translated_text}`;
    } catch (error) {
        // catch Errors
        console.log(error)
    }
}

// Button Enable/Disable
function toggleButton() {
    button.disabled = !button.disabled;
}

// get the Joke from "GetJokes" function and pass it to "VoiceRSS" function
function tellMe(joke) {
    VoiceRSS.speech({
        key:'a120ee4ea05c40ed95fa28b23566ee0d',
        src: joke,
        hl: 'en-us',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// Get Jokes from Joke API
async function getJokes() {
    const APIUrl = 'https://v2.jokeapi.dev/joke/Any';
    let joke = '';
    try {
        const response = await fetch(APIUrl);
        const data = await response.json();
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }
        // Translate the joke
        translateToAribaic(joke);
        // Text-To-Speach
        tellMe(joke);
        subText.innerText = `ENG-SUB: ${joke}`;
        // disable button
        toggleButton();
        console.log(joke);
        } catch (error) {
        // catch errors
        console.log(error)
    }
}


//  Event Listners
button.addEventListener('click', getJokes);
// enable button when audo ended
audioElement.addEventListener('ended', () => {
    toggleButton();
    subText.innerText = '';
    subArText.innerText = '';
});