// ==UserScript==
// @name         AWBW Design Maps Improved
// @version      1.3.2
// @description  Improves the AWBW mapmaking experience.
// @author       TheGamerASD
// @match        https://awbw.amarriner.com/*
// @icon         https://cdn.discordapp.com/emojis/929147036677324800.webp?size=96&quality=lossless
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var theme: string;
    var lastSymmetry: number;
    var previewElement: HTMLDivElement;

    enum Pages {
        All = "https://awbw.amarriner.com",
        YourMaps = "https://awbw.amarriner.com/design.php",
        MapEditor = "https://awbw.amarriner.com/editmap.php?maps_id=",
        UploadMap = "https://awbw.amarriner.com/uploadmap.php",
        PreviewMap = "https://awbw.amarriner.com/prevmaps.php?maps_id="
    }

    class Module {
        public func: Function;
        public page: string;

        constructor(func: Function, page: Pages) {
            this.func = func;
            this.page = page;
        }
    }

    abstract class ModuleManager {
        private static modules: Module[] = [];

        public static registerModule(func: Function, page: Pages) {
            this.modules.push(new Module(func, page));
        }

        public static runModules() {
            for (let module of this.modules) {
                if (window.location.href.startsWith(module.page)) {
                    try {
                        module.func();
                    }
                    catch (error) {
                        console.warn(`Error occurred in module '${module.func.name}': ` + error);
                    }
                }
            }
        }
    }

    let GlobalFunctions: { [name: string]: Function } = {};

    abstract class Utils {
        public static trimCharEnd(string: string, char: string) {
            let start: number = 0;
            let end: number = string.length;

            while (end > start && string[end - 1] === char)
                --end;

            return (start > 0 || end < string.length) ? string.substring(start, end) : string;
        }
    }

    function setGlobals() {
        if (window.location.href.startsWith(Pages.MapEditor)) {
            theme = document.getElementById("current-building").querySelector("img").src.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/)\w+/)[0];
            lastSymmetry = 0;
            window.terrain_name = "";
            window.id = 0;
        }

        GlobalFunctions.uploadMap = async (mapName: string, mapData: string): Promise<Response> => {
            return await fetch("/uploadmap.php",
                {
                    method: "POST",

                    body: `-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="action"

UPLOAD
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="mapfile"; filename="data.txt"
Content-Type: text/plain

${mapData}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="name"

${mapName}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="format"

AWBW
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="overwrite"

new
-----------------------------216783749517670898471830319234--`,
                    headers:
                    {
                        "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                    }
                });
        }

        GlobalFunctions.overwriteMap = async (mapName: string, overwriteID: string, mapData: string): Promise<Response> => {
            return await fetch("/uploadmap.php",
                {
                    method: "POST",

                    body: `-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="action"

UPLOAD
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="mapfile"; filename="data.txt"
Content-Type: text/plain

${mapData}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="name"

${mapName}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="format"

AWBW
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="overwrite"

${overwriteID}
-----------------------------216783749517670898471830319234--`,
                    headers:
                    {
                        "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                    }
                });
        }
    }

    function autosaveScript() {
        'use strict';

        var intervalID: number;
        var previousState: boolean = false;
        var checked: boolean = false;

        function saveAsync() {
            $.ajax({
                method: "POST",
                url: "updatemap.php",
                contentType: "application/x-www-form-urlencoded",
                data: $('#map_form').serialize(),
            });
        }

        function autosaveCheckboxToggled() {
            checked = (document.getElementById("autosave_checkbox") as HTMLInputElement).checked;

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

        function onLeavePage(e: Event): undefined {
            if (checked) {
                $.ajax({
                    method: "POST",
                    url: "updatemap.php",
                    contentType: "application/x-www-form-urlencoded",
                    data: $('#map_form').serialize(),
                    async: false,
                });
            }
            return undefined;
        }

        var saveButton = Object.values(document.getElementsByClassName("norm")).filter(e => e.textContent.includes("Save"))[0];

        saveButton.parentElement.innerHTML += `<td class=\"norm\" style=\"border-left: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;\" height=\"30\"><a class=\"norm2\" href=\"#\" style=\"display:block; height: 100%; cursor: default;\">
<span class=\"small_text\" title=\"Toggle Autosave\" style=\"line-height:29px; display: block; vertical-align: middle;\">
<img src=\"terrain/savemap.gif\" style=\"vertical-align: middle;\">
<b style=\"vertical-align:middle;\">Auto</b>
<input type=\"checkbox\" id=\"autosave_checkbox\" style=\"vertical-align: middle; cursor: pointer;\"></input>
</span></a>
</td>`;

        setInterval(autosaveCheckboxToggled, 200);

        window.onbeforeunload = onLeavePage;
    }

    function infoPanelScript() {
        'use strict';

        var gmCont = document.getElementById("gamemap");
        var html: string;

        function getTiles(name: string): number {
            return (html.match(new RegExp(name, "g")) || []).length;
        }

        var infoPanel = document.createElement("div");
        infoPanel.innerHTML = `<table cellpadding'2'='' style='background-color: #EEEEEE; border: 1px solid #AAAAAA; ' cellspacing='0'>
<tbody><tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralcity.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='cities'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutralbase.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='bases'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/plain.gif' style='position: relative;top: 3px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='plains'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/mountain.gif' style='position: relative;top: 1px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='mountains'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/coin.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='money' style="padding-right: 2px;">0</span></b></td>
</tr>
<tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralport.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='ports'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutralairport.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='airports'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/vroad.gif' style='position: relative;top: 3px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='roads'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/vriver.gif' style='position: relative;top: 1px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='rivers'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/moneycountry.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='moneycountry' style="padding-right: 2px;">0</span></b></td>
</tr>
<tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralcomtower.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='towers'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutrallab.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='labs'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/wood.gif' style='position: relative;top: 3px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='forests'>0</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/sea.gif' style='position: relative;top: 1px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='seas'>0</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/moneybase.png?raw=true' style='position: relative;top: 3px;width: 16px;'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='moneybase' style="padding-right: 2px;">0</span></b></td>
</tr>
</tbody></table>`;
        document.getElementById("gamecontainer").appendChild(infoPanel);

        var cities: HTMLElement = document.getElementById("cities");
        var bases: HTMLElement = document.getElementById("bases");
        var ports: HTMLElement = document.getElementById("ports");
        var airports: HTMLElement = document.getElementById("airports");
        var towers: HTMLElement = document.getElementById("towers");
        var labs: HTMLElement = document.getElementById("labs");
        var plains: HTMLElement = document.getElementById("plains");
        var roads: HTMLElement = document.getElementById("roads");
        var forests: HTMLElement = document.getElementById("forests");
        var mountains: HTMLElement = document.getElementById("mountains");
        var rivers: HTMLElement = document.getElementById("rivers");
        var seas: HTMLElement = document.getElementById("seas");
        var money: HTMLElement = document.getElementById("money");
        var moneycountry: HTMLElement = document.getElementById("moneycountry");
        var moneybase: HTMLElement = document.getElementById("moneybase");

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
            let hqs: number = getTiles("hq\\.");
            let totalIncome: number = parseInt(bases.textContent) + parseInt(ports.textContent) + parseInt(airports.textContent) + parseInt(cities.textContent) + hqs;
            let countries: number = 0;
            if (hqs === 0) {
                if (labs.textContent !== "0") {
                    if (getTiles("orangestarlab\\.") > 0) countries++;
                    if (getTiles("bluemoonlab\\.") > 0) countries++;
                    if (getTiles("greenearthlab\\.") > 0) countries++;
                    if (getTiles("yellowcometlab\\.") > 0) countries++;
                    if (getTiles("blackholelab\\.") > 0) countries++;
                    if (getTiles("redfirelab\\.") > 0) countries++;
                    if (getTiles("greyskylab\\.") > 0) countries++;
                    if (getTiles("browndesertlab\\.") > 0) countries++;
                    if (getTiles("amberblazelab\\.") > 0) countries++;
                    if (getTiles("jadesunlab\\.") > 0) countries++;
                    if (getTiles("cobalticelab\\.") > 0) countries++;
                    if (getTiles("pinkcosmoslab\\.") > 0) countries++;
                    if (getTiles("tealgalaxylab\\.") > 0) countries++;
                    if (getTiles("purplelightninglab\\.") > 0) countries++;
                    if (getTiles("acidrainlab\\.") > 0) countries++;
                    if (getTiles("whitenovalab\\.") > 0) countries++;
                }
            }
            else {
                if (getTiles("orangestarhq\\.") > 0) countries++;
                if (getTiles("bluemoonhq\\.") > 0) countries++;
                if (getTiles("greenearthhq\\.") > 0) countries++;
                if (getTiles("yellowcomethq\\.") > 0) countries++;
                if (getTiles("blackholehq\\.") > 0) countries++;
                if (getTiles("redfirehq\\.") > 0) countries++;
                if (getTiles("greyskyhq\\.") > 0) countries++;
                if (getTiles("browndeserthq\\.") > 0) countries++;
                if (getTiles("amberblazehq\\.") > 0) countries++;
                if (getTiles("jadesunhq\\.") > 0) countries++;
                if (getTiles("cobalticehq\\.") > 0) countries++;
                if (getTiles("pinkcosmoshq\\.") > 0) countries++;
                if (getTiles("tealgalaxyhq\\.") > 0) countries++;
                if (getTiles("purplelightninghq\\.") > 0) countries++;
                if (getTiles("acidrainhq\\.") > 0) countries++;
                if (getTiles("whitenovahq\\.") > 0) countries++;
            }
            money.textContent = totalIncome.toString() + "k ";
            let moneyPerCountry: number = Math.round(totalIncome / countries * 100) / 100;
            moneycountry.textContent = isFinite(moneyPerCountry) ? moneyPerCountry.toString() + "k " : "0k ";
            let moneyPerBase: number = Math.round(totalIncome / parseInt(bases.textContent) * 100) / 100
            moneybase.textContent = isFinite(moneyPerBase) ? moneyPerBase.toString() + "k " : "0k ";
        }

        setInterval(updateInfo, 400);
    }

    function asyncSaveScript() {
        var saveButton: HTMLElement = Object.values(document.getElementsByClassName("norm2")).filter(e => e.textContent.includes("Save"))[0] as HTMLElement;
        var saveButtonText: HTMLElement = Object.values(document.getElementsByTagName("B")).filter(b => b.textContent === "Save")[0] as HTMLElement;

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

        function onSuccess(res: any): void {
            saveButton.parentElement.setAttribute("style", "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
            saveButton.setAttribute("style", "display: block; height: 100%;");
            saveButtonText.textContent = "Save";
        }

        function onError(res: any): void {
            saveButton.parentElement.setAttribute("style", "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
            saveButton.setAttribute("style", "display: block; height: 100%;");
            saveButtonText.textContent = "Save";

            alert("An error has occurred while trying to save. Please make sure you are connected to the internet.");
        }

        saveButton.setAttribute("href", "#");
        saveButton.onclick = saveAsync;
    }

    function unitSelectScript() {
        var innerUnitTable = document.getElementById("design-map-unit-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0] as HTMLElement;
        innerUnitTable.innerHTML = `<b style=\"padding-left: 2px;\">Land</b>
<table>
    <tbody>
        <tr>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(0, 'infantry.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"infantry.gif\" src=\"https://awbw.amarriner.com/terrain/${theme}/osinfantry.gif\"
                        style=\"display: block; margin: auto;\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(1, 'mech.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"mech.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osmech.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(2, 'recon.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"recon.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osrecon.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(6, 'tank.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"tank.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/ostank.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(4, 'apc.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"apc.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osapc.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(8, 'anti-air.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"anti-air.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osanti-air.gif\" border=\"0\"></a>
            </td>
        </tr>
        <tr>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(5, 'artillery.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"artillery.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osartillery.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(12, 'rocket.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"rocket.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osrocket.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(10, 'missile.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"missile.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osmissile.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(13, 'md.tank.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"md.tank.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osmd.tank.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(18, 'neotank.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"neotank.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osneotank.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(23, 'megatank.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"megatank.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osmegatank.gif\" border=\"0\"></a>
            </td>
        </tr>
        <tr>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(16, 'piperunner.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"piperunner.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/ospiperunner.gif\" border=\"0\"></a>
            </td>
        </tr>
    </tbody>
</table>
<b style=\"padding-left: 2px;\">Air</b>
<table>
    <tbody>
        <tr>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(3, 't-copter.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"t-copter.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/ost-copter.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(9, 'b-copter.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"b-copter.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osb-copter.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(15, 'fighter.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"fighter.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osfighter.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(19, 'bomber.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"bomber.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osbomber.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(20, 'stealth.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"stealth.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osstealth.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(21, 'blackbomb.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"blackbomb.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osblackbomb.gif\" border=\"0\"></a>
            </td>
        </tr>
    </tbody>
</table>
<b style=\"padding-left: 1px;\">Naval</b>
<table>
    <tbody>
        <tr>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(7, 'blackboat.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"blackboat.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osblackboat.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(11, 'lander.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"lander.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/oslander.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(14, 'cruiser.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"cruiser.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/oscruiser.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(17, 'sub.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"sub.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/ossub.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(22, 'battleship.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"battleship.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/osbattleship.gif\" border=\"0\"></a>
            </td>
            <td class=\"bordergrey\" style=\"vertical-align: middle;\">
                <a href=\"javascript: changeSquare(24, 'carrier.gif' , 'unit' ); closeMenu(unitTable);\">
                    <img id=\"carrier.gif\" style=\"display: block; margin: auto;\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/oscarrier.gif\" border=\"0\"></a>
            </td>
        </tr>
    </tbody>
</table>
<b style=\"padding-left: 2px;\">Country</b>
<table>
    <tbody>
        <tr>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/oslogo.gif\"
                    onclick=\"changeCountry('os', 'orangestar' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bmlogo.gif\" onclick=\"changeCountry('bm', 'bluemoon'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/gelogo.gif\"
                    onclick=\"changeCountry('ge', 'greenearth' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/yclogo.gif\"
                    onclick=\"changeCountry('yc', 'yellowcomet' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bhlogo.gif\" onclick=\"changeCountry('bh', 'blackhole'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/rflogo.gif\" onclick=\"changeCountry('rf', 'redfire'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/gslogo.gif\" onclick=\"changeCountry('gs', 'greysky'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bdlogo.gif\"
                    onclick=\"changeCountry('bd', 'browndesert' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
        </tr>
        <tr>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/ablogo.gif\"
                    onclick=\"changeCountry('ab', 'amberblaze' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/jslogo.gif\" onclick=\"changeCountry('js', 'jadesun'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/cilogo.gif\" onclick=\"changeCountry('ci', 'cobaltice'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/pclogo.gif\"
                    onclick=\"changeCountry('pc', 'pinkcosmos' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/tglogo.gif\"
                    onclick=\"changeCountry('tg', 'tealgalaxy' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/pllogo.gif\"
                    onclick=\"changeCountry('pl', 'purplelightning' );\" style=\"vertical-align: middle; margin-left:
                    0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/arlogo.gif\" onclick=\"changeCountry('ar', 'acidrain'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/wnlogo.gif\" onclick=\"changeCountry('wn', 'whitenova'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
        </tr>
    </tbody>
</table>`;
    }

    function terrainSelectScript() {
        var tableElement = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0] as HTMLElement;
        tableElement.setAttribute("class", "bordergrey");
        tableElement.innerHTML = `<a href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">
<img id=\"missilesilo.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/missilesilo.gif\" style=\"margin: auto 2px;\" border=\"type=image\"></a>`;

        showBuildings = () => {
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
                var terrain_name: string = buildingImage.src;
                terrain_name = terrain_name.replace(/terrain\/(aw1|aw2|ani)\//, '');
                terrain_name = terrain_name.replace('https://awbw.amarriner.com/', '');

                var id: number;

                for (var c: number = 1; c <= images.length; c++) {
                    if (images[c] == terrain_name) {
                        id = c;
                        break;
                    }
                }
                terrain_name = terrain_name.replace(country, '');

                if (terrain_name.indexOf("neutral") >= 0 || terrain_name.includes("missilesilo")) {
                    changeSquare(id, terrain_name, 'neutral');
                } else {
                    changeSquare(id, terrain_name, 'building');
                }
            }
            else {
                closeMenu(buildingTable);
                buildingVisible = false;
            }
        };

        var innerTerrainTable = document.getElementById("design-map-terrain-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0] as HTMLElement;
        innerTerrainTable.innerHTML = `<b style="padding-left: 2px;">Basic</b>
    <table>
        <tbody>
            <tr>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(1, 'plain.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"plain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/plain.gif\"
                            style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(3, 'wood.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wood.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wood.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(112, 'missilesiloempty.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"missilesiloempty.gif\" class=\"design\"
                            src=\"https://awbw.amarriner.com/terrain/${theme}/missilesiloempty.gif\" border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(2, 'mountain.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"mountain.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/mountain.gif\"
                            border=\"type=image\"></a>
                </td>
            </tr>
        </tbody>
    </table>
    <b style="padding-left: 2px;">River</b>
    <table>
        <tbody>
            <tr>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(4, 'hriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/hriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(5, 'vriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/vriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(6, 'criver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"criver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/criver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(7, 'esriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"esriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/esriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(8, 'swriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"swriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/swriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(9, 'wnriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wnriver.gif\"
                            border=\"type=image\"></a>
                </td>
            </tr>
            <tr>
                            <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(10, 'neriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"neriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/neriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(11, 'eswriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"eswriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/eswriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(12, 'swnriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"swnriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/swnriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(13, 'wneriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wneriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wneriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(14, 'nesriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"nesriver.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/nesriver.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(-1, 'autoriver.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"autoriver.gif\" class=\"design\" src=\"https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/autoriver.png?raw=true\"
                            border=\"type=image\" style=\"width:16px; height: 16px;\"></a>
                </td>
            </tr>
        </tbody>
    </table>
    <b style="padding-left: 2px;">Road</b>
    <table>
        <tbody>
            <tr>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(15, 'hroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/hroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(16, 'vroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/vroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(17, 'croad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"croad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/croad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(18, 'esroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"esroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/esroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(19, 'swroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"swroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/swroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(20, 'wnroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wnroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(21, 'neroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"neroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/neroad.gif\"
                            border=\"type=image\"></a>
                </td>
            </tr>
            <tr>
                            <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(22, 'eswroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"eswroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/eswroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(23, 'swnroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"swnroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/swnroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(24, 'wneroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wneroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wneroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(25, 'nesroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"nesroad.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/nesroad.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(-2, 'autoroad.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"autoroad.gif\" class=\"design\" src=\"https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/autoroad.png?raw=true\"
                            border=\"type=image\" style=\"width:16px; height: 16px;\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(26, 'hbridge.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/hbridge.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(27, 'vbridge.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vbridge.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/vbridge.gif\"
                            border=\"type=image\"></a>
                </td>
            </tr>
        </tbody>
    </table>
    <b style="padding-left: 1px;">Ocean</b>
    <table>
        <tbody>
            <tr>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(28, 'sea.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"sea.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/sea.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(33, 'reef.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"reef.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/reef.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(29, 'shoal41.png', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"shoal41.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/shoal41.png\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(30, 'shoal67.png', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"shoal67.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/shoal67.png\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(31, 'shoal49.png', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"shoal49.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/shoal49.png\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(32, 'shoal43.png', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"shoal43.png\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/shoal43.png\"
                            border=\"type=image\"></a>
                </td>
            </tr>
        </tbody>
    </table>
    <b style="padding-left: 2px;">Pipe</b>
    <table>
        <tbody>
            <tr>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(101, 'vpipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/vpipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(102, 'hpipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/hpipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(103, 'nepipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"nepipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/nepipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(104, 'espipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"espipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/espipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(105, 'swpipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"swpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/swpipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(106, 'wnpipe.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wnpipe.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wnpipe.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(107, 'npipeend.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"npipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/npipeend.gif\"
                            border=\"type=image\"></a>
                </td>
            </tr>
            <tr>
            <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(108, 'epipeend.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"epipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/epipeend.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(109, 'spipeend.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"spipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/spipeend.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(110, 'wpipeend.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"wpipeend.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/wpipeend.gif\"
                            border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(113, 'hpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hpipeseam.gif\" class=\"design\"
                            src=\"https://awbw.amarriner.com/terrain/${theme}/hpipeseam.gif\" border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(114, 'vpipeseam.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vpipeseam.gif\" class=\"design\"
                            src=\"https://awbw.amarriner.com/terrain/${theme}/vpipeseam.gif\" border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(115, 'hpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"hpiperubble.gif\" class=\"design\"
                            src=\"https://awbw.amarriner.com/terrain/${theme}/hpiperubble.gif\" border=\"type=image\"></a>
                </td>
                <td class=\"bordergrey\">
                    <a href=\"javascript:changeSquare(116, 'vpiperubble.gif', 'terrain'); closeMenu(terrainTable);\">
                        <img id=\"vpiperubble.gif\" class=\"design\"
                            src=\"https://awbw.amarriner.com/terrain/${theme}/vpiperubble.gif\" border=\"type=image\"></a>
                </td>
            </tr>
        </tbody>
    </table>`;

        var innerBuildingTable = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0] as HTMLElement;
        innerBuildingTable.innerHTML = `<b style=\"padding-left: 2px;\"> Preowned</b>
<table>
    <tbody>
        <tr>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(42, 'hq.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"hq.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarhq.gif\"
                        style=\"border: 2px solid rgba(9, 159, 226, 0.6);\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(40, 'airport.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"airport.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarairport.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(39, 'base.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"base.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarbase.gif\"
                        border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(38, 'city.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"city.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarcity.gif\"
                        border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(134, 'comtower.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"comtower.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarcomtower.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(146, 'lab.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"lab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarlab.gif\"
                        border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(41, 'port.gif', 'building'); closeMenu(buildingTable);\">
                    <img id=\"port.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/orangestarport.gif\"
                        border=\"type=image\"></a>
            </td>
        </tr>
        </tbody>
</table>
<b style=\"padding-left: 2px;\">Neutral</b>
<table>
    <tbody>
        <tr>
            <td class=\"bordergrey\"><a
                    href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"missilesilo.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/missilesilo.gif\" style=\"margin: auto 2px;\"
                        border=\"type=image\"></a></td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(36, 'neutralairport.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutralairport.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/neutralairport.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(35, 'neutralbase.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutralbase.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/neutralbase.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(34, 'neutralcity.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutralcity.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/neutralcity.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(133, 'neutralcomtower.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutralcomtower.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/neutralcomtower.gif\" border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(145, 'neutrallab.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutrallab.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/neutrallab.gif\"
                        border=\"type=image\"></a>
            </td>
            <td class=\"bordergrey\">
                <a href=\"javascript:changeSquare(37, 'neutralport.gif', 'neutral'); closeMenu(buildingTable);\">
                    <img id=\"neutralport.gif\" class=\"design\"
                        src=\"https://awbw.amarriner.com/terrain/${theme}/neutralport.gif\" border=\"type=image\"></a>
            </td>
        </tr>
    </tbody>
</table>
<b style=\"padding-left: 2px;\">Country</b>
<table>
    <tbody>
        <tr>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/oslogo.gif\"
                    onclick=\"changeCountry('os', 'orangestar' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bmlogo.gif\" onclick=\"changeCountry('bm', 'bluemoon'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/gelogo.gif\"
                    onclick=\"changeCountry('ge', 'greenearth' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/yclogo.gif\"
                    onclick=\"changeCountry('yc', 'yellowcomet' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bhlogo.gif\" onclick=\"changeCountry('bh', 'blackhole'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/rflogo.gif\" onclick=\"changeCountry('rf', 'redfire'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/gslogo.gif\" onclick=\"changeCountry('gs', 'greysky'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/bdlogo.gif\"
                    onclick=\"changeCountry('bd', 'browndesert' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
        </tr>
        <tr>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/ablogo.gif\"
                    onclick=\"changeCountry('ab', 'amberblaze' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/jslogo.gif\" onclick=\"changeCountry('js', 'jadesun'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/cilogo.gif\" onclick=\"changeCountry('ci', 'cobaltice'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/pclogo.gif\"
                    onclick=\"changeCountry('pc', 'pinkcosmos' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/tglogo.gif\"
                    onclick=\"changeCountry('tg', 'tealgalaxy' );\" style=\"vertical-align: middle; margin-left: 0px;
                    margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/pllogo.gif\"
                    onclick=\"changeCountry('pl', 'purplelightning' );\" style=\"vertical-align: middle; margin-left:
                    0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/arlogo.gif\" onclick=\"changeCountry('ar', 'acidrain'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
            <td>
                <img src=\"https://awbw.amarriner.com/terrain/${theme}/wnlogo.gif\" onclick=\"changeCountry('wn', 'whitenova'
                    );\" style=\"vertical-align: middle; margin-left: 0px; margin-right: 0px;cursor: pointer;\">
            </td>
        </tr>
    </tbody>
</table>`;

        var containerTable = document.getElementById("design-map-misc-controls").childNodes[1] as HTMLElement;
        var countryDisplay = document.getElementById("current-country");

        countryDisplay.setAttribute("style", "display: none;");
        containerTable.style.width = "175";
    }

    function createMapScript() {
        let innerCreateMapTable = Object.values(document.querySelectorAll("form")).filter(f => f.name === "" && f.action === "https://awbw.amarriner.com/design.php" && f.className !== "login-form")[0].parentElement;
        innerCreateMapTable.innerHTML = `<form name=\"\" create1=\"\" action=\"design.php\" method=\"post\">
    <table cellspacing=\"1\" cellpadding=\"2\">
        <tbody>
            <tr>
                <td>Map Name:</td>
                <td><input type=\"text\" id=\"create_map_name\" class=\"text\" name=\"maps_name\" maxlength=\"100\" style=\"padding-left: 3px;\"></td>
            </tr>
            <tr>
                <td style=\"text-align: right;\">Width:</td>
                <td>
                    <input class=\"text\" name=\"maps_width\" min=\"5\" max=\"50\" value="20" type=\"number\" style=\"width: 32%; padding-left: 3px;\">
                </td>
            </tr>
            <tr>
                <td style=\"text-align: right;\">Height:</td>
                <td>
                    <input class=\"text\" name=\"maps_height\" min=\"5\" max=\"50\" value="20" type=\"number\" style=\"width: 32%; padding-left: 3px;\">
                </td>
            </tr>
            <tr>
                <td></td>
                <td><input type=\"submit\" class=\"submit\" value=\"Submit\"></td>
            </tr>
        </tbody>
    </table>
    <input type=\"hidden\" name=\"maps_new\" value=\"1\">
</form>`;

        async function onMapCreate(e: SubmitEvent) {
            let width: number = parseInt((document.getElementsByName("maps_width")[0] as HTMLInputElement).value);
            let height: number = parseInt((document.getElementsByName("maps_height")[0] as HTMLInputElement).value);

            if (height > 36 || width > 36) {
                e.preventDefault();
                let mapString = "28,";
                mapString = mapString.repeat(width);
                mapString = Utils.trimCharEnd(mapString, ',');
                mapString += "\n";
                mapString = mapString.repeat(height);
                mapString = Utils.trimCharEnd(mapString, '\n');

                let mapName: string = (document.getElementById("create_map_name") as HTMLInputElement).value;
                await GlobalFunctions.uploadMap(mapName, mapString);
                window.location.href = "https://awbw.amarriner.com/design.php";
            }
        }

        let form: HTMLFormElement = innerCreateMapTable.querySelector("form");
        form.onsubmit = onMapCreate;
    }

    function clickThroughScript() {
        for (var b = 0; b <= mapheight; b++) {
            for (var a = 0; a <= mapwidth; a++) {
                var x: string = a.toString(); if (a < 10) { x = '0' + a; }
                var y: string = b.toString(); if (b < 10) { y = '0' + b; }
                var squareSpan = document.getElementById(`square${x}${y}`);
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

        oldupdate = (square: string, hidden: string, x: number, y: number, thetop: number) => {
            //close menus
            closeMenu(terrainTable);
            closeMenu(countryTable);
            closeMenu(buildingTable);
            closeMenu(unitTable);

            if (symndx < 0) {
                GlobalFunctions.placeAutoTile(symndx, x, y);
                return;
            }

            var tx: string = x.toString();
            if (parseInt(tx) < 10) {
                tx = "0" + x;
            }
            var ty: string = y.toString();
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
                newDiv.setAttribute(
                    "style",
                    "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block; outline: 0;"
                );
                newDiv.setAttribute(
                    "href",
                    `javascript:update('${square}','${hidden}',${x},${y},${thetop});`
                );

                //add image
                var newimg = document.createElement("img");

                if (type == "terrain") {
                    var imgLink = `terrain/${theme}/` + images[symndx];
                } else if (type == "building" || type == "neutral") {
                    var imgLink = `terrain/${theme}/` + images[symndx];
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
                newhref.setAttribute(
                    "href",
                    `javascript:update('${square}', ${hidden}, ${x}, ${y}, ${thetop})`
                );
                theNode.appendChild(newhref);
                if (type != "delete") {
                    newimg = document.createElement("img");
                    newimg.setAttribute("src", `terrain/${theme}/` + code + units_img[curndx]);
                    newimg.setAttribute("border", "0");
                    theNode.firstChild.appendChild(newimg);
                    newimg.classList.add("predeployed-unit-img");

                    if (!curndx) {
                        theNode.style.top = (thetop + tops[1]).toString();
                    } else {
                        theNode.style.top = (thetop + tops[curndx]).toString();
                    }
                    theUnitNode.setAttribute("value", x + "," + y + "," + units[curndx]);
                    theCodeNode.setAttribute("value", x + "," + y + "," + code);
                } else {
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
        var mapObj: Array<string[]> = [];
        var innerSymm = Object.values(document.getElementsByClassName("norm")).filter(n => n.textContent.includes("Symm:"))[0];

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

        function getPointsFromSymmetry(x: number, y: number) {
            var points: Point[] = [];
            var fx = mapwidth - x;
            var fy = mapheight - y;
            var stype = (document.getElementById('set-symmetry') as HTMLSelectElement).value;

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
                    var x: string = a.toString(); if (a < 10) { x = '0' + a; }
                    var y: string = b.toString(); if (b < 10) { y = '0' + b; }

                    var squareSrc = document.getElementById(`square${x}${y}`).querySelector("img").src;
                    squareSrc = squareSrc.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/(aw1|aw2|ani)\/)[\w\.]+/)[0];

                    if (squareSrc.includes("road.")) squareSrc = "road";
                    if (squareSrc.includes("river.")) squareSrc = "river";
                    if (squareSrc.includes("bridge.")) squareSrc = "bridge";
                    if (squareSrc.includes("pipe.")) squareSrc = "pipe";
                    if (squareSrc.includes("pipeseam.")) squareSrc = "pipeseam";
                    if (squareSrc.includes("piperubble.")) squareSrc = "piperubble";
                    if (squareSrc.includes("pipeend.")) squareSrc = "pipeend";
                    if (squareSrc.includes("shoal")) squareSrc = "shoal";
                    if (squareSrc.match(/(?<!neutral)city\./)) squareSrc = "ownedcity";
                    if (squareSrc.match(/(?<!neutral)base\./)) squareSrc = "ownedbase";
                    if (squareSrc.match(/(?<!neutral|air)port\./)) squareSrc = "ownedport";
                    if (squareSrc.match(/(?<!neutral)airport\./)) squareSrc = "ownedairport";
                    if (squareSrc.match(/(?<!neutral)hq\./)) squareSrc = "ownedhq";
                    if (squareSrc.match(/(?<!neutral)comtower\./)) squareSrc = "ownedcomtower";
                    if (squareSrc.match(/(?<!neutral)lab\./)) squareSrc = "ownedlab";

                    mapRow.push(squareSrc);
                }

                mapObj.push(mapRow);
            }
        }

        function getTile(x: number, y: number) {
            return mapObj[y][x];
        }

        class Point {
            public x: number;
            public y: number;

            public equals(other: Point): boolean {
                return this.x == other.x && this.y == other.y;
            }

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
            }
        }

        function getAsymmetries() {
            var asymms = [];
            var stype: number = parseInt((document.getElementById('set-symmetry') as HTMLSelectElement).value);
            var skipCoords: Point[] = [];

            if (stype === 0) {
                return null;
            }

            for (var y = 0; y <= mapheight; y++) {
                for (var x = 0; x <= mapwidth; x++) {
                    if (skipCoords.some(p => p.equals(new Point(x, y)))) {
                        continue;
                    }

                    var symms = getPointsFromSymmetry(x, y);

                    if (stype >= 1 && stype <= 5) {
                        var symm: Point = symms[0]

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
                    titleString += '\n' + `Asymmetry at (${a[0].x}, ${a[0].y}) and (${a[1].x}, ${a[1].y})`;
                }

                if (asymms.length > 9) {
                    titleString += '\n' + `...and ${asymms.length - 9} more`;
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
                    titleString += '\n' + `Asymmetry at (${a[0].x}, ${a[0].y}), (${a[1].x}, ${a[1].y}), (${a[2].x}, ${a[2].y}), and (${a[3].x}, ${a[3].y})`;
                }

                if (asymms.length > 9) {
                    titleString += '\n' + `...and ${asymms.length - 9} more`;
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
        var trow: HTMLTableRowElement = document.createElement("tr");
        trow.innerHTML = `<td style="vertical-align: top;">
Map Data:
</td>
<td>
<textarea wrap="off" style="width: 80%; height: 400px; resize: none;"></textarea>
</td>`;

        var textArea: HTMLTextAreaElement = trow.querySelector("textarea");
        var mapName: HTMLInputElement = document.getElementsByName("name")[0] as HTMLInputElement;
        var overwriteMap: HTMLSelectElement = document.getElementsByName("overwrite")[0] as HTMLSelectElement;

        var tbody: HTMLTableSectionElement = document.getElementsByClassName("borderwhite")[0].children[0].children[0] as HTMLTableSectionElement;
        tbody.insertBefore(trow, tbody.lastElementChild);

        tbody.deleteRow(2);
        tbody.deleteRow(0);

        var submitButton: HTMLInputElement = document.getElementsByClassName("submit")[0] as HTMLInputElement;
        submitButton.setAttribute("type", "button");

        async function onMapSubmit() {
            let response: Response = await GlobalFunctions.overwriteMap(mapName.value, overwriteMap.value, textArea.value);
            let html: string = await response.text();

            document.body.innerHTML = html;
            setTimeout(() => window.location.href = "https://awbw.amarriner.com/design.php", 1000);
        }

        submitButton.onclick = onMapSubmit;
    }

    function hotkeysScript() {

        var hotkeys: Hotkey[] = [];

        class Hotkey {
            key: string;
            downFunc: Function;
            upFunc: Function;

            constructor(key: string, downFunc: Function, upFunc: Function) {
                this.key = key;
                this.downFunc = downFunc;
                this.upFunc = upFunc;
            }
        }

        function onKeyDown(e: KeyboardEvent): void {
            if (e.repeat) {
                return;
            }

            for (var i = 0; i < hotkeys.length; i++) {
                if (hotkeys[i].key === e.key) {
                    hotkeys[i].downFunc();
                }
            }
        }

        function onKeyUp(e: KeyboardEvent): void {
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

        function addHotkey(key: string, downFunc: Function, upFunc: Function): void {
            hotkeys.push(new Hotkey(key, downFunc, upFunc));
        }

        addHotkey("a", () => { if (!terrainVisible) showBaseTerrain() }, () => { if (terrainVisible) showBaseTerrain() });
        addHotkey("s", () => { if (!buildingVisible) showBuildings() }, () => { if (buildingVisible) showBuildings() });
        addHotkey("d", () => { if (!unitVisible) showUnits() }, () => { if (unitVisible) showUnits() });
        addHotkey("f", () => changeSquare(-1, "delete-image", "delete"), Function.prototype);

        addHotkey("1", () => changeCountry("os", "orangestar"), Function.prototype);
        addHotkey("2", () => changeCountry("bm", "bluemoon"), Function.prototype);
        addHotkey("3", () => changeCountry("ge", "greenearth"), Function.prototype);
        addHotkey("4", () => changeCountry("yc", "yellowcomet"), Function.prototype);
        addHotkey("5", () => changeCountry("bh", "blackhole"), Function.prototype);
        addHotkey("6", () => changeCountry("rf", "redfire"), Function.prototype);
        addHotkey("7", () => changeCountry("gs", "greysky"), Function.prototype);
        addHotkey("8", () => changeCountry("bd", "browndesert"), Function.prototype);

        addHotkey("!", () => changeCountry("ab", "amberblaze"), Function.prototype);
        addHotkey("@", () => changeCountry("js", "jadesun"), Function.prototype);
        addHotkey("#", () => changeCountry("ci", "cobaltice"), Function.prototype);
        addHotkey("$", () => changeCountry("pc", "pinkcosmos"), Function.prototype);
        addHotkey("%", () => changeCountry("tg", "tealgalaxy"), Function.prototype);
        addHotkey("^", () => changeCountry("pl", "purplelightning"), Function.prototype);
        addHotkey("&", () => changeCountry("ar", "acidrain"), Function.prototype);
        addHotkey("*", () => changeCountry("wn", "whitenova"), Function.prototype);

        addHotkey("Control", () => {
            var selectSymm: HTMLSelectElement = document.getElementById("set-symmetry") as HTMLSelectElement;
            var selectedSymm: number = parseInt(selectSymm.value);
            if (selectedSymm === 0) {
                selectSymm.value = lastSymmetry.toString();
                lastSymmetry = 0;
            } else {
                lastSymmetry = selectedSymm;
                selectSymm.value = "0";
            }
        }, Function.prototype);

        document.getElementById("current-terrain").setAttribute("title", "Select base terrain (A)")
        document.getElementById("current-building").setAttribute("title", "Select building (S)")
        document.getElementById("current-unit").setAttribute("title", "Select unit (D)")
        document.getElementById("delete-unit").setAttribute("title", "Delete unit (F)")
    }

    function previewScript() {
        let saveButton: HTMLElement = Object.values(document.getElementsByClassName("norm")).filter(e => e.textContent.includes("Save"))[0] as HTMLElement;
        let previewButtonElement: HTMLTableCellElement = document.createElement("td");
        let previewOn: boolean = false;
        let previewButtonDisabled: boolean = false;

        previewButtonElement.innerHTML = `<a class="norm2" id="preview_button" href="#" style="display:block; height: 100%;">
<span class="small_text" style="line-height:29px; display: block; vertical-align: middle;" title="Toggle Preview Mode">
<img style="vertical-align: middle;" src="terrain/editmap.gif">
<b style="vertical-align:middle;">Preview</b>
</span></a>`;
        previewButtonElement.setAttribute("class", "norm");
        previewButtonElement.setAttribute("style", "border-left: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;");
        previewButtonElement.setAttribute("height", "30");
        saveButton.parentElement.appendChild(previewButtonElement);

        let previewButton: HTMLAnchorElement = document.getElementById("preview_button") as HTMLAnchorElement;

        function setPreviewButton(enabled: boolean, text: string) {
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

        function previewToggled(e: Event) {
            if (previewButtonDisabled) {
                return;
            }

            previewOn = !previewOn;

            if (previewOn) {
                setPreviewButton(false, "Preview");
                let mapLink: string = (document.getElementById("design-map-name").childNodes[0] as HTMLAnchorElement).href;
                mapLink = mapLink.replace("editmap.php", "prevmaps.php");

                let autosaveCheckbox = document.getElementById("autosave_checkbox") as HTMLInputElement;

                if (autosaveCheckbox.checked) {
                    $.ajax({
                        method: "POST",
                        url: "updatemap.php",
                        contentType: "application/x-www-form-urlencoded",
                        data: $('#map_form').serialize()
                    }).then(() => {
                        $.ajax({
                            method: "GET",
                            url: mapLink,
                            contentType: "text/html; charset=UTF-8",
                            cache: false,
                            success: function (data: string) {
                                let doc: Document = new DOMParser().parseFromString(data, "text/html");
                                let html: string = doc.getElementById("gamemap").innerHTML;
                                let gamemapContainer: HTMLElement = document.getElementById("gamemap-container");
                                let gamemap: HTMLElement = document.getElementById("gamemap");
                                previewElement = document.createElement("div");
                                previewElement.innerHTML = html;
                                previewElement.setAttribute("style", `scale: ${localStorage.getItem("scale")}; height: 0.5%; pointer-events: none;`);
                                let mapBackground: HTMLImageElement = Object.values(previewElement.childNodes).find(c => (c as HTMLElement).id === "map-background") as HTMLImageElement;
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
                    })
                }
                else {
                    $.ajax({
                        method: "GET",
                        url: mapLink,
                        contentType: "text/html; charset=UTF-8",
                        cache: false,
                        success: function (data: string) {
                            let doc: Document = new DOMParser().parseFromString(data, "text/html");
                            let html: string = doc.getElementById("gamemap").innerHTML;
                            let gamemapContainer: HTMLElement = document.getElementById("gamemap-container");
                            let gamemap: HTMLElement = document.getElementById("gamemap");
                            previewElement = document.createElement("div");
                            previewElement.innerHTML = html;
                            previewElement.setAttribute("style", `scale: ${localStorage.getItem("scale")}; height: 0.5%; pointer-events: none;`);
                            let mapBackground: HTMLImageElement = Object.values(previewElement.childNodes).find(c => (c as HTMLElement).id === "map-background") as HTMLImageElement;
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
                let gamemapContainer: HTMLElement = document.getElementById("gamemap-container");
                let gamemap: HTMLElement = document.getElementById("gamemap");
                gamemap.style.removeProperty("display");
                gamemapContainer.removeChild(previewElement);
            }
        }

        previewButton.onclick = previewToggled;
    }

    function fixCacheScript() {
        let mapBackground: HTMLImageElement = document.getElementById("map-background") as HTMLImageElement;
        mapBackground.src = mapBackground.src + "?" + Date.now();
    }

    function mapResizeScript() {
        let main: HTMLElement = document.getElementById("main");
        let tables: HTMLElement[] = Object.values(main.children).filter(e => (e as HTMLElement).style.width === "900px") as HTMLElement[];
        let tableRows: HTMLTableRowElement[] = tables.map(t => t.children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0]) as HTMLTableRowElement[];
        let mapNames: { [key: string]: string } = {};

        tableRows.forEach(tr => {
            let mapPreviewButton: HTMLElement = document.createElement("td");

            mapPreviewButton.setAttribute("class", "norm");
            mapPreviewButton.setAttribute("style", "text-align:left; padding-left: 4px; padding-bottom: 3px;");
            mapPreviewButton.setAttribute("width", "125");
            mapPreviewButton.setAttribute("height", "35");
            mapPreviewButton.setAttribute("class", "norm");
            mapPreviewButton.innerHTML = `<span class="small_text" title="Resize this design map">
<a class="norm2" style="display:block;color: #000000;text-decoration: none;font-weight: normal;cursor: pointer;">
<img style="vertical-align:middle;" src="terrain/zoomin.gif">
<b style="padding-right: 3px; vertical-align:middle;">Resize Map</b>
</a></span>`;

            tr.appendChild(mapPreviewButton);
            let mapID: string = (mapPreviewButton.parentElement.children[0].children[0].children[0] as HTMLAnchorElement).href.match(/(?<=https:\/\/awbw\.amarriner\.com\/editmap\.php\?maps_id=)\d+/)[0];
            mapNames[mapID] = tr.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].children[0].textContent;
            mapPreviewButton.setAttribute("mapid", mapID);
            mapPreviewButton.querySelector("a").onclick = () => onResizeMapClick(mapID, mapNames);
        });

        function onResizeMapClick(mapID: string, mapNames: { [key: string]: string }) {
            let resizePrompt: HTMLElement = document.createElement("div");
            resizePrompt.setAttribute("style", "position: fixed; left: 50vw; top: 50vh; margin-top: -7%; margin-left: -8%; z-index: 1;");
            resizePrompt.setAttribute("id", "resize_prompt");
            resizePrompt.innerHTML = `<table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="bordertitle" height="20"><b>Resize Map</b></td></tr><tr>
<td class="borderwhite" style="padding-top: 3px;">
<form name="" style="padding-left: 2px; padding-right: 2px; margin-bottom: 5px;">
<table cellspacing="1" cellpadding="2"><tbody><tr><td><b>X Axis:</b></td></tr><tr><td>
<select class="select_left">
<option value="Expand">Expand</option>
<option value="Shrink">Shrink</option></select></td>
<td>left by</td><td>
<input class="text input_left" min="0" max="20" value="0" type="number" style=" padding-left: 3px; width: 50px;"></td>
<td>tile(s)</td></tr>
<tr><td>
<select class="select_right">
<option value="Expand">Expand</option>
<option value="Shrink">Shrink</option></select></td>
<td>right by</td><td>
<input class="text input_right" min="0" max="20" value="0" type="number" style=" padding-left: 3px; width: 50px;"></td>
<td>tile(s)</td></tr><tr><td><b>Y Axis:</b></td></tr><tr><td><select  class="select_top">
<option value="Expand">Expand</option>
<option value="Shrink">Shrink</option></select></td><td>top by</td><td>
<input class="text input_top" min="0" max="20" value="0" type="number" style=" padding-left: 3px;width: 50px;"></td>
<td>tile(s)</td></tr>
<tr><td><select class="select_bottom">
<option value="Expand">Expand</option>
<option value="Shrink">Shrink</option></select></td><td>bottom by</td><td>
<input class="text input_bottom" min="0" max="20" value="0" type="number" style=" padding-left: 3px;width: 50px;"></td>
<td>tile(s)</td></tr>
<tr>
<td style=""><input style="margin-top: 5px;width: 50px;" class="submit" type="button" value="Resize"></td></tr><tr>
<td style=""><input style="margin-top: 5px;width: 50px;" class="submit" type="button" value="Cancel"></td></tr>
</tbody></tbody></table></form></td></tr></tbody></table>`;
            document.getElementById("main").appendChild(resizePrompt);

            (resizePrompt.getElementsByClassName("submit")[0] as HTMLElement).onclick = () => onResize(mapID, mapNames);
            (resizePrompt.getElementsByClassName("submit")[1] as HTMLElement).onclick = onResizeCancel;

            let darkFilter: HTMLElement = document.createElement("div");
            darkFilter.setAttribute("style", "width: 100vw;height: 100vh;background-color: #00000050;position: fixed;top: 0vh;left: 0vw;");
            darkFilter.setAttribute("id", "dark_filter");
            document.getElementById("main").appendChild(darkFilter);
        }

        function onResize(mapID: string, mapNames: { [key: string]: string }) {
            let resizePrompt: HTMLElement = document.getElementById("resize_prompt");

            if (!confirm(`Are you sure you want to resize "${mapNames[mapID]}"? Resizing a map will remove all predeployed units from it.`)) {
                resizePrompt.parentElement.removeChild(document.getElementById("resize_prompt"));
                document.getElementById("dark_filter").parentElement.removeChild(document.getElementById("dark_filter"));
                return;
            }

            let topInput: HTMLInputElement = resizePrompt.getElementsByClassName("input_top")[0] as HTMLInputElement;
            let bottomInput: HTMLInputElement = resizePrompt.getElementsByClassName("input_bottom")[0] as HTMLInputElement;
            let leftInput: HTMLInputElement = resizePrompt.getElementsByClassName("input_left")[0] as HTMLInputElement;
            let rightInput: HTMLInputElement = resizePrompt.getElementsByClassName("input_right")[0] as HTMLInputElement;

            if (!topInput.validity.valid || !bottomInput.validity.valid || !leftInput.validity.valid || !rightInput.validity.valid) {
                topInput.reportValidity();
                bottomInput.reportValidity();
                leftInput.reportValidity();
                rightInput.reportValidity();
                return;
            }

            resizePrompt.parentElement.removeChild(document.getElementById("resize_prompt"));
            document.getElementById("dark_filter").parentElement.removeChild(document.getElementById("dark_filter"));

            let top: number = parseInt(topInput.value);
            let bottom: number = parseInt(bottomInput.value);
            let left: number = parseInt(leftInput.value);
            let right: number = parseInt(rightInput.value);

            let topExpand: boolean = (resizePrompt.getElementsByClassName("select_top")[0] as HTMLSelectElement).value === "Expand";
            let bottomExpand: boolean = (resizePrompt.getElementsByClassName("select_bottom")[0] as HTMLSelectElement).value === "Expand";
            let leftExpand: boolean = (resizePrompt.getElementsByClassName("select_left")[0] as HTMLSelectElement).value === "Expand";
            let rightExpand: boolean = (resizePrompt.getElementsByClassName("select_right")[0] as HTMLSelectElement).value === "Expand";

            function resizeMap(mapData: string): string {
                let mapLines: string[] = mapData.split('\n').map(l => Utils.trimCharEnd(l, '\n'));

                let mapWidth: number = mapLines[0].split(',').length;
                let mapHeight: number = mapLines.length;
                let tile: string = "28,";
                let tileRaw: string = "28";

                function getChange(change: number, mode: boolean) {
                    if (mode) return change;
                    else return -change;
                }

                let newHeight: number = mapHeight + getChange(top, topExpand) + getChange(bottom, bottomExpand);
                let newWidth: number = mapWidth + getChange(left, leftExpand) + getChange(right, rightExpand);

                if (newHeight > 50 || newHeight < 5 || newWidth > 50 || newWidth < 5) {
                    return "";
                }

                let index: number = 0;
                mapLines.forEach(mapLine => {
                    let lineArray: string[] = mapLine.split(',');

                    if (left != 0) {
                        if (leftExpand) {
                            for (let i = 0; i < left; i++) {
                                lineArray.unshift(tileRaw);
                            }
                        }
                        else {
                            lineArray = lineArray.slice(left);
                        }
                    }

                    if (right != 0) {
                        if (rightExpand) {
                            for (let i = 0; i < right; i++) {
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
                        for (let i = 0; i < top; i++) {
                            mapLines.unshift(Utils.trimCharEnd(tile.repeat(newWidth), ","));
                        }
                    }
                    else {
                        mapLines = mapLines.slice(top);
                    }
                }

                if (bottom != 0) {
                    if (bottomExpand) {
                        for (let i = 0; i < bottom; i++) {
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
                url: `https://awbw.amarriner.com/text_map.php?maps_id=${mapID}`,
                contentType: "text/html; charset=UTF-8",
                cache: false,
                success: function (data: string) {
                    let doc: Document = new DOMParser().parseFromString(data, "text/html");
                    let mapData: string = doc.querySelector("section#main > table > tbody > tr:nth-child(2) tbody").textContent.replace(/\n\n/g, "\n").trim();
                    let resizedMapData: string = resizeMap(mapData);

                    if (resizedMapData === "") {
                        alert("Resize canceled. Resizing map would give it an invalid size.");
                        return;
                    }

                    fetch("/uploadmap.php",
                        {
                            method: "POST",

                            body: `-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="action"

UPLOAD
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="mapfile"; filename="data.txt"
Content-Type: text/plain

${resizedMapData}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="name"

${mapNames[mapID]}
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="format"

AWBW
-----------------------------216783749517670898471830319234
Content-Disposition: form-data; name="overwrite"

${mapID}
-----------------------------216783749517670898471830319234--`,
                            headers:
                            {
                                "Content-Type": "multipart/form-data; boundary=---------------------------216783749517670898471830319234"
                            }
                        }).then(() => {
                            window.location.href = `https://awbw.amarriner.com/design.php#map_${mapID}`;
                            let mapPreview: HTMLImageElement = Object.values(document.querySelectorAll("img")).find(i => i.src.includes(`/${mapID}.png`)) as HTMLImageElement;
                            mapPreview.src = `${mapPreview.src.split('?')[0]}?${Date.now()}`;;
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

        function getTile(x: number, y: number): string {
            if (x < 0 || y < 0 || x > mapwidth || y > mapheight) {
                return "";
            }

            let xid: string = x.toString(); if (x < 10) { xid = '0' + x; }
            let yid: string = y.toString(); if (y < 10) { yid = '0' + y; }

            let squareSrc = document.getElementById(`square${xid}${yid}`).querySelector("img").src;
            squareSrc = squareSrc.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/(aw1|aw2|ani)\/)[\w\.]+/)[0];
            return squareSrc;
        }

        function placeTile(tile: number, x: number, y: number) {
            let square: string = `square${x.toString().padStart(2, "0")}${y.toString().padStart(2, "0")}`;
            let hidden: string = `hidden${x.toString().padStart(2, "0")}${y.toString().padStart(2, "0")}`;
            let top: number = y * 16;
            let oldCurndx: number = curndx;
            let oldSymndx: number = symndx;

            curndx = tile;
            symndx = tile;

            oldupdate(square, hidden, x, y, top);

            curndx = oldCurndx;
            symndx = oldSymndx;
        }

        function setTileAuto(tileset: number[], tileName: string, altTileName: string, x: number, y: number) {
            let up: boolean = getTile(x, y - 1).includes(tileName) || getTile(x, y - 1).includes(altTileName);
            let down: boolean = getTile(x, y + 1).includes(tileName) || getTile(x, y + 1).includes(altTileName);
            let left: boolean = getTile(x - 1, y).includes(tileName) || getTile(x - 1, y).includes(altTileName);
            let right: boolean = getTile(x + 1, y).includes(tileName) || getTile(x + 1, y).includes(altTileName);

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

        GlobalFunctions.placeAutoTile = (autotile: number, x: number, y: number) => {
            if (autotile === -1) {
                let riverTileset: number[] = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

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
                let roadTileset: number[] = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

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
        }

        changeSquare = (id: number, terrain_name: string, t: string): void => {
            curndx = id;

            //remove highlight from previous image
            theNode = document.getElementById(oldterrain) as HTMLImageElement;
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
            theNode = document.getElementById(terrain_name) as HTMLImageElement;
            theNode.style.border = 'solid 2px rgba(9, 159, 226, 0.6)';

            //change menu image & highlight
            if (type == 'terrain') { theNode = terrainImage; }
            if (type == 'building' || type == 'neutral') { theNode = buildingImage; }
            if (type == 'unit') { theNode = unitImage; }
            if (type == 'delete') { theNode = deleteImage; }

            if (type !== 'delete') {
                if (terrain_name.startsWith('auto')) { theNode.src = `https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/${terrain_name.split('.')[0]}.png?raw=true`; theNode.style.width = "16px"; }
                else if (type == 'terrain') { theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + terrain_name; }
                else if (type == 'building') { theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + country + terrain_name; }
                else if (type == 'neutral') { theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + terrain_name; }
                else if (type == 'unit') { theNode.src = 'https://awbw.amarriner.com/' + 'terrain/ani/' + code + terrain_name; }
            }
            else {
                closeMenu(terrainTable); closeMenu(countryTable); closeMenu(buildingTable); closeMenu(unitTable);
            }
            theNode.style.border = 'solid 2px rgba(9, 159, 226, 0.6)';

            if (type == 'delete') {
                gamemap.style.cursor = "url(https://awbw.amarriner.com/terrain/delete_cursor.gif), auto";
            }
            else {
                gamemap.style.cursor = 'pointer';
            }
        }

        showBaseTerrain = () => {
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
                if (countryVisible) { closeMenu(countryTable); }
                if (buildingVisible) { closeMenu(buildingTable); }
                if (unitVisible) { closeMenu(unitTable); }

                //change square
                terrain_name = terrainImage.src;
                if (terrain_name.startsWith("https://github.com/TheGamerASD")) {
                    terrain_name = terrain_name.replace('https://github.com/TheGamerASD/AWBW-Design-Maps-Improved/blob/main/images/', '');
                    terrain_name = terrain_name.replace('?raw=true', '');
                    terrain_name = terrain_name.replace('png', 'gif');
                }
                else {
                    terrain_name = terrain_name.replace(`terrain/${theme}/`, '');
                    terrain_name = terrain_name.replace('https://awbw.amarriner.com/', '');
                }

                for (var c = 1; c <= images.length; c++) {
                    if (images[c] == terrain_name) { id = c; break; }
                }

                changeSquare(id, terrain_name, 'terrain');
            }
            else {
                closeMenu(terrainTable);
                terrainVisible = 0;
            }
        }

        update = (square: string, hidden: string, x: number, y: number, thetop: number) => {
            symndx = curndx;

            oldupdate(square, hidden, x, y, thetop);

            let tx: string = x.toString();
            var ty: string = y.toString();
            var fx = mapwidth - x;
            var fy = mapheight - y;
            let tfx: string = (mapwidth - x).toString();
            let tfy: string = (mapheight - y).toString();
            if (x < 10) { tx = '0' + x; }
            if (y < 10) { ty = '0' + y; }
            if (fx < 10) { tfx = '0' + (mapwidth - x); }
            if (fy < 10) { tfy = '0' + (mapheight - y); }
            let stype: number = parseInt((document.getElementById('set-symmetry') as HTMLSelectElement).value);
            if (stype >= 6 || stype == 0 || curndx < 0) { symndx = curndx; }
            else { symndx = symmetry[curndx][stype]; }

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
        }
    }

    function linkFixScript() {
        document.querySelectorAll("a").forEach(a => a.style.outline = "0");
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