/*
Translations.

Contents:
    - EN
    - NL
*/

import { Language } from './type/lang';

export let lang = Language.EN;

export const t_EN = new Map();
t_EN.set("HARBOUR_WOOD", "wood harbour");
t_EN.set("HARBOUR_STONE", "stone harbour");
t_EN.set("HARBOUR_WOOL", "wool harbour");
t_EN.set("HARBOUR_ORE", "ore harbour");
t_EN.set("HARBOUR_GRAIN", "grain harbour");
t_EN.set("HARBOUR_ALL", "generic harbour");
t_EN.set("STONE", "stone");
t_EN.set("WOOL", "wool");
t_EN.set("ORE", "ore");
t_EN.set("GRAIN", "grain");
t_EN.set("WOOD", "wood");
t_EN.set("DESERT", "desert");
t_EN.set("WAITING_FOR_TAKEOFF", "waiting for game to start");
t_EN.set("JOIN_GAME", "join game");
t_EN.set("START_GAME", "start game");
t_EN.set("LEAVE_GAME", "leave game");
t_EN.set("STOP_GAME", "stop game");
t_EN.set("CONNECT", "connect");
t_EN.set("DISCONNECT", "disconnect");
t_EN.set("DEV_MODE", "dev mode");
t_EN.set("ON", "on");
t_EN.set("OFF", "off");
t_EN.set("YOUR_TURN", "your turn");
t_EN.set("TRADE", "trade");
t_EN.set("CURRENT_RESOURCES", "current resources");
t_EN.set("ACTIONS_HINT", "You have not chosen any actions for this turn yet. Click on the board to build streets, villages and cities or click the trade button to trade resources.");
t_EN.set("FINISH_TURN", "Finish turn");
t_EN.set("NO_PLAYERS_CONNECTED", "no players connected");
t_EN.set("DEVELOPMENT_CARDS", "development cards");
t_EN.set("RESOURCES", "resources");
t_EN.set("UNUSED", "unused");
t_EN.set("BUY_DEVELOPMENT", "buy development card");
t_EN.set("CLEAR_ACTIONS", "clear actions");
t_EN.set("WAITING_FOR_PLAYERS", "waiting for players");
t_EN.set("WAITING_FOR_TAKEOFF", "waiting for takeoff");
t_EN.set("GAME_RUNNING", "running");
t_EN.set("CANCEL", "cancel");
t_EN.set("APPLY", "apply");
t_EN.set("SETUP", "determine first player");
t_EN.set("INITIAL_BUILDING", "first buildphase");
t_EN.set("THROW_DICE", "throwing dice");
t_EN.set("FORCE_DISCARD", "force discard");
t_EN.set("MOVE_BANDIT", "move bandit");
t_EN.set("STEAL_CARD", "steal card");
t_EN.set("TRADING", "trade with bank");
t_EN.set("BUILDING", "building");
t_EN.set("YOUR_FORCE_DISCARD", "discarding");
t_EN.set("FINISH_DISCARD", "confirm discard");
t_EN.set("SETTINGS", "settings");
t_EN.set("LANGUAGE", "language");

export const t_NL = new Map();
t_NL.set("HARBOUR_WOOD", "hout haven");
t_NL.set("HARBOUR_STONE", "steen haven");
t_NL.set("HARBOUR_WOOL", "wol haven");
t_NL.set("HARBOUR_ORE", "erts haven");
t_NL.set("HARBOUR_GRAIN", "graan haven");
t_NL.set("HARBOUR_ALL", "normale haven");
t_NL.set("STONE", "steen");
t_NL.set("WOOL", "wol");
t_NL.set("ORE", "erts");
t_NL.set("GRAIN", "graan");
t_NL.set("WOOD", "hout");
t_NL.set("DESERT", "woestijn");
t_NL.set("WAITING_FOR_TAKEOFF", "wachten tot het spel start");
t_NL.set("JOIN_GAME", "neem deel aan spel");
t_NL.set("START_GAME", "start spel");
t_NL.set("LEAVE_GAME", "verlaat spel");
t_NL.set("STOP_GAME", "stop spel");
t_NL.set("CONNECT", "verbinden");
t_NL.set("DISCONNECT", "verbreek verbinding");
t_NL.set("DEV_MODE", "Ontwikkelaarsmodus");
t_NL.set("ON", "aan");
t_NL.set("OFF", "uit");
t_NL.set("YOUR_TURN", "jouw beurt");
t_NL.set("TRADE", "handelen");
t_NL.set("CURRENT_RESOURCES", "huidige grondstoffen");
t_NL.set("ACTIONS_HINT", "Je hebt nog geen acties gekozen voor deze beurt. Klik op het bord om straten, dorpen en steden te bouwen of klik op de handel knop om grondstoffen te verhandelen.");
t_NL.set("FINISH_TURN", "beëindig beurt");
t_NL.set("NO_PLAYERS_CONNECTED", "geen spelers verbonden");
t_NL.set("DEVELOPMENT_CARDS", "ontwikkelingskaarten");
t_NL.set("RESOURCES", "grondstoffen");
t_NL.set("UNUSED", "ongebruikt");
t_NL.set("BUY_DEVELOPMENT", "koop ontwikkelingskaart");
t_NL.set("CLEAR_ACTIONS", "verwijder acties");
t_NL.set("WAITING_FOR_PLAYERS", "wachten op spelers");
t_NL.set("WAITING_FOR_TAKEOFF", "wachten tot spel start");
t_NL.set("GAME_RUNNING", "spel is gestart");
t_NL.set("CANCEL", "annuleren");
t_NL.set("APPLY", "toepassen");
t_NL.set("SETUP", "eerste speler bepalen");
t_NL.set("INITIAL_BUILDING", "eerste bouwronde");
t_NL.set("THROW_DICE", "dobbelsteen gooien");
t_NL.set("FORCE_DISCARD", "verplicht kaarten afleggen");
t_NL.set("MOVE_BANDIT", "verplaats de bandiet");
t_EN.set("STEAL_CARD", "steel een kaart");
t_NL.set("TRADING", "ruilen met de bank");
t_NL.set("BUILDING", "bouwen");
t_NL.set("YOUR_FORCE_DISCARD", "kaarten afleggen");
t_NL.set("FINISH_DISCARD", "kaarten afleggen");
t_NL.set("SETTINGS", "instellingen");
t_NL.set("LANGUAGE", "taal");

// lowercase translation
function t(key: string) {
  if (key === undefined) return "";
  var result;
  if (lang == Language.NL) { result = t_NL.get(key);}
  else { result = t_EN.get(key);}
  return (result === undefined) ? key : result;
}

// uppercase translation
function T(key: string) {
  var str = t(key);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setGlobalLanguage(new_lang: Language) {
  lang = new_lang;
}

export {t, T, setGlobalLanguage}