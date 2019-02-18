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

      //把数据读出来,然后进行修改
      // for(var i = 0; i < person.data.length;i++){
      //   if(id == person.data[i].id){
      //     console.log('id一样的');
      //     for(var key in params){
      //       if(person.data[i][key]){
      //           person.data[i][key] = params[key];
      //       }
      //     }
      //   }
      // }
      // person.total = person.data.length;
      // var str = JSON.stringify(person);
      // //console.log(str);
      // fs.writeFile('./mock/person.json',str,function(err){
      //   if(err){
      //       console.error(err);
      //   }
      //   console.log('--------------------修改成功');
      //   console.log(person.data);
      // })
    })
  })
}