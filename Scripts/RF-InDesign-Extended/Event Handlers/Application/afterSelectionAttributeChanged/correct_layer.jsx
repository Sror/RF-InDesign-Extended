﻿if (typeof(EXTENDABLES) === 'undefined') {#include "../../../Extendables/extendables.jsx";}$.level = 0;var clPrefs, currentLayer;var sel;var doc = app.documents[0];main();function main (event) {  if (app.documents.length === 0 || app.modalState) {    return;  }  var tool;  currentLayer = doc.activeLayer.name;  app.scriptPreferences.enableRedraw = false;  clPrefs = correctLayerPrefs();  sel = app.selection;  removeForLayerDuplicates();  if (sel.length !== 0){return;}  var layerKeys = clPrefs.layerNames();    setLayer(layerKeys);}function removeForLayerDuplicates () {  var tmp = clPrefs.setting("preventLayerDuplicates");  if (!tmp) {return;}  if (!currentLayer.match(/ Copy$/gi)) {return;}  var nonDuplicateLayerName = currentLayer.replace(/ Copy$/gi, '');  doc.activeLayer = nonDuplicateLayerName;  doc.activeLayer.visible = true;  var items  = doc.layers.item(currentLayer).pageItems.everyItem();  var guides = doc.layers.item(currentLayer).guides.everyItem();  items.itemLayer = nonDuplicateLayerName;  guides.itemLayer = nonDuplicateLayerName;  doc.layers.item(currentLayer).remove();}function setLayer (layerKeys) {  var currentStyle = getCurrentStyle();  if(currentStyle === false){return;}  for (var i = 0; i < layerKeys.length; i++) {    var key = layerKeys[i];    if (clPrefs.associatedStyles(key).contains(currentStyle)) {      if (currentLayer == key) {return;}      var styles = clPrefs.associatedStyles(key);      if (styles.contains(currentStyle)) {        app.documents[0].activeLayer = key;      }      break;    }  }}function getCurrentStyle () {  var currentStyle, doc, currentLayer, tool;  currentStyle = "";  doc          = app.documents[0];  currentLayer = app.documents[0].activeLayer.name;  tool         = app.toolBoxTools.currentTool;  if (sel.length !== 0) {    return false;  }  if (tool == UITools.TYPE_TOOL) {    currentStyle = doc.pageItemDefaults.appliedTextObjectStyle.name;  } else {    currentStyle = doc.pageItemDefaults.appliedGraphicObjectStyle.name;  }  return currentStyle;}function correctLayerPrefs () {  // This stuff should make it only reload the json on change, but it doesn't work yet.  // Currently the script reloads the prefs each time it runs. The performance hit doesn't  // seem bad though.  this.prefsPath = File("correct_layer_prefs.json").at(File($.fileName).component("path")).fsName;  this.currentModifiedDate = File(this.prefsPath).modified;  this.dataStore = JSON.parse(readPref(this.prefsPath));    this.data = function () {    var fileModifiedDate = File(this.prefsPath).modified;    if (this.currentModifiedDate === fileModifiedDate) {      return this.dataStore;    }else{      this.dataStore = JSON.parse(readPref(this.prefsPath));      return this.dataStore;    }  };  this.setting = function (key) {    return this.data()[key];  };    this.layerNames = function () {    return this.data().layers.keys();  };    this.associatedStyles = function (layerName) {    return this.data().layers[layerName].styles;  };  this.save = function () {  };  return this;}function readPref (thePath) {  if (File(thePath).exists === true) {    var file = File(thePath);    file.open("r");    file.encoding= 'UTF-8';    var theText = file.read();    file.close();    return decomment(theText);  }}function decomment (string) {  return string.replace(/^[ \t]*\/\/[^\r\n]*\n*|/gm, "");}