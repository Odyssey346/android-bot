# Android Discord Bot
Bot Discord permettant de savoir une version Android ou Magisk particulière ou si une rom est officiel pour un certain appareil

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

### Comment l'installer:
Téléchargez et Installez NodeJS : https://nodejs.org/en/

Téléchargez le repo : https://github.com/Pharuxtan/android-bot/archive/master.zip

Dézipper le zip et ouvrez une Invite de commande dans le dossier extrait

Puis tapez
```
npm i android-versions
npm i discord.js
npm i prettysize
npm i request
npm i xml-js
```

Ouvrez le fichier index.js et mettez le token de votre bot à la place de "token" (sans enlever les "")

### Comment l'utiliser:
 Tapez sur votre Invite de Commande `node index.js`
 
 ajoutez le bot à votre serveur puis faite .help
 
### Troubleshooting
 
 Q1: Pourquoi quand je démarre le bot j'ai `Cannot find module` ?
 
 R1: Avez vous bien installer tout les packages avec npm ?
 
 Q2: Pourquoi quand je démarre le bot j'ai `UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided.` ?
 
 R2: Avez-vous bien mit votre token dans le index.js ?
