const Discord = require("discord.js");
const request = require("request");
const pretty = require('prettysize');
const convert = require('xml-js');
const android = require('android-versions');
const fs = require('fs');
require("./device.js")(null);
const config = require('./config.json');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//Language Verifier
const configlang = config.lang.toLowerCase();
const langfile = require('./lang.json');
if(langfile[configlang] === undefined){
	console.log("Please enter a Language Exist !");
	process.exit(0);
}
//end
var lang = langfile[configlang];
const client = new Discord.Client();
const roms = ["DotOS (dotos)\n", "Evolution-X (evo/evox)\n", "HavocOS (havoc)\n", "PearlOS (pearl)\n", "PixysOS (pixy)\n", "Potato Open Sauce Project (posp/potato)\n", "ViperOS (viper)\n", "LineageOS (los/lineage)\n", "Pixel Experience (pe)\n", "BootleggersROM (btlg/bootleggers)\n", "AOSP Extended (aex)\n", "crDroid (crdroid)\n", "Syberia (syberia)\n", "Clean Open Source Project (cosp/clean)\n", "Resurrection Remix (rr)\n", "SuperiorOS (superior)\n", "RevengeOS (revenge)\n", "Android Open Source illusion Project (aosip)\n", "ArrowOS (arrow)\n", "Liquid Remix (liquid)\n", "Dirty Unicorns (dirty)\n", "XenonHD (xenon)\n", "Kraken Open Tentacles Project (kotp/kraken)\n", "Android Ice Cold Project (aicp)\n", "NitrogenOS (nitrogen)\n", "CerberusOS (cerberus)\n"].sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join('');
function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var dates = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = dates[a.getDate()-1];
  var time = `${year}-${month}-${date}`;
  return time;
}
function devicename(codename){
	const device = require('./device.json');
	if(device[codename] !== undefined){
		return device[codename]; 
	} else {
		return codename;
	}
}
var app = require('firebase').initializeApp({apiKey: "AIzaSyAjfPSshzXoje3pewbnfpJYhlRrbNRmFEU",authDomain: "twrpbuilder.firebaseapp.com",databaseURL: "https://twrpbuilder.firebaseio.com",projectId: "twrpbuilder",storageBucket: "twrpbuilder.appspot.com",messagingSenderId: "1079738297898"});

var prefix = config.prefix;

client.on("ready", () => {
	client.user.setActivity(`${prefix}help`, {type: "STREAMING",url: "https://www.twitch.tv/android"});
	console.log(`${lang.connect} ${client.user.username} - ${client.user.id}`);
});

//Help
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	if(content.startsWith(`${prefix}help`)){
		const embed = new Discord.RichEmbed()
			.setColor(0xFFFFFF)
			.setTitle(lang.help.default.title)
			.setDescription("`"+prefix+"android <version_number>` : "+lang.help.default.android+"\n"+
			"`"+prefix+"magisk <version>`: "+lang.help.default.magisk.text+" \n - "+lang.help.default.magisk.ver+": `Stable`, `Beta`, `Canary`\n"+
			"`"+prefix+"twrp <codename>`: "+lang.help.default.twrp+"\n"+
			"`"+prefix+"gapps <arch> <ver> <variant>`: "+lang.help.default.gapps+"\n"+
			"`"+prefix+"cdn <device>`: "+lang.help.default.cdn+"\n"+
			"`"+prefix+"help roms`: "+lang.help.default.roms+"\n"+
			"`"+prefix+"lang`: "+lang.help.default.lang+"\n"+
			"`"+prefix+"prefix`: "+lang.help.default.prefix+"\n"+
			"`"+prefix+"invite`: "+lang.help.default.inv)
			.setFooter(`${lang.help.default.help} | ${prefix}help (here)`);
		const f = content.split(' ')[1];
		if(f === "here"){
			send({embed});
		} else if(f === "roms"){
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle(lang.help.roms.title)
				.setDescription(lang.help.roms.desc)
				.addField(lang.help.roms.available, roms, false)
				.addField(lang.help.roms.use.title, "`"+prefix+"<rom> <codename>`\n"+lang.help.roms.use.example+": `"+prefix+"havoc whyred`\n"+lang.help.roms.use.cmdroms+" `"+prefix+"roms`.\n"+lang.help.roms.use.cdnroms+"`"+prefix+"roms <codename>`\n"+lang.help.roms.use.example+": `"+prefix+"roms daisy`\n\n"+lang.help.roms.use.note, false)
				.setFooter(`${lang.help.roms.help} | ${prefix}help roms (here)`);
			const s = content.split(' ')[2];
			if(s === "here"){
				send({embed})
			} else {
				sendmp({embed})
			}
		} else {
			sendmp({embed});
		}
	}
});

//Android Bot
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	//Android
	if(content.startsWith(`${prefix}android`)){
		const version = content.split(' ')[1];
		function name(name){
			if(name === "(no code name)"){
				return "";
			} else {
				return name;
			}
		}
		function color(name){
			if(name === "Pie"){
				return 0xe0f6d9
			} else if(name === "Oreo"){
				return 0xedb405
			} else if(name === "Nougat"){
				return 0x4fc3f6
			} else if(name === "Marshmallow"){
				return 0xe91e63
			} else if(name === "Lollipop"){
				return 0x9c27b1
			} else if(name === "KitKat" || name === "KitKat Watch"){
				return 0x693c20
			} else if(name === "Jellybean"){
				return 0xfe0000
			} else if(name === "Ice Cream Sandwich"){
				return 0x8a4e1d
			} else if(name === "Honeycomb"){
				return 0x00467a
			} else if(name === "Gingerbread"){
				return 0xb28a70
			} else if(name === "Froyo"){
				return 0xa4d229
			} else if(name === "Eclair"){
				return 0xc19d53
			} else if(name === "Donut"){
				return 0xf4f5f7
			} else if(name === "Cupcake"){
				return 0x8cc63c
			} else {
				return 0xffffff
			}
		}
		if(version !== undefined){
			const info = android.get(version);
			if(info !== null){
				const embed = new Discord.RichEmbed()
					.setColor(color(info.name))
					.setTitle(`Android ${info.semver} ${name(info.name)}`)
					.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**"+lang.android.versioncode+"**: `"+info.versionCode+"`")
				send({embed});
			} else {
				if(version === "29" || version === "10.0" || version === "10.0.0"){
					const embed = new Discord.RichEmbed()
						.setColor(0x77c35f)
						.setTitle("Android 10 Q")
						.setDescription("**API**: `29`\n**NDK**: `8`\n**"+lang.android.versioncode+"**: `Q`")
					send({embed});
				} else {
					send(lang.android.error);
				}
			}
		} else {
			const info = android.get(28);
			const embed = new Discord.RichEmbed()
				.setColor(color(info.name))
				.setTitle(`Android ${info.semver} ${name(info.name)}`)
				.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**"+lang.android.versioncode+"**: `"+info.versionCode+"`")
			send({embed});
		}
	//Magisk
	} else if(content.startsWith(`${prefix}magisk`)) {
		const version = content.split(' ')[1];
		async function magisk(url) {
			return new Promise(function(resolve, reject) {
				request({
					url
				}, function(err, responses, bodyurl) {
					var response = JSON.parse(bodyurl);
					resolve(response);
				});
			});
		}
		//Stable Version
		if(version === "stable") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`).then(magisks => {
				request({
					url: magisks.magisk.note
				}, function(err, response, logm){
					request({
						url: magisks.app.note
					}, function(err, response, loga){
						var log = logm + "\n" + "Magisk Manager" + loga;
						const embed = new Discord.RichEmbed()
							.setColor(0x30756a)
							.setTitle("Magisk Stable")
							.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`"+`\n**${lang.download}**: [Magisk Manager ${magisks.app.version}](${magisks.app.link})`, true)
							.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})`, true)
							.addField("ChangeLog", "```"+log+"```", false)
						send({embed});
					});
				});
			});
		//Beta Version
		} else if(version === "beta") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`).then(magiskb => {
				request({
					url: magiskb.magisk.note
				}, function(err, response, logm){
					request({
						url: magiskb.app.note
					}, function(err, response, loga){
						var log = logm + "\n" + "Magisk Manager" + loga;
						const embed = new Discord.RichEmbed()
							.setColor(0x30756a)
							.setTitle("Magisk Beta")
							.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`"+`\n**${lang.download}**: [Magisk Manager ${magiskb.app.version}](${magiskb.app.link})`, true)
							.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})`, true)
							.addField("ChangeLog", "```"+log+"```", false)
						send({embed});
					});
				});
			});
		//Canary Version
		} else if(version === "canary") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`).then(magiskc => {
				request({
					url: magiskc.magisk.note
				}, function(err, response, log){
					const embed = new Discord.RichEmbed()
						.setColor(0x30756a)
						.setTitle("Magisk Canary")
						.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [SNET ${magiskc.snet.versionCode}](${magiskc.snet.link})`, true)
						.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})`, true)
						.addField("ChangeLog", "```"+log+"```", false)
					send({embed});
				});
			});
		//All (undefined) Version
		} else {
			//Stable
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`).then(magisks => {
			//Beta
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`).then(magiskb => {
			//Canary
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`).then(magiskc => {
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk")
					.addField("Stable", "** **", false)
					.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magisks.app.version}](${magisks.app.link})\n - [ChangeLog](${magisks.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})\n - [ChangeLog](${magisks.magisk.note})`, true)
					.addField("Beta", "** **", false)		
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskb.app.version}](${magiskb.app.link})\n - [ChangeLog](${magiskb.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})\n - [ChangeLog](${magiskb.magisk.note})`, true)
					.addField("Canary", "** **", false)						
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [ChangeLog](${magiskc.app.note})\n - [SNET ${magiskc.snet.versionCode}](${magiskc.snet.link})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})\n - [ChangeLog](${magiskc.magisk.note})`, true)
				send({embed})
			})})});
		}
	//Invite
	} else if(content.startsWith(`${prefix}invite`)){
		client.generateInvite().then(link => {
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle("Invite")
				.setURL(link)
			send({embed});
		});
	//TWRP
	} else if(content.startsWith(`${prefix}twrp`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			request({
				url: `https://twrp.me/search.json`
			}, function(err, responses, bodyurl) {
				var body = JSON.parse(bodyurl);
				var response = body.find(cdn => cdn.title.indexOf(`(${codename})`) !== -1);
				if(response !== undefined){
					const embed = new Discord.RichEmbed()
						.setColor(0x0091CA)
						.setTitle(`TWRP | ${devicename(codename)}`)
				    .setDescription(`**${lang.download}**: [${response.title}](https://twrp.me${response.url})`)
					send({embed});
				} else {
					var body = JSON.parse(bodyurl);
					var response = body.find(cdn => cdn.title.indexOf(`(${codenameup})`) !== -1);
					if(response !== undefined){
						const embed = new Discord.RichEmbed()
							.setColor(0x0091CA)
							.setTitle(`TWRP | ${devicename(codename)}`)
							.setDescription(`**${lang.download}**: [${response.title}](https://twrp.me${response.url})`)
						send({embed});
          } else {
            function reverseSnapshot(snap){var reverseSnap = [];snap.forEach(function(data){var val = data.val();reverseSnap.push(val)});return reverseSnap.reverse();}
            app.database().ref("Builds").orderByKey().once("value").then(function(snapshot) {
              var response = reverseSnapshot(snapshot).find(cdn => cdn.codeName === codename);
              if(response !== undefined){
                request({
                  url: response.url.replace("https://github.com/", "https://api.github.com/repos/") + `?client_id=${config.ci}&client_secret=${config.cs}`, json: true, headers: {'User-Agent': 'android bot'}
                }, function(err, resp, json){
                  try {
                    var dl = json.assets.map(d => {return `[${d.name}](${d.browser_download_url}) \`${pretty(d.size)}\``}).join("\n");
                    const embed = new Discord.RichEmbed()
                      .setColor(0x0091CA)
                      .setTitle(`TWRP Builder | ${devicename(codename)}`)
                      .addField(`**${lang.download}**:`, dl)
                    send({embed});
                  } catch(e) {
                    send(lang.twrperr+" `"+devicename(codename)+"`");
                  }
                })
              } else {
                var response = reverseSnapshot(snapshot).find(cdn => cdn.codeName === codenameup);
                if(response !== undefined){
                  request({
                    url: response.url.replace("https://github.com/", "https://api.github.com/repos/") + `?client_id=${config.ci}&client_secret=${config.cs}`, json: true, headers: {'User-Agent': 'android bot'}
                  }, function(err, resp, json){
                    try {
                      var dl = json.assets.map(d => {return `[${d.name}](${d.browser_download_url}) \`${pretty(d.size)}\``}).join("\n");
                      const embed = new Discord.RichEmbed()
                        .setColor(0x0091CA)
                        .setTitle(`TWRP Builder | ${devicename(codename)}`)
                        .addField(`**${lang.download}**:`, dl)
                      send({embed});
                    } catch(e) {
                      send(lang.twrperr+" `"+devicename(codename)+"`");
                    }
                  })
                } else {
                  send(lang.twrperr+" `"+devicename(codename)+"`");
                }
              }
            });
          }
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//OpenGapps
	} else if(content.startsWith(`${prefix}gapps`)){
		const arch = content.split(' ')[1];
		if(arch === undefined){
			send(lang.gapps.noarch + ' `arm`, `arm64`, `x86`, `x86_64`')
		} else if(arch !== 'arm' && arch !== 'arm64' && arch !== 'x86' && arch !== 'x86_64'){
			send(lang.gapps.archerr + ' `arm`, `arm64`, `x86`, `x86_64`')
		} else {
			const ver = content.split(' ')[2];
			if(ver === undefined){
				if(arch !== 'arm' && arch !== 'x86'){
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
				} else {
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`, `4.4`')
				}
			} else if(ver === '9.0' || ver === '8.1' || ver === '8.0' || ver === '7.1' || ver === '7.0' || ver === '6.0' || ver === '5.1' || ver === '5.0' || ver === '4.4'){
				const variant = content.split(' ')[3];
				function sendembed(){
					request.get({
						url: `https://api.github.com/repos/opengapps/${arch}/tags` + `?client_id=${config.ci}&client_secret=${config.cs}`, headers: {'User-Agent': 'android bot'}
					}, function(err, response, nbody){
						request.get({
							url: `https://api.github.com/repos/opengapps/${arch}/releases/latest` + `?client_id=${config.ci}&client_secret=${config.cs}`, headers: {'User-Agent': 'android bot'}
						}, function(err, response, body){
							var time = JSON.parse(nbody)[0].name;
							var search = JSON.parse(body).assets.find(s => s.name.indexOf(`open_gapps-${arch}-${ver}-${variant}-${time}.zip`) !== -1);
							var dl = search.browser_download_url;
							var size = pretty(search.size);
							var name = search.name;
							const embed = new Discord.RichEmbed()
								.setColor(0x009688)
								.setTitle('OpenGapps')
								.setDescription(`**${lang.date}**:` + ' **`' + `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}` + '`**\n' + `**${lang.size}**:` + ' **`' + size + '`**\n' + `**${lang.download}**: [${name}](${dl})`)
							send(embed);
						});
					});
				}
				if(ver === '8.0'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'full' && variant !== 'mini' && variant !== 'micro' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed()
					}
				} else if(ver === '7.0' || ver === '6.0' || ver === '5.1'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `aroma`, `stock`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'aroma' && variant !== 'stock' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `aroma`, `stock`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed();
					}
				} else if(ver === '5.0'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `nano`, `pico`')
					} else if(variant !== 'nano' && variant !== 'pico'){
						send(lang.gapps.varerr + ' `nano`, `pico`')
					} else {
						sendembed();
					}
				} else if(ver === '4.4'){
					if(arch !== 'arm' && arch !== 'x86'){
						send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
					} else {
						if(variant === undefined){
							send(lang.gapps.novar + ' `nano`, `pico`')
						} else if(variant !== 'nano' && variant !== 'pico'){
							send(lang.gapps.varerr + ' `nano`, `pico`')
						} else {
							sendembed();
						}
					}
				} else {
					if(variant === undefined){
						send(lang.gapps.novar + ' `aroma`, `super`, `stock`, `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'aroma' && variant !== 'super' && variant !== 'stock' && variant !== 'full' && variant !== 'mini' && variant !== 'micro' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `aroma`, `super`, `stock`, `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed()
					}
				}
			} else {
				if(arch !== 'arm' && arch !== 'x86'){
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
				} else {
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`, `4.4`')
				}
			}
		}
	//Language
	} else if(content.startsWith(`${prefix}lang`)){
		if(message.channel.type !== "dm"){
			if(message.member.hasPermission(["MANAGE_GUILD"], false, true, true)){
				const lg = content.split(' ')[1]
				if(lg !== undefined){
					if(lg !== "en" && lg !== "fr"){
						send(lang.lang.err + ' `fr`, `en`')
					} else {
						var gld = require("./guild.json");
						gld[message.guild.id]['lang'] = lg
						fs.writeFile("./guild.json", JSON.stringify(gld, null, 4), err => {
							if(err) throw err;
						});
						send(langfile[lg].lang.suc + " `" + lg + "`");
					}
				} else {
					send(lang.lang.nol + ' `fr`, `en`')
				}
			} else {
				send(lang.perm)
			}
		} else {
			send(lang.dm)
		}
	//Prefix
	} else if(content.startsWith(`${prefix}prefix`)){
		if(message.channel.type !== "dm"){
			if(message.member.hasPermission(["MANAGE_GUILD"], false, true, true)){
				const prf = content.split(' ')[1]
				if(prf !== undefined){
						var gld = require("./guild.json");
						gld[message.guild.id]['prefix'] = prf
						fs.writeFile("./guild.json", JSON.stringify(gld, null, 4), err => {
							if(err) throw err;
						});
						send(lang.prefix.suc + " `" + prf + "`");
				} else {
					send(lang.prefix.nop)
				}
			} else {
				send(lang.perm)
			}
		} else {
			send(lang.dm)
		}
	//Codename Search
	} else if(content.startsWith(`${prefix}cdn`)){
		const srch = message.content.split(' ').slice(1).join(' ')
		if(srch !== undefined){
			var values = Object.values(require("./device.json"));
			var keys = Object.keys(require("./device.json"));
			var num = values.map(n => n.toLowerCase()).map(n => n.indexOf(srch.toLowerCase()) !== -1);
			var indices = [];
			var element = true;
			var ids = num.indexOf(element);
			while (ids != -1) {
				indices.push(ids);
				ids = num.indexOf(element, ids + 1);
			}
			var result = indices.map(n => { return `\`${keys[n]}\`: ${values[n]}`})
			const embed = new Discord.RichEmbed()
				.setTitle(`${lang.cdn.srch} | ${srch}`)
				.setColor(0xFFFFFF);
			if(result[0] === undefined){
				return send(lang.cdn.nocdn)
			} else if(result.join("\n").length <= 2048){
				embed.setDescription(result.join("\n"));
			} else {
				var txt;
				var arr = [];
				var i = 0;
				do{
					txt += result[i] + "\n"
					if(txt.length > 1024){
						txt.split("\n").slice(0, -1).join("\n");
						i--
						var n = true
						do {
							if(txt.length > 1024){
								txt.split("\n").slice(0, -1).join("\n");
								i--
								arr.push(txt)
								txt = "";
							} else {
								arr.push(txt)
								txt = "";
								n = false
							}
						} while(n)
					} else if(txt.length <= 1024 && txt.length >= 985) {
						arr.push(txt)
						txt = "";
					}
					i++
				} while (i <= result.length)
				if(arr.length > 6){
					return send(lang.cdn.lot)
				} else {
					for(i=0; i<arr.length; i++){
						embed.addField(i, arr[i].replace(undefined, ""), true)
					}
				}
			}
			send(embed);
		} else {
			send(lang.cdn.nosrch)
		}
	}
});

//Custom ROM
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	async function rom(url, urlup, body, btlg, cosp, crdroid, xml, dirty, error, end, cdn, cdnup, bkpurl, bkpurlup, posp) {
		return new Promise(function(resolve, reject){
			if(body){
				if(error){
					request({
						url
					}, function(err, responses, bodyurl){
						if(responses.statusCode === 200){
							if(end){
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} else {
								resolve(JSON.parse(bodyurl))
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200){
									if(end){
										resolve(JSON.parse(bodyurl).slice(-1)[0])
									} else {
										resolve(JSON.parse(bodyurl))
									}
								} else {
									resolve(false);
								}
							});
						}
					});
				} else {
					request({
						url
					}, function(err, responses, bodyurl){
						if(responses.statusCode === 200 && JSON.parse(bodyurl).error === "false" || !JSON.parse(bodyurl).error){
							if(end){
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} else {
								resolve(JSON.parse(bodyurl))
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).error === "false" || !JSON.parse(bodyurl).error){
									if(end){
										resolve(JSON.parse(bodyurl).slice(-1)[0])
									} else {
										resolve(JSON.parse(bodyurl))
									}
								} else {
									resolve(false);
								}
							});
						}
					});
				}
			} else if(btlg){
				request({
					url
				}, function(err, responses, bodyurl){
					if(responses.statusCode === 200 && JSON.parse(bodyurl)[cdn] !== undefined){
						resolve(JSON.parse(bodyurl)[cdn])
					} else {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && JSON.parse(bodyurl)[cdnup] !== undefined){
								resolve(JSON.parse(bodyurl)[cdnup])
							} else {
								resolve(false);
							}
						});
					}
				});
			} else if(cosp){
				request({
					url: `https://mirror.codebucket.de/cosp/getdevices.php`
				}, function(err, responses, bodyurl) {
					var body = JSON.parse(bodyurl);
					var response = body.includes(cdn);
					if(response){
						request({
							url: `https://ota.cosp-project.org/latestDownload?device=${cdn}`
						}, function(err, responses, bodyurl) {
							if(JSON.parse(bodyurl).error) return resolve(false);
							resolve(JSON.parse(bodyurl))
						});
					} else {
						request({
							url: `https://mirror.codebucket.de/cosp/getdevices.php`
						}, function(err, responses, bodyurl) {
							var body = JSON.parse(bodyurl);
							var response = body.includes(cdnup);
							if(response){
								request({
									url: `https://ota.cosp-project.org/latestDownload?device=${cdn}`
								}, function(err, responses, bodyurl) {
									if(JSON.parse(bodyurl).error) return resolve(false);
									resolve(JSON.parse(bodyurl))
								});
							} else {
								resolve(false)
							}
						});
					}
				});
			} else if(xml){
				request({
					url
				}, function(err, responses, bodyurl) {
					try {
						var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
						resolve(body);
					} catch(err) {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							try {
								var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
								resolve(body);
							} catch(err) {
								resolve(false);
							}
						});
					}
				});
			} else if(crdroid){
				request({
					url
				}, function(err, responses, bodyurl) {
					var body = convert.xml2json(bodyurl, {compact: true, spaces: 4});
					function resp(){
						try {
							return JSON.parse(body).OTA.manufacturer.find((m) => m[cdn] !== undefined)[cdn];
						} catch (err) {
							try {
								return JSON.parse(body).OTA.manufacturer.find((m) => m[cdnup] !== undefined)[cdnup];
							} catch (err) {
								return false;
							}
						}
					}
					var response = resp()
					if(response){
						resolve(response);
					} else {
						resolve(false);
					}
				});
			} else if(dirty){
				request({
					url
				}, function(err, responses, bodyurl){
					try {
						resolve(JSON.parse(bodyurl).slice(-1)[0])
					} catch(err) {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							try {
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} catch(err) {
								resolve(false);
							}
						});
					}
				});
			} else {
				request({
					url
				}, function(err, responses, bodyurl){
					try{
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							if(end){
								if(posp){
									var json = {};
									json["bkp"] = false
									json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
									resolve(json)
								} else {
									resolve(JSON.parse(bodyurl).response.slice(-1)[0])
								}
							} else {
								resolve(JSON.parse(bodyurl).response[0])
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									if(end){
										if(posp){
											var json = {};
											json["bkp"] = false
											json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
											resolve(json)
										} else {
											resolve(JSON.parse(bodyurl).response.slice(-1)[0])
										}
									} else {
										resolve(JSON.parse(bodyurl).response[0])
									}
								} else {
									resolve(false);
								}
							});
						}
					} catch (err) {
						request({
							url: bkpurl
						}, function(err, responses, bodyurl){
							if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
								if(end){
									if(posp){
										var json = {};
										json["bkp"] = true
										json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
										resolve(json)
									} else {
										resolve(JSON.parse(bodyurl).response.slice(-1)[0])
									}
								} else {
									resolve(JSON.parse(bodyurl).response[0])
								}
							} else {
								request({
									url: bkpurlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
										if(posp){
											var json = {};
											json["bkp"] = true
											json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
											resolve(json)
										} else {
											resolve(JSON.parse(bodyurl).response[0])
										}
									} else {
										resolve(false);
									}
								});
							}
						});
					}
				});
			}
		});
	}
	//HavocOS
	if(content.startsWith(`${prefix}havoc`) || content.startsWith(`${prefix}havocos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x1A73E8)
						.setTitle(`HavocOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed})
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//PixysOS
	} else if(content.startsWith(`${prefix}pixy`) || content.startsWith(`${prefix}pixys`) || content.startsWith(`${prefix}pixysos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/"
			rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x9abcf2)
						.setTitle(`PixysOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//PearlOS
	} else if(content.startsWith(`${prefix}pearl`) || content.startsWith(`${prefix}pearlos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/PearlOS/OTA/master/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x4d7dc4)
						.setTitle(`PearlOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//DotOS
	} else if(content.startsWith(`${prefix}dotos` || content.startsWith(`${prefix}dot`))){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/DotOS/ota_config/dot-p/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0xef2222)
						.setTitle(`DotOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//ResurrectionRemix
	} else if(content.startsWith(`${prefix}rr`) || content.startsWith(`${prefix}resurrection`) || content.startsWith(`${prefix}resurrectionremix`) || content.startsWith(`${prefix}rros`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x1A1C1D)
						.setTitle(`Resurrection Remix | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//SuperiorOS
	} else if(content.startsWith(`${prefix}superior`) || content.startsWith(`${prefix}superioros`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase
			const start = "https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0xbe1421)
						.setTitle(`SuperiorOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//ViperOS
	} else if(content.startsWith(`${prefix}viper`) || content.startsWith(`${prefix}viperos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/Viper-Devices/official_devices/master/"
			if(codename === "daisy"){
				rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`, true).then(response => {
					if(response){
						const embed = new Discord.RichEmbed()
							.setColor(0x4184f4)
							.setTitle(`ViperOS | ${devicename(codename)}`)
							.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						send(lang.romerr+" `"+devicename(codename)+"`")
					}
				});
			} else {
				rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
					if(response){
						const embed = new Discord.RichEmbed()
							.setColor(0x4184f4)
							.setTitle(`ViperOS | ${devicename(codename)}`)
							.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						send(lang.romerr+" `"+devicename(codename)+"`")
					}
				});
			}
		} else {
			send(lang.cdnerr)
		}
	//LineageOS
	} else if(content.startsWith(`${prefix}lineage`) || content.startsWith(`${prefix}los`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://download.lineageos.org/api/v1/"
			rom(`${start}${codename}/nightly/*`, `${start}${codenameup}/nightly/*`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x167C80)
						.setTitle(`LineageOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Evolution-X
	} else if(content.startsWith(`${prefix}evo`) || content.startsWith(`${prefix}evox`) || content.startsWith(`${prefix}evolutionx`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			if(codename !== "enchilada"){
				const codenameup = content.split(' ')[1].toUpperCase();
				const start = "https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/"
				rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, false, false, true).then(response => {
					if(response){
						const embed = new Discord.RichEmbed()
							.setColor(0xb0c9ce)
							.setTitle(`Evolution-X | ${devicename(codename)}`)
							.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						send(lang.romerr+" `"+devicename(codename)+"`")
					}
				});
			} else {
				send(lang.romerr+" `"+devicename(codename)+"`")
			}
		} else {
			send(lang.cdnerr)
		}
	//AOSP Extended AEX
	} else if(content.startsWith(`${prefix}aex`) || content.startsWith(`${prefix}aospextended`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://api.aospextended.com/ota/"
			//Pie
			rom(`${start}${codename}/pie`, `${start}${codenameup}/pie`, true).then(pie => {
			//Oreo
			rom(`${start}${codename}/oreo`, `${start}${codenameup}/oreo`, true).then(oreo => {
				function check(response){
					if(response){
						return "**"+lang.date+"**: **`"+`${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+pretty(response.filesize)+"`**\n**"+lang.version+"**: **`"+response.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0xf8ba00)
					.setTitle(`AEX | ${devicename(codename)}`)
					.addField("Pie", check(pie))
					.addField("Oreo", check(oreo))
				send({embed})
			})});
		} else {
			send(lang.cdnerr)
		}
	//BootleggersROM
	} else if(content.startsWith(`${prefix}bootleggers`) || content.startsWith(`${prefix}btlg`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://bootleggersrom-devices.github.io/api/devices.json"
			rom(start, start, false, true, false, false, false, false, false, false, codename, codenameup).then(response => {
				if(response){
					function size(size, prettysize){
						if(prettysize === "0 Bytes"){
							if(size.indexOf("(") !== -1){
								return size.split('(')[0]
							} else {
								return size
							}
						} else {
							return prettysize
						}
					}
					const embed = new Discord.RichEmbed()
						.setColor(0x515262)
						.setTitle(`BootleggersROM | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `${response.filename.split('-')[4].substring(0, 4)}-${response.filename.split('-')[4].substring(4, 6)}-${response.filename.split('-')[4].substring(6, 8)}` +"`**\n**"+lang.size+"**: **`"+size(response.buildsize, pretty(response.buildsize))+"`**\n**"+lang.version+"**: **`"+`${response.filename.split('-')[1].split('.')[1]}.${response.filename.split('-')[1].split('.')[2]}`+"`**\n"+`**${lang.download}**: [${response.filename}](${response.download})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Pixel Experience
	} else if(content.startsWith(`${prefix}pe`) || content.startsWith(`${prefix}pixelexperience`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://download.pixelexperience.org/ota_v2/"
			//Pie
			rom(`${start}${codename}/pie`, `${start}${codenameup}/pie`, true).then(pie => {
			//CAF
			rom(`${start}${codename}/pie_caf`, `${start}${codenameup}/pie_caf`, true).then(caf => {
			//Go
			rom(`${start}${codename}/pie_go`, `${start}${codenameup}/pie_go`, true).then(go => {
			//Oreo
			rom(`${start}${codename}/oreo`, `${start}${codenameup}/oreo`, true).then(oreo => {
				function check(response){
					if(response){
						return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0xf8ba00)
					.setTitle(`Pixel Experience | ${devicename(codename)}`)
					.addField("Pie", check(pie))
					.addField("Pie-CAF", check(caf))
					.addField("Pie Go", check(go))
					.addField("Oreo", check(oreo))
				send({embed})
			})})})});
		} else {
			send(lang.cdnerr)
		}
	//Potato Open Source Project POSP
	} else if(content.startsWith(`${prefix}posp`) || content.startsWith(`${prefix}potato`) || content.startsWith(`${prefix}potatorom`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://api.potatoproject.co/checkUpdate?device="
			const bkp = "http://api.strangebits.co.in/checkUpdate?device="
			//Weekly
			rom(`${start}${codename}&type=weekly`, `${start}${codenameup}&type=weekly`, false, false, false, false, false, false, false, true, '', '', `${bkp}${codename}&type=weekly`, `${bkp}${codenameup}&type=weekly`, true).then(week => {
			//Mashed
			rom(`${start}${codename}&type=mashed`, `${start}${codenameup}&type=mashed`, false, false, false, false, false, false, false, true, '', '', `${bkp}${codename}&type=mashed`, `${bkp}${codenameup}&type=mashed`, true).then(mash => {
				function check(resp){
					if(resp.json !== undefined){
						if(resp.bkp){
							var response = resp.json;
							var dl;
							if(response.url.indexOf('mirror.potatoproject.co') !== -1){
								dl = response.url.replace("mirror.potatoproject.co", "mirror.sidsun.com")
							} else {
								dl = response.url
							}
							return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
						} else {
							var response = resp.json;
							return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
						}
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0x6a16e2)
					.setTitle(`Potato Open Sauce Project | ${devicename(codename)}`)
					.addField('Weekly', check(week))
					.addField('Mashed', check(mash))
				send({embed})
			})});
		} else {
			send(lang.cdnerr)
		}
	//RevengeOS
	} else if(content.startsWith(`${prefix}revenge`) || content.startsWith(`${prefix}revengeos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/RevengeOS/releases/master/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, false, false, true, true).then(response => {
				if(response){
					var date = response.date.split('/');
					const embed = new Discord.RichEmbed()
						.setColor(0x1395FA)	
						.setTitle(`RevengeOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+`${date[0]}-${date[1]}-${date[2]}`+"`**\n**"+lang.size+"**: **`"+response.size+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.file_name}](https://acc.dl.osdn.jp/storage/g/r/re/revengeos/${codename}/${response.file_name})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//crDroid
	} else if(content.startsWith(`${prefix}crdroid`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			rom("https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml", '', false, false, false, true, false, false, false, false, codename, codenameup).then(response => {
				if(response){
					var filename = response.filename._text;
					const embed = new Discord.RichEmbed()
						.setColor(0x31423F)	
						.setTitle(`crDroid | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `${filename.split('-')[2].substring(0, 4)}-${filename.split('-')[2].substring(4, 6)}-${filename.split('-')[2].substring(6, 8)}` +"`**\n**"+lang.version+"**: **`"+filename.split('-')[4]+"`**\n"+`**${lang.download}**: [${filename}](${response.download._text})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Clean Open Source Project COSP
	} else if(content.startsWith(`${prefix}cosp`) || content.startsWith(`${prefix}clean`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://mirror.codebucket.de/cosp/getdevices.php"
			rom(start, start, false, false, true, false, false, false, false, '', codename, codenameup).then(response => {
				if(response){
					const date = response.date.toString();
					const embed = new Discord.RichEmbed()
						.setColor(0x010101)	
						.setTitle(`Clean Open Source Project | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)}` +"`**\n"+`**${lang.download}**: [${response.download.split('/')[5]}](${response.download})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//SyberiaOS
	} else if(content.startsWith(`${prefix}syberia`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/syberia-project/official_devices/master"
			rom(`${start}/a-only/${codename}.json`, `${start}/a-only/${codenameup}.json`, true, false, false, false, false, false, true).then(a => {
				if(a){
					const embed = new Discord.RichEmbed()
						.setColor(0xDF766E)
						.setTitle(`Syberia | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `${a.build_date.substring(0, 4)}-${a.build_date.substring(4, 6)}-${a.build_date.substring(6, 8)}` +"`**\n**"+lang.size+"**: **`"+pretty(a.filesize)+"`**\n**"+lang.version+"**: **`"+a.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${a.filename}](${a.url})`)
					send({embed});
				} else {
					function abcdn(code){
						if(code === 'fajita' || code === 'FAJITA'){
							return 'OnePlus6T'
						} else if(code === 'enchilada' || code === 'ENCHILADA'){
							return 'OnePlus6'
						} else {
							return code
						}
					}
					rom(`${start}/ab/${abcdn(codename)}.json`, `${start}/ab/${abcdn(codenameup)}.json`).then(ab => {
						if(ab){
							const embed = new Discord.RichEmbed()
								.setColor(0xDF766E)
								.setTitle(`Syberia | ${devicename(codename)}`)
								.setDescription("**"+lang.date+"**: **`"+timeConverter(ab.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(ab.size)+"`**\n**"+lang.version+"**: **`"+ab.version+"`**\n"+`**${lang.download}**: [${ab.filename}](${ab.url})`)
							send({embed});
						} else {
							send(lang.romerr+" `"+devicename(codename)+"`")
						}
					})
				}
			})
		} else {
			send(lang.cdnerr)
		}
	//AOSiP
	} else if(content.startsWith(`${prefix}aosip`) || content.startsWith(`${prefix}illusion`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://aosip.dev/"
			//Official
			rom(`${start}${codename}/official`, `${start}${codenameup}/official`).then(off => {
			//Beta
			rom(`${start}${codename}/beta`, `${start}${codenameup}/beta`).then(beta => {
				function check(response){
					if(response){
						return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0x20458B)
					.setTitle(`Android Open Source illusion Project | ${devicename(codename)}`)
					.addField(lang.official, check(off))
					.addField(lang.beta, check(beta))
				send({embed})
			})});
		} else {
			send(lang.cdnerr)
		}
	//ArrowOS
	} else if(content.startsWith(`${prefix}arrow`) || content.startsWith(`${prefix}arrowos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://update.arrowos.net/api/v1/"
			rom(`${start}${codename}/official`, `${start}${codenameup}/official`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0xe6e6e6)
						.setTitle(`ArrowOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed})
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Liquid Remix
	} else if(content.startsWith(`${prefix}liquid`) || content.startsWith(`${prefix}liquidremix`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/"
			function op(cdn){
				if(cdn === 'enchilada'){
					return 'oneplus'
				} else {
					return cdn
				}
			}
			rom(`${start}${op(codename)}.xml`, `${start}${codenameup}.xml`, false, false, false, false, true).then(body => {
				if(body){
					function resp(cdn, cdnup) {
						var info = body.SlimOTA.Official[cdn]
						if(info !== undefined){
							return body.SlimOTA.Official[cdn]
						} else {
							return body.SlimOTA.Official[cdnup]
						}
					}
					var response = resp(codename, codenameup);
					var filename = response.Filename._text;
					const embed = new Discord.RichEmbed()
						.setColor(0x2D8CFD)	
						.setTitle(`Liquid Remix | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `${filename.split('-')[1].substring(0, 4)}-${filename.split('-')[1].substring(4, 6)}-${filename.split('-')[1].substring(6, 8)}` +"`**\n"+`**${lang.download}**: [${filename}](${response.RomUrl._text})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Dirty Unicorns
	} else if(content.startsWith(`${prefix}dirty`) || content.startsWith(`${prefix}dirtyunicorns`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = 'https://download.dirtyunicorns.com/api/files/'
			//Official
			rom(`${start}${codename}/Official`, `${start}${codenameup}/Official`, false, false, false, false, false, true).then(off => {
			//Rc
			rom(`${start}${codename}/Rc`, `${start}${codenameup}/Rc`, false, false, false, false, false, true).then(rc => {
			//Weeklies
			rom(`${start}${codename}/Weeklies`, `${start}${codenameup}/Weeklies`, false, false, false, false, false, true).then(week => {
				function check(response, ver){
					if(response){
						return "**"+lang.date+"**: **`"+`${response.filename.split('-')[2].substring(0, 4)}-${response.filename.split('-')[2].substring(4, 6)}-${response.filename.split('-')[2].substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+response.filesize+"`**\n**"+lang.version+"**: **`"+response.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${response.filename}](https://download.dirtyunicorns.com/api/download/${response.filename.split('-')[0].split('_')[1]}/${ver}/${response.filename})`
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0xB00300)
					.setTitle(`Dirty Unicorns | ${devicename(codename)}`)
					.addField(lang.official, check(off, "Official"))
					.addField("Rc", check(rc, "Rc"))
					.addField("Weeklies", check(week, "Weeklies"))
				send({embed})
			})})});
		} else {
			send(lang.cdnerr)
		}
	//XenonHD
	} else if(content.startsWith(`${prefix}xenon`) || content.startsWith(`${prefix}xenonhd`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://mirrors.c0urier.net/android/teamhorizon/P/OTA/"
			//Official
			rom(`${start}ota_${codename}_official.xml`, `${start}ota_${codenameup}_official.xml`, false, false, false, false, true).then(off => {
			//Experimental
			rom(`${start}ota_${codename}_experimental.xml`, `${start}ota_${codenameup}_experimental.xml`, false, false, false, false, true).then(exp => {
				console.log(off + exp)
				function check(respo, n){
					if(respo){
						function resp(cdn, cdnup) {
							function ver(){
								if(n === "off"){
									return off
								} else {
									return exp
								}
							}
							var body = ver();
							var info = body.XenonOTA.Pie[cdn]
							if(info !== undefined){
								return body.XenonOTA.Pie[cdn]
							} else {
								return body.XenonOTA.Pie[cdnup]
							}
						}
						var response = resp(codename, codenameup)
						var filename = response.Filename._text;
						return "**"+lang.date+"**: **`"+ `20${filename.split('-')[1].substring(0, 2)}-${filename.split('-')[1].substring(2, 4)}-${filename.split('-')[1].substring(4, 6)}` +"`**\n"+`**${lang.download}**: [${filename}](${response.RomUrl._text})`
					} else {
						return lang.norom
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0x009688)
					.setTitle(`XenonHD | ${devicename(codename)}`)
					.addField(lang.official, check(off, "off"))
					.addField(lang.experimental, check(exp, "exp"))
				send({embed})
			})});
		} else {
			send(lang.cdnerr)
		}
	//Kraken Open Tentacles Project KOTP
	} else if(content.startsWith(`${prefix}kotp`) || content.startsWith(`${prefix}kraken`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0xA373EF)
						.setTitle(`Kraken Open Tentacles Project | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Android Ice Cold Project AICP
	} else if(content.startsWith(`${prefix}aicp`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "http://ota.aicp-rom.com/update.php?device="
			rom(`${start}${codename}`, `${start}${codenameup}`, true).then(response => {
				if(response){
					response = response.updates[0]
					var filename = response.name;
					const embed = new Discord.RichEmbed()
						.setColor(0xB3B5B3)
						.setTitle(`Android Ice Cold Project | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+`${filename.split("-")[3].substring(0, 4)}-${filename.split("-")[3].substring(4, 6)}-${filename.split("-")[3].substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+response.size+"MB"+"`**\n**"+lang.version+"**: **`"+response.version.split("\n")[0]+"`**\n"+`**${lang.download}**: [${filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//NitrogenOS
	} else if(content.startsWith(`${prefix}nitrogen`) || content.startsWith(`${prefix}nitrogenos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase
			const start = "https://raw.githubusercontent.com/nitrogen-project/OTA/p/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x009999)
						.setTitle(`NitrogenOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+`${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+pretty(response.filesize)+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//CerberusOS 
	} else if(content.startsWith(`${prefix}cerberus`) || content.startsWith(`${prefix}cerberusos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/"
			rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0xE92029)
						.setTitle(`CerberusOS | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(parseInt(response.datetime))+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed})
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//ROMs
	} else if(content.startsWith(`${prefix}roms`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
      message.channel.startTyping();
			async function roms(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200){
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function rombody(url, urlup, name) {
				if(codename === "enchilada"){
					if(name === "Evolution-X (evo/evox)"){
						return new Promise(function(resolve, reject) {
							resolve(false);
						});
					} else {
						return new Promise(function(resolve, reject) {
							request({
								url
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200){
									resolve(`${name}\n`);
								} else {
									request({
										url: urlup
									}, function(err, responses, bodyurl) {
										if(responses.statusCode === 200){
											resolve(`${name}\n`);
										} else {
											resolve(false);
										}
									});
								}
							});
						});
					}
				} else {
					return new Promise(function(resolve, reject) {
						request({
							url
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200){
								resolve(`${name}\n`);
							} else {
								request({
									url: urlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200){
										resolve(`${name}\n`);
									} else {
										resolve(false);
									}
								});
							}
						});
					});
				}
			}
			async function romlos(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function romposp(url, urlup, bkpurl, bkpurlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						try {
							if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
								resolve(`${name}\n`);
							} else {
								request({
									url: urlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
										resolve(`${name}\n`);
									} else {
										resolve(false);
									}
								});
							}
						} catch(err) {
							request({
								url: bkpurl
							}, function(err, responses, bodyurl){
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									resolve(`${name}\n`);
								} else {
									request({
										url: bkpurlup
									}, function(err, responses, bodyurl) {
										if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
											resolve(`${name}\n`);
										} else {
											resolve(false);
										}
									});
								}
							});
						}
					});
				});
			}
			async function rompe(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function rombtlg(url, codename, codenameup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl)[codename] !== undefined){
							resolve(`${name}\n`);
						} else {
							request({
								url
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl)[codenameup] !== undefined){
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function romcosp(code, codeup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url: `https://mirror.codebucket.de/cosp/getdevices.php`
					}, function(err, responses, bodyurl) {
						var body = JSON.parse(bodyurl);
						var response = body.includes(codename);
						if(response){
							resolve(`${name}\n`)
						} else {
							request({
								url: `https://mirror.codebucket.de/cosp/getdevices.php`
							}, function(err, responses, bodyurl) {
								var body = JSON.parse(bodyurl);
								var response = body.includes(codename);
								if(response){
									resolve(`${name}\n`)
								} else {
									resolve(false)
								}
							});
						}
					});
				});
			}
			async function romcrd(code, codeup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url: "https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml"
					}, function(err, responses, bodyurl) {
						var body = convert.xml2json(bodyurl, {compact: true, spaces: 4});
						function resp(){
							try {
								return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
							} catch (err) {
								try {
									return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
								} catch (err) {
									return false;
								}
							}
						}
						if(resp() === false){
							resolve(false)
						} else {
							resolve(`${name}\n`)
						}
					});
				});
			}
			async function romsyb(coden, codenup, name){
				return new Promise(function(resolve, reject) {
					request({
						url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/a-only/${coden}.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var response = JSON.parse(bodyurl);
							resolve(`${name}\n`);
						} else {
							request({
								url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/a-only/${codenup}.json`
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200){
									var response = JSON.parse(bodyurl);
									resolve(`${name}\n`);
								} else {
									function ab(code){
										if(code === 'fajita'){
											return 'OnePlus6T'
										} else if(code === 'enchilada'){
											return 'OnePlus6'
										} else if(code === 'FAJITA'){
											return 'OnePlus6T'
										} else if(code === 'ENCHILADA'){
											return 'OnePlus6'
										} else {
											return code
										}
									}
									request({
										url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/ab/${ab(coden)}.json`
									}, function(err, responses, bodyurl) {
										if(responses.statusCode === 200){
											var body = JSON.parse(bodyurl);
											var response = body.response[0]
											resolve(`${name}\n`);
										} else {
											request({
												url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/ab/${ab(codenup)}.json`
											}, function(err, responses, bodyurl) {
												if(responses.statusCode === 200){
													var body = JSON.parse(bodyurl);
													var response = body.response[0]
													resolve(`${name}\n`);
												} else {
													resolve(false);
												}
											});
										}
									});
								}
							});
						}
					});
				});
			}
			async function romxml(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					function urlcheck(u){
						if(u === 'https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/enchilada.xml'){
							return 'https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/oneplus.xml'
						} else {
							return u
						}
					}
					request({
						url: urlcheck(url)
					}, function(err, responses, bodyurl) {
						try {
							var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
							resolve(`${name}\n`);
						} catch(err) {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								try {
									var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
									resolve(`${name}\n`);
								} catch(err) {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function romdirty(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl){
						try {
							var body = JSON.parse(bodyurl).slice(-1)[0];
							resolve(`${name}\n`)
						} catch(err) {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								try {
									var body = JSON.parse(bodyurl).slice(-1)[0];
									resolve(`${name}\n`)
								} catch(err) {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function romaicp(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl){
						if(JSON.parse(bodyurl).error === undefined){
							resolve(`${name}\n`)
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(JSON.parse(bodyurl).error === undefined){
									resolve(`${name}\n`)
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			//HavocOS
			roms(`https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codename}.json`, `https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codenameup}.json`, "HavocOS (havoc)").then(havoc => {
			//PixysOS
			roms(`https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codenameup}/build.json`, "PixysOS (pixy)").then(pixy => {
			//LineageOS
			romlos(`https://download.lineageos.org/api/v1/${codename}/nightly/*`, `https://download.lineageos.org/api/v1/${codenameup}/nightly/*`, "LineageOS (los/lineage)").then(los => {
			//PearlOS
			roms(`https://raw.githubusercontent.com/PearlOS/OTA/master/${codename}.json`, `https://raw.githubusercontent.com/PearlOS/OTA/master/${codenameup}.json`, "PearlOS (pearl)").then(pearl => {
			//DotOS
			roms(`https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codename}.json`, `https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codenameup}.json`, "DotOS (dotos)").then(dotos => {
			//ViperOS
			roms(`https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codenameup}/build.json`, "ViperOS (viper)").then(viper => {
			//Potato Open Sauce Project POSP (Weekly)
			romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=weekly`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=weekly`,`http://api.strangebits.co.in/checkUpdate?device=${codename}&type=weekly`, `http://api.strangebits.co.in/checkUpdate?device=${codenameup}&type=weekly`, "Potato Open Sauce Project (Weekly) (posp/potato)").then(pospw => {
			//Potato Open Sauce Project POSP (Mashed)
			romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=mashed`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=mashed`,`http://api.strangebits.co.in/checkUpdate?device=${codename}&type=mashed`, `http://api.strangebits.co.in/checkUpdate?device=${codenameup}&type=mashed`, "Potato Open Sauce Project (Mashed) (posp/potato)").then(pospm => {
			//Evolution-X EVO-X
			rombody(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename}.json`, `https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codenameup}.json`, "Evolution-X (evo/evox)").then(evo => {
			//AOSP Extended AEX (Pie)
			rombody(`https://api.aospextended.com/ota/${codename}/pie`, `https://api.aospextended.com/ota/${codenameup}/pie`, "AOSP Extended (Pie) (aex)").then(aexpie => {
			//AOSP Extended AEX (Oreo)
			rombody(`https://api.aospextended.com/ota/${codename}/oreo`, `https://api.aospextended.com/ota/${codenameup}/oreo`, "AOSP Extended (Oreo) (aex)").then(aexoreo => {
			//BootleggersROM BTLG
			rombtlg(`https://bootleggersrom-devices.github.io/api/devices.json`, codename, codenameup, "BootleggersROM (btlg/bootleggers)").then(btlg => {
			//Pixel Experience (Pie)
			rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie`, "Pixel Experience (Pie) (pe)").then(pepie => {
			//Pixel Experience (CAF)
			rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie_caf`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie_caf`, "Pixel Experience (CAF) (pe)").then(pecaf => {
			//Pixel Experience (Go)
			rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie_go`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie_go`, "Pixel Experience (Pie Go) (pe)").then(pego => {
			//Pixel Experience (Oreo)
			rompe(`https://download.pixelexperience.org/ota_v2/${codename}/oreo`, `https://download.pixelexperience.org/ota_v2/${codenameup}/oreo`, "Pixel Experience (Oreo) (pe)").then(peoreo => {
			//SyberiaOS
			romsyb(codename, codenameup, "Syberia (syberia)").then(syberia => {
			//crDroid
			romcrd(codename, codenameup, "crDroid (crdroid)").then(crdroid => {
			//Clean Open Source Porject COSP
			romcosp(codename, codenameup, "Clean Open Source Project (cosp/clean)").then(cosp => {
			//ResurrectionRemix RR
			roms(`https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/${codename}.json`, `https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/${codenameup}.json`, "Resurrection Remix (rr)").then(rr => {
			//SuperiorOS
			roms(`https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/${codename}.json`, `https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/${codenameup}.json`, "SuperiorOS (superior)").then(superior => {
			//RevengeOS
			roms(`https://raw.githubusercontent.com/RevengeOS/releases/master/${codename}.json`, `https://raw.githubusercontent.com/RevengeOS/releases/master/${codenameup}.json`, "RevengeOS (revenge)").then(revenge => {
			//AOSiP Official
			roms(`https://aosip.dev/${codename}/official`, `https://aosip.dev/${codenameup}/official`, `Android Open Source illusion Project (${lang.official}) (aosip)`).then(aosipo => {
			//AOSiP Beta
			roms(`https://aosip.dev/${codename}/beta`, `https://aosip.dev/${codenameup}/beta`, `Android Open Source illusion Project (${lang.beta}) (aosip)`).then(aosipb => {
			//ArrowOS
			roms(`https://update.arrowos.net/api/v1/${codename}/official`, `https://update.arrowos.net/api/v1/${codenameup}/official`, "ArrowOS (arrow)").then(arrow => {
			//Liquid Remix
			romxml(`https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/${codename}.xml`, `https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/${codenameup}.xml`, "Liquid Remix (liquid)").then(liquid => {
			//Dirty Unicorns (Official)
			romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Official`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Official`, `Dirty Unicorns (${lang.official}) (dirty)`).then(dirtyo => {
			//Dirty Unicorns (RC)
			romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Rc`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Rc`, "Dirty Unicorns (RC) (dirty)").then(dirtyr => {
			//Dirty Unicorns (Weeklies)
			romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Weeklies`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Weeklies`, "Dirty Unicorns (Weeklies) (dirty)").then(dirtyw => {
			//XenonHD (Official)
			romxml(`https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codename}_official.xml`, `https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codenameup}_official.xml`, `XenonHD (${lang.official}) (xenon)`).then(xenono => {
			//XenonHD (Experimental)
			romxml(`https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codename}_experimental.xml`, `https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codenameup}_experimental.xml`, `XenonHD (${lang.experimental}) (xenon)`).then(xenone => {
			//Kraken Open Tentacles Project KOTP
			roms(`https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/${codename}.json`, `https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/${codenameup}.json`, "Kraken Open Tentacles Project (kotp/kraken)").then(kotp => {
			//Android Ice Cold Project AICP
			romaicp(`http://ota.aicp-rom.com/update.php?device=${codename}`, `http://ota.aicp-rom.com/update.php?device=${codenameup}`, "Android Ice Cold Project (aicp)").then(aicp => {
			//NitrogenOS
			roms(`https://raw.githubusercontent.com/nitrogen-project/OTA/p/${codename}.json`, `https://raw.githubusercontent.com/nitrogen-project/OTA/p/${codenameup}.json`, "NitrogenOS (nitrogen)").then(nitrogen => {
			//CerberusOS
			roms(`https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/${codename}/build.json`, `https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/${codenameup}/build.json`, "CerberusOS (cerberus)").then(cerberus => {
				
				//havoc, pixy, los, pearl, dotos, viper, pospw, pospm, evo, aexpie, aexoreo, btlg, pepie, pecaf, peoreo, pego, syberia, crdroid, cosp, rr, superior, revenge, aosipo, aosipb, arrow, liquid, dirtyo, dirtyr, dirtyw, xenono, xenone, kotp, aicp, nitrogen, cerberus
				
				
				if(havoc === false && pixy === false && los === false && pearl === false && dotos === false && viper === false && pospw === false && pospm === false && evo === false && aexpie === false && aexoreo == false && btlg === false && pepie === false && pecaf === false && peoreo === false && syberia === false && crdroid === false && cosp === false && rr === false && pego === false && superior === false && revenge === false && aosipo === false && aosipb === false && arrow === false && liquid === false && dirtyo === false && dirtyr === false && dirtyw === false && xenone === false && xenono === false && kotp === false && aicp === false && nitrogen === false && cerberus === false){
         				send(lang.romserr+" `"+devicename(codename)+"`");
				} else {
					
					function tof(f){
						if(f !== false){
							return `${f}`
						} else {
							return "";
						}
					}
					
					const embed = new Discord.RichEmbed()
						.setColor(0xFFFFFF)
						.setTitle(`${lang.roms} ${devicename(codename)}`)
						.setDescription([tof(havoc), tof(pixy), tof(los), tof(pearl), tof(dotos), tof(viper), tof(pospw), tof(pospm), tof(evo), tof(aexpie), tof(aexoreo), tof(btlg), tof(pepie), tof(pecaf), tof(peoreo), tof(pego), tof(syberia), tof(crdroid), tof(cosp), tof(rr), tof(superior), tof(revenge), tof(aosipo), tof(aosipb), tof(arrow), tof(liquid), tof(dirtyo), tof(dirtyr), tof(dirtyw), tof(xenono), tof(xenone), tof(kotp), tof(aicp), tof(nitrogen), tof(cerberus)].sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join(''))
					send({embed});
				}
        message.channel.stopTyping();
				
			})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})});
		} else {
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle(lang.help.roms.available)
				.setDescription(roms)
			send({embed});
		}
	}
});

client.login(config.token);
