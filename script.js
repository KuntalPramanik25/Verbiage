const recordButton = document.querySelector(".record")
const result = document.querySelector(".result")
const downloadButton= document.querySelector(".download")
const selectLanguage= document.querySelector("#language")
const clearButton= document.querySelector(".clear")

function popularLanguages() 
{
    languages.forEach((lang) => 
    {
        const option = document.createElement("option")
        option.value = lang.code
        option.innerHTML = lang.name
        selectLanguage.appendChild(option)
    })
  }

popularLanguages();

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition,
    recognition,
    recording = false;

function speechToText() 
{
    try
    {
        recognition = new speechRecognition();
        recognition.lang = selectLanguage.value;
        recognition.interimResults = true
        recordButton.classList.add("recording")
        recordButton.querySelector("p").innerHTML = "Listening..."
        recognition.start()
        recognition.onresult = (event) =>
        {
            const speechResult = event.results[0][0].transcript
            if (event.results[0].isFinal)
            {
                result.innerHTML += " " + speechResult
                result.querySelector("p").remove()
            }
            else
            {
                if (!document.querySelector(".interim"))
                {
                    const interim = document.createElement("p")
                    interim.classList.add("interim")
                    result.appendChild(interim)
                }

                document.querySelector(".interim").innerHTML = " " + speechResult
            }

            downloadButton.disabled = false
        }

        recognition.onspeechend = () =>
        {
            speechToText();
        }

        recognition.onerror = (event) => 
        {
            stopRecording()
            if (event.error === "no-speech")
            {
                alert("No speech was detected. Stopping...");
            }
            else if (event.error === "audio-capture")
            {
                alert("No microphone was found. Ensure that a microphone is installed.");
            }
            else if (event.error === "not-allowed")
            {
                alert("Permission to use microphone is blocked.");
            }
            else if (event.error === "aborted")
            {
                alert("Listening Stopped.");
            }
            else
            {
                alert("Error occurred in recognition: " + event.error);
            }
        }
    }
    catch (error)
    {
        recording = false
        console.log(error)
    }
}

recordButton.addEventListener("click", () => {
    if (!recording)
    {
        speechToText()
        recording = true;
    }
    else
    {
        stopRecording()
    }
})

function stopRecording()
{
    recognition.stop();
    recordButton.querySelector("p").innerHTML = "Start Dictating"
    recordButton.classList.remove("recording")
    recording = false
}

function download()
{
    const text = result.innerText
    const filename = "Speech.txt"

    const element = document.createElement("a")

    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    element.setAttribute("download", filename)

    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

downloadButton.addEventListener("click", download)

clearButton.addEventListener("click", () => {
    result.innerHTML = "";
    downloadButton.disabled = true
})