# Android Discord Bot
Bot Discord permettant de savoir une version Android ou Magisk particulière ou si une rom ou twrp est officiel pour un certain appareil et avoir les OpenGapps facilement ou avoir des infomration sur une application Google Play

Langue: [English](README.md) | [Français](README.fr.md)

prefix: .

#### ROMs Supporté pour les commandes Roms:
* DotOS
* Evolution-X
* HavocOS
* PearlOS
* PixysOS
* Potato Open Sauce Project (POSP)
* ViperOS
* LineageOS
* Pixel Experience
* BootleggersROM
* AOSP Extended
* crDroid
* Syberia
* Clean Open Source Project (COSP)
* Resurrection Remix
* SuperiorOS
* RevengeOS
* Android Open Source illusion Project
* ArrowOS
* Liquid Remix
* Dirty Unicorns
* XenonHD
* Kraken Open Tentacles Project (KOTP)
* Android Ice Cold Project (AICP)
* NitrogenOS
* CerberusOS

### Comment l'installer:
Téléchargez et Installez NodeJS : https://nodejs.org/en/

Téléchargez le repo : https://github.com/Pharuxtan/android-bot/archive/master.zip

Dézipper le zip et ouvrez une Invite de commande dans le dossier extrait

Puis tapez `npm install`

Ouvrez le fichier config.json:
* Mettez votre token
* Mettez la langue (fr, en)
* Mettez l'id client de votre app GitHub Oauth
* Mettez le secret client de votre app GitHub Oauth

Pour créer son App GitHub Oauth, allez ici : https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/

### Comment l'utiliser:
 Tapez sur votre Invite de Commande `node index.js`
 
 ajoutez le bot à votre serveur puis faite .help
 
### Troubleshooting
 
 Q1: Pourquoi quand je démarre le bot j'ai `Cannot find module` ?
 
 R1: Avez vous bien installer tout les packages avec `npm install` ?
 
 Q2: Pourquoi quand je démarre le bot j'ai `UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided.` ?
 
 R2: Avez-vous bien mit votre token dans le config.json ?
