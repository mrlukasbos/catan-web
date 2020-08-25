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
t_EN["DEV_MODE"] = "dev mode";
t_EN["ON"] = "on";
t_EN["OFF"] = "off";

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
t_NL["CONNECT"] = "Verbinden";
t_NL["DEV_MODE"] = "Ontwikkelaarsmodus";
t_NL["ON"] = "aan";
t_NL["OFF"] = "uit";
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