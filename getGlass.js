const axios = require("axios");

const url = "https://api.jikan.moe/v3/genre";

module.exports = {
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
