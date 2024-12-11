const input=document.querySelector('.input-search');
const suggestions=document.querySelector('.suggestions');
const searchIcon=document.querySelector('.search-icon');
const humidity=document.querySelector('.humidity .value')
const temperature=document.querySelector('.temperature .value')
const precipitation=document.querySelector('.precipitation .value');
var apiKey;

async function gettingKey() {
    const response=await fetch('http://localhost:3000/key');

    const data=await response.json();
    apiKey=data.key;
    
}
gettingKey();



const apiHost='wft-geo-db.p.rapidapi.com';
let debounceTimer;

input.addEventListener('input',()=>{
    let query=input.value;

    if (query=='') {
        suggestions.innerHTML=''
       
      
        
    }
    if (!query) {
        suggestions.innerHTML=''
        return
      
        
    }
    clearTimeout(debounceTimer)
    debounceTimer=setTimeout(()=>fetchCities(query),500)
})


async function fetchCities(query) {

    const url=`https://${apiHost}/v1/geo/cities?namePrefix=${query}&limit=5`;
    const options={
        method:'GET',
        headers:{
                'X-RapidAPI-Key': apiKey,
                   'X-RapidAPI-Host': apiHost
                }
    };
    try {
    const response=await fetch(url,options);

    if (!response.ok) {
        
        console.log("Error Occured",response.statusText);
        
       
        
    }
    const data=await response.json();
    if (!data.data || !Array.isArray(data.data)) {
       
        console.log('Unexpected API Response');
        
        
    }

    suggestions.innerHTML=''
    data.data.forEach(city=>{
        const li=document.createElement('li');

        li.textContent=city.name;
        li.addEventListener('click',()=>{
            input.value=city.name;
            suggestions.innerHTML=''
        })
        suggestions.appendChild(li);

    })
        
    } catch (error) {
        console.log("Error Occured");
        
        
    }
    
  
}


searchIcon.addEventListener('click', ()=>{
    let query=input.value;
    let debounceTimer;
    if (query=='') {
        console.log('Nothing to search');
        return
        
        
    }else if(!query){
        console.log('Nothing to search');
        return

    }

    clearTimeout(debounceTimer);
    debounceTimer=setTimeout(()=>fetchingWeather(query),500)
    


    

  

})

async function fetchingWeather(query) {
    try {
        const response=await fetch('http://localhost:3000/city',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({city:query})
        })
        const data=await response.json();
        humidity.textContent=data.humidity;
        temperature.textContent=data.temperature+' °C';
        precipitation.textContent=data.precipitation;
        
     
        
    } catch (error) {
        console.log("Error occred in fetching");
        
        
    }
    
}
