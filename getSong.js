const axios = require("axios");
const config = require('./config/default.json');

const url = 'https://deezerdevs-deezer.p.rapidapi.com';

module.exports = {
  searchSong: (someString) => axios({
      "method":"GET",
      "url":`${url}/search`,
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": config.rapidapiKey,
      "useQueryString":true
      },"params":{
      "q":someString
      }
      })
      .then((response)=>{
        return response.data;
      })
      .catch((error)=>{
        console.log(error)
      })
}
