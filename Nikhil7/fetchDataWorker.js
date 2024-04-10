// fetchDataWorker.js

self.onmessage = async function(event) {
    const { apiKey, lat, lon, city } = event.data;
    
    let apiUrl;
    if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    } else if (city) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    } else {
      // Handle invalid parameters
      self.postMessage({ error: 'Invalid parameters provided.' });
      return;
    }
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      self.postMessage({ data });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };
  