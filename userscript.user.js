// ==UserScript==
// @name         AWBW Design Maps Improved
// @version      1.1
// @description  Improves the AWBW mapmaking experience.
// @author       TheGamerASD
// @match        https://awbw.amarriner.com/editmap.php?maps_id=*
// @match        https://awbw.amarriner.com/design.php*
// @match        https://awbw.amarriner.com/uploadmap.php*
// @icon         https://cdn.discordapp.com/emojis/929147036677324800.webp?size=96&quality=lossless
// @grant        none
// ==/UserScript==
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
                        console.log(error);
                    }
                }
            }
        };
        ModuleManager.modules = [];
        return ModuleManager;
    }());
    function setGlobalVariables() {
        if (window.location.href.startsWith(Pages.MapEditor)) {
            theme = document.getElementById("current-building").querySelector("img").src.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/)\w+/)[0];
            lastSymmetry = 0;
        }
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
                intervalID = setInterval(saveAsync, 20 * 1000);
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
        var gmCont = document.getElementById("gamemap-container");
        function getTiles(name) {
            return (gmCont.innerHTML.match(new RegExp(name, "g")) || []).length.toString();
        }
        var infoPanel = document.createElement("div");
        infoPanel.innerHTML = "<table cellpadding'2'='' style='background-color: #EEEEEE; border: 1px solid #AAAAAA; ' cellspacing='0'>\n<tbody><tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/".concat(theme, "/neutralcity.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='cities'>6</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralbase.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='bases'>5</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/plain.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='plains'>5</span></b></td>\n<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/mountain.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='mountains'>5</span></b></td>\n</tr>\n<tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralport.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='ports'>1</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralairport.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='airports'>2</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/vroad.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='roads'>2</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/vriver.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='rivers'>2</span></b></td>\n</tr>\n<tr>\n<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcomtower.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='towers'>3</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/neutrallab.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='labs'>1</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/wood.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='forests'>1</span></b></td>\n<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/").concat(theme, "/sea.gif'></td>\n<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='seas'>1</span></b></td>\n</tr>\n</tbody></table>");
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
        function updateInfo() {
            cities.textContent = getTiles("city\\.");
            bases.textContent = getTiles("base\\.");
            ports.textContent = getTiles("(?<!air)port\\.");
            airports.textContent = getTiles("airport\\.");
            towers.textContent = getTiles("comtower\\.");
            labs.textContent = getTiles("lab\\.");
            plains.textContent = getTiles("plain\\.");
            roads.textContent = getTiles("(road\\.|bridge\\.)");
            forests.textContent = getTiles("wood\\.");
            mountains.textContent = getTiles("mountain\\.");
            rivers.textContent = getTiles("river\\.");
            seas.textContent = getTiles("(sea\\.|reef\\.)");
        }
        setInterval(updateInfo, 500);
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
        innerTerrainTable.innerHTML = "<b style=\"padding-left: 2px;\">Basic</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(1, 'plain.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"plain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/plain.gif\"\n                            style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(3, 'wood.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wood.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wood.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(112, 'missilesiloempty.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"missilesiloempty.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/missilesiloempty.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(2, 'mountain.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"mountain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/mountain.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">River</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(4, 'hriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(5, 'vriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(6, 'criver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"criver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/criver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(7, 'esriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"esriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/esriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(8, 'swriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(9, 'wnriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n                            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(10, 'neriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"neriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(11, 'eswriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"eswriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/eswriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(12, 'swnriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swnriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(13, 'wneriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wneriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wneriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(14, 'nesriver.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nesriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nesriver.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">Road</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(15, 'hroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(16, 'vroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(17, 'croad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"croad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/croad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(18, 'esroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"esroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/esroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(19, 'swroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(20, 'wnroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(21, 'neroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"neroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n                            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(22, 'eswroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"eswroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/eswroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(23, 'swnroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swnroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(24, 'wneroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wneroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wneroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(25, 'nesroad.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nesroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nesroad.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(26, 'hbridge.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hbridge.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(27, 'vbridge.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vbridge.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 1px;\">Ocean</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(28, 'sea.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"sea.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/sea.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(33, 'reef.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"reef.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/reef.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(29, 'shoal41.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal41.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal41.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(30, 'shoal67.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal67.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal67.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(31, 'shoal49.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal49.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal49.png\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(32, 'shoal43.png', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"shoal43.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/shoal43.png\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <b style=\"padding-left: 2px;\">Pipe</b>\n    <table>\n        <tbody>\n            <tr>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(101, 'vpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(102, 'hpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(103, 'nepipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"nepipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/nepipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(104, 'espipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"espipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/espipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(105, 'swpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"swpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/swpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(106, 'wnpipe.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wnpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnpipe.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(107, 'npipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"npipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/npipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n            </tr>\n            <tr>\n            <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(108, 'epipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"epipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/epipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(109, 'spipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"spipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/spipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(110, 'wpipeend.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"wpipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wpipeend.gif\"\n                            border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(113, 'hpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpipeseam.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpipeseam.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(114, 'vpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpipeseam.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpipeseam.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(115, 'hpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"hpiperubble.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/hpiperubble.gif\" border=\"type=image\"></a>\n                </td>\n                <td class=\"bordergrey\">\n                    <a href=\"javascript:changeSquare(116, 'vpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">\n                        <img id=\"vpiperubble.gif\" class=\"design\"\n                            src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/vpiperubble.gif\" border=\"type=image\"></a>\n                </td>\n            </tr>\n        </tbody>\n    </table>");
        var innerBuildingTable = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
        innerBuildingTable.innerHTML = "<b style=\"padding-left: 2px;\"> Preowned</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(42, 'hq.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"hq.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/".concat(theme, "/orangestarhq.gif\"\n                        style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(40, 'airport.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"airport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarairport.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(39, 'base.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"base.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarbase.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(38, 'city.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"city.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarcity.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(134, 'comtower.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"comtower.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarcomtower.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(146, 'lab.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"lab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarlab.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(41, 'port.gif', 'building'); closeMenu(buildingTable);\">\n                    <img id=\"port.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/orangestarport.gif\"\n                        border=\"type=image\"></a>\n            </td>\n        </tr>\n        </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Neutral</b>\n<table>\n    <tbody>\n        <tr>\n            <td class=\"bordergrey\"><a\n                    href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"missilesilo.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/missilesilo.gif\" style=\"margin: auto 2px;\"\n                        border=\"type=image\"></a></td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(36, 'neutralairport.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralairport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralairport.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(35, 'neutralbase.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralbase.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralbase.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(34, 'neutralcity.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralcity.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcity.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(133, 'neutralcomtower.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralcomtower.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralcomtower.gif\" border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(145, 'neutrallab.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutrallab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutrallab.gif\"\n                        border=\"type=image\"></a>\n            </td>\n            <td class=\"bordergrey\">\n                <a href=\"javascript:changeSquare(37, 'neutralport.gif', 'neutral'); closeMenu(buildingTable);\">\n                    <img id=\"neutralport.gif\" class=\"design\"\n                        src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/neutralport.gif\" border=\"type=image\"></a>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<b style=\"padding-left: 2px;\">Country</b>\n<table>\n    <tbody>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/oslogo.gif\"\n                    onclick=\"changeCountry('os', 'orangestar' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bmlogo.gif\" onclick=\"changeCountry('bm', 'bluemoon'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gelogo.gif\"\n                    onclick=\"changeCountry('ge', 'greenearth' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/yclogo.gif\"\n                    onclick=\"changeCountry('yc', 'yellowcomet' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bhlogo.gif\" onclick=\"changeCountry('bh', 'blackhole'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/rflogo.gif\" onclick=\"changeCountry('rf', 'redfire'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/gslogo.gif\" onclick=\"changeCountry('gs', 'greysky'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/bdlogo.gif\"\n                    onclick=\"changeCountry('bd', 'browndesert' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/ablogo.gif\"\n                    onclick=\"changeCountry('ab', 'amberblaze' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/jslogo.gif\" onclick=\"changeCountry('js', 'jadesun'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/cilogo.gif\" onclick=\"changeCountry('ci', 'cobaltice'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pclogo.gif\"\n                    onclick=\"changeCountry('pc', 'pinkcosmos' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/tglogo.gif\"\n                    onclick=\"changeCountry('tg', 'tealgalaxy' );\" style=\"vertical-align: middle; margin-left: 0px;\n                    margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/pllogo.gif\"\n                    onclick=\"changeCountry('pl', 'purplelightning' );\" style=\"vertical-align: middle; margin-left:\n                    0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/arlogo.gif\" onclick=\"changeCountry('ar', 'acidrain'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n            <td>\n                <img src=\"https://awbw.amarriner.com/terrain/").concat(theme, "/wnlogo.gif\" onclick=\"changeCountry('wn', 'whitenova'\n                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">\n            </td>\n        </tr>\n    </tbody>\n</table>");
        var containerTable = document.getElementById("design-map-misc-controls").childNodes[1];
        var countryDisplay = document.getElementById("current-country");
        countryDisplay.setAttribute("style", "display: none;");
        containerTable.style.width = "175";
    }
    function createMapScript() {
        var innerCreateMapTable = Object.values(document.querySelectorAll("form")).filter(function (f) { return f.name === "" && f.action === "https://awbw.amarriner.com/design.php" && f.className !== "login-form"; })[0].parentElement;
        innerCreateMapTable.innerHTML = "<form name=\"\" create1=\"\" action=\"design.php\" method=\"post\">\n    <table cellspacing=\"1\" cellpadding=\"2\">\n        <tbody>\n            <tr>\n                <td>Map Name:</td>\n                <td><input type=\"text\" class=\"text\" name=\"maps_name\" maxlength=\"100\" style=\"padding-left: 3px;\"></td>\n            </tr>\n            <tr>\n                <td style=\"text-align: right;\">Width:</td>\n                <td>\n                    <input class=\"text\" name=\"maps_width\" min=\"5\" max=\"36\" value=\"20\" type=\"number\" style=\"width: 32%; padding-left: 3px;\">\n                </td>\n            </tr>\n            <tr>\n                <td style=\"text-align: right;\">Height:</td>\n                <td>\n                    <input class=\"text\" name=\"maps_height\" min=\"5\" max=\"36\" value=\"20\" type=\"number\" style=\"width: 32%; padding-left: 3px;\">\n                </td>\n            </tr>\n            <tr>\n                <td></td>\n                <td><input type=\"submit\" class=\"submit\" value=\"Submit\"></td>\n            </tr>\n        </tbody>\n    </table>\n    <input type=\"hidden\" name=\"maps_new\" value=\"1\">\n</form>";
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
                newA.setAttribute("style", "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block;");
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
                newDiv.setAttribute("style", "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block;");
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
                theNode.style.top = thetop + tops[curndx];
                //create hidden node
                theHiddenNode.setAttribute("value", x + "," + y + "," + terrain[symndx]);
            }
            if (type == "unit" || type == "delete") {
                square = "unit" + tx + ty;
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
                        theNode.style.top = thetop + tops[1];
                    }
                    else {
                        theNode.style.top = thetop + tops[curndx];
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
            fetch("/uploadmap.php", {
                method: "POST",
                body: "-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"action\"\n\nUPLOAD\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"mapfile\"; filename=\"data.txt\"\nContent-Type: text/plain\n\n".concat(textArea.value, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"name\"\n\n").concat(mapName.value, "\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"format\"\n\nAWBW\n-----------------------------216783749517670898471830319234\nContent-Disposition: form-data; name=\"overwrite\"\n\n").concat(overwriteMap.value, "\n-----------------------------216783749517670898471830319234--"),
                headers: {
                    "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                }
            }).then(function (html) {
                html.text().then(function (text) {
                    document.body.innerHTML = text;
                    setTimeout(function () { return window.location.href = "https://awbw.amarriner.com/design.php"; }, 1500);
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
        previewButtonElement.innerHTML = "<a class=\"norm2\" href=\"#\" style=\"display:block; height: 100%; cursor: default;\">\n<span class=\"small_text\" style=\"line-height:29px; display: block; vertical-align: middle;\" title=\"Toggle Preview Mode\">\n<img style=\"vertical-align: middle;\" src=\"terrain/editmap.gif\">\n<b style=\"vertical-align:middle;\">Preview</b>\n<input type=\"checkbox\" id=\"preview_checkbox\" style=\"vertical-align: middle; cursor: pointer;\">\n</span></a>";
        previewButtonElement.setAttribute("class", "norm");
        previewButtonElement.setAttribute("style", "border-left: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
        previewButtonElement.setAttribute("height", "30");
        saveButton.parentElement.appendChild(previewButtonElement);
        var previewCheckbox = document.getElementById("preview_checkbox");
        function previewCheckboxToggled(e) {
            if (previewCheckbox.checked) {
                previewCheckbox.disabled = true;
                var mapLink = document.getElementById("design-map-name").childNodes[0].href;
                mapLink = mapLink.replace("editmap.php", "prevmaps.php");
                var autosaveCheckbox = document.getElementById("autosave_checkbox");
                if (autosaveCheckbox.checked) {
                    $.ajax({
                        method: "POST",
                        url: "updatemap.php",
                        contentType: "application/x-www-form-urlencoded",
                        data: $('#map_form').serialize()
                    });
                }
                $.ajax({
                    method: "GET",
                    url: mapLink,
                    contentType: "text/html; charset=UTF-8",
                    cache: false,
                    success: function (data) {
                        var doc = new DOMParser().parseFromString(data, "text/html");
                        var html = doc.getElementById("gamemap").innerHTML;
                        var gamemapContainer = document.getElementById("gamemap-container");
                        var gamemap = document.getElementById("gamemap");
                        previewElement = document.createElement("div");
                        previewElement.innerHTML = html;
                        previewElement.setAttribute("style", "scale: ".concat(localStorage.getItem("scale"), "; height: 0.5%"));
                        var mapBackground = Object.values(previewElement.childNodes).find(function (c) { return c.id === "map-background"; });
                        mapBackground.src = mapBackground.src += "?" + Date.now();
                        gamemap.style.display = "none";
                        gamemapContainer.appendChild(previewElement);
                        previewCheckbox.disabled = false;
                    },
                    error: function () {
                        alert("An error has occurred while trying to get the map preview. Please make sure you are connected to the internet.");
                        previewCheckbox.disabled = false;
                    }
                });
            }
            else {
                var gamemapContainer = document.getElementById("gamemap-container");
                var gamemap = document.getElementById("gamemap");
                gamemapContainer.removeChild(previewElement);
                gamemap.style.removeProperty("display");
            }
        }
        previewCheckbox.onchange = previewCheckboxToggled;
    }
    function fixCacheScript() {
        var mapBackground = document.getElementById("map-background");
        mapBackground.src = mapBackground.src + "?" + Date.now();
    }
    ModuleManager.registerModule(setGlobalVariables, Pages.All);
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
    ModuleManager.registerModule(uploadMapScript, Pages.UploadMap);
    ModuleManager.registerModule(fixCacheScript, Pages.PreviewMap);
    ModuleManager.runModules();
})();
