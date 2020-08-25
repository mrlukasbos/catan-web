/*
Translations.

Contents:
    - EN
    - NL
*/

export var lang = 'EN';

export var t_EN = new Map();
t_EN["HARBOUR_WOOD"] = "wood harbour";
t_EN["HARBOUR_STONE"] = "stone harbour";
t_EN["HARBOUR_WOOL"] = "wool harbour";
t_EN["HARBOUR_ORE"] = "ore harbour";
t_EN["HARBOUR_GRAIN"] = "grain harbour";
t_EN["HARBOUR_ALL"] = "generic harbour";
t_EN["STONE"] = "stone";
t_EN["WOOL"] = "wool";
t_EN["ORE"] = "ore";
t_EN["GRAIN"] = "grain";
t_EN["WOOD"] = "wood";
t_EN["WAITING_FOR_TAKEOFF"] = "waiting for game to start";
t_EN["JOIN_GAME"] = "join game";
t_EN["START_GAME"] = "start game";
t_EN["STOP_GAME"] = "stop game";
t_EN["CONNECT"] = "connect";
t_EN["DISCONNECT"] = "disconnect";
t_EN["DEV_MODE"] = "dev mode";
t_EN["ON"] = "on";
t_EN["OFF"] = "off";
t_EN["YOUR_TURN"] = "your turn";
t_EN["TRADE"] = "trade";
t_EN["CURRENT_RESOURCES"] = "current resources";
t_EN["ACTIONS_HINT"] = "You have not chosen any actions for this turn yet. Click on the board to build streets, villages and cities or click the trade button to trade resources.";
t_EN["FINISH_TURN"] = "Finish turn";
t_EN["NO_PLAYERS_CONNECTED"] = "no players connected";
t_EN["DEVELOPMENT_CARDS"] = "development cards";
t_EN["RESOURCES"] = "resources";
t_EN["UNUSED"] = "unused";

export var t_NL = new Map();
t_NL["HARBOUR_WOOD"] = "hout haven";
t_NL["HARBOUR_STONE"] = "steen haven";
t_NL["HARBOUR_WOOL"] = "wol haven";
t_NL["HARBOUR_ORE"] = "erts haven";
t_NL["HARBOUR_GRAIN"] = "graan haven";
t_NL["HARBOUR_ALL"] = "normale haven";
t_NL["STONE"] = "steen";
t_NL["WOOL"] = "wol";
t_NL["ORE"] = "erts";
t_NL["GRAIN"] = "graan";
t_NL["WOOD"] = "hout";
t_NL["WAITING_FOR_TAKEOFF"] = "wachten tot het spel start";
t_NL["JOIN_GAME"] = "neem deel aan spel";
t_NL["START_GAME"] = "start spel";
t_NL["STOP_GAME"] = "stop spel";
t_NL["CONNECT"] = "verbinden";
t_NL["DISCONNECT"] = "verbreek verbinding";
t_NL["DEV_MODE"] = "Ontwikkelaarsmodus";
t_NL["ON"] = "aan";
t_NL["OFF"] = "uit";
t_NL["YOUR_TURN"] = "jouw beurt";
t_NL["TRADE"] = "handelen";
t_NL["CURRENT_RESOURCES"] = "huidige grondstoffen";
t_NL["ACTIONS_HINT"] = "Je hebt nog geen acties gekozen voor deze beurt. Klik op het bord om straten, dorpen en steden te bouwen of klik op de handel knop om grondstoffen te verhandelen.";
t_NL["FINISH_TURN"] = "beëindig beurt";
t_NL["NO_PLAYERS_CONNECTED"] = "geen spelers verbonden";
t_NL["DEVELOPMENT_CARDS"] = "ontwikkelingskaarten";
t_NL["RESOURCES"] = "grondstoffen";
t_NL["UNUSED"] = "ongebruikt";

 // lowercase translation
function t(key) {
    var result;
    if (lang == 'NL') { result = t_NL[key];}
    else { result = t_EN[key];}
    return (result === undefined) ? "" : result;
}

// uppercase translation
function T(key) {
    var str = t(key);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setGlobalLanguage(new_lang) {
    lang = new_lang;
}

export {t, T, setGlobalLanguage}