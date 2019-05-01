# Android Discord Bot
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

### Comment l'installer:
##### Sur Windows:

Installez NodeJS : https://nodejs.org/dist/v10.15.3/node-v10.15.3-x64.msi

Télécharger le repo : https://github.com/Pharuxtan/android-bot/archive/master.zip

Dézipper le zip et ouvrez une Invite de commande dans le dossier extrait

Puis tapez ```
npm install
```

Ouvrez le fichier index.js et mettez le token de votre bot à la place de "token" (sans enlever les "")

### Comment l'utiliser:
 Tapez sur votre Invite de Commande ```
 node index.js
 ```
 ajoutez le bot à votre serveur puis fait .help
 
 ### Troubleshooting
 
 Q1: Pourquoi quand je démarre le bot j'ai `Cannot find module` ?
 
 R1: Avez vous fait `npm install` ?
 
 Q2: Pourquoi quand je démarre le bot j'ai `UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided.` ?
 
 R2: Avez-vous bien mit votre token dans le index.js ?
