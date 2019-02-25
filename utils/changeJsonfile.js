const fs = require('fs');
const isPlainObject = require('is-plain-object');

// todo 支持递归
module.exports = function (jsonFile, options) {
  return new Promise((resolve, reject)=>{
    if(!isPlainObject(options)){
      console.error('options must be plainObject.');
      reject();
      return;
    }

    fs.readFile(jsonFile, function(err,data){
      if(err){
        console.error(err);
        reject(err);
        return;
      }

      try{
        let json = data.toString();
        json = JSON.parse(json);
        
        for(let prop in options){
          json[prop] = options[prop];
        }

        const str = JSON.stringify(json);

        fs.writeFile(jsonFile, str, function(err){
          if(err){
              console.error(err);
              reject(err);
              return;
          }
          resolve(json);
        })
      }catch(err){
        console.error(err);
        reject(err);
      }
    })
  })
}