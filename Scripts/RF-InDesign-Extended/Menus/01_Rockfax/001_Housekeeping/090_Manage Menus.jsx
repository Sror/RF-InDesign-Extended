﻿#target "InDesign";$.level = 0;if (typeof(EXTENDABLES) === 'undefined') {#include "../../../Extendables/extendables.jsx";}if (typeof(rfidx) == 'undefined') {var rfidx = require("rockfaxidx");}if (typeof(prefs) == 'undefined') {var prefs = rfidx.Prefs();}var mnu          = app.menus.item("$ID/Main");var submenus     = mnu.submenus.everyItem().getElements();var submenuNames = [];var stdNames     = "Apple File Edit Layout Type Object Table View Window Help".split(" ");for (var i = 0; i < submenus.length; i++) {  if (!stdNames.contains(submenus[i].name)) {    submenuNames.push(submenus[i].name);  }}var killList         = [];var w                = new Window ("dialog");var myText           = w.add ("staticText", undefined, "Choose which menus to delete:");var myList           = w.add ("listbox", undefined, submenuNames, {multiselect: true});var group            = w.add('group');var cacelButton      = group.add ("button", undefined, "Cancel");var myButton         = group.add ("button", undefined, "Delete");myList.preferredSize = [200,100];    myButton.onClick = function () {  var selNames = [];  for (var i = 0; i < myList.selection.length; i++) {    selNames.push(myList.selection[i].text);  };  w.close();  $.sleep(200);  for (var i = 0; i < submenus.length; i++) {    if (selNames.contains(submenus[i].name)) {     killList.push( submenus[i]);    };  };};w.show ();killList.forEach(function (item, i) {    item.remove();});