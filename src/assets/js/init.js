const { ipcRenderer } = require('electron');
const { dialog, shell, app } = require('electron').remote;
const path = require('path');
const SSAPI = require( path.resolve(__dirname, './assets/js/module.api.js') );
const SRXD = require( path.resolve(__dirname, './assets/js/module.srxd.js') );
const fs = require('fs');
const ncp = require('ncp');
const http = require('http');

let api = new SSAPI();
let srxdControl = new SRXD();