// ==UserScript==
// @name         AWBW Design Maps Improved
// @version      1.3.1
// @description  Improves the AWBW mapmaking experience.
// @author       TheGamerASD
// @match        https://awbw.amarriner.com/*
// @icon         https://cdn.discordapp.com/emojis/929147036677324800.webp?size=96&quality=lossless
// @grant        none
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    'use strict';
    var theme;
    var lastSymmetry;
    var previewElement;
    var Pages;
    (function (Pages) {
        Pages["All"] = "https://awbw.amarriner.com";
        Pages["YourMaps"] = "https://awbw.amarriner.com/design.php";
        Pages["MapEditor"] = "https://awbw.amarriner.com/editmap.php?maps_id=";
        Pages["UploadMap"] = "https://awbw.amarriner.com/uploadmap.php";
        Pages["PreviewMap"] = "https://awbw.amarriner.com/prevmaps.php?maps_id=";
    })(Pages || (Pages = {}));
    var Module = /** @class */ (function () {
        function Module(func, page) {
            this.func = func;
            this.page = page;
        }
        return Module;
    }());
    var ModuleManager = /** @class */ (function () {
        function ModuleManager() {
        }
        ModuleManager.registerModule = function (func, page) {
            this.modules.push(new Module(func, page));
        };
        ModuleManager.runModules = function () {
            for (var _i = 0, _a = this.modules; _i < _a.length; _i++) {
                var module = _a[_i];
                if (window.location.href.startsWith(module.page)) {
                    try {
                        module.func();
                    }
                    catch (error) {
                        console.warn("Error occurred in module '".concat(module.func.name, "': ") + error);
                    }
                }
            }
        };
        ModuleManager.modules = [];
        return ModuleManager;
    }());
    var GlobalFunctions = {};
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.trimCharEnd = function (string, char) {
            var start = 0;
            var end = string.length;
            while (end > start && string[end - 1] === char)
                --end;
            return (start > 0 || end < string.length) ? string.substring(start, end) : string;
        };
        return Utils;
    }());
    function setGlobals() {
        var _this = this;
        if (window.location.href.startsWith(Pages.MapEditor)) {
            theme = document.getElementById("current-building").querySelector("img").src.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/)\w+/)[0];
            lastSymmetry = 0;
            window.terrain_name = "";
            window.id = 0;
        }
        GlobalFunctions.uploadMap = function (mapName, mapData) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/uploadmap.php", {
                            method: "POST",
                            body: "-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"action\"\n\nUPLOAD\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"mapfile\"; filename=\"data.txt\"\nContent-Type: text/plain\n\n".concat(mapData, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"name\"\n\n").concat(mapName, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"format\"\n\nAWBW\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"overwrite\"\n\nnew\n-----------------------------216783749517670898471830319234--"),
                            headers: {
                                "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        GlobalFunctions.overwriteMap = function (mapName, overwriteID, mapData) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/uploadmap.php", {
                            method: "POST",
                            body: "-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"action\"\n\nUPLOAD\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"mapfile\"; filename=\"data.txt\"\nContent-Type: text/plain\n\n".concat(mapData, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"name\"\n\n").concat(mapName, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"format\"\n\nAWBW\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"overwrite\"\n\n").concat(overwriteID, "\n-----------------------------216783749517670898471830319234--"),
                            headers: {
                                "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    function autosaveScript() {
        'use strict';
        var intervalID;
        var previousState = false;
        var checked = false;
        function saveAsync() {
            $.ajax({
                method: "POST",
                url: "updatemap.php",
                contentType: "application/x-www-form-urlencoded",
                data: $('#map_form').serialize()
            });
        }
        function autosaveCheckboxToggled() {
            checked = document.getElementById("autosave_checkbox").checked;
            if (checked === previousState) {
                return;
            }
            if (checked) {
                intervalID = setInterval(saveAsync, 10 * 1000);
            }
            else {
                clearInterval(intervalID);
            }
            previousState = checked;
        }
        function onLeavePage(e) {
            if (checked) {
                $.ajax({
                    method: "POST",
                    url: "updatemap.php",
                    contentType: "application/x-www-form-urlencoded",
                    data: $('#map_form').serialize(),
                    async: false
                });
            }
            return undefined;
        }
        var saveButton = Object.values(document.getElementsByClassName("norm")).filter(function (e) { return e.textContent.includes("Save"); })[0];
        saveButton.parentElement.innerHTML += "<td class=\"norm\" style=\"border-left: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;\" height=\"30\"><a class=\"norm2\" href=\"#\" style=\"display:block; height: 100%; cursor: default;\">\n<span class=\"small_text\" title=\"Toggle Autosave\" style=\"line-height:29px; display: block; vertical-align: middle;\">\n<img src=\"terrain/savemap.gif\" style=\"vertical-align: middle;\">\n<b style=\"vertical-align:middle;\">Auto</b>\n<input type=\"checkbox\" id=\"autosave_checkbox\" style=\"vertical-align: middle; cursor: pointer;\"></input>\n</span></a>\n</td>";
        setInterval(autosaveCheckboxToggled, 200);
        window.onbeforeunload = onLeavePage;
    }
    function infoPanelScript() {
        'use strict';
        var gmCont = document.getElementById("gamemap");
        var html;
        function getTiles(name) {
            return (html.match(new RegExp(name, "g")) || []).length;
        }
        var infoPanel = document.createElement("div");
        infoPanel.innerHTML = "<table cellpadding'2'='' style='background-color: #EEEEEE; border: 1px solid #AAAAAA; ' cellspacing='0'>\n<tbody><tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/".concat(theme, "/neutralcity.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='cities'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralbase.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='bases'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/plain.gif' style='position: relative;top: 3px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='plains'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/mountain.gif' style='position: relative;top: 1px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='mountains'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/coin.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='money' style=\"padding-right: 2px;\">0</span></b></td>\n</tr>\n<tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralport.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='ports'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralairport.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='airports'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/vroad.gif' style='position: relative;top: 3px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='roads'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/vriver.gif' style='position: relative;top: 1px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='rivers'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/moneycountry.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='moneycountry' style=\"padding-right: 2px;\">0</span></b></td>\n</tr>\n<tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcomtower.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='towers'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutrallab.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='labs'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/wood.gif' style='position: relative;top: 3px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='forests'>0</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/sea.gif' style='position: relative;top: 1px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='seas'>0</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/moneybase.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='moneybase' style=\"padding-right: 2px;\">0</span></b></td>\n</tr>\n</tbody></table>");
        document.getElementById("gamecontainer").appendChild(infoPanel);
        var cities = document.getElementById("cities");
        var bases = document.getElementById("bases");
        var ports = document.getElementById("ports");
        var airports = document.getElementById("airports");
        var towers = document.getElementById("towers");
        var labs = document.getElementById("labs");
        var plains = document.getElementById("plains");
        var roads = document.getElementById("roads");
        var forests = document.getElementById("forests");
        var mountains = document.getElementById("mountains");
        var rivers = document.getElementById("rivers");
        var seas = document.getElementById("seas");
        var money = document.getElementById("money");
        var moneycountry = document.getElementById("moneycountry");
        var moneybase = document.getElementById("moneybase");
        function updateInfo() {
            html = gmCont.innerHTML;
            cities.textContent = getTiles("city\\.").toString();
            bases.textContent = getTiles("base\\.").toString();
            ports.textContent = getTiles("(?<!air)port\\.").toString();
            airports.textContent = getTiles("airport\\.").toString();
            towers.textContent = getTiles("comtower\\.").toString();
            labs.textContent = getTiles("lab\\.").toString();
            plains.textContent = getTiles("plain\\.").toString();
            roads.textContent = getTiles("(road\\.|bridge\\.)").toString();
            forests.textContent = getTiles("wood\\.").toString();
            mountains.textContent = getTiles("mountain\\.").toString();
            rivers.textContent = getTiles("river\\.").toString();
            seas.textContent = getTiles("(sea\\.|reef\\.)").toString();
            var hqs = getTiles("hq\\.");
            var totalIncome = parseInt(bases.textContent) + parseInt(ports.textContent) + parseInt(airports.textContent) + parseInt(cities.textContent) + hqs;
            var countries = 0;
            if (hqs === 0) {
                if (labs.textContent !== "0") {
                    if (getTiles("orangestarlab\\.") > 0)
                        countries++;
                    if (getTiles("bluemoonlab\\.") > 0)
                        countries++;
                    if (getTiles("greenearthlab\\.") > 0)
                        countries++;
                    if (getTiles("yellowcometlab\\.") > 0)
                        countries++;
                    if (getTiles("blackholelab\\.") > 0)
                        countries++;
                    if (getTiles("redfirelab\\.") > 0)
                        countries++;
                    if (getTiles("greyskylab\\.") > 0)
                        countries++;
                    if (getTiles("browndesertlab\\.") > 0)
                        countries++;
                    if (getTiles("amberblazelab\\.") > 0)
                        countries++;
                    if (getTiles("jadesunlab\\.") > 0)
                        countries++;
                    if (getTiles("cobalticelab\\.") > 0)
                        countries++;
                    if (getTiles("pinkcosmoslab\\.") > 0)
                        countries++;
                    if (getTiles("tealgalaxylab\\.") > 0)
                        countries++;
                    if (getTiles("purplelightninglab\\.") > 0)
                        countries++;
                    if (getTiles("acidrainlab\\.") > 0)
                        countries++;
                    if (getTiles("whitenovalab\\.") > 0)
                        countries++;
                }
            }
            else {
                if (getTiles("orangestarhq\\.") > 0)
                    countries++;
                if (getTiles("bluemoonhq\\.") > 0)
                    countries++;
                if (getTiles("greenearthhq\\.") > 0)
                    countries++;
                if (getTiles("yellowcomethq\\.") > 0)
                    countries++;
                if (getTiles("blackholehq\\.") > 0)
                    countries++;
                if (getTiles("redfirehq\\.") > 0)
                    countries++;
                if (getTiles("greyskyhq\\.") > 0)
                    countries++;
                if (getTiles("browndeserthq\\.") > 0)
                    countries++;
                if (getTiles("amberblazehq\\.") > 0)
                    countries++;
                if (getTiles("jadesunhq\\.") > 0)
                    countries++;
                if (getTiles("cobalticehq\\.") > 0)
                    countries++;
                if (getTiles("pinkcosmoshq\\.") > 0)
                    countries++;
                if (getTiles("tealgalaxyhq\\.") > 0)
                    countries++;
                if (getTiles("purplelightninghq\\.") > 0)
                    countries++;
                if (getTiles("acidrainhq\\.") > 0)
                    countries++;
                if (getTiles("whitenovahq\\.") > 0)
                    countries++;
            }
            money.textContent = totalIncome.toString() + "k ";
            var moneyPerCountry = Math.round(totalIncome / countries * 100) / 100;
            moneycountry.textContent = isFinite(moneyPerCountry) ? moneyPerCountry.toString() + "k " : "0k ";
            var moneyPerBase = Math.round(totalIncome / parseInt(bases.textContent) * 100) / 100;
            moneybase.textContent = isFinite(moneyPerBase) ? moneyPerBase.toString() + "k " : "0k ";
        }
        setInterval(updateInfo, 400);
    }
    function asyncSaveScript() {
        var saveButton = Object.values(document.getElementsByClassName("norm2")).filter(function (e) { return e.textContent.includes("Save"); })[0];
        var saveButtonText = Object.values(document.getElementsByTagName("B")).filter(function (b) { return b.textContent === "Save"; })[0];
        function saveAsync() {
            saveButton.parentElement.setAttribute("style", "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px; background-color: silver;");
            saveButton.setAttribute("style", "display: block; height: 100%; pointer-events: none;");
            saveButtonText.textContent = "Saving...";
            $.ajax({
                method: "POST",
                url: "updatemap.php",
                contentType: "application/x-www-form-urlencoded",
                data: $('#map_form').serialize(),
                success: onSuccess,
                error: onError
            });
        }
        function onSuccess(res) {
            saveButton.parentElement.setAttribute("style", "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
            saveButton.setAttribute("style", "display: block; height: 100%;");
            saveButtonText.textContent = "Save";
        }
        function onError(res) {
            saveButton.parentElement.setAttribute("style", "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
            saveButton.setAttribute("style", "display: block; height: 100%;");
            saveButtonText.textContent = "Save";
            alert("An error has occurred while trying to save. Please make sure you are connected to the internet.");
        }
        saveButton.setAttribute("href", "#");
        saveButton.onclick = saveAsync;
    }
    function unitSelectScript() {
        var innerUnitTable = document.getElementById("design-map-unit-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
        innerUnitTable.innerHTML = "<b style=\"padding-left: 2px;\">Land</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(0, 'infantry.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"infantry.gif\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/osinfantry.gif\"\n                        style=\"display: block; margin: auto;\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(1, 'mech.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"mech.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osmech.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(2, 'recon.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"recon.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osrecon.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(6, 'tank.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"tank.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ostank.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(4, 'apc.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"apc.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osapc.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(8, 'anti-air.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"anti-air.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osanti-air.gif\" border=\"0\"></a>\n            </td>\n        </tr>\n        <tr>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(5, 'artillery.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"artillery.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osartillery.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(12, 'rocket.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"rocket.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osrocket.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(10, 'missile.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"missile.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osmissile.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(13, 'md.tank.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"md.tank.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osmd.tank.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(18, 'neotank.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"neotank.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osneotank.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(23, 'megatank.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"megatank.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osmegatank.gif\" border=\"0\"></a>\n            </td>\n        </tr>\n        <tr>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(16, 'piperunner.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"piperunner.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ospiperunner.gif\" border=\"0\"></a>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Air</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(3, 't-copter.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"t-copter.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ost-copter.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(9, 'b-copter.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"b-copter.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osb-copter.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(15, 'fighter.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"fighter.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osfighter.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(19, 'bomber.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"bomber.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osbomber.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(20, 'stealth.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"stealth.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osstealth.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(21, 'blackbomb.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"blackbomb.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osblackbomb.gif\" border=\"0\"></a>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<b style=\"padding-left: 1px;\">Naval</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(7, 'blackboat.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"blackboat.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osblackboat.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(11, 'lander.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"lander.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oslander.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(14, 'cruiser.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"cruiser.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oscruiser.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(17, 'sub.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"sub.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ossub.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(22, 'battleship.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"battleship.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/osbattleship.gif\" border=\"0\"></a>\n            </td>\n            <td class=\"bordergrey\" style=\"vertical-align: middle;\">\n                <a href=\"javascript: changeSquare(24, 'carrier.gif' , 'unit' ); closeMenu(unitTable);\">\n                    <img id=\"carrier.gif\" style=\"display: block; margin: auto;\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oscarrier.gif\" border=\"0\"></a>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Country</b>\n<table>\n    <tbody>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oslogo.gif\"\n                    onclick=\"changeCountry('os', 'orangestar' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bmlogo.gif\" onclick=\"changeCountry('bm', 'bluemoon'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gelogo.gif\"\n                    onclick=\"changeCountry('ge', 'greenearth' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/yclogo.gif\"\n                    onclick=\"changeCountry('yc', 'yellowcomet' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bhlogo.gif\" onclick=\"changeCountry('bh', 'blackhole'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/rflogo.gif\" onclick=\"changeCountry('rf', 'redfire'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gslogo.gif\" onclick=\"changeCountry('gs', 'greysky'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bdlogo.gif\"\n                    onclick=\"changeCountry('bd', 'browndesert' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ablogo.gif\"\n                    onclick=\"changeCountry('ab', 'amberblaze' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/jslogo.gif\" onclick=\"changeCountry('js', 'jadesun'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/cilogo.gif\" onclick=\"changeCountry('ci', 'cobaltice'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pclogo.gif\"\n                    onclick=\"changeCountry('pc', 'pinkcosmos' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/tglogo.gif\"\n                    onclick=\"changeCountry('tg', 'tealgalaxy' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pllogo.gif\"\n                    onclick=\"changeCountry('pl', 'purplelightning' );\" style=\"vertical-align: middle; margin-left:\n                    0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/arlogo.gif\" onclick=\"changeCountry('ar', 'acidrain'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnlogo.gif\" onclick=\"changeCountry('wn', 'whitenova'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n    </tbody>\n</table>");
    }
    function terrainSelectScript() {
        var tableElement = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0];
        tableElement.setAttribute("class", "bordergrey");
        tableElement.innerHTML = "<a href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">\n<img id=\"missilesilo.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/missilesilo.gif\" style=\"margin: auto 2px;\" border=\"type=image\"></a>");
        showBuildings = function () {
            if (!buildingVisible) {
                var elLeft = getOffset(currentBuilding).left;
                var elTop = getOffset(currentBuilding).top;
                var containerLeft = getOffset(gameContainer).left;
                var containerTop = getOffset(gameContainer).top;
                applyCSS(buildingTable, {
                    left: (elLeft - containerLeft - 50) + "px",
                    top: (elTop - containerTop + 45) + "px",
                    visibility: 'visible'
                });
                buildingVisible = true;
                if (countryVisible) {
                    closeMenu(countryTable);
                }
                if (terrainVisible) {
                    closeMenu(terrainTable);
                }
                if (unitVisible) {
                    closeMenu(unitTable);
                }
                //change square
                var terrain_name = buildingImage.src;
                terrain_name = terrain_name.replace(/terrain\/(aw1|aw2|ani)\//, '');
                terrain_name = terrain_name.replace('https://awbw.amarriner.com/', '');
                var id;
                for (var c = 1; c <= images.length; c++) {
                    if (images[c] == terrain_name) {
                        id = c;
                        break;
                    }
                }
                terrain_name = terrain_name.replace(country, '');
                if (terrain_name.indexOf("neutral") >= 0 || terrain_name.includes("missilesilo")) {
                    changeSquare(id, terrain_name, 'neutral');
                }
                else {
                    changeSquare(id, terrain_name, 'building');
                }
            }
            else {
                closeMenu(buildingTable);
                buildingVisible = false;
            }
        };
        var innerTerrainTable = document.getElementById("design-map-terrain-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
        innerTerrainTable.innerHTML = "<b style=\"padding-left: 2px;\">Basic</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(1, 'plain.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"plain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/plain.gif\"\n                            style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(3, 'wood.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wood.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wood.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(112, 'missilesiloempty.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"missilesiloempty.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/missilesiloempty.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(2, 'mountain.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"mountain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/mountain.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">River</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(4, 'hriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(5, 'vriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(6, 'criver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"criver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/criver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(7, 'esriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"esriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/esriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(8, 'swriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(9, 'wnriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n                            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(10, 'neriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"neriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(11, 'eswriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"eswriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/eswriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(12, 'swnriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swnriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(13, 'wneriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wneriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wneriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(14, 'nesriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nesriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nesriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(-1, 'autoriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"autoriver.gif\" class=\"design\" src=\"https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/autoriver.png?raw=true\"\n                            border=\"type=image\" style=\"width:16px; height: 16px;\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">Road</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(15, 'hroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(16, 'vroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(17, 'croad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"croad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/croad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(18, 'esroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"esroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/esroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(19, 'swroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(20, 'wnroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(21, 'neroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"neroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n                            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(22, 'eswroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"eswroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/eswroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(23, 'swnroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swnroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(24, 'wneroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wneroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wneroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(25, 'nesroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nesroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nesroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(-2, 'autoroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"autoroad.gif\" class=\"design\" src=\"https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/autoroad.png?raw=true\"\n                            border=\"type=image\" style=\"width:16px; height: 16px;\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(26, 'hbridge.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hbridge.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(27, 'vbridge.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vbridge.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 1px;\">Ocean</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(28, 'sea.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"sea.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/sea.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(33, 'reef.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"reef.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/reef.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(29, 'shoal41.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal41.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal41.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(30, 'shoal67.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal67.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal67.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(31, 'shoal49.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal49.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal49.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(32, 'shoal43.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal43.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal43.png\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">Pipe</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(101, 'vpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(102, 'hpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(103, 'nepipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nepipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nepipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(104, 'espipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"espipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/espipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(105, 'swpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(106, 'wnpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(107, 'npipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"npipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/npipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(108, 'epipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"epipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/epipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(109, 'spipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"spipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/spipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(110, 'wpipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wpipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wpipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(113, 'hpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpipeseam.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpipeseam.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(114, 'vpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpipeseam.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpipeseam.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(115, 'hpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpiperubble.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpiperubble.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(116, 'vpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpiperubble.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpiperubble.gif\" border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>");
        var innerBuildingTable = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
        innerBuildingTable.innerHTML = "<b style=\"padding-left: 2px;\"> Preowned</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(42, 'hq.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"hq.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/orangestarhq.gif\"\n                        style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(40, 'airport.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"airport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarairport.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(39, 'base.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"base.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarbase.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(38, 'city.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"city.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarcity.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(134, 'comtower.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"comtower.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarcomtower.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(146, 'lab.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"lab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarlab.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(41, 'port.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"port.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarport.gif\"\n                        border=\"type=image\"></a>\n            </td>\n        </tr>\n        </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Neutral</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\"><a\n                    href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"missilesilo.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/missilesilo.gif\" style=\"margin: auto 2px;\"\n                        border=\"type=image\"></a></td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(36, 'neutralairport.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralairport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralairport.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(35, 'neutralbase.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralbase.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralbase.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(34, 'neutralcity.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralcity.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcity.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(133, 'neutralcomtower.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralcomtower.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcomtower.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(145, 'neutrallab.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutrallab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutrallab.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(37, 'neutralport.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralport.gif\" border=\"type=image\"></a>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Country</b>\n<table>\n    <tbody>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oslogo.gif\"\n                    onclick=\"changeCountry('os', 'orangestar' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bmlogo.gif\" onclick=\"changeCountry('bm', 'bluemoon'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gelogo.gif\"\n                    onclick=\"changeCountry('ge', 'greenearth' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/yclogo.gif\"\n                    onclick=\"changeCountry('yc', 'yellowcomet' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bhlogo.gif\" onclick=\"changeCountry('bh', 'blackhole'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/rflogo.gif\" onclick=\"changeCountry('rf', 'redfire'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gslogo.gif\" onclick=\"changeCountry('gs', 'greysky'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bdlogo.gif\"\n                    onclick=\"changeCountry('bd', 'browndesert' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ablogo.gif\"\n                    onclick=\"changeCountry('ab', 'amberblaze' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/jslogo.gif\" onclick=\"changeCountry('js', 'jadesun'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/cilogo.gif\" onclick=\"changeCountry('ci', 'cobaltice'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pclogo.gif\"\n                    onclick=\"changeCountry('pc', 'pinkcosmos' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/tglogo.gif\"\n                    onclick=\"changeCountry('tg', 'tealgalaxy' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pllogo.gif\"\n                    onclick=\"changeCountry('pl', 'purplelightning' );\" style=\"vertical-align: middle; margin-left:\n                    0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/arlogo.gif\" onclick=\"changeCountry('ar', 'acidrain'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnlogo.gif\" onclick=\"changeCountry('wn', 'whitenova'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n    </tbody>\n</table>");
        var containerTable = document.getElementById("design-map-misc-controls").childNodes[1];
        var countryDisplay = document.getElementById("current-country");
        countryDisplay.setAttribute("style", "display: none;");
        containerTable.style.width = "175";
    }
    function createMapScript() {
        var innerCreateMapTable = Object.values(document.querySelectorAll("form")).filter(function (f) { return f.name === "" && f.action === "https://awbw.amarriner.com/design.php" && f.className !== "login-form"; })[0].parentElement;
        innerCreateMapTable.innerHTML = "<form name=\"\" create1=\"\" action=\"design.php\" method=\"post\">\n    <table cellspacing=\"1\" cellpadding=\"2\">\n        <tbody>\n            <tr>\n                <td>Map Name:</td>\n                <td><input type=\"text\" id=\"create_map_name\" class=\"text\" name=\"maps_name\" maxlength=\"100\" style=\"padding-left: 3px;\"></td>\n            </tr>\n            <tr>\n                <td style=\"text-align: right;\">Width:</td>\n                <td>\n                    <input class=\"text\" name=\"maps_width\" min=\"5\" max=\"50\" value=\"20\" type=\"number\" style=\"width: 32%; padding-left: 3px;\">\n                </td>\n            </tr>\n            <tr>\n                <td style=\"text-align: right;\">Height:</td>\n                <td>\n                    <input class=\"text\" name=\"maps_height\" min=\"5\" max=\"50\" value=\"20\" type=\"number\" style=\"width: 32%; padding-left: 3px;\">\n                </td>\n            </tr>\n            <tr>\n                <td></td>\n                <td><input type=\"submit\" class=\"submit\" value=\"Submit\"></td>\n            </tr>\n        </tbody>\n    </table>\n    <input type=\"hidden\" name=\"maps_new\" value=\"1\">\n</form>";
        function onMapCreate(e) {
            return __awaiter(this, void 0, void 0, function () {
                var width, height, mapString, mapName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            width = parseInt(document.getElementsByName("maps_width")[0].value);
                            height = parseInt(document.getElementsByName("maps_height")[0].value);
                            if (!(height > 36 || width > 36)) return [3 /*break*/, 2];
                            e.preventDefault();
                            mapString = "28,";
                            mapString = mapString.repeat(width);
                            mapString = Utils.trimCharEnd(mapString, ',');
                            mapString += "\n";
                            mapString = mapString.repeat(height);
                            mapString = Utils.trimCharEnd(mapString, '\n');
                            mapName = document.getElementById("create_map_name").value;
                            return [4 /*yield*/, GlobalFunctions.uploadMap(mapName, mapString)];
                        case 1:
                            _a.sent();
                            window.location.href = "https://awbw.amarriner.com/design.php";
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
        var form = innerCreateMapTable.querySelector("form");
        form.onsubmit = onMapCreate;
    }
    function clickThroughScript() {
        for (var b = 0; b <= mapheight; b++) {
            for (var a = 0; a <= mapwidth; a++) {
                var x = a.toString();
                if (a < 10) {
                    x = '0' + a;
                }
                var y = b.toString();
                if (b < 10) {
                    y = '0' + b;
                }
                var squareSpan = document.getElementById("square".concat(x).concat(y));
                squareSpan.style.pointerEvents = "none";
                var onClickString = "javascript:" + squareSpan.querySelector("img").onclick.toString().split('\n')[1].split(';')[0] + ";";
                var newA = document.createElement("a");
                newA.setAttribute("style", "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block; outline: 0;");
                newA.setAttribute("href", onClickString);
                squareSpan.appendChild(newA);
                squareSpan.style.borderLeft = "";
                squareSpan.style.borderTop = "";
                squareSpan.style.borderBottom = "";
                squareSpan.style.borderRight = "";
            }
        }
        oldupdate = function (square, hidden, x, y, thetop) {
            //close menus
            closeMenu(terrainTable);
            closeMenu(countryTable);
            closeMenu(buildingTable);
            closeMenu(unitTable);
            if (symndx < 0) {
                GlobalFunctions.placeAutoTile(symndx, x, y);
                return;
            }
            var tx = x.toString();
            if (parseInt(tx) < 10) {
                tx = "0" + x;
            }
            var ty = y.toString();
            if (parseInt(ty) < 10) {
                ty = "0" + y;
            }
            if (type == "terrain" || type == "building" || type == "neutral") {
                square = "square" + tx + ty;
                hidden = "hidden" + tx + ty;
                var theNode = document.getElementById(square);
                var theHiddenNode = document.getElementById(hidden);
                theNode.style.pointerEvents = "none";
                theNode.style.borderLeft = "";
                theNode.style.borderTop = "";
                theNode.style.borderBottom = "";
                theNode.style.borderRight = "";
                for (var i = theNode.childNodes.length - 1; i >= 0; i--) {
                    theNode.removeChild(theNode.childNodes[i]);
                }
                //add link
                var newhref = document.createElement("a");
                var newDiv = document.createElement("a");
                newDiv.setAttribute("style", "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block; outline: 0;");
                newDiv.setAttribute("href", "javascript:update('".concat(square, "','").concat(hidden, "',").concat(x, ",").concat(y, ",").concat(thetop, ");"));
                //add image
                var newimg = document.createElement("img");
                if (type == "terrain") {
                    var imgLink = "terrain/".concat(theme, "/") + images[symndx];
                }
                else if (type == "building" || type == "neutral") {
                    var imgLink = "terrain/".concat(theme, "/") + images[symndx];
                }
                newimg.src = imgLink;
                newimg.setAttribute("border", "none");
                theNode.appendChild(newhref);
                theNode.firstChild.appendChild(newimg);
                theNode.appendChild(newDiv);
                theNode.style.top = (thetop + tops[curndx]).toString();
                //create hidden node
                theHiddenNode.setAttribute("value", x + "," + y + "," + terrain[symndx]);
            }
            if (type == "unit" || type == "delete") {
                square = "unit" + tx + ty;
                hidden = "hidden" + tx + ty;
                var unit = "units_id" + tx + ty;
                var codeid = "code" + tx + ty;
                theNode = document.getElementById(square);
                var theUnitNode = document.getElementById(unit);
                var theCodeNode = document.getElementById(codeid);
                for (i = theNode.childNodes.length - 1; i >= 0; i--) {
                    theNode.removeChild(theNode.childNodes[i]);
                }
                newhref = document.createElement("a");
                newhref.setAttribute("href", "javascript:update('".concat(square, "', ").concat(hidden, ", ").concat(x, ", ").concat(y, ", ").concat(thetop, ")"));
                theNode.appendChild(newhref);
                if (type != "delete") {
                    newimg = document.createElement("img");
                    newimg.setAttribute("src", "terrain/".concat(theme, "/") + code + units_img[curndx]);
                    newimg.setAttribute("border", "0");
                    theNode.firstChild.appendChild(newimg);
                    newimg.classList.add("predeployed-unit-img");
                    if (!curndx) {
                        theNode.style.top = (thetop + tops[1]).toString();
                    }
                    else {
                        theNode.style.top = (thetop + tops[curndx]).toString();
                    }
                    theUnitNode.setAttribute("value", x + "," + y + "," + units[curndx]);
                    theCodeNode.setAttribute("value", x + "," + y + "," + code);
                }
                else {
                    theUnitNode.setAttribute("value", "");
                    theCodeNode.setAttribute("value", "");
                }
            }
        };
        function fixBorder() {
            var gmContainer = document.getElementById("gamemap-container");
            gmContainer.style.border = "3px solid black";
        }
        fixBorder();
    }
    function symmetryCheckerScript() {
        var mapObj = [];
        var innerSymm = Object.values(document.getElementsByClassName("norm")).filter(function (n) { return n.textContent.includes("Symm:"); })[0];
        var badge = document.createElement("b");
        badge.setAttribute("style", "width: 20px; line-height: 20px; border-radius: 50%; color: #fff; text-align: center; background: red; display: none; aspect-ratio: 1/1; padding-left: 0px; margin-left: 1px; vertical-align: middle; cursor: default;");
        badge.setAttribute("id", "symm-badge");
        badge.setAttribute("title", "");
        innerSymm.appendChild(badge);
        var check = document.createElement("b");
        check.setAttribute("style", "color: green; font-size: 17px; vertical-align: middle; padding-right: 1px; display: none; cursor: default;");
        check.setAttribute("id", "symm-check");
        check.setAttribute("title", "Map is symmetrical");
        check.textContent = "✓";
        innerSymm.appendChild(check);
        function getPointsFromSymmetry(x, y) {
            var points = [];
            var fx = mapwidth - x;
            var fy = mapheight - y;
            var stype = document.getElementById('set-symmetry').value;
            // Rotate 2Q
            if (stype == "4") {
                points.push(new Point(fx, fy));
            }
            // Rotate 4Q
            if (stype == "6") {
                points.push(new Point(fx, fy));
                points.push(new Point(y, fx));
                points.push(new Point(fy, x));
            }
            // Flip X
            if (stype == "3") {
                points.push(new Point(fx, y));
            }
            // Flip Y
            if (stype == "5") {
                points.push(new Point(x, fy));
            }
            // Diagonal X
            if (stype == "1") {
                points.push(new Point(y, x));
            }
            // Diagonal Y
            if (stype == "2") {
                points.push(new Point(fy, fx));
            }
            // Flip 4Q
            if (stype == "7") {
                points.push(new Point(fx, fy));
                points.push(new Point(fx, y));
                points.push(new Point(x, fy));
            }
            return points;
        }
        function fillMapObj() {
            mapObj = [];
            for (var b = 0; b <= mapheight; b++) {
                var mapRow = [];
                for (var a = 0; a <= mapwidth; a++) {
                    var x = a.toString();
                    if (a < 10) {
                        x = '0' + a;
                    }
                    var y = b.toString();
                    if (b < 10) {
                        y = '0' + b;
                    }
                    var squareSrc = document.getElementById("square".concat(x).concat(y)).querySelector("img").src;
                    squareSrc = squareSrc.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/(aw1|aw2|ani)\/)[\w\.]+/)[0];
                    if (squareSrc.includes("road."))
                        squareSrc = "road";
                    if (squareSrc.includes("river."))
                        squareSrc = "river";
                    if (squareSrc.includes("bridge."))
                        squareSrc = "bridge";
                    if (squareSrc.includes("pipe."))
                        squareSrc = "pipe";
                    if (squareSrc.includes("pipeseam."))
                        squareSrc = "pipeseam";
                    if (squareSrc.includes("piperubble."))
                        squareSrc = "piperubble";
                    if (squareSrc.includes("pipeend."))
                        squareSrc = "pipeend";
                    if (squareSrc.includes("shoal"))
                        squareSrc = "shoal";
                    if (squareSrc.match(/(?<!neutral)city\./))
                        squareSrc = "ownedcity";
                    if (squareSrc.match(/(?<!neutral)base\./))
                        squareSrc = "ownedbase";
                    if (squareSrc.match(/(?<!neutral|air)port\./))
                        squareSrc = "ownedport";
                    if (squareSrc.match(/(?<!neutral)airport\./))
                        squareSrc = "ownedairport";
                    if (squareSrc.match(/(?<!neutral)hq\./))
                        squareSrc = "ownedhq";
                    if (squareSrc.match(/(?<!neutral)comtower\./))
                        squareSrc = "ownedcomtower";
                    if (squareSrc.match(/(?<!neutral)lab\./))
                        squareSrc = "ownedlab";
                    mapRow.push(squareSrc);
                }
                mapObj.push(mapRow);
            }
        }
        function getTile(x, y) {
            return mapObj[y][x];
        }
        var Point = /** @class */ (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Point.prototype.equals = function (other) {
                return this.x == other.x && this.y == other.y;
            };
            return Point;
        }());
        function getAsymmetries() {
            var asymms = [];
            var stype = parseInt(document.getElementById('set-symmetry').value);
            var skipCoords = [];
            if (stype === 0) {
                return null;
            }
            for (var y = 0; y <= mapheight; y++) {
                for (var x = 0; x <= mapwidth; x++) {
                    if (skipCoords.some(function (p) { return p.equals(new Point(x, y)); })) {
                        continue;
                    }
                    var symms = getPointsFromSymmetry(x, y);
                    if (stype >= 1 && stype <= 5) {
                        var symm = symms[0];
                        var id = getTile(x, y);
                        var id2 = getTile(symm.x, symm.y);
                        skipCoords.push(symm);
                        if (id !== id2) {
                            asymms.push([new Point(x, y), new Point(symm.x, symm.y)]);
                        }
                    }
                    else {
                        var id = getTile(x, y);
                        var id2 = getTile(symms[0].x, symms[0].y);
                        var id3 = getTile(symms[1].x, symms[1].y);
                        var id4 = getTile(symms[2].x, symms[2].y);
                        skipCoords.push(symms[0], symms[1], symms[2]);
                        if (id !== id2 || id !== id3 || id !== id4) {
                            asymms.push([new Point(x, y), new Point(symms[0].x, symms[0].y), new Point(symms[1].x, symms[1].y), new Point(symms[2].x, symms[2].y)]);
                        }
                    }
                }
            }
            return asymms;
        }
        function displayAsymms() {
            var symmBadge = document.getElementById("symm-badge");
            var symmCheck = document.getElementById("symm-check");
            var asymms = getAsymmetries();
            if (asymms == null) {
                symmBadge.style.display = "none";
                symmCheck.style.display = "none";
            }
            else if (asymms.length === 0) {
                symmBadge.style.display = "none";
                symmCheck.style.display = "inline";
            }
            else if (asymms[0].length === 2) {
                symmBadge.style.display = "inline-block";
                symmCheck.style.display = "none";
                symmBadge.textContent = (asymms.length > 9 ? "9+" : asymms.length).toString();
                var titleString = "Map is asymmetrical:";
                for (var i = 0; i < Math.min(asymms.length, 9); i++) {
                    var a = asymms[i];
                    titleString += '\n' + "Asymmetry at (".concat(a[0].x, ", ").concat(a[0].y, ") and (").concat(a[1].x, ", ").concat(a[1].y, ")");
                }
                if (asymms.length > 9) {
                    titleString += '\n' + "...and ".concat(asymms.length - 9, " more");
                }
                symmBadge.title = titleString;
            }
            else {
                symmBadge.style.display = "inline-block";
                symmCheck.style.display = "none";
                symmBadge.textContent = (asymms.length > 9 ? "9+" : asymms.length).toString();
                var titleString = "Map is asymmetrical:";
                for (var i = 0; i < Math.min(asymms.length, 9); i++) {
                    var a = asymms[i];
                    titleString += '\n' + "Asymmetry at (".concat(a[0].x, ", ").concat(a[0].y, "), (").concat(a[1].x, ", ").concat(a[1].y, "), (").concat(a[2].x, ", ").concat(a[2].y, "), and (").concat(a[3].x, ", ").concat(a[3].y, ")");
                }
                if (asymms.length > 9) {
                    titleString += '\n' + "...and ".concat(asymms.length - 9, " more");
                }
                symmBadge.title = titleString;
            }
        }
        function checkLoop() {
            fillMapObj();
            displayAsymms();
        }
        setInterval(checkLoop, 2000);
    }
    function uploadMapScript() {
        var trow = document.createElement("tr");
        trow.innerHTML = "<td style=\"vertical-align: top;\">\nMap Data:\n</td>\n<td>\n<textarea wrap=\"off\" style=\"width: 80%; height: 400px; resize: none;\"></textarea>\n</td>";
        var textArea = trow.querySelector("textarea");
        var mapName = document.getElementsByName("name")[0];
        var overwriteMap = document.getElementsByName("overwrite")[0];
        var tbody = document.getElementsByClassName("borderwhite")[0].children[0].children[0];
        tbody.insertBefore(trow, tbody.lastElementChild);
        tbody.deleteRow(2);
        tbody.deleteRow(0);
        var submitButton = document.getElementsByClassName("submit")[0];
        submitButton.setAttribute("type", "button");
        function onMapSubmit() {
            return __awaiter(this, void 0, void 0, function () {
                var response, html;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, GlobalFunctions.overwriteMap(mapName.value, overwriteMap.value, textArea.value)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            html = _a.sent();
                            document.body.innerHTML = html;
                            setTimeout(function () { return window.location.href = "https://awbw.amarriner.com/design.php"; }, 1000);
                            return [2 /*return*/];
                    }
                });
            });
        }
        submitButton.onclick = onMapSubmit;
    }
    function hotkeysScript() {
        var hotkeys = [];
        var Hotkey = /** @class */ (function () {
            function Hotkey(key, downFunc, upFunc) {
                this.key = key;
                this.downFunc = downFunc;
                this.upFunc = upFunc;
            }
            return Hotkey;
        }());
        function onKeyDown(e) {
            if (e.repeat) {
                return;
            }
            for (var i = 0; i < hotkeys.length; i++) {
                if (hotkeys[i].key === e.key) {
                    hotkeys[i].downFunc();
                }
            }
        }
        function onKeyUp(e) {
            if (e.repeat) {
                return;
            }
            for (var i = 0; i < hotkeys.length; i++) {
                if (hotkeys[i].key === e.key) {
                    hotkeys[i].upFunc();
                }
            }
        }
        window.onkeydown = onKeyDown;
        window.onkeyup = onKeyUp;
        function addHotkey(key, downFunc, upFunc) {
            hotkeys.push(new Hotkey(key, downFunc, upFunc));
        }
        addHotkey("a", function () { if (!terrainVisible)
            showBaseTerrain(); }, function () { if (terrainVisible)
            showBaseTerrain(); });
        addHotkey("s", function () { if (!buildingVisible)
            showBuildings(); }, function () { if (buildingVisible)
            showBuildings(); });
        addHotkey("d", function () { if (!unitVisible)
            showUnits(); }, function () { if (unitVisible)
            showUnits(); });
        addHotkey("f", function () { return changeSquare(-1, "delete-image", "delete"); }, Function.prototype);
        addHotkey("1", function () { return changeCountry("os", "orangestar"); }, Function.prototype);
        addHotkey("2", function () { return changeCountry("bm", "bluemoon"); }, Function.prototype);
        addHotkey("3", function () { return changeCountry("ge", "greenearth"); }, Function.prototype);
        addHotkey("4", function () { return changeCountry("yc", "yellowcomet"); }, Function.prototype);
        addHotkey("5", function () { return changeCountry("bh", "blackhole"); }, Function.prototype);
        addHotkey("6", function () { return changeCountry("rf", "redfire"); }, Function.prototype);
        addHotkey("7", function () { return changeCountry("gs", "greysky"); }, Function.prototype);
        addHotkey("8", function () { return changeCountry("bd", "browndesert"); }, Function.prototype);
        addHotkey("!", function () { return changeCountry("ab", "amberblaze"); }, Function.prototype);
        addHotkey("@", function () { return changeCountry("js", "jadesun"); }, Function.prototype);
        addHotkey("#", function () { return changeCountry("ci", "cobaltice"); }, Function.prototype);
        addHotkey("$", function () { return changeCountry("pc", "pinkcosmos"); }, Function.prototype);
        addHotkey("%", function () { return changeCountry("tg", "tealgalaxy"); }, Function.prototype);
        addHotkey("^", function () { return changeCountry("pl", "purplelightning"); }, Function.prototype);
        addHotkey("&", function () { return changeCountry("ar", "acidrain"); }, Function.prototype);
        addHotkey("*", function () { return changeCountry("wn", "whitenova"); }, Function.prototype);
        addHotkey("Control", function () {
            var selectSymm = document.getElementById("set-symmetry");
            var selectedSymm = parseInt(selectSymm.value);
            if (selectedSymm === 0) {
                selectSymm.value = lastSymmetry.toString();
                lastSymmetry = 0;
            }
            else {
                lastSymmetry = selectedSymm;
                selectSymm.value = "0";
            }
        }, Function.prototype);
        document.getElementById("current-terrain").setAttribute("title", "Select base terrain (A)");
        document.getElementById("current-building").setAttribute("title", "Select building (S)");
        document.getElementById("current-unit").setAttribute("title", "Select unit (D)");
        document.getElementById("delete-unit").setAttribute("title", "Delete unit (F)");
    }
    function previewScript() {
        var saveButton = Object.values(document.getElementsByClassName("norm")).filter(function (e) { return e.textContent.includes("Save"); })[0];
        var previewButtonElement = document.createElement("td");
        var previewOn = false;
        var previewButtonDisabled = false;
        previewButtonElement.innerHTML = "<a class=\"norm2\" id=\"preview_button\" href=\"#\" style=\"display:block; height: 100%;\">\n<span class=\"small_text\" style=\"line-height:29px; display: block; vertical-align: middle;\" title=\"Toggle Preview Mode\">\n<img style=\"vertical-align: middle;\" src=\"terrain/editmap.gif\">\n<b style=\"vertical-align:middle;\">Preview</b>\n</span></a>";
        previewButtonElement.setAttribute("class", "norm");
        previewButtonElement.setAttribute("style", "border-left: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
        previewButtonElement.setAttribute("height", "30");
        saveButton.parentElement.appendChild(previewButtonElement);
        var previewButton = document.getElementById("preview_button");
        function setPreviewButton(enabled, text) {
            if (enabled) {
                previewButtonDisabled = false;
                previewButton.parentElement.style.removeProperty("background-color");
                previewButton.style.cursor = "pointer";
            }
            else {
                previewButtonDisabled = true;
                previewButton.parentElement.style.backgroundColor = "silver";
                previewButton.style.cursor = "default";
            }
            previewButton.querySelector("b").textContent = text;
        }
        function previewToggled(e) {
            if (previewButtonDisabled) {
                return;
            }
            previewOn = !previewOn;
            if (previewOn) {
                setPreviewButton(false, "Preview");
                var mapLink_1 = document.getElementById("design-map-name").childNodes[0].href;
                mapLink_1 = mapLink_1.replace("editmap.php", "prevmaps.php");
                var autosaveCheckbox = document.getElementById("autosave_checkbox");
                if (autosaveCheckbox.checked) {
                    $.ajax({
                        method: "POST",
                        url: "updatemap.php",
                        contentType: "application/x-www-form-urlencoded",
                        data: $('#map_form').serialize()
                    }).then(function () {
                        $.ajax({
                            method: "GET",
                            url: mapLink_1,
                            contentType: "text/html; charset=UTF-8",
                            cache: false,
                            success: function (data) {
                                var doc = new DOMParser().parseFromString(data, "text/html");
                                var html = doc.getElementById("gamemap").innerHTML;
                                var gamemapContainer = document.getElementById("gamemap-container");
                                var gamemap = document.getElementById("gamemap");
                                previewElement = document.createElement("div");
                                previewElement.innerHTML = html;
                                previewElement.setAttribute("style", "scale: ".concat(localStorage.getItem("scale"), "; height: 0.5%; pointer-events: none;"));
                                var mapBackground = Object.values(previewElement.childNodes).find(function (c) { return c.id === "map-background"; });
                                mapBackground.src = mapBackground.src += "?" + Date.now();
                                gamemapContainer.appendChild(previewElement);
                                gamemap.style.display = "none";
                                setPreviewButton(true, "Edit");
                            },
                            error: function () {
                                previewOn = false;
                                alert("An error has occurred while trying to get the map preview. Please make sure you are connected to the internet.");
                                setPreviewButton(true, "Preview");
                            }
                        });
                    });
                }
                else {
                    $.ajax({
                        method: "GET",
                        url: mapLink_1,
                        contentType: "text/html; charset=UTF-8",
                        cache: false,
                        success: function (data) {
                            var doc = new DOMParser().parseFromString(data, "text/html");
                            var html = doc.getElementById("gamemap").innerHTML;
                            var gamemapContainer = document.getElementById("gamemap-container");
                            var gamemap = document.getElementById("gamemap");
                            previewElement = document.createElement("div");
                            previewElement.innerHTML = html;
                            previewElement.setAttribute("style", "scale: ".concat(localStorage.getItem("scale"), "; height: 0.5%; pointer-events: none;"));
                            var mapBackground = Object.values(previewElement.childNodes).find(function (c) { return c.id === "map-background"; });
                            mapBackground.src = mapBackground.src += "?" + Date.now();
                            gamemapContainer.appendChild(previewElement);
                            gamemap.style.display = "none";
                            setPreviewButton(true, "Edit");
                        },
                        error: function () {
                            previewOn = false;
                            alert("An error has occurred while trying to get the map preview. Please make sure you are connected to the internet.");
                            setPreviewButton(true, "Preview");
                        }
                    });
                }
            }
            else {
                setPreviewButton(true, "Preview");
                var gamemapContainer = document.getElementById("gamemap-container");
                var gamemap_1 = document.getElementById("gamemap");
                gamemap_1.style.removeProperty("display");
                gamemapContainer.removeChild(previewElement);
            }
        }
        previewButton.onclick = previewToggled;
    }
    function fixCacheScript() {
        var mapBackground = document.getElementById("map-background");
        mapBackground.src = mapBackground.src + "?" + Date.now();
    }
    function mapResizeScript() {
        var main = document.getElementById("main");
        var tables = Object.values(main.children).filter(function (e) { return e.style.width === "900px"; });
        var tableRows = tables.map(function (t) { return t.children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0]; });
        var mapNames = {};
        tableRows.forEach(function (tr) {
            var mapPreviewButton = document.createElement("td");
            mapPreviewButton.setAttribute("class", "norm");
            mapPreviewButton.setAttribute("style", "text-align:left; padding-left: 4px; padding-bottom: 3px;");
            mapPreviewButton.setAttribute("width", "125");
            mapPreviewButton.setAttribute("height", "35");
            mapPreviewButton.setAttribute("class", "norm");
            mapPreviewButton.innerHTML = "<span class=\"small_text\" title=\"Resize this design map\">\n<a class=\"norm2\" style=\"display:block;color: #000000;text-decoration: none;font-weight: normal;cursor: pointer;\">\n<img style=\"vertical-align:middle;\" src=\"terrain/zoomin.gif\">\n<b style=\"padding-right: 3px; vertical-align:middle;\">Resize Map</b>\n</a></span>";
            tr.appendChild(mapPreviewButton);
            var mapID = mapPreviewButton.parentElement.children[0].children[0].children[0].href.match(/(?<=https:\/\/awbw\.amarriner\.com\/editmap\.php\?maps_id=)\d+/)[0];
            mapNames[mapID] = tr.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].children[0].textContent;
            mapPreviewButton.setAttribute("mapid", mapID);
            mapPreviewButton.querySelector("a").onclick = function () { return onResizeMapClick(mapID, mapNames); };
        });
        function onResizeMapClick(mapID, mapNames) {
            var resizePrompt = document.createElement("div");
            resizePrompt.setAttribute("style", "position: fixed; left: 50vw; top: 50vh; margin-top: -7%; margin-left: -8%; z-index: 1;");
            resizePrompt.setAttribute("id", "resize_prompt");
            resizePrompt.innerHTML = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr>\n<td class=\"bordertitle\" height=\"20\"><b>Resize Map</b></td></tr><tr>\n<td class=\"borderwhite\" style=\"padding-top: 3px;\">\n<form name=\"\" style=\"padding-left: 2px; padding-right: 2px; margin-bottom: 5px;\">\n<table cellspacing=\"1\" cellpadding=\"2\"><tbody><tr><td><b>X Axis:</b></td></tr><tr><td>\n<select class=\"select_left\">\n<option value=\"Expand\">Expand</option>\n<option value=\"Shrink\">Shrink</option></select></td>\n<td>left by</td><td>\n<input class=\"text input_left\" min=\"0\" max=\"20\" value=\"0\" type=\"number\" style=\" padding-left: 3px; width: 50px;\"></td>\n<td>tile(s)</td></tr>\n<tr><td>\n<select class=\"select_right\">\n<option value=\"Expand\">Expand</option>\n<option value=\"Shrink\">Shrink</option></select></td>\n<td>right by</td><td>\n<input class=\"text input_right\" min=\"0\" max=\"20\" value=\"0\" type=\"number\" style=\" padding-left: 3px; width: 50px;\"></td>\n<td>tile(s)</td></tr><tr><td><b>Y Axis:</b></td></tr><tr><td><select  class=\"select_top\">\n<option value=\"Expand\">Expand</option>\n<option value=\"Shrink\">Shrink</option></select></td><td>top by</td><td>\n<input class=\"text input_top\" min=\"0\" max=\"20\" value=\"0\" type=\"number\" style=\" padding-left: 3px;width: 50px;\"></td>\n<td>tile(s)</td></tr>\n<tr><td><select class=\"select_bottom\">\n<option value=\"Expand\">Expand</option>\n<option value=\"Shrink\">Shrink</option></select></td><td>bottom by</td><td>\n<input class=\"text input_bottom\" min=\"0\" max=\"20\" value=\"0\" type=\"number\" style=\" padding-left: 3px;width: 50px;\"></td>\n<td>tile(s)</td></tr>\n<tr>\n<td style=\"\"><input style=\"margin-top: 5px;width: 50px;\" class=\"submit\" type=\"button\" value=\"Resize\"></td></tr><tr>\n<td style=\"\"><input style=\"margin-top: 5px;width: 50px;\" class=\"submit\" type=\"button\" value=\"Cancel\"></td></tr>\n</tbody></tbody></table></form></td></tr></tbody></table>";
            document.getElementById("main").appendChild(resizePrompt);
            resizePrompt.getElementsByClassName("submit")[0].onclick = function () { return onResize(mapID, mapNames); };
            resizePrompt.getElementsByClassName("submit")[1].onclick = onResizeCancel;
            var darkFilter = document.createElement("div");
            darkFilter.setAttribute("style", "width: 100vw;height: 100vh;background-color: #00000050;position: fixed;top: 0vh;left: 0vw;");
            darkFilter.setAttribute("id", "dark_filter");
            document.getElementById("main").appendChild(darkFilter);
        }
        function onResize(mapID, mapNames) {
            var resizePrompt = document.getElementById("resize_prompt");
            if (!confirm("Are you sure you want to resize \"".concat(mapNames[mapID], "\"? Resizing a map will remove all predeployed units from it."))) {
                resizePrompt.parentElement.removeChild(document.getElementById("resize_prompt"));
                document.getElementById("dark_filter").parentElement.removeChild(document.getElementById("dark_filter"));
                return;
            }
            var topInput = resizePrompt.getElementsByClassName("input_top")[0];
            var bottomInput = resizePrompt.getElementsByClassName("input_bottom")[0];
            var leftInput = resizePrompt.getElementsByClassName("input_left")[0];
            var rightInput = resizePrompt.getElementsByClassName("input_right")[0];
            if (!topInput.validity.valid || !bottomInput.validity.valid || !leftInput.validity.valid || !rightInput.validity.valid) {
                topInput.reportValidity();
                bottomInput.reportValidity();
                leftInput.reportValidity();
                rightInput.reportValidity();
                return;
            }
            resizePrompt.parentElement.removeChild(document.getElementById("resize_prompt"));
            document.getElementById("dark_filter").parentElement.removeChild(document.getElementById("dark_filter"));
            var top = parseInt(topInput.value);
            var bottom = parseInt(bottomInput.value);
            var left = parseInt(leftInput.value);
            var right = parseInt(rightInput.value);
            var topExpand = resizePrompt.getElementsByClassName("select_top")[0].value === "Expand";
            var bottomExpand = resizePrompt.getElementsByClassName("select_bottom")[0].value === "Expand";
            var leftExpand = resizePrompt.getElementsByClassName("select_left")[0].value === "Expand";
            var rightExpand = resizePrompt.getElementsByClassName("select_right")[0].value === "Expand";
            function resizeMap(mapData) {
                var mapLines = mapData.split('\n').map(function (l) { return Utils.trimCharEnd(l, '\n'); });
                var mapWidth = mapLines[0].split(',').length;
                var mapHeight = mapLines.length;
                var tile = "28,";
                var tileRaw = "28";
                function getChange(change, mode) {
                    if (mode)
                        return change;
                    else
                        return -change;
                }
                var newHeight = mapHeight + getChange(top, topExpand) + getChange(bottom, bottomExpand);
                var newWidth = mapWidth + getChange(left, leftExpand) + getChange(right, rightExpand);
                if (newHeight > 50 || newHeight < 5 || newWidth > 50 || newWidth < 5) {
                    return "";
                }
                var index = 0;
                mapLines.forEach(function (mapLine) {
                    var lineArray = mapLine.split(',');
                    if (left != 0) {
                        if (leftExpand) {
                            for (var i = 0; i < left; i++) {
                                lineArray.unshift(tileRaw);
                            }
                        }
                        else {
                            lineArray = lineArray.slice(left);
                        }
                    }
                    if (right != 0) {
                        if (rightExpand) {
                            for (var i = 0; i < right; i++) {
                                lineArray.push(tileRaw);
                            }
                        }
                        else {
                            lineArray = lineArray.slice(0, lineArray.length - right);
                        }
                    }
                    mapLines[index] = Utils.trimCharEnd(lineArray.join(','), ',');
                    index++;
                });
                if (top != 0) {
                    if (topExpand) {
                        for (var i = 0; i < top; i++) {
                            mapLines.unshift(Utils.trimCharEnd(tile.repeat(newWidth), ","));
                        }
                    }
                    else {
                        mapLines = mapLines.slice(top);
                    }
                }
                if (bottom != 0) {
                    if (bottomExpand) {
                        for (var i = 0; i < bottom; i++) {
                            mapLines.push(Utils.trimCharEnd(tile.repeat(newWidth), ","));
                        }
                    }
                    else {
                        mapLines = mapLines.slice(0, mapLines.length - bottom);
                    }
                }
                return mapLines.join('\n');
            }
            $.ajax({
                method: "GET",
                url: "https://awbw.amarriner.com/text_map.php?maps_id=".concat(mapID),
                contentType: "text/html; charset=UTF-8",
                cache: false,
                success: function (data) {
                    var doc = new DOMParser().parseFromString(data, "text/html");
                    var mapData = doc.getElementById("main").children[0].children[0].children[1].children[0].children[0].textContent.replace(/\n\n/g, "\n").trim();
                    console.log(mapData);
                    var resizedMapData = resizeMap(mapData);
                    if (resizedMapData === "") {
                        alert("Resize canceled. Resizing map would give it an invalid size.");
                        return;
                    }
                    fetch("/uploadmap.php", {
                        method: "POST",
                        body: "-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"action\"\n\nUPLOAD\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"mapfile\"; filename=\"data.txt\"\nContent-Type: text/plain\n\n".concat(resizedMapData, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"name\"\n\n").concat(mapNames[mapID], "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"format\"\n\nAWBW\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"overwrite\"\n\n").concat(mapID, "\n-----------------------------216783749517670898471830319234--"),
                        headers: {
                            "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                        }
                    }).then(function () {
                        window.location.href = "https://awbw.amarriner.com/design.php#map_".concat(mapID);
                        var mapPreview = Object.values(document.querySelectorAll("img")).find(function (i) { return i.src === "https://awbw.amarriner.com/smallmaps/".concat(mapID, ".png"); });
                        mapPreview.src = mapPreview.src + "?" + Date.now();
                    });
                },
                error: function () {
                    alert("An error has occurred. Please make sure you are connected to the internet.");
                }
            });
        }
        function onResizeCancel() {
            document.getElementById("resize_prompt").parentElement.removeChild(document.getElementById("resize_prompt"));
            document.getElementById("dark_filter").parentElement.removeChild(document.getElementById("dark_filter"));
        }
    }
    function autoTileScript() {
        function getTile(x, y) {
            if (x < 0 || y < 0 || x > mapwidth || y > mapheight) {
                return "";
            }
            var xid = x.toString();
            if (x < 10) {
                xid = '0' + x;
            }
            var yid = y.toString();
            if (y < 10) {
                yid = '0' + y;
            }
            var squareSrc = document.getElementById("square".concat(xid).concat(yid)).querySelector("img").src;
            squareSrc = squareSrc.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/(aw1|aw2|ani)\/)[\w\.]+/)[0];
            return squareSrc;
        }
        function placeTile(tile, x, y) {
            var square = "square".concat(x.toString().padStart(2, "0")).concat(y.toString().padStart(2, "0"));
            var hidden = "hidden".concat(x.toString().padStart(2, "0")).concat(y.toString().padStart(2, "0"));
            var top = y * 16;
            var oldCurndx = curndx;
            var oldSymndx = symndx;
            curndx = tile;
            symndx = tile;
            oldupdate(square, hidden, x, y, top);
            curndx = oldCurndx;
            symndx = oldSymndx;
        }
        function setTileAuto(tileset, tileName, altTileName, x, y) {
            var up = getTile(x, y - 1).includes(tileName) || getTile(x, y - 1).includes(altTileName);
            var down = getTile(x, y + 1).includes(tileName) || getTile(x, y + 1).includes(altTileName);
            var left = getTile(x - 1, y).includes(tileName) || getTile(x - 1, y).includes(altTileName);
            var right = getTile(x + 1, y).includes(tileName) || getTile(x + 1, y).includes(altTileName);
            if (up && down && left && right) {
                placeTile(tileset[2], x, y);
            }
            else if (left && right && down) {
                placeTile(tileset[7], x, y);
            }
            else if (left && up && down) {
                placeTile(tileset[8], x, y);
            }
            else if (left && right && up) {
                placeTile(tileset[9], x, y);
            }
            else if (up && right && down) {
                placeTile(tileset[10], x, y);
            }
            else if (right && down) {
                placeTile(tileset[3], x, y);
            }
            else if (left && down) {
                placeTile(tileset[4], x, y);
            }
            else if (left && up) {
                placeTile(tileset[5], x, y);
            }
            else if (right && up) {
                placeTile(tileset[6], x, y);
            }
            else if (right || left) {
                placeTile(tileset[0], x, y);
            }
            else if (up || down) {
                placeTile(tileset[1], x, y);
            }
            else if (y === 0 || y === mapheight) {
                placeTile(tileset[1], x, y);
            }
            else {
                placeTile(tileset[0], x, y);
            }
        }
        GlobalFunctions.placeAutoTile = function (autotile, x, y) {
            if (autotile === -1) {
                var riverTileset = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
                setTileAuto(riverTileset, "river.", null, x, y);
                if (getTile(x + 1, y).includes("river.")) {
                    setTileAuto(riverTileset, "river.", null, x + 1, y);
                }
                if (getTile(x - 1, y).includes("river.")) {
                    setTileAuto(riverTileset, "river.", null, x - 1, y);
                }
                if (getTile(x, y + 1).includes("river.")) {
                    setTileAuto(riverTileset, "river.", null, x, y + 1);
                }
                if (getTile(x, y - 1).includes("river.")) {
                    setTileAuto(riverTileset, "river.", null, x, y - 1);
                }
            }
            else if (autotile === -2) {
                var roadTileset = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                setTileAuto(roadTileset, "road.", "bridge.", x, y);
                if (getTile(x + 1, y).includes("road.")) {
                    setTileAuto(roadTileset, "road.", "bridge.", x + 1, y);
                }
                if (getTile(x - 1, y).includes("road.")) {
                    setTileAuto(roadTileset, "road.", "bridge.", x - 1, y);
                }
                if (getTile(x, y + 1).includes("road.")) {
                    setTileAuto(roadTileset, "road.", "bridge.", x, y + 1);
                }
                if (getTile(x, y - 1).includes("road.")) {
                    setTileAuto(roadTileset, "road.", "bridge.", x, y - 1);
                }
            }
        };
        changeSquare = function (id, terrain_name, t) {
            curndx = id;
            //remove highlight from previous image
            theNode = document.getElementById(oldterrain);
            theNode.style.border = 'solid 2px transparent';
            //set variables
            oldterrain = terrain_name;
            type = t;
            //remove highlight from all menus
            theNode = terrainImage;
            theNode.style.border = 'solid 2px transparent';
            theNode = buildingImage;
            theNode.style.border = 'solid 2px transparent';
            theNode = unitImage;
            theNode.style.border = 'solid 2px transparent';
            theNode = deleteImage;
            theNode.style.border = 'solid 2px transparent';
            //highlight selected tile (in menu)
            theNode = document.getElementById(terrain_name);
            theNode.style.border = 'solid 2px rgba(9, 159, 226, 0.6)';
            //change menu image & highlight
            if (type == 'terrain') {
                theNode = terrainImage;
            }
            if (type == 'building' || type == 'neutral') {
                theNode = buildingImage;
            }
            if (type == 'unit') {
                theNode = unitImage;
            }
            if (type == 'delete') {
                theNode = deleteImage;
            }
            if (type !== 'delete') {
                if (terrain_name.startsWith('auto')) {
                    theNode.src = "https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/".concat(terrain_name.split('.')[0], ".png?raw=true");
                    theNode.style.width = "16px";
                }
                else if (type == 'terrain') {
                    theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + terrain_name;
                }
                else if (type == 'building') {
                    theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + country + terrain_name;
                }
                else if (type == 'neutral') {
                    theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + terrain_name;
                }
                else if (type == 'unit') {
                    theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + code + terrain_name;
                }
            }
            else {
                closeMenu(terrainTable);
                closeMenu(countryTable);
                closeMenu(buildingTable);
                closeMenu(unitTable);
            }
            theNode.style.border = 'solid 2px rgba(9, 159, 226, 0.6)';
            if (type == 'delete') {
                gamemap.style.cursor = "url(https://awbw.amarriner.com/terrain/delete_cursor.gif), auto";
            }
            else {
                gamemap.style.cursor = 'pointer';
            }
        };
        showBaseTerrain = function () {
            if (!terrainVisible) {
                var elLeft = getOffset(currentTerrain).left, elTop = getOffset(currentTerrain).top;
                var containerLeft = getOffset(gameContainer).left, containerTop = getOffset(gameContainer).top;
                //show dropdown
                applyCSS(terrainTable, {
                    left: (elLeft - containerLeft - 10) + "px",
                    top: (elTop - containerTop + 45) + "px",
                    visibility: 'visible'
                });
                terrainVisible = 1;
                //hide other dropdowns
                if (countryVisible) {
                    closeMenu(countryTable);
                }
                if (buildingVisible) {
                    closeMenu(buildingTable);
                }
                if (unitVisible) {
                    closeMenu(unitTable);
                }
                //change square
                terrain_name = terrainImage.src;
                if (terrain_name.startsWith("https://github.com/TheGamerASD")) {
                    terrain_name = terrain_name.replace('https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/', '');
                    terrain_name = terrain_name.replace('?raw=true', '');
                    terrain_name = terrain_name.replace('png', 'gif');
                }
                else {
                    terrain_name = terrain_name.replace("terrain/".concat(theme, "/"), '');
                    terrain_name = terrain_name.replace('https://awbw.amarriner.com/', '');
                }
                for (var c = 1; c <= images.length; c++) {
                    if (images[c] == terrain_name) {
                        id = c;
                        break;
                    }
                }
                changeSquare(id, terrain_name, 'terrain');
            }
            else {
                closeMenu(terrainTable);
                terrainVisible = 0;
            }
        };
        update = function (square, hidden, x, y, thetop) {
            symndx = curndx;
            oldupdate(square, hidden, x, y, thetop);
            var tx = x.toString();
            var ty = y.toString();
            var fx = mapwidth - x;
            var fy = mapheight - y;
            var tfx = (mapwidth - x).toString();
            var tfy = (mapheight - y).toString();
            if (x < 10) {
                tx = '0' + x;
            }
            if (y < 10) {
                ty = '0' + y;
            }
            if (fx < 10) {
                tfx = '0' + (mapwidth - x);
            }
            if (fy < 10) {
                tfy = '0' + (mapheight - y);
            }
            var stype = parseInt(document.getElementById('set-symmetry').value);
            if (stype >= 6 || stype == 0 || curndx < 0) {
                symndx = curndx;
            }
            else {
                symndx = symmetry[curndx][stype];
            }
            //2-quad rotation
            if (stype == 4) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tfx + tfy, 'hidden' + tfx + tfy, fx, fy, fy * 16);
                }
            }
            //4-quad rotation
            if (stype == 6) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tfx + tfy, 'hidden' + tfx + tfy, fx, fy, fy * 16);
                    oldupdate('square' + ty + tfx, 'hidden' + ty + tfx, y, fx, fx * 16);
                    oldupdate('square' + tfy + tx, 'hidden' + tfy + tx, fy, x, x * 16);
                }
            }
            //horizontal flip
            if (stype == 3) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tfx + ty, 'hidden' + tfx + ty, fx, y, y * 16);
                }
            }
            //vertical flip
            if (stype == 5) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tx + tfy, 'hidden' + tx + tfy, x, fy, fy * 16);
                }
            }
            //diagonal L->R flip
            if (stype == 1) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + ty + tx, 'hidden' + ty + tx, y, x, x * 16);
                }
            }
            //diagonal R->L flip
            if (stype == 2) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tfy + tfx, 'hidden' + tfy + tfx, fy, fx, fx * 16);
                }
            }
            //horizontal + vertical flip (4-quadrant)
            if (stype == 7) {
                if (type == 'terrain' || type == 'building' || type == 'neutral') {
                    oldupdate('square' + tfx + tfy, 'hidden' + tfx + tfy, fx, fy, fy * 16);
                    oldupdate('square' + tfx + ty, 'hidden' + tfx + ty, fx, y, y * 16);
                    oldupdate('square' + tx + tfy, 'hidden' + tx + tfy, x, fy, fy * 16);
                }
            }
        };
    }
    function linkFixScript() {
        document.querySelectorAll("a").forEach(function (a) { return a.style.outline = "0"; });
    }
    ModuleManager.registerModule(setGlobals, Pages.All);
    ModuleManager.registerModule(autosaveScript, Pages.MapEditor);
    ModuleManager.registerModule(infoPanelScript, Pages.MapEditor);
    ModuleManager.registerModule(asyncSaveScript, Pages.MapEditor);
    ModuleManager.registerModule(unitSelectScript, Pages.MapEditor);
    ModuleManager.registerModule(terrainSelectScript, Pages.MapEditor);
    ModuleManager.registerModule(clickThroughScript, Pages.MapEditor);
    ModuleManager.registerModule(symmetryCheckerScript, Pages.MapEditor);
    ModuleManager.registerModule(hotkeysScript, Pages.MapEditor);
    ModuleManager.registerModule(previewScript, Pages.MapEditor);
    ModuleManager.registerModule(createMapScript, Pages.YourMaps);
    ModuleManager.registerModule(mapResizeScript, Pages.YourMaps);
    ModuleManager.registerModule(uploadMapScript, Pages.UploadMap);
    ModuleManager.registerModule(fixCacheScript, Pages.PreviewMap);
    ModuleManager.registerModule(autoTileScript, Pages.MapEditor);
    ModuleManager.registerModule(linkFixScript, Pages.MapEditor);
    ModuleManager.runModules();
})();
