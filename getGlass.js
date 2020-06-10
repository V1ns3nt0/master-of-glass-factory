const axios = require("axios");

const url = "https://api.jikan.moe/v3/genre";

module.exports = {

  /**
  * Function that makes a request to the API to search for anime and manga.
  * @param {string} type - anime or manga
  * @param {number} genre - genre's ID
  * @return {object}
  * @author V1ns3nt0
  */

  recomendGlass: (type, genre) => axios({
      "method":"GET",
      "url":`${url}/${type}/${genre}`,
      "headers":{
      "content-type":"application/json",
      },"params":{
        'type': type,
        'genre_id': genre
      }
      })
      .then((response)=>{
        return response.data;
      })
      .catch((error)=>{
        console.log(error)
      })
}
