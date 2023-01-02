const search = document.getElementById("search");
const btn = document.getElementById("btn");
const result = document.getElementById("result");
const surahName = document.getElementById("surah-name");
const surahNameAr = document.getElementById("surah-name-ar");
const revelation = document.getElementById("revelation");
const verses = document.getElementById("verses");
const tranEdit = document.getElementById("tran-edit")
const errortext = document.querySelector(".error")
function showData(surah){
    const {edition,nameArabic,nameEnglish,revelation,ayahs} = surah;
    surahName.innerText = nameEnglish;
    surahNameAr.innerText = nameArabic;
    revelation.innerText = revelation;
    tranEdit.innerText = edition;
    ayahs.forEach(ayah=>{
        const number = document.createElement("p");
        number.classList.add("number")
        number.innerText = ayah.ayahdesc
        const text = document.createElement("p");
        text.classList.add("text")
        text.innerText = ayah.ayah
        verses.appendChild(number);
        verses.appendChild(text);
    })
}
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (e) {
        console.log(e);
    }

}
function searchAyah(arg) {
    let ayahregex = arg.match(/[\d:-]/g)?.join("");
    let editionregex = arg.match(/[a-zA-Z]/g)?.join("").toLowerCase();
    if(ayahregex == undefined){
        return errortext.innerText = "Invalid Arguments!"
    }
    console.log(editionregex)
    let edition = "en.sahih";
    if (editionregex?.length > 0) {
        switch (editionregex) {
            case "saheeh":
            case "sahih":
            case "saheehinternational":
            case "sahihinternational":
                edition = "en.sahih";
                break;
            case "ahmedali":
                edition = "en.ahmedali"
                break;
            case "ahmedrazakhan":
            case "razakhan":
                edition = "en.ahmedraza"
                break;
            case "arberry":
                edition = "en.arberry"
                break;
            case "muhammadasad":
            case "asad":
                edition = "en.asad"
                break;
            case "abdulmajiddaryabadi":
            case "daryabadi":
                edition = "en.daryabadi"
                break;
            case "alhilali":
            case "hilali":
                edition = "en.hilali"
                break;
            case "williampickthall":
            case "pickthall":
                edition = "en.pickthall"
                break;
            default:
                console.log("error");
                break;
        }
    } else {
        edition = "en.sahih"
    }
    let surah = ayahregex?.split(":")[0];
    let startingAyah = ayahregex?.split(":")[1]?.split("-")[0];
    let endingAyah = ayahregex?.split(":")[1]?.split("-")[1];
    if(surah == undefined || startingAyah == undefined){
        return errortext.innerText = "Invalid Arguments!";
    }
    const ayahArr = [];
    if(Number(startingAyah) > Number(endingAyah)) return console.log("Invalid Arguments");
    if(endingAyah == null){ 
        const data = fetchData(`https://api.alquran.cloud/v1/ayah/${surah}:${startingAyah}/editions/${edition}`)
        data.then(res=>{
            res.data.forEach(text=>{
                const theayah = {ayah:text.text,ayahdesc:`${surah}:${startingAyah}`}
                ayahArr.push(theayah)
                
            })
        }).catch(e=>{
            const mute = e
            return errortext.innerText = "Invalid Arguments!";
        })
    } else {
        for(let i = Number(startingAyah);i<=Number(endingAyah);i++){
            const data = fetchData(`https://api.alquran.cloud/v1/ayah/${surah}:${i}/editions/${edition}`)
            data.then(res=>{
                res.data.forEach(text=>{
                    const theayah = {ayah:text.text,ayahdesc:`${surah}:${i}`}
                    ayahArr.push(theayah)
                    
                })
            }).catch(e=>{
                const mute = e
                return errortext.innerText = "Invalid Arguments!";
            })
        }
    }
    const verseDesc = fetchData(`https://api.alquran.cloud/v1/ayah/${surah}:${startingAyah}/editions/${edition}`);
    verseDesc.then(res=>{
        const {edition,surah} = res.data[0]
        // console.log(edition)
        let surahData = {
            edition:edition.englishName,
            nameArabic:surah.name,
            nameEnglish:surah.englishName,
            revelation:surah.revelationType,
            ayahs:ayahArr
        };
        console.log(surahData)
        showData(surahData);
    }).catch(e=>{
        const mute = e
        return errortext.innerText = "Invalid Arguments!";
    })
}
btn.addEventListener("click",()=>{
    surahName.innerHTML = "";
    surahNameAr.innerHTML = "";
    revelation.innerHTML = "";
    tranEdit.innerHTML = "";
    verses.innerHTML = "";
    errortext.innerHTML = ""
    let searchtxt = search.value;
    searchAyah(searchtxt)
})
