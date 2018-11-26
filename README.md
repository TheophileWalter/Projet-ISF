# Projet-ISF
Visualisation des données ISF

## DEVELOPER PART

### Import GitHub project
#### Clone
* `$ git clone https://github.com/TheophileWalter/Projet-ISF.git`
* `$ git config --global user.email "Vous@exemple.com"`
* `$ git config --global user.name "Votre Nom"`

#### Update
option : `$ git config credential.helper store`
1. `$ git add .`
2. `$ git commit -m "comment what's changed"`
3. `$ git pull`
4. `$ git push`

## TODO & NEEDED List:
- [ ] Ajouter boutons pour afficher sur le graphe
  - [ ] moyenne des années sélectionnées par le user
  - [ ] médiane des années sélectionnées par le user
  - [ ] Q1 des années sélectionnées par le user
  - [ ] Q3 des années sélectionnées par le user

- [ ] Ajouter boutons pour choisir
  - [x] ISF
  - [ ] payeurs
  - [ ] ISF / payeurs
  - [ ] un ISF minimum
  - [ ] un ISF maximum
  - [ ] un intervale dans lequel doit se trouver l'ISF

## TODO List:
- [x] Dossier "data/"
  - [x] Données brutes de ISF en CSV
  - [x] Données codes communes et postaux en CSV
  
- [x] Dossier "data_json/"
  - [x] Données nettoyées de ISF en JSON
  - [x] Données codes communes et postaux en JSON

- [x] Dossier "data_prep/"
  - [x] Sauvegarder, traiter et nettoyer les fichiers données CSV sous format JSON
  - [x] "convertCsvToJson.js" : données CSV en JSON
  - [x] "locationCSV2JSon.py" : codes CSV en JSON

- [x] Dossier "web_src/"
  - [x] "load.js" : charge toutes les données des années 
  - [x] "mainInit.js" : lie les codes communes et codes postaux pour obtenir les coordonnées géographiques
  - [x] "style.css" : feuille de style de la page "index.html"
  - [x] "tools.js" : code pour les différents traitements dans les graphiques
  - [x] "visu.js" : code des différents styles de visualisations (graphiques ou cartes)
 
- [x] Dossier "web_src/jquery/"
  - [x] Librairie pour JQuery

- [ ] Dossier "web_src/chart/"
  - [x] "Chart.bundle.min.js" : 
  - [x] "Chart.min.js" : 
  - [x] "chartjs-plugin-zoom.min.js" : 

- [x] "index.html" : page pour visualiser le dashboard


## Execute scripts
- convertCsvToJson.js : `$ node convertCsvToJson.js`
