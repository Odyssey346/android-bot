const Discord = require("discord.js");
const request = require("request");
const pretty = require('prettysize');
const android = require('android-versions');
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
			 "AOSP Extended (aex)";
function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = `${year}-${month}-${date}`;
  return time;
}

var prefix = ".";

client.on("ready", () => {
	client.user.setActivity(`${prefix}help`, {type: "STREAMING",url: "https://www.twitch.tv/android"});
	console.log(`Connecter sur ${client.user.username} - ${client.user.id}`);
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
			.setTitle("Android Bot")
			.setDescription("`"+prefix+"android <version_number>` : Avoir des info sur une version d'Android particulière\n"+
			"`"+prefix+"magisk <version>`: Avoir la version de magisk la plus récente \n - Version: `Stable`, `Beta`, `Canary`\n"+
			"`"+prefix+"help roms`: Voir les commandes pour les Customs ROMs\n"+
			"`"+prefix+"invite`: Avoir l'invite du bot")
			.setFooter(`Aide | ${prefix}help (here)`);
		const f = content.split(' ')[1];
		if(f === "here"){
			send({embed});
		} else if(f === "roms"){
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle("Custom ROM Commande")
				.setDescription("Récupère les dernières versions des appareils officiellement pris en charge")
				.addField("ROMs Disponibles", roms, false)
				.addField("Utilisation", "`"+prefix+"<rom> <nom_de_code>`\nExemple: `"+prefix+"havoc whyred`\nVous pouvez également afficher les ROMs disponibles avec `"+prefix+"roms`.\n\n**Note:**\nSi le bot vous répond `Aucune ROM trouvé pour <nom_appareil>/<nom_de_code>` c'est que la rom n'est pas disponible officiellement pour votre appareil.", false)
				.addField("Pour Pixel Experience et AOSP Extended", "`"+prefix+"pe <nom_de_code> <version>`\nVersions: Oreo (oreo), Pie (pie), Pie-CAF (caf (que Pixel Experience))\nExemple: `"+prefix+"pe whyred caf`\n\n**Note:**\nSi le bot vous répond `Aucune ROM trouvé pour la version <version> pour <nom_appareil>/<nom_de_code>` c'est que la rom n'est pas disponible pour la version pie, caf ou oreo, ou que la rom n'est pas disponible officiellement pour votre appareil.", false)
				.setFooter(`Aide Roms | ${prefix}help roms (here)`);
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
		if(version !== undefined){
			const info = android.get(version);
			if(info !== null){
				function name(name){
					if(name === "(no code name)"){
						return "";
					} else {
						return name;
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor(0xFFFFFF)
					.setTitle(`Android ${info.semver} ${name(info.name)}`)
					.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**Code de Version**: `"+info.versionCode+"`")
				send({embed});
			} else {
				send("Veuillez entrer une version d'android ou une version d'api correct")
			}
		} else {
			const info = android.get(28);
			function name(name){
				if(name === "(no code name)"){
					return "";
				} else {
					return name;
				}
			}
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle(`Android ${info.semver} ${name(info.name)}`)
				.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**Code de Version**: `"+info.versionCode+"`")
			send({embed});
		}
	//Magisk
	} else if(content.startsWith(`${prefix}magisk`)) {
		const version = content.split(' ')[1];
		//Stable Version
		if(version === "stable") {
			request({
				url: `https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`
			}, function(err, responses, bodyurl) {
				var response = JSON.parse(bodyurl);
				var app = response.app;
				var magisk = response.magisk;
				var uninstaller = response.uninstaller;
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Stable")
					.addField("Magisk Manager", "**Version**: "+app.version+" `"+app.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Manager ${app.version}](${app.link})\n - [ChangeLog](${app.note})`, true)
					.addField("Magisk Installer", "**Version**: "+magisk.version+" `"+magisk.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Installer ${magisk.version}](${magisk.link})\n - [Magisk Uninstaller](${uninstaller.link})\n - [ChangeLog](${magisk.note})`, true)
				send({embed});
			});
		//Beta Version
		} else if(version === "beta") {
			request({
				url: `https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`
			}, function(err, responses, bodyurl) {
				var response = JSON.parse(bodyurl);
				var app = response.app;
				var magisk = response.magisk;
				var uninstaller = response.uninstaller;
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Beta")
					.addField("Magisk Manager", "**Version**: "+app.version+" `"+app.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Manager ${app.version}](${app.link})\n - [ChangeLog](${app.note})`, true)
					.addField("Magisk Installer", "**Version**: "+magisk.version+" `"+magisk.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Installer ${magisk.version}](${magisk.link})\n - [Magisk Uninstaller](${uninstaller.link})\n - [ChangeLog](${magisk.note})`, true)
				send({embed});
			});
		//Canary Version
		} else if(version === "canary") {
			request({
				url: `https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`
			}, function(err, responses, bodyurl) {
				var response = JSON.parse(bodyurl);
				var app = response.app;
				var magisk = response.magisk;
				var uninstaller = response.uninstaller;
				var snet = response.snet;
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Canary")
					.addField("Magisk Manager", "**Version**: "+app.version+" `"+app.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Manager ${app.version}](${app.link})\n - [ChangeLog](${app.note})`, true)
					.addField("Magisk Installer", "**Version**: "+magisk.version+" `"+magisk.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Installer ${magisk.version}](${magisk.link})\n - [Magisk Uninstaller](${uninstaller.link})\n - [ChangeLog](${magisk.note})`, true)
					.addField("SNET (SafetyNet)", "**Version**: `"+snet.versionCode+"`\n**Télécharger**: "+`[snet.apk](${snet.link})`, true)
				send({embed});
			});
		//Stable (undefined) Version
		} else {
			request({
				url: `https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`
			}, function(err, responses, bodyurl) {
				var response = JSON.parse(bodyurl);
				var app = response.app;
				var magisk = response.magisk;
				var uninstaller = response.uninstaller;
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk Stable")
					.addField("Magisk Manager", "**Version**: "+app.version+" `"+app.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Manager ${app.version}](${app.link})\n - [ChangeLog](${app.note})`, true)
					.addField("Magisk Installer", "**Version**: "+magisk.version+" `"+magisk.versionCode+"`\n**Télécharger**: \n - "+`[Magisk Installer ${magisk.version}](${magisk.link})\n - [Magisk Uninstaller](${uninstaller.link})\n - [ChangeLog](${magisk.note})`, true)
				send({embed});
			});
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
	function devicename(codename){
		const device = require('./device.json');
		if(device[codename] !== undefined){
			return device[codename]; 
		} else {
			return codename;
		}
	}
	//HavocOS
	if(content.startsWith(`${prefix}havoc`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codename}.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x1A73E8)
						.setTitle(`HavocOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codenameup}.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x1A73E8)
								.setTitle(`HavocOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//LineageOS
	} else if(content.startsWith(`${prefix}lineage`) || content.startsWith(`${prefix}los`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://download.lineageos.org/api/v1/${codename}/nightly/*`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x167C80)
						.setTitle(`LineageOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://download.lineageos.org/api/v1/${codenameup}/nightly/*`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x167C80)
								.setTitle(`LineageOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//PixysOS
	} else if(content.startsWith(`${prefix}pixy`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codename}/build.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x9abcf2)
						.setTitle(`PixysOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codenameup}/build.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x9abcf2)
								.setTitle(`PixysOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//PearlOS
	} else if(content.startsWith(`${prefix}pearl`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://raw.githubusercontent.com/PearlOS/OTA/master/${codename}.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x4d7dc4)
						.setTitle(`PearlOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://raw.githubusercontent.com/PearlOS/OTA/master/${codenameup}.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x4d7dc4)
								.setTitle(`PearlOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//DotOS
	} else if(content.startsWith(`${prefix}dotos`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codename}.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0xef2222)
						.setTitle(`DotOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codenameup}.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0xef2222)
								.setTitle(`DotOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//ViperOS
	} else if(content.startsWith(`${prefix}viper`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codename}/build.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200){
					var body = JSON.parse(bodyurl);
					var response = body.response[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x4184f4)
						.setTitle(`ViperOS | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codenameup}/build.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x4184f4)
								.setTitle(`ViperOS | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//Potato Open Sauce Porject POSP
	} else if(content.startsWith(`${prefix}posp`) || content.startsWith(`${prefix}potato`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://api.potatoproject.co/checkUpdate?device=${codename}&type=mashed`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
					var body = JSON.parse(bodyurl);
					var response = body.response.slice(-1)[0]
					const embed = new Discord.RichEmbed()
						.setColor(0x6a16e2)
						.setTitle(`Potato Open Sauce Project | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=mashed`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							var body = JSON.parse(bodyurl);
							var response = body.response.slice(-1)[0]
							const embed = new Discord.RichEmbed()
								.setColor(0x6a16e2)
								.setTitle(`Potato Open Sauce Project | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//Evolution-X EVO-X
	} else if(content.startsWith(`${prefix}evo`) || content.startsWith(`${prefix}evox`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			if(codename !== "enchilada"){
				request({
					url: `https://raw.githubusercontent.com/evolution-x/official_devices/master/builds/${codename}.json`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0xb0c9ce)
							.setTitle(`Evolution-X | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://raw.githubusercontent.com/evolution-x/official_devices/master/builds/${codenameup}.json`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0xb0c9ce)
									.setTitle(`Evolution-X | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
							}
						});
					}
					
				});
			} else {
				send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
			}
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//AOSP Extended AEX
	} else if(content.startsWith(`${prefix}aex`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const version = content.split(' ')[2];
			//Pie Version
			if(version === "pie") {
				request({
					url: `https://api.aospextended.com/ota/${codename}/pie`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0x21ef8b)
							.setTitle(`AEX | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://api.aospextended.com/ota/${codenameup}/pie`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0x21ef8b)
									.setTitle(`AEX | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			//Oreo Version
			} else if(version === "oreo") {
				request({
					url: `https://api.aospextended.com/ota/${codename}/oreo`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0x21ef8b)
							.setTitle(`AEX | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://api.aospextended.com/ota/${codenameup}/oreo`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0x21ef8b)
									.setTitle(`AEX | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			//Pie (undefined) Version
			} else {
				request({
					url: `https://api.aospextended.com/ota/${codename}/pie`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0x21ef8b)
							.setTitle(`AEX | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://api.aospextended.com/ota/${codenameup}/pie`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0x21ef8b)
									.setTitle(`AEX | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+ `${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.filesize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			}
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//BootleggersROM BTLG
	} else if(content.startsWith(`${prefix}bootleggers`) || content.startsWith(`${prefix}btlg`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			request({
				url: `https://bootleggersrom-devices.github.io/api/devices.json`
			}, function(err, responses, bodyurl) {
				if(responses.statusCode === 200 && JSON.parse(bodyurl)[codename] !== undefined){
					var body = JSON.parse(bodyurl);
					var response = body[codename];
					const embed = new Discord.RichEmbed()
						.setColor(0x515262)
						.setTitle(`BootleggersROM | ${devicename(codename)}`)
						.setDescription("**Date**: **`"+ `${response.buildate.substring(0, 4)}-${response.buildate.substring(4, 6)}-${response.buildate.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.buildsize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.download})`)
					send({embed});
				} else {
					const codenameup = codename.toUpperCase();
					request({
						url: `https://bootleggersrom-devices.github.io/api/devices.json`
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl)[codenameup] !== undefined){
							var body = JSON.parse(bodyurl);
							var response = body[codenameup];
							const embed = new Discord.RichEmbed()
								.setColor(0x515262)
								.setTitle(`BootleggersROM | ${devicename(codename)}`)
								.setDescription("**Date**: **`"+ `${response.buildate.substring(0, 4)}-${response.buildate.substring(4, 6)}-${response.buildate.substring(6, 8)}` +"`**\n**Taille**: **`"+pretty(response.buildsize)+"`**\n**Version**: **`"+response.filename.split('-')[1]+"`**\n"+`**Télécharger**: [${response.filename}](${response.download})`)
							send({embed});
						} else {
							send("Aucune ROM trouvé pour `"+devicename(codename)+"`");
						}
					});
				}
			});
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//Pixel Experience PE
	} else if(content.startsWith(`${prefix}pe`)){
		const codename = content.split(' ')[1]
		if(codename !== undefined){
			const version = content.split(' ')[2];
			//Pie version
			if(version === "pie") {
				request({
					url: `https://download.pixelexperience.org/ota_v2/${codename}/pie`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0xf8ba00)
							.setTitle(`Pixel Experience | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://download.pixelexperience.org/ota_v2/${codenameup}/pie`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0xf8ba00)
									.setTitle(`Pixel Experience | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			//CAF Version
			} else if(version === "caf" || version === "pie_caf" || version === "pie-caf"){
				request({
					url: `https://download.pixelexperience.org/ota_v2/${codename}/pie_caf`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0xf8ba00)
							.setTitle(`Pixel Experience | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://download.pixelexperience.org/ota_v2/${codenameup}/pie_caf`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0xf8ba00)
									.setTitle(`Pixel Experience | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			//Oreo Version
			} else if(version === "oreo"){
				request({
					url: `https://download.pixelexperience.org/ota_v2/${codename}/oreo`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0xf8ba00)
							.setTitle(`Pixel Experience | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://download.pixelexperience.org/ota_v2/${codenameup}/oreo`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0xf8ba00)
									.setTitle(`Pixel Experience | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `"+version+"` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			//Pie (undefined) Version
			} else {
				request({
					url: `https://download.pixelexperience.org/ota_v2/${codename}/pie`
				}, function(err, responses, bodyurl) {
					if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
						var response = JSON.parse(bodyurl);
						const embed = new Discord.RichEmbed()
							.setColor(0xf8ba00)
							.setTitle(`Pixel Experience | ${devicename(codename)}`)
							.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
						send({embed});
					} else {
						const codenameup = codename.toUpperCase();
						request({
							url: `https://download.pixelexperience.org/ota_v2/${codenameup}/pie`
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
								var response = JSON.parse(bodyurl);
								const embed = new Discord.RichEmbed()
									.setColor(0xf8ba00)
									.setTitle(`Pixel Experience | ${devicename(codename)}`)
									.setDescription("**Date**: **`"+timeConverter(response.datetime)+"`**\n**Taille**: **`"+pretty(response.size)+"`**\n**Version**: **`"+response.version+"`**\n"+`**Télécharger**: [${response.filename}](${response.url})`)
								send({embed});
							} else {
								send("Aucune ROM trouvé sur la version `pie` pour `"+devicename(codename)+"`");
							}
						});
					}
				});
			}
		} else {
			send("Veuillez entrer un nom de code !")
		}
	//ROMs
	} else if(content.startsWith(`${prefix}roms`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
			async function rom(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200){
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
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
									var response = JSON.parse(bodyurl);
									resolve(`${name}\n`);
								} else {
									request({
										url: urlup
									}, function(err, responses, bodyurl) {
										if(responses.statusCode === 200){
											var response = JSON.parse(bodyurl);
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
								var response = JSON.parse(bodyurl);
								resolve(`${name}\n`);
							} else {
								request({
									url: urlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200){
										var response = JSON.parse(bodyurl);
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
							var body = JSON.parse(bodyurl);
							var response = body.response[0]
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									var body = JSON.parse(bodyurl);
									var response = body.response[0]
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			async function romposp(url, urlup, name) {
				return new Promise(function(resolve, reject) {
					request({
						url
					}, function(err, responses, bodyurl) {
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							var body = JSON.parse(bodyurl);
							var response = body.response.slice(-1)[0]
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									var body = JSON.parse(bodyurl);
									var response = body.response.slice(-1)[0]
									resolve(`${name}\n`);
								} else {
									resolve(false);
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
							var response = JSON.parse(bodyurl);
							resolve(`${name}\n`);
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
									var response = JSON.parse(bodyurl);
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
							var body = JSON.parse(bodyurl);
							var response = body[codename];
							resolve(`${name}\n`);
						} else {
							request({
								url
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl)[codenameup] !== undefined){
									var body = JSON.parse(bodyurl);
									var response = body[codenameup];
									resolve(`${name}\n`);
								} else {
									resolve(false);
								}
							});
						}
					});
				});
			}
			//HavocOS
			rom(`https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codename}.json`, `https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codenameup}.json`, "HavocOS (havoc)").then(havoc => {
			//PixysOS
			rom(`https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codenameup}/build.json`, "PixysOS (pixy)").then(pixy => {
			//LineageOS
			romlos(`https://download.lineageos.org/api/v1/${codename}/nightly/*`, `https://download.lineageos.org/api/v1/${codenameup}/nightly/*`, "LineageOS (los/lineage)").then(los => {
			//PearlOS
			rom(`https://raw.githubusercontent.com/PearlOS/OTA/master/${codename}.json`, `https://raw.githubusercontent.com/PearlOS/OTA/master/${codenameup}.json`, "PearlOS (pearl)").then(pearl => {
			//DotOS
			rom(`https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codename}.json`, `https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codenameup}.json`, "DotOS (dotos)").then(dotos => {
			//ViperOS
			rom(`https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codenameup}/build.json`, "ViperOS (viper)").then(viper => {
			//Potato Open Sauce Project POSP
			romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=mashed`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=mashed`, "Potato Open Sauce Project (posp/potato)").then(posp => {
			//Evolution-X EVO-X
			rombody(`https://raw.githubusercontent.com/evolution-x/official_devices/master/builds/${codename}.json`, `https://raw.githubusercontent.com/evolution-x/official_devices/master/builds/${codenameup}.json`, "Evolution-X (evo/evox)").then(evo => {
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
			//Pixel Experience (Oreo)
			rompe(`https://download.pixelexperience.org/ota_v2/${codename}/oreo`, `https://download.pixelexperience.org/ota_v2/${codenameup}/oreo`, "Pixel Experience (Oreo) (pe)").then(peoreo => {
				
				//havoc, pixy, los, pearl, dotos, viper, posp, evo, aexpie, aexoreo, btlg, pie, caf, oreo
				
				if(havoc === false && pixy === false && los === false && pearl === false && dotos === false && viper === false && posp === false && evo === false && aexpie === false && aexoreo == false && btlg === false && pepie === false && pecaf === false && peoreo === false){
					send("Aucune ROMs Disponibles pour `"+devicename(codename)+"`")
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
						.setTitle(`ROMs Disponibles pour ${devicename(codename)}`)
						.setDescription(`${tof(dotos)}${tof(evo)}${tof(havoc)}${tof(pearl)}${tof(pixy)}${tof(posp)}${tof(viper)}${tof(los)}${tof(pepie)}${tof(pecaf)}${tof(peoreo)}${tof(btlg)}${tof(aexpie)}${tof(aexoreo)}`)
					send({embed});
				}
				
			})})})})})})})})})})})})})});
		} else {
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle("ROMs Disponibles")
				.setDescription(roms)
			send({embed});
		}
	}
});


client.login("token");
