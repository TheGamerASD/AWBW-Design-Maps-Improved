// ==UserScript==
// @name         AWBW Design Maps Improved
// @version      1.0
// @description  Improves the AWBW mapmaking experience.
// @author       TheGamerASD
// @match        https://awbw.amarriner.com/editmap.php?maps_id=*
// @match        https://awbw.amarriner.com/design.php*
// @icon         https://cdn.discordapp.com/emojis/929147036677324800.webp?size=96&quality=lossless
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // GLOBAL VARIABLES START

    var theme;

    // GLOBAL VARIABLES END

    // AUTOSAVE START
    function autosaveScript() {
        'use strict';

        var intervalID;
        var previousState = false;
        var checked = false;

        function saveAsync()
        {
            $.ajax({
                method: "POST",
                url: "updatemap.php",
                contentType: "application/x-www-form-urlencoded",
                data: $('#map_form').serialize(),
            });
        }

        function autosaveCheckboxToggled()
        {
            checked = document.getElementById("autosave_checkbox").checked;

            if(checked === previousState)
            {
                return;
            }

            if(checked)
            {
                intervalID = setInterval(saveAsync, 20 * 1000);
            }
            else
            {
                clearInterval(intervalID);
            }

            previousState = checked;
        }

        function onLeavePage(e)
        {
            if(checked)
            {
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
    // AUTOSAVE END

    // INFO PANEL START
    function infoPanelScript() {
        'use strict';

        var gmCont = document.getElementById("gamemap-container");

        function getTiles(name)
        {
            return (gmCont.innerHTML.match(new RegExp(name, "g")) || []).length;
        }

        var infoPanel = document.createElement("div");
        infoPanel.innerHTML = `<table cellpadding'2'='' style='background-color: #EEEEEE; border: 1px solid #AAAAAA; ' cellspacing='0'>
<tbody><tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralcity.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='cities'>6</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutralbase.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='bases'>5</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/plain.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='plains'>5</span></b></td>
<td style='width: 50px; text-align: right;'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/mountain.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='mountains'>5</span></b></td>
</tr>
<tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralport.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='ports'>1</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutralairport.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='airports'>2</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/vroad.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='roads'>2</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/vriver.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='rivers'>2</span></b></td>
</tr>
<tr>
<td style='padding-left: 2px;'><img src='https://awbw.amarriner.com/terrain/${theme}/neutralcomtower.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='towers'>3</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/neutrallab.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='labs'>1</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/wood.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='forests'>1</span></b></td>
<td style='width: 50px; text-align: right'> &nbsp; <img src='https://awbw.amarriner.com/terrain/${theme}/sea.gif'></td>
<td style='vertical-align: middle; text-align: right; padding-right: 2px;'><b> &nbsp; <span class='small_text_11' id='seas'>1</span></b></td>
</tr>
</tbody></table>`;
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

        function updateInfo()
        {
            cities.textContent = getTiles("city\.");
            bases.textContent = getTiles("base\.");
            ports.textContent = getTiles("(?<!air)port\.");
            airports.textContent = getTiles("airport\.");
            towers.textContent = getTiles("comtower\.");
            labs.textContent = getTiles("lab\.");
            plains.textContent = getTiles("plain\.");
            roads.textContent = getTiles("(road\.|bridge\.)");
            forests.textContent = getTiles("wood\.");
            mountains.textContent = getTiles("mountain\.");
            rivers.textContent = getTiles("river\.");
            seas.textContent = getTiles("(sea\.|reef\.)");
        }

        setInterval(updateInfo, 500);
    }
    // INFO PANEL END

    // ASYNC SAVE START

    function asyncSaveScript()
    {
        var saveButton = Object.values(document.getElementsByClassName("norm2")).filter(e => e.textContent.includes("Save"))[0];
        var saveButtonText = Object.values(document.getElementsByTagName("B")).filter(b => b.textContent === "Save")[0];

        function saveAsync()
        {
            saveButton.parentNode.style = "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px; background-color: silver;";
            saveButton.style = "display: block; height: 100%; pointer-events: none;";
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

        function onSuccess(res)
        {
            saveButton.parentNode.style = "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;";
            saveButton.style = "display: block; height: 100%;";
            saveButtonText.textContent = "Save";
        }

        function onError(res)
        {
            saveButton.parentNode.style = "border-right: solid 1px #888888; text-align:left; padding-left: 5px; padding-right: 5px;";
            saveButton.style = "display: block; height: 100%;";
            saveButtonText.textContent = "Save";

            alert("An error has occurred while trying to save. Please make sure you are connected to the internet.");
        }

        saveButton.href = "#";
        saveButton.onclick = saveAsync;
    }

    // ASYNC SAVE END

    // UNIT SELECT START

    function unitSelectScript()
    {
        var innerUnitTable = document.getElementById("design-map-unit-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
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

    // UNIT SELECT END

    // TERRAIN SELECT START

    function terrainSelectScript()
    {
        var tableElement = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[2].childNodes[0];
        tableElement.setAttribute("class", "bordergrey");
        tableElement.innerHTML = `<a href=\"javascript:changeSquare(111, 'missilesilo.gif', 'neutral'); closeMenu(buildingTable);\">
<img id=\"missilesilo.gif\" class=\"design\" src=\"https://awbw.amarriner.com/terrain/${theme}/missilesilo.gif\" style=\"margin: auto 2px;\" border=\"type=image\"></a>`;

        showBuildings = () => {
            if(!buildingVisible) {
                var elLeft = getOffset(currentBuilding).left;
                var elTop = getOffset(currentBuilding).top;
                var containerLeft = getOffset(gameContainer).left;
                var containerTop = getOffset(gameContainer).top;
                applyCSS(buildingTable, {
                    left: (elLeft - containerLeft - 50) + "px",
                    top: (elTop - containerTop + 45) + "px",
                    visibility: 'visible'
                });

                buildingVisible = 1;

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
                } else {
                    changeSquare(id, terrain_name, 'building');
                }
            }
            else {
                closeMenu(buildingTable);
                buildingVisible = 0;
            }
        };

        var innerTerrainTable = document.getElementById("design-map-terrain-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
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

        var innerBuildingTable = document.getElementById("design-map-building-table").childNodes[1].childNodes[1].childNodes[2].childNodes[0];
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

        var containerTable = document.getElementById("design-map-misc-controls").childNodes[1];
        var countryDisplay = document.getElementById("current-country");

        countryDisplay.style = "display: none;";
        containerTable.width = 175;
    }

    // TERRAIN SELECT END

    // CREATE MAP START

    function createMapScript()
    {
        var innerCreateMapTable = Object.values(document.querySelectorAll("form")).filter(f => f.name === "" && f.action === "https://awbw.amarriner.com/design.php" && f.className !== "login-form")[0].parentElement;
        innerCreateMapTable.innerHTML = `<form name=\"\" create1=\"\" action=\"design.php\" method=\"post\">
    <table cellspacing=\"1\" cellpadding=\"2\">
        <tbody>
            <tr>
                <td>Map Name:</td>
                <td><input type=\"text\" class=\"text\" name=\"maps_name\" maxlength=\"100\" style=\"padding-left: 3px;\"></td>
            </tr>
            <tr>
                <td style=\"text-align: right;\">Width:</td>
                <td>
                    <input class=\"text\" name=\"maps_width\" min=\"5\" max=\"36\" value="20" type=\"number\" style=\"width: 32%; padding-left: 3px;\">
                </td>
            </tr>
            <tr>
                <td style=\"text-align: right;\">Height:</td>
                <td>
                    <input class=\"text\" name=\"maps_height\" min=\"5\" max=\"36\" value="20" type=\"number\" style=\"width: 32%; padding-left: 3px;\">
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
    }

    // CREATE MAP END

    // CLICKTHROUGH START

    function clickThroughScript()
    {
        for (var b = 0; b <= mapheight; b++) {
            for (var a = 0; a <= mapwidth; a++) {
                var x = a; if (a < 10) { x = '0' + a; }
                var y = b; if (b < 10) { y = '0' + b; }
                var squareSpan = document.getElementById(`square${x}${y}`);
                squareSpan.style.pointerEvents = "none";
                var onClickString = "javascript:" + squareSpan.querySelector("img").onclick.toString().split('\n')[1].split(';')[0] + ";";
                var newA = document.createElement("a");
                newA.setAttribute(
                    "style",
                    "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block;"
                );
                newA.setAttribute(
                    "href",
                    onClickString
                );
                squareSpan.appendChild(newA);

                squareSpan.style.borderLeft = "";
                squareSpan.style.borderTop = "";
                squareSpan.style.borderBottom = "";
                squareSpan.style.borderRight = "";
            }
        }

        oldupdate = (square, hidden, x, y, thetop) => {
            //close menus
            closeMenu(terrainTable);
            closeMenu(countryTable);
            closeMenu(buildingTable);
            closeMenu(unitTable);

            var tx = x;
            if (tx < 10) {
                tx = "0" + x;
            }
            var ty = y;
            if (ty < 10) {
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
                    "width: inherit; aspect-ratio: 1/1; position: relative; top: -16px; pointer-events: all; display: block;"
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
                newhref.setAttribute(
                    "href",
                    `javascript:update('${square}', ${hidden}, ${x}, ${y}, ${thetop})`
                );
                theNode.appendChild(newhref);
                if (type != "delete") {
                    newimg = document.createElement("img");
                    newimg.setAttribute("src", `terrain/${theme}/` + code + units_img[curndx]);
                    newimg.setAttribute("border", 0);
                    theNode.firstChild.appendChild(newimg);
                    newimg.classList.add("predeployed-unit-img");

                    if (!curndx) {
                        theNode.style.top = thetop + tops[1];
                    } else {
                        theNode.style.top = thetop + tops[curndx];
                    }
                    theUnitNode.setAttribute("value", x + "," + y + "," + units[curndx]);
                    theCodeNode.setAttribute("value", x + "," + y + "," + code);
                } else {
                    theUnitNode.setAttribute("value", "");
                    theCodeNode.setAttribute("value", "");
                }
            }
        };

        function fixBorder()
        {
            var gmContainer = document.getElementById("gamemap-container");
            gmContainer.style.border = "3px solid black";
        }

        fixBorder();
    }

    // CLICKTHROUGH END

    // SYMMETRY CHECKER START

    function symmetryCheckerScript()
    {
        var mapObj = [];
        var innerSymm = Object.values(document.getElementsByClassName("norm")).filter(n => n.textContent.includes("Symm:"))[0];

        var badge = document.createElement("b");
        badge.setAttribute("style", "width: 20px; line-height: 20px; border-radius: 50%; color: #fff; text-align: center; background: red; display: none; aspect-ratio: 1/1; padding-left: 0px; margin-left: 1px; vertical-align: middle;");
        badge.setAttribute("id", "symm-badge");
        badge.setAttribute("title", "");
        innerSymm.appendChild(badge);

        var check = document.createElement("b");
        check.setAttribute("style", "color: green; font-size: 17px; vertical-align: middle; padding-right: 1px; display: none;");
        check.setAttribute("id", "symm-check");
        check.setAttribute("title", "Map is symmetrical");
        check.textContent = "✓";
        innerSymm.appendChild(check);

        function getPointsFromSymmetry(x, y)
        {
            var points = [];
            var fx = mapwidth - x;
            var fy = mapheight - y;
            var stype = document.getElementById('set-symmetry').value;

            // Rotate 2Q
            if (stype == 4) {
                points.push({x: fx, y: fy});
            }

            // Rotate 4Q
            if (stype == 6) {
                points.push({x: fx, y: fy});
                points.push({x: y, y: fx});
                points.push({x: fy, y: x});
            }

            // Flip X
            if (stype == 3) {
                points.push({x: fx, y: y});
            }

            // Flip Y
            if (stype == 5) {
                points.push({x: x, y: fy});
            }

            // Diagonal X
            if (stype == 1) {
                points.push({x: y, y: x});
            }

            // Diagonal Y
            if (stype == 2) {
                points.push({x: fy, y: fx});
            }

            // Flip 4Q
            if (stype == 7) {
                points.push({x: fx, y: fy});
                points.push({x: fx, y: y});
                points.push({x: x, y: fy});
            }

            return points;
        }

        function fillMapObj()
        {
            mapObj = [];

            for (var b = 0; b <= mapheight; b++) {
                var mapRow = [];

                for (var a = 0; a <= mapwidth; a++) {
                    var x = a; if (a < 10) { x = '0' + a; }
                    var y = b; if (b < 10) { y = '0' + b; }

                    var squareSrc = document.getElementById(`square${x}${y}`).querySelector("img").src;
                    squareSrc = squareSrc.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/(aw1|aw2|ani)\/)[\w\.]+/)[0];

                    if(squareSrc.includes("road.")) squareSrc = "road";
                    if(squareSrc.includes("river.")) squareSrc = "river";
                    if(squareSrc.includes("bridge.")) squareSrc = "bridge";
                    if(squareSrc.includes("pipe.")) squareSrc = "pipe";
                    if(squareSrc.includes("pipeseam.")) squareSrc = "pipeseam";
                    if(squareSrc.includes("piperubble.")) squareSrc = "piperubble";
                    if(squareSrc.includes("pipeend.")) squareSrc = "pipeend";
                    if(squareSrc.includes("shoal")) squareSrc = "shoal";
                    if(squareSrc.match(/(?<!neutral)city\./)) squareSrc = "ownedcity";
                    if(squareSrc.match(/(?<!neutral)base\./)) squareSrc = "ownedbase";
                    if(squareSrc.match(/(?<!neutral|air)port\./)) squareSrc = "ownedport";
                    if(squareSrc.match(/(?<!neutral)airport\./)) squareSrc = "ownedairport";
                    if(squareSrc.match(/(?<!neutral)hq\./)) squareSrc = "ownedhq";
                    if(squareSrc.match(/(?<!neutral)comtower\./)) squareSrc = "ownedcomtower";
                    if(squareSrc.match(/(?<!neutral)lab\./)) squareSrc = "ownedlab";

                    mapRow.push(squareSrc);
                }

                mapObj.push(mapRow);
            }
        }

        function getTile(x, y)
        {
            return mapObj[y][x];
        }

        function Point(x, y)
        {
            return {x: x, y: y};
        }

        function isEqual(p1, p2)
        {
            return p1.x === p2.x && p1.y === p2.y;
        }

        function getAsymmetries()
        {
            var asymms = [];
            var stype = document.getElementById('set-symmetry').value;
            var skipCoords = [];

            if(stype === "0")
            {
                return null;
            }

            for (var y = 0; y <= mapheight; y++) {
                for (var x = 0; x <= mapwidth; x++) {
                    if(skipCoords.some(p => isEqual(p, Point(x, y))))
                    {
                        continue;
                    }

                    var symms = getPointsFromSymmetry(x, y);

                    if(stype >= 1 && stype <= 5)
                    {
                        var symm = symms[0]

                        var id = getTile(x, y);
                        var id2 = getTile(symm.x, symm.y);

                        skipCoords.push(symm);

                        if (id !== id2)
                        {
                            asymms.push([Point(x, y), Point(symm.x, symm.y)]);
                        }
                    }
                    else
                    {
                        var id = getTile(x, y);
                        var id2 = getTile(symms[0].x, symms[0].y);
                        var id3 = getTile(symms[1].x, symms[1].y);
                        var id4 = getTile(symms[2].x, symms[2].y);

                        skipCoords.push(symms[0], symms[1], symms[2]);

                        if (id !== id2 || id !== id3 || id !== id4)
                        {
                            asymms.push([Point(x, y), Point(symms[0].x, symms[0].y), Point(symms[1].x, symms[1].y), Point(symms[2].x, symms[2].y)]);
                        }
                    }
                }
            }

            return asymms;
        }

        function displayAsymms()
        {
            var symmBadge = document.getElementById("symm-badge");
            var symmCheck = document.getElementById("symm-check");

            var asymms = getAsymmetries();

            if(asymms == null)
            {
                symmBadge.style.display = "none";
                symmCheck.style.display = "none";
            }
            else if(asymms.length === 0)
            {
                symmBadge.style.display = "none";
                symmCheck.style.display = "inline";
            }
            else if(asymms[0].length === 2)
            {
                symmBadge.style.display = "inline-block";
                symmCheck.style.display = "none";
                symmBadge.textContent = asymms.length > 9 ? "9+" : asymms.length;

                var titleString = "Map is asymmetrical:";
                for (var i = 0; i < Math.min(asymms.length, 9); i++)
                {
                    var a = asymms[i];
                    titleString += '\n' + `Asymmetry at (${a[0].x}, ${a[0].y}) and (${a[1].x}, ${a[1].y})`;
                }

                if (asymms.length > 9)
                {
                    titleString += '\n' + `...and ${asymms.length - 9} more`;
                }

                symmBadge.title = titleString;
            }
            else
            {
                symmBadge.style.display = "inline-block";
                symmCheck.style.display = "none";
                symmBadge.textContent = asymms.length > 9 ? "9+" : asymms.length;

                var titleString = "Map is asymmetrical:";
                for (var i = 0; i < Math.min(asymms.length, 9); i++)
                {
                    var a = asymms[i];
                    titleString += '\n' + `Asymmetry at (${a[0].x}, ${a[0].y}), (${a[1].x}, ${a[1].y}), (${a[2].x}, ${a[2].y}), and (${a[3].x}, ${a[3].y})`;
                }

                if (asymms.length > 9)
                {
                    titleString += '\n' + `...and ${asymms.length - 9} more`;
                }

                symmBadge.title = titleString;
            }
        }

        function checkLoop()
        {
            fillMapObj();
            displayAsymms();
        }

        setInterval(checkLoop, 2000);
    }

    // SYMMETRY CHECKER END

    // EDITMAP.PHP START

    if(window.location.toString().startsWith("https://awbw.amarriner.com/editmap.php?maps_id="))
    {
        theme = document.getElementById("current-building").querySelector("img").src.match(/(?<=https:\/\/awbw\.amarriner\.com\/terrain\/)\w+/);

        autosaveScript();
        infoPanelScript();
        asyncSaveScript();
        unitSelectScript();
        terrainSelectScript();
        clickThroughScript();
        symmetryCheckerScript();
    }

    // EDITMAP.PHP END

    // DESIGN.PHP START

    if(window.location.toString().startsWith("https://awbw.amarriner.com/design.php"))
    {
        createMapScript();
    }

    // DESIGN.PHP END
})();
