
function setPreset() {
    document.getElementById("apiKey").value = config.API_KEY;
    document.getElementById("lat").value = 25.048;
    document.getElementById("lon").value = 121.532;
    document.getElementById("time").value = 1675785600;
    document.getElementById("city").value = "Taipei";
  }
  
  async function fetchDataByLatLon() {
    const apiKey = document.getElementById("apiKey").value;
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    const time =  document.getElementById("time").value;
    const city = document.getElementById("city").value;
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    
    // Fetching data using async/await
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      displayData(data); // Accessing JSON properties
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    // Fetching data using promises and .then()
    // fetch(apiUrl)
    //   .then(response => response.json())
    //   .then(data => displayData(data))
    //   .catch(error => console.error('Error fetching data:', error));
  }
  
  async function fetchDataByCity() {
    const apiKey = document.getElementById("apiKey").value;
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    const time =  document.getElementById("time").value;
    const city = document.getElementById("city").value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    // Fetching data using async/await
    // try {
    //   const response = await fetch(apiUrl);
    //   const data = await response.json();
    //   displayData(data); // Accessing JSON properties
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
    
    // Fetching data using promises and .then()
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => displayData(data))
      .catch(error => console.error('Error fetching data:', error));
  }
  // Function to display data
  function displayData(data) {
    // Accessing JSON properties
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const cityName = data.name;
    const country = data.sys.country;
    
    // Displaying data
    //const output = `Temperature: ${temperature}K, Weather: ${weatherDescription}, City: ${cityName}, Country: ${country}`;
    const output = `<table border="1px">
    <colgroup>
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 60%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 15%;">
      </colgroup>
    <tr>`+
    `<th>Temprature</th>
    <th>Weather</th>
    <th>City</th>
    <th>Country</th>
    </tr><tr>`+
  `<td id="temp">${temperature}K</td>` +
  `<td id="weather">${weatherDescription}</td>` +
  `<td id="cty">${cityName}</td>`+
  `<td id="ctry"> ${country}</td>`+
  `<tr></table>`;
    document.getElementById("dataContainer").innerHTML = output;
    // document.getElementById("dataContainer").innerHTML = JSON.stringify(data, null, 2);
  
  }
  

// Code for fetchDataFromAll(), fetchDataFromAny(), and fetchDataWithWorker() functions goes here

// Function to fetch data from both endpoints simultaneously using Promise.all()
async function fetchDataFromAll() {
    try {
      const [dataByCity, dataByLatLon] = await Promise.all([fetchDataByCity(), fetchDataByLatLon()]);
      displayData(dataByCity || dataByLatLon); // Display whichever data arrives first
    } catch (error) {
      console.error('Error fetching data from all sources:', error);
    }
  }
  
  // Function to fetch data from either endpoint, whichever returns first, using Promise.any()
  async function fetchDataFromAny() {
    try {
      const result = await Promise.any([fetchDataByCity(), fetchDataByLatLon()]);
      displayData(result);
    } catch (error) {
      console.error('Error fetching data from any source:', error);
    }
  }
  
  // Function to fetch data using web worker
  function fetchDataWithWorker() {
    const apiKey = document.getElementById("apiKey").value;
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    const city = document.getElementById("city").value;
  
    const worker = new Worker('fetchDataWorker.js');
  
    worker.onmessage = function(event) {
      const { data, error } = event.data;
      if (data) {
        displayData(data);
      } else if (error) {
        console.error('Error fetching data:', error);
      }
      worker.terminate();
    };
  
    worker.postMessage({ apiKey, lat, lon, city });
  }
  