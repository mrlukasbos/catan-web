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
t_EN["DESERT"] = "desert";
t_EN["WAITING_FOR_TAKEOFF"] = "waiting for game to start";
t_EN["JOIN_GAME"] = "join game";
t_EN["START_GAME"] = "start game";
t_EN["LEAVE_GAME"] = "leave game";
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
t_EN["BUY_DEVELOPMENT"] = "buy development card";
t_EN["CLEAR_ACTIONS"] = "clear actions";
t_EN["WAITING_FOR_PLAYERS"] = "waiting for players";
t_EN["WAITING_FOR_TAKEOFF"] = "waiting for takeoff";
t_EN["GAME_RUNNING"] = "running";
t_EN["CANCEL"] = "cancel";
t_EN["APPLY"] = "apply";
t_EN["SETUP"] = "determine first player";
t_EN["INITIAL_BUILDING"] = "first buildphase";
t_EN["THROW_DICE"] = "throwing dice";
t_EN["FORCE_DISCARD"] = "force discard";
t_EN["MOVE_BANDIT"] = "move bandit";
t_EN["STEAL_CARD"] = "steal card";
t_EN["TRADING"] = "trade with bank";
t_EN["BUILDING"] = "building";
t_EN["SETTINGS"] = "settings";
t_EN["LANGUAGE"] = "language";

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
t_NL["DESERT"] = "woestijn";
t_NL["WAITING_FOR_TAKEOFF"] = "wachten tot het spel start";
t_NL["JOIN_GAME"] = "neem deel aan spel";
t_NL["START_GAME"] = "start spel";
t_NL["LEAVE_GAME"] = "verlaat spel";
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
t_NL["BUY_DEVELOPMENT"] = "koop ontwikkelingskaart";
t_NL["CLEAR_ACTIONS"] = "verwijder acties";
t_NL["WAITING_FOR_PLAYERS"] = "wachten op spelers";
t_NL["WAITING_FOR_TAKEOFF"] = "wachten tot spel start";
t_NL["GAME_RUNNING"] = "spel is gestart";
t_NL["CANCEL"] = "annuleren";
t_NL["APPLY"] = "toepassen";
t_NL["SETUP"] = "eerste speler bepalen";
t_NL["INITIAL_BUILDING"] = "eerste bouwronde";
t_NL["THROW_DICE"] = "dobbelsteen gooien";
t_NL["FORCE_DISCARD"] = "verplicht kaarten afleggen";
t_NL["MOVE_BANDIT"] = "verplaats de bandiet";
t_EN["STEAL_CARD"] = "steel een kaart";
t_NL["TRADING"] = "ruilen met de bank";
t_NL["BUILDING"] = "bouwen";
t_NL["SETTINGS"] = "instellingen";
t_NL["LANGUAGE"] = "taal";

 // lowercase translation
function t(key) {
    if (key === undefined) return "";
    var result;
    if (lang == 'NL') { result = t_NL[key];}
    else { result = t_EN[key];}
    return (result === undefined) ? key : result;
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