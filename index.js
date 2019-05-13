const Discord = require("discord.js");
const request = require("request");
const pretty = require('prettysize');
const convert = require('xml-js');
const android = require('android-versions');
const config = require('./config.json');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//Language Verifier
const configlang = config.lang.toLowerCase();
const langverif = require('./lang.json');
if(langverif[configlang] === undefined){
	console.log("Please enter a Language Exist !");
	process.exit(0);
}
//end
const lang = langverif[configlang];
const client = new Discord.Client();
const roms = "DotOS (dotos)\n"+
			 "Evolution-X (evo/evox)\n"+
			 "HavocOS (havoc)\n"+
			 "PearlOS (pearl)\n"+
			 "PixysOS (pixy)\n"+
			 "Potato Open Sauce Project (posp/potato)\n"+
			 "ViperOS (viper)\n"+
			 "LineageOS (los/lineage)\n"+
			 "Pixel Experience (pe)\n"+
			 "BootleggersROM (btlg/bootleggers)\n"+
			 "AOSP Extended (aex)\n"+
			 "crDroid (crdroid)\n"+
			 "Syberia (syberia)\n"+
			 "Clean Open Source Project (cosp/clean)\n"+
			 "Resurrection Remix (rr)\n"+
			 "SuperiorOS (superior)\n"+
			 "RevengeOS (revenge)";
function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
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


var prefix = ".";

client.on("ready", () => {
	client.user.setActivity(`${prefix}help`, {type: "STREAMING",url: "https://www.twitch.tv/android"});
	console.log(`${lang.connect} ${client.user.username} - ${client.user.id}`);
});

//Help
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const guild = message.guild;
	const member = message.member;
	const author = message.author;
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	if(content.startsWith(`${prefix}help`)){
		const embed = new Discord.RichEmbed()
			.setColor(0xFFFFFF)
			.setTitle(lang.help.default.title)
			.setDescription("`"+prefix+"android <version_number>` : "+lang.help.default.android+"\n"+
			"`"+prefix+"magisk <version>`: "+lang.help.default.magisk.text+" \n - "+lang.help.default.magisk.ver+": `Stable`, `Beta`, `Canary`\n"+
			"`"+prefix+"twrp <codename>`: "+lang.help.default.twrp+"\n"+
			"`"+prefix+"help roms`: "+lang.help.default.roms+"\n"+
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
				.addField(lang.help.roms.use.title, "`"+prefix+"<rom> <nom_de_code>`\n"+lang.help.roms.use.example+": `"+prefix+"havoc whyred`\n"+lang.help.roms.use.cmdroms+" `"+prefix+"roms`.\n\n"+lang.help.roms.use.note, false)
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
	const guild = message.guild;
	const member = message.member;
	const author = message.author;
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
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Stable")
					.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magisks.app.version}](${magisks.app.link})\n - [ChangeLog](${magisks.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})\n - [ChangeLog](${magisks.magisk.note})`, true)
				send({embed});
			});
		//Beta Version
		} else if(version === "beta") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`).then(magiskb => {
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Beta")
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magiskb.app.version}](${magiskb.app.link})\n - [ChangeLog](${magiskb.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})\n - [ChangeLog](${magiskb.magisk.note})`, true)
				send({embed});
			});
		//Canary Version
		} else if(version === "canary") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`).then(magiskc => {
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Canary")
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [ChangeLog](${magiskc.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})\n - [ChangeLog](${magiskc.magisk.note})`, true)
					.addField("SNET (SafetyNet)", "**"+lang.version+"**: `"+magiskc.snet.versionCode+"`\n**${lang.download}**: "+`[snet.apk](${magiskc.snet.link})`, true)
				send({embed});
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
					.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magisks.app.version}](${magisks.app.link})\n - [ChangeLog](${magisks.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})\n - [ChangeLog](${magisks.magisk.note})`, true)
					.addField("Beta", "** **", false)		
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magiskb.app.version}](${magiskb.app.link})\n - [ChangeLog](${magiskb.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})\n - [ChangeLog](${magiskb.magisk.note})`, true)
					.addField("Canary", "** **", false)						
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [ChangeLog](${magiskc.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`\n**${lang.download}**: \n - "+`[Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})\n - [ChangeLog](${magiskc.magisk.note})`, true)
					.addField("SNET (SafetyNet)", "**"+lang.version+"**: `"+magiskc.snet.versionCode+"`\n**${lang.download}**: "+`[snet.apk](${magiskc.snet.link})`, true)
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
						send(lang.twrperr+" `"+devicename(codename)+"`");
					}
				}
			});
		} else {
			send(lang.cdnerr)
		}
	}
});

//Custom ROM
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const guild = message.guild;
	const member = message.member;
	const author = message.author;
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	async function rom(url, urlup, body, btlg, cosp, crdroid, error, end, name, cdn, cdnup, bkpurl, bkpurlup) {
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
						resolve(`https://mirror.codebucket.de/cosp/${cdn}`)
					} else {
						request({
							url: `https://mirror.codebucket.de/cosp/getdevices.php`
						}, function(err, responses, bodyurl) {
							var body = JSON.parse(bodyurl);
							var response = body.includes(cdnup);
							if(response){
								resolve(`https://mirror.codebucket.de/cosp/${cdnup}`)
							} else {
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
			} else {
				request({
					url
				}, function(err, responses, bodyurl){
					try{
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							if(end){
								resolve(JSON.parse(bodyurl).response.slice(-1)[0])
							} else {
								resolve(JSON.parse(bodyurl).response[0])
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									if(end){
										resolve(JSON.parse(bodyurl).response.slice(-1)[0])
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
									resolve(JSON.parse(bodyurl).response.slice(-1)[0])
								} else {
									resolve(JSON.parse(bodyurl).response[0])
								}
							} else {
								request({
									url: bkpurlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
										if(end){
											resolve(JSON.parse(bodyurl).response.slice(-1)[0])
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
	if(content.startsWith(`${prefix}havoc`)){
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
	} else if(content.startsWith(`${prefix}pixy`)){
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
	} else if(content.startsWith(`${prefix}pearl`)){
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
	} else if(content.startsWith(`${prefix}dotos`)){
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
	} else if(content.startsWith(`${prefix}rr`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase
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
	} else if(content.startsWith(`${prefix}superior`)){
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
	} else if(content.startsWith(`${prefix}viper`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/Viper-Devices/official_devices/master/"
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
	} else if(content.startsWith(`${prefix}evo`) || content.startsWith(`${prefix}evox`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			if(codename !== "enchilada"){
				const codenameup = content.split(' ')[1].toUpperCase();
				const start = "https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/"
				rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, true).then(response => {
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
	} else if(content.startsWith(`${prefix}aex`)){
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
			rom(start, start, false, true, false, false, false, false, '', codename, codenameup).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x515262)
						.setTitle(`BootleggersROM | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+ `${response.buildate.substring(0, 4)}-${response.buildate.substring(4, 6)}-${response.buildate.substring(6, 8)}` +"`**\n**"+lang.size+"**: **`"+pretty(response.buildsize)+"`**\n**"+lang.version+"**: **`"+response.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${response.filename}](${response.download})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//Pixel Experience
	} else if(content.startsWith(`${prefix}pe`)){
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
	} else if(content.startsWith(`${prefix}posp`) || content.startsWith(`${prefix}potato`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://api.potatoproject.co/checkUpdate?device="
			const bkp = "http://api.strangebits.co.in/checkUpdate?device="
			rom(`${start}${codename}&type=mashed`, `${start}${codenameup}&type=mashed`, false, false, false, false, false, true, '', '', '', `${bkp}${codename}&type=mashed`, `${bkp}${codenameup}&type=mashed`).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x6a16e2)
						.setTitle(`Potato Open Sauce Project | ${devicename(codename)}`)
						.setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					send(lang.romerr+" `"+devicename(codename)+"`")
				}
			});
		} else {
			send(lang.cdnerr)
		}
	//RevengeOS
	} else if(content.startsWith(`${prefix}revenge`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			const start = "https://raw.githubusercontent.com/RevengeOS/releases/master/"
			rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, true, true).then(response => {
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
			rom("https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml", '', false, false, false, true, false, false, '', codename, codenameup).then(response => {
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
			rom(start, start, false, false, true, false, false, false, '', codename, codenameup).then(response => {
				if(response){
					const embed = new Discord.RichEmbed()
						.setColor(0x010101)	
						.setTitle(`Clean Open Source Project | ${devicename(codename)}`)
						.setDescription(`**${lang.download}**: [COSP ${codename}](${response})`)
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
			rom(`${start}/a-only/${codename}.json`, `${start}/a-only/${codenameup}.json`, true, false, false, false, true).then(a => {
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
	//ROMs
	} else if(content.startsWith(`${prefix}roms`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
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
			//Potato Open Sauce Project POSP
			romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=mashed`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=mashed`,`http://api.strangebits.co.in/checkUpdate?device=${codename}&type=mashed`, `http://api.strangebits.co.in/checkUpdate?device=${codenameup}&type=mashed`, "Potato Open Sauce Project (posp/potato)").then(posp => {
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
				
				//havoc, pixy, los, pearl, dotos, viper, posp, evo, aexpie, aexoreo, btlg, pepie, pecaf, peoreo, pego, syberia, crdroid, cosp, rr, superior, revenge
				
				if(havoc === false && pixy === false && los === false && pearl === false && dotos === false && viper === false && posp === false && evo === false && aexpie === false && aexoreo == false && btlg === false && pepie === false && pecaf === false && peoreo === false && syberia === false && crdroid === false && cosp === false && rr === false && pego === false && superior === false && revenge === false){
					send(lang.romserr+" `"+devicename(codename)+"`")
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
						.setDescription(`${tof(dotos)}${tof(evo)}${tof(havoc)}${tof(pearl)}${tof(pixy)}${tof(posp)}${tof(viper)}${tof(los)}${tof(pepie)}${tof(pecaf)}${tof(pego)}${tof(peoreo)}${tof(btlg)}${tof(aexpie)}${tof(aexoreo)}${tof(crdroid)}${tof(syberia)}${tof(cosp)}${tof(rr)}${tof(superior)}${tof(revenge)}`)
					send({embed});
				}
				
			})})})})})})})})})})})})})})})})})})})})});
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
