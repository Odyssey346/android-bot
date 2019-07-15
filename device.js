function d(d) {
  setInterval(function(){
    const request = require('request');
    const iconv = require("iconv-lite");
    const babyparse = require("babyparse");
    const fs = require("fs");
    request.get({
      url: `https://storage.googleapis.com/play_public/supported_devices.csv`
    }, function(err, response, data){
      if(response.statusCode !== 200) return console.log("error");
      var devices = {};
      function cleanup(str){
        if(!str) return str;
        str = str.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').trim();
        if(str.indexOf("\\x") !== -1){
          var hex = str.split("\\x").slice(1);
          var txt = str.split("\\x")[1];
          for(var i = 0; i < hex.length; i++){
            var h;
            if(hex[i].length > 2){
              h = hex[i].substring(0, 2)
            } else {
              h = hex[i]
            }
            txt += String.fromCharCode(parseInt(h,16));
          }
          if(hex[hex.length - 1].length !== 2){
            txt += hex[hex.length - 1].substr(2)
          }
          str = txt;
        }
        return str;
      }
      babyparse.parse(iconv.decode(Buffer.from(data, 'binary'), 'utf-16le')).data.forEach(parts => {
        if(parts.length === 4){
          if(cleanup(parts[1]).toLowerCase().search("chromebook") === -1){
            if(parts[1] !== ""){
              if(cleanup(parts[1]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
                devices[parts[2].toLowerCase()] = cleanup(parts[1])
              } else {	
                devices[parts[2].toLowerCase()] = cleanup(parts[0] + " " + parts[1])
              }
            } else {
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
                devices[parts[2].toLowerCase()] = cleanup(parts[3])
              } else {	
                devices[parts[2].toLowerCase()] = cleanup(parts[0] + " " + parts[3])
              }
            }
          }
        }
      });
      devices["bacon"] = "OnePlus One";
      devices["onyx"] = "OnePlus X";
      devices["cheeseburger"] = "OnePlus 5";
      devices["dumpling"] = "OnePlus 5T";
      devices["enchilada"] = "OnePlus 6";
      devices["fajita"] = "OnePlus 6T";
      devices["guacamole"] = "OnePlus 7 Pro";
      devices["guacamoleb"] = "OnePlus 7";
      devices["tissot"] = "Xiaomi Mi A1";
      devices["daisy"] = "Xiaomi Mi A2 Lite";
      devices["lavender"] = "Xiaomi Redmi Note 7";
      devices["tulip"] = "Xiaomi Redmi Note 6";
      devices["laurus"] = "Xiaomi Mi CC9e";
      devices["pyxis"] = "Xiaomi Mi CC9";
      devices["vela"] = "Xiaomi Mi CC9 Meitu Edition";
      devices["onclite"] = "Xiaomi Redmi 7 India";
      fs.writeFile('./device.json', JSON.stringify(devices, null, 4), err => {if(err) throw err;});
    });
  }, 1800000)
} module.exports = d;
