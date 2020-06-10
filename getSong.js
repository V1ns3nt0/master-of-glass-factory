const axios = require("axios");
const config = require('./config/default.json');

const url = 'https://deezerdevs-deezer.p.rapidapi.com';

module.exports = {

  /**
  * Function that makes a request to the API to search for music.
  * @param {string} someString - the name of the song or artist
  * @return {object}
  * @author V1ns3nt0
  */

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
