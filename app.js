const STORAGE_KEY = "albion-rohstoffrechner-state-v1";

const cities = [
  "Bridgewatch",
  "Fort Sterling",
  "Lymhurst",
  "Martlock",
  "Thetford",
  "Caerleon",
  "Brecilien",
];

const priceTypes = ["Niedrigster", "Höchster", "Durchschnitt"];

const tiers = [
  "2", "3",
  "4.0", "4.1", "4.2", "4.3", "4.4",
  "5.0", "5.1", "5.2", "5.3", "5.4",
  "6.0", "6.1", "6.2", "6.3", "6.4",
  "7.0", "7.1", "7.2", "7.3", "7.4",
  "8.0", "8.1", "8.2", "8.3", "8.4",
];

const craftingRules = {
  "2": { previous: null, woodPerPlank: 1, downstream: ["3"] },
  "3": { previous: "2", woodPerPlank: 2, downstream: ["4.0", "4.1", "4.2", "4.3", "4.4"] },
  "4.0": { previous: "3", woodPerPlank: 2, downstream: ["5.0"] },
  "4.1": { previous: "3", woodPerPlank: 2, downstream: ["5.1"] },
  "4.2": { previous: "3", woodPerPlank: 2, downstream: ["5.2"] },
  "4.3": { previous: "3", woodPerPlank: 2, downstream: ["5.3"] },
  "4.4": { previous: "3", woodPerPlank: 2, downstream: ["5.4"] },
  "5.0": { previous: "4.0", woodPerPlank: 3, downstream: ["6.0"] },
  "5.1": { previous: "4.1", woodPerPlank: 3, downstream: ["6.1"] },
  "5.2": { previous: "4.2", woodPerPlank: 3, downstream: ["6.2"] },
  "5.3": { previous: "4.3", woodPerPlank: 3, downstream: ["6.3"] },
  "5.4": { previous: "4.4", woodPerPlank: 3, downstream: ["6.4"] },
  "6.0": { previous: "5.0", woodPerPlank: 4, downstream: ["7.0"] },
  "6.1": { previous: "5.1", woodPerPlank: 4, downstream: ["7.1"] },
  "6.2": { previous: "5.2", woodPerPlank: 4, downstream: ["7.2"] },
  "6.3": { previous: "5.3", woodPerPlank: 4, downstream: ["7.3"] },
  "6.4": { previous: "5.4", woodPerPlank: 4, downstream: ["7.4"] },
  "7.0": { previous: "6.0", woodPerPlank: 5, downstream: ["8.0"] },
  "7.1": { previous: "6.1", woodPerPlank: 5, downstream: ["8.1"] },
  "7.2": { previous: "6.2", woodPerPlank: 5, downstream: ["8.2"] },
  "7.3": { previous: "6.3", woodPerPlank: 5, downstream: ["8.3"] },
  "7.4": { previous: "6.4", woodPerPlank: 5, downstream: ["8.4"] },
  "8.0": { previous: "7.0", woodPerPlank: 6, downstream: [] },
  "8.1": { previous: "7.1", woodPerPlank: 6, downstream: [] },
  "8.2": { previous: "7.2", woodPerPlank: 6, downstream: [] },
  "8.3": { previous: "7.3", woodPerPlank: 6, downstream: [] },
  "8.4": { previous: "7.4", woodPerPlank: 6, downstream: [] },
};

const weapons = [
  { key: "grosserFeuerstab", label: "Großer Feuerstab", planks: 20, bars: 12, artifact: null },
  { key: "feuerstab", label: "Feuerstab", planks: 16, bars: 8, artifact: null },
  { key: "inferno", label: "Inferno", planks: 20, bars: 12, artifact: null },
  { key: "wildfeuer", label: "Wildfeuer", planks: 16, bars: 8, artifact: "Wildfeuer Orb" },
  { key: "morgenlied", label: "Morgenlied", planks: 16, bars: 8, artifact: "Glowing Hormonic Ring" },
  { key: "blaizing", label: "Blaizing", planks: 20, bars: 12, artifact: "Unholy Scroll" },
  { key: "brimstone", label: "Brimstone", planks: 20, bars: 12, artifact: "Burning Orb" },
  { key: "flammenlaeufer", label: "Flammenläufer", planks: 16, bars: 8, artifact: "Pyreheart Crystal" },
];

const rohstoffNotes = [
  "Produktionswunsch ist immer die gewünschte Endmenge an Planken.",
  "Grüne Zellen sind Eingabefelder: Produktionswunsch, IST Holz Lager, IST Planken Lager sowie Marktpreise.",
  "Blaue Zellen sind Berechnungsfelder und bilden die Excel-Logik direkt nach.",
  "Holzpreis Kauf bepreist nur die zusätzlich zu kaufende Holzmenge.",
  "Vorhandene Vorstufen-Planken reduzieren automatisch den Bedarf der unteren Stufen.",
];

const herstellungNotes = [
  "Ziel = gewünschter Bestand je Stab und Tier.",
  "End = vorhandener Endbestand. Fehlmenge = Ziel - End.",
  "Einsatz rechnet nur die herzustellende Fehlmenge mit MAX(Ziel - End, 0).",
  "Rückgewinn rechnet mit MIN(Ziel, End) entsprechend der Excel-Formeln.",
  "Kapital-Einsatz und Kapital-Rückgewinn nutzen nur den Plankenpreis des jeweiligen Tiers.",
];

const defaultMarketWood = {
  "2": { "Bridgewatch": { "Niedrigster": 59, "Höchster": 60, "Durchschnitt": 60 }, "Fort Sterling": { "Niedrigster": 83, "Höchster": 83, "Durchschnitt": 83 }, "Lymhurst": { "Niedrigster": 42, "Höchster": 43, "Durchschnitt": 43 }, "Martlock": { "Niedrigster": 46, "Höchster": 46, "Durchschnitt": 46 }, "Thetford": { "Niedrigster": 49, "Höchster": 55, "Durchschnitt": 52 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 41, "Höchster": 42, "Durchschnitt": 42 } },
  "3": { "Bridgewatch": { "Niedrigster": 111, "Höchster": 137, "Durchschnitt": 124 }, "Fort Sterling": { "Niedrigster": 124, "Höchster": 170, "Durchschnitt": 147 }, "Lymhurst": { "Niedrigster": 117, "Höchster": 126, "Durchschnitt": 122 }, "Martlock": { "Niedrigster": 105, "Höchster": 106, "Durchschnitt": 106 }, "Thetford": { "Niedrigster": 121, "Höchster": 123, "Durchschnitt": 122 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 125, "Höchster": 125, "Durchschnitt": 125 } },
  "4.0": { "Bridgewatch": { "Niedrigster": 82, "Höchster": 83, "Durchschnitt": 83 }, "Fort Sterling": { "Niedrigster": 96, "Höchster": 113, "Durchschnitt": 105 }, "Lymhurst": { "Niedrigster": 81, "Höchster": 89, "Durchschnitt": 85 }, "Martlock": { "Niedrigster": 83, "Höchster": 85, "Durchschnitt": 84 }, "Thetford": { "Niedrigster": 83, "Höchster": 84, "Durchschnitt": 84 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 86, "Höchster": 88, "Durchschnitt": 87 } },
  "4.1": { "Bridgewatch": { "Niedrigster": 88, "Höchster": 89, "Durchschnitt": 89 }, "Fort Sterling": { "Niedrigster": 115, "Höchster": 119, "Durchschnitt": 117 }, "Lymhurst": { "Niedrigster": 101, "Höchster": 102, "Durchschnitt": 102 }, "Martlock": { "Niedrigster": 88, "Höchster": 89, "Durchschnitt": 89 }, "Thetford": { "Niedrigster": 97, "Höchster": 98, "Durchschnitt": 98 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 103, "Höchster": 106, "Durchschnitt": 105 } },
  "4.2": { "Bridgewatch": { "Niedrigster": 634, "Höchster": 660, "Durchschnitt": 647 }, "Fort Sterling": { "Niedrigster": 785, "Höchster": 785, "Durchschnitt": 785 }, "Lymhurst": { "Niedrigster": 725, "Höchster": 746, "Durchschnitt": 736 }, "Martlock": { "Niedrigster": 617, "Höchster": 651, "Durchschnitt": 634 }, "Thetford": { "Niedrigster": 642, "Höchster": 661, "Durchschnitt": 652 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 649, "Höchster": 678, "Durchschnitt": 664 } },
  "4.3": { "Bridgewatch": { "Niedrigster": 3200, "Höchster": 3751, "Durchschnitt": 3476 }, "Fort Sterling": { "Niedrigster": 3746, "Höchster": 4167, "Durchschnitt": 3957 }, "Lymhurst": { "Niedrigster": 3250, "Höchster": 3900, "Durchschnitt": 3575 }, "Martlock": { "Niedrigster": 3522, "Höchster": 3798, "Durchschnitt": 3660 }, "Thetford": { "Niedrigster": 3667, "Höchster": 3735, "Durchschnitt": 3701 }, "Caerleon": { "Niedrigster": 3101, "Höchster": 3913, "Durchschnitt": 3507 }, "Brecilien": { "Niedrigster": 3916, "Höchster": 3916, "Durchschnitt": 3916 } },
  "4.4": { "Bridgewatch": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Fort Sterling": { "Niedrigster": 38443, "Höchster": 38443, "Durchschnitt": 38443 }, "Lymhurst": { "Niedrigster": 35494, "Höchster": 35494, "Durchschnitt": 35494 }, "Martlock": { "Niedrigster": 27862, "Höchster": 34388, "Durchschnitt": 31125 }, "Thetford": { "Niedrigster": 34498, "Höchster": 34498, "Durchschnitt": 34498 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 33162, "Höchster": 33162, "Durchschnitt": 33162 } },
  "5.0": { "Bridgewatch": { "Niedrigster": 264, "Höchster": 267, "Durchschnitt": 266 }, "Fort Sterling": { "Niedrigster": 285, "Höchster": 297, "Durchschnitt": 291 }, "Lymhurst": { "Niedrigster": 338, "Höchster": 342, "Durchschnitt": 340 }, "Martlock": { "Niedrigster": 259, "Höchster": 260, "Durchschnitt": 260 }, "Thetford": { "Niedrigster": 263, "Höchster": 271, "Durchschnitt": 267 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 238, "Höchster": 317, "Durchschnitt": 278 } },
  "5.1": { "Bridgewatch": { "Niedrigster": 393, "Höchster": 408, "Durchschnitt": 401 }, "Fort Sterling": { "Niedrigster": 471, "Höchster": 611, "Durchschnitt": 541 }, "Lymhurst": { "Niedrigster": 435, "Höchster": 439, "Durchschnitt": 437 }, "Martlock": { "Niedrigster": 397, "Höchster": 399, "Durchschnitt": 398 }, "Thetford": { "Niedrigster": 413, "Höchster": 414, "Durchschnitt": 414 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 400, "Höchster": 405, "Durchschnitt": 403 } },
  "5.2": { "Bridgewatch": { "Niedrigster": 1250, "Höchster": 1268, "Durchschnitt": 1259 }, "Fort Sterling": { "Niedrigster": 1302, "Höchster": 1359, "Durchschnitt": 1331 }, "Lymhurst": { "Niedrigster": 1379, "Höchster": 1379, "Durchschnitt": 1379 }, "Martlock": { "Niedrigster": 904, "Höchster": 1147, "Durchschnitt": 1026 }, "Thetford": { "Niedrigster": 1194, "Höchster": 1199, "Durchschnitt": 1197 }, "Caerleon": { "Niedrigster": 1430, "Höchster": 1430, "Durchschnitt": 1430 }, "Brecilien": { "Niedrigster": 1095, "Höchster": 1147, "Durchschnitt": 1121 } },
  "5.3": { "Bridgewatch": { "Niedrigster": 10374, "Höchster": 10683, "Durchschnitt": 10529 }, "Fort Sterling": { "Niedrigster": 11136, "Höchster": 11847, "Durchschnitt": 11492 }, "Lymhurst": { "Niedrigster": 10981, "Höchster": 11012, "Durchschnitt": 10997 }, "Martlock": { "Niedrigster": 10600, "Höchster": 10862, "Durchschnitt": 10731 }, "Thetford": { "Niedrigster": 10770, "Höchster": 11925, "Durchschnitt": 11348 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 10603, "Höchster": 11450, "Durchschnitt": 11027 } },
  "5.4": { "Bridgewatch": { "Niedrigster": 50985, "Höchster": 50985, "Durchschnitt": 50985 }, "Fort Sterling": { "Niedrigster": 53985, "Höchster": 53985, "Durchschnitt": 53985 }, "Lymhurst": { "Niedrigster": 54946, "Höchster": 54946, "Durchschnitt": 54946 }, "Martlock": { "Niedrigster": 55005, "Höchster": 55005, "Durchschnitt": 55005 }, "Thetford": { "Niedrigster": 50262, "Höchster": 50262, "Durchschnitt": 50262 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 45542, "Höchster": 45542, "Durchschnitt": 45542 } },
  "6.0": { "Bridgewatch": { "Niedrigster": 864, "Höchster": 936, "Durchschnitt": 900 }, "Fort Sterling": { "Niedrigster": 941, "Höchster": 966, "Durchschnitt": 954 }, "Lymhurst": { "Niedrigster": 948, "Höchster": 968, "Durchschnitt": 958 }, "Martlock": { "Niedrigster": 845, "Höchster": 850, "Durchschnitt": 848 }, "Thetford": { "Niedrigster": 951, "Höchster": 952, "Durchschnitt": 952 }, "Caerleon": { "Niedrigster": 792, "Höchster": 792, "Durchschnitt": 792 }, "Brecilien": { "Niedrigster": 843, "Höchster": 874, "Durchschnitt": 859 } },
  "6.1": { "Bridgewatch": { "Niedrigster": 1207, "Höchster": 1220, "Durchschnitt": 1214 }, "Fort Sterling": { "Niedrigster": 1355, "Höchster": 1482, "Durchschnitt": 1419 }, "Lymhurst": { "Niedrigster": 1352, "Höchster": 1359, "Durchschnitt": 1356 }, "Martlock": { "Niedrigster": 1279, "Höchster": 1654, "Durchschnitt": 1467 }, "Thetford": { "Niedrigster": 1332, "Höchster": 1379, "Durchschnitt": 1356 }, "Caerleon": { "Niedrigster": 1154, "Höchster": 1154, "Durchschnitt": 1154 }, "Brecilien": { "Niedrigster": 1231, "Höchster": 1234, "Durchschnitt": 1233 } },
  "6.2": { "Bridgewatch": { "Niedrigster": 5869, "Höchster": 6740, "Durchschnitt": 6305 }, "Fort Sterling": { "Niedrigster": 6301, "Höchster": 7698, "Durchschnitt": 7000 }, "Lymhurst": { "Niedrigster": 6997, "Höchster": 6997, "Durchschnitt": 6997 }, "Martlock": { "Niedrigster": 6192, "Höchster": 7556, "Durchschnitt": 6874 }, "Thetford": { "Niedrigster": 6026, "Höchster": 6514, "Durchschnitt": 6270 }, "Caerleon": { "Niedrigster": 6255, "Höchster": 6255, "Durchschnitt": 6255 }, "Brecilien": { "Niedrigster": 5615, "Höchster": 5939, "Durchschnitt": 5777 } },
  "6.3": { "Bridgewatch": { "Niedrigster": 28330, "Höchster": 29895, "Durchschnitt": 29113 }, "Fort Sterling": { "Niedrigster": 28012, "Höchster": 29186, "Durchschnitt": 28599 }, "Lymhurst": { "Niedrigster": 30499, "Höchster": 30499, "Durchschnitt": 30499 }, "Martlock": { "Niedrigster": 28401, "Höchster": 30026, "Durchschnitt": 29214 }, "Thetford": { "Niedrigster": 28613, "Höchster": 28999, "Durchschnitt": 28806 }, "Caerleon": { "Niedrigster": 33523, "Höchster": 33523, "Durchschnitt": 33523 }, "Brecilien": { "Niedrigster": 26825, "Höchster": 30206, "Durchschnitt": 28516 } },
  "6.4": { "Bridgewatch": { "Niedrigster": 128991, "Höchster": 128991, "Durchschnitt": 128991 }, "Fort Sterling": { "Niedrigster": 134999, "Höchster": 134999, "Durchschnitt": 134999 }, "Lymhurst": { "Niedrigster": 124999, "Höchster": 124999, "Durchschnitt": 124999 }, "Martlock": { "Niedrigster": 127000, "Höchster": 127000, "Durchschnitt": 127000 }, "Thetford": { "Niedrigster": 126964, "Höchster": 126964, "Durchschnitt": 126964 }, "Caerleon": { "Niedrigster": 149998, "Höchster": 149998, "Durchschnitt": 149998 }, "Brecilien": { "Niedrigster": 139937, "Höchster": 139937, "Durchschnitt": 139937 } },
  "7.0": { "Bridgewatch": { "Niedrigster": 3030, "Höchster": 3032, "Durchschnitt": 3031 }, "Fort Sterling": { "Niedrigster": 2961, "Höchster": 3146, "Durchschnitt": 3054 }, "Lymhurst": { "Niedrigster": 3131, "Höchster": 3131, "Durchschnitt": 3131 }, "Martlock": { "Niedrigster": 2906, "Höchster": 3221, "Durchschnitt": 3064 }, "Thetford": { "Niedrigster": 2953, "Höchster": 2992, "Durchschnitt": 2973 }, "Caerleon": { "Niedrigster": 2975, "Höchster": 2975, "Durchschnitt": 2975 }, "Brecilien": { "Niedrigster": 3045, "Höchster": 3046, "Durchschnitt": 3046 } },
  "7.1": { "Bridgewatch": { "Niedrigster": 3866, "Höchster": 4118, "Durchschnitt": 3992 }, "Fort Sterling": { "Niedrigster": 4130, "Höchster": 4421, "Durchschnitt": 4276 }, "Lymhurst": { "Niedrigster": 4145, "Höchster": 4145, "Durchschnitt": 4145 }, "Martlock": { "Niedrigster": 3390, "Höchster": 3946, "Durchschnitt": 3668 }, "Thetford": { "Niedrigster": 3773, "Höchster": 4302, "Durchschnitt": 4038 }, "Caerleon": { "Niedrigster": 4610, "Höchster": 4610, "Durchschnitt": 4610 }, "Brecilien": { "Niedrigster": 3743, "Höchster": 4334, "Durchschnitt": 4039 } },
  "7.2": { "Bridgewatch": { "Niedrigster": 14040, "Höchster": 17998, "Durchschnitt": 16019 }, "Fort Sterling": { "Niedrigster": 17660, "Höchster": 17983, "Durchschnitt": 17822 }, "Lymhurst": { "Niedrigster": 18485, "Höchster": 18485, "Durchschnitt": 18485 }, "Martlock": { "Niedrigster": 16444, "Höchster": 17970, "Durchschnitt": 17207 }, "Thetford": { "Niedrigster": 16558, "Höchster": 18960, "Durchschnitt": 17759 }, "Caerleon": { "Niedrigster": 15686, "Höchster": 15686, "Durchschnitt": 15686 }, "Brecilien": { "Niedrigster": 16717, "Höchster": 18420, "Durchschnitt": 17569 } },
  "7.3": { "Bridgewatch": { "Niedrigster": 72135, "Höchster": 77967, "Durchschnitt": 75051 }, "Fort Sterling": { "Niedrigster": 75165, "Höchster": 79951, "Durchschnitt": 77558 }, "Lymhurst": { "Niedrigster": 70177, "Höchster": 70177, "Durchschnitt": 70177 }, "Martlock": { "Niedrigster": 69579, "Höchster": 73981, "Durchschnitt": 71780 }, "Thetford": { "Niedrigster": 72126, "Höchster": 77449, "Durchschnitt": 74788 }, "Caerleon": { "Niedrigster": 85000, "Höchster": 85000, "Durchschnitt": 85000 }, "Brecilien": { "Niedrigster": 75007, "Höchster": 76898, "Durchschnitt": 75953 } },
  "7.4": { "Bridgewatch": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Fort Sterling": { "Niedrigster": 343000, "Höchster": 343000, "Durchschnitt": 343000 }, "Lymhurst": { "Niedrigster": 299996, "Höchster": 299996, "Durchschnitt": 299996 }, "Martlock": { "Niedrigster": 309998, "Höchster": 309998, "Durchschnitt": 309998 }, "Thetford": { "Niedrigster": 319999, "Höchster": 319999, "Durchschnitt": 319999 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 333996, "Höchster": 333996, "Durchschnitt": 333996 } },
  "8.0": { "Bridgewatch": { "Niedrigster": 8100, "Höchster": 9554, "Durchschnitt": 8827 }, "Fort Sterling": { "Niedrigster": 10005, "Höchster": 10590, "Durchschnitt": 10298 }, "Lymhurst": { "Niedrigster": 10602, "Höchster": 10602, "Durchschnitt": 10602 }, "Martlock": { "Niedrigster": 9536, "Höchster": 10543, "Durchschnitt": 10040 }, "Thetford": { "Niedrigster": 9533, "Höchster": 9982, "Durchschnitt": 9758 }, "Caerleon": { "Niedrigster": 8397, "Höchster": 8397, "Durchschnitt": 8397 }, "Brecilien": { "Niedrigster": 9218, "Höchster": 9493, "Durchschnitt": 9356 } },
  "8.1": { "Bridgewatch": { "Niedrigster": 16689, "Höchster": 16949, "Durchschnitt": 16819 }, "Fort Sterling": { "Niedrigster": 16762, "Höchster": 19464, "Durchschnitt": 18113 }, "Lymhurst": { "Niedrigster": 12794, "Höchster": 12794, "Durchschnitt": 12794 }, "Martlock": { "Niedrigster": 16310, "Höchster": 16978, "Durchschnitt": 16644 }, "Thetford": { "Niedrigster": 16320, "Höchster": 18176, "Durchschnitt": 17248 }, "Caerleon": { "Niedrigster": 16470, "Höchster": 16470, "Durchschnitt": 16470 }, "Brecilien": { "Niedrigster": 15513, "Höchster": 16444, "Durchschnitt": 15979 } },
  "8.2": { "Bridgewatch": { "Niedrigster": 63368, "Höchster": 68998, "Durchschnitt": 66183 }, "Fort Sterling": { "Niedrigster": 63401, "Höchster": 70892, "Durchschnitt": 67147 }, "Lymhurst": { "Niedrigster": 69996, "Höchster": 69996, "Durchschnitt": 69996 }, "Martlock": { "Niedrigster": 59025, "Höchster": 68328, "Durchschnitt": 63677 }, "Thetford": { "Niedrigster": 62164, "Höchster": 69675, "Durchschnitt": 65920 }, "Caerleon": { "Niedrigster": 89995, "Höchster": 89995, "Durchschnitt": 89995 }, "Brecilien": { "Niedrigster": 62000, "Höchster": 62000, "Durchschnitt": 62000 } },
  "8.3": { "Bridgewatch": { "Niedrigster": 200013, "Höchster": 254000, "Durchschnitt": 227007 }, "Fort Sterling": { "Niedrigster": 235262, "Höchster": 255000, "Durchschnitt": 245131 }, "Lymhurst": { "Niedrigster": 251972, "Höchster": 251972, "Durchschnitt": 251972 }, "Martlock": { "Niedrigster": 235020, "Höchster": 259898, "Durchschnitt": 247459 }, "Thetford": { "Niedrigster": 235398, "Höchster": 274976, "Durchschnitt": 255187 }, "Caerleon": { "Niedrigster": 270000, "Höchster": 270000, "Durchschnitt": 270000 }, "Brecilien": { "Niedrigster": 239858, "Höchster": 239858, "Durchschnitt": 239858 } },
  "8.4": { "Bridgewatch": { "Niedrigster": 1200000, "Höchster": 1200000, "Durchschnitt": 1200000 }, "Fort Sterling": { "Niedrigster": 1267986, "Höchster": 1267986, "Durchschnitt": 1267986 }, "Lymhurst": { "Niedrigster": 1100000, "Höchster": 1100000, "Durchschnitt": 1100000 }, "Martlock": { "Niedrigster": 1199999, "Höchster": 1199999, "Durchschnitt": 1199999 }, "Thetford": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 1200000, "Höchster": 1200000, "Durchschnitt": 1200000 } },
};

const defaultMarketPlanks = {
  "2": { "Bridgewatch": { "Niedrigster": 30, "Höchster": 47, "Durchschnitt": 39 }, "Fort Sterling": { "Niedrigster": 26, "Höchster": 37, "Durchschnitt": 32 }, "Lymhurst": { "Niedrigster": 40, "Höchster": 40, "Durchschnitt": 40 }, "Martlock": { "Niedrigster": 20, "Höchster": 38, "Durchschnitt": 29 }, "Thetford": { "Niedrigster": 39, "Höchster": 44, "Durchschnitt": 42 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 38, "Höchster": 96, "Durchschnitt": 67 } },
  "3": { "Bridgewatch": { "Niedrigster": 174, "Höchster": 269, "Durchschnitt": 222 }, "Fort Sterling": { "Niedrigster": 225, "Höchster": 249, "Durchschnitt": 237 }, "Lymhurst": { "Niedrigster": 275, "Höchster": 275, "Durchschnitt": 275 }, "Martlock": { "Niedrigster": 189, "Höchster": 274, "Durchschnitt": 232 }, "Thetford": { "Niedrigster": 217, "Höchster": 284, "Durchschnitt": 251 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "4.0": { "Bridgewatch": { "Niedrigster": 315, "Höchster": 325, "Durchschnitt": 320 }, "Fort Sterling": { "Niedrigster": 224, "Höchster": 258, "Durchschnitt": 241 }, "Lymhurst": { "Niedrigster": 309, "Höchster": 309, "Durchschnitt": 309 }, "Martlock": { "Niedrigster": 219, "Höchster": 307, "Durchschnitt": 263 }, "Thetford": { "Niedrigster": 294, "Höchster": 345, "Durchschnitt": 320 }, "Caerleon": { "Niedrigster": 571, "Höchster": 571, "Durchschnitt": 571 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "4.1": { "Bridgewatch": { "Niedrigster": 320, "Höchster": 371, "Durchschnitt": 346 }, "Fort Sterling": { "Niedrigster": 297, "Höchster": 341, "Durchschnitt": 319 }, "Lymhurst": { "Niedrigster": 395, "Höchster": 395, "Durchschnitt": 395 }, "Martlock": { "Niedrigster": 360, "Höchster": 386, "Durchschnitt": 373 }, "Thetford": { "Niedrigster": 329, "Höchster": 337, "Durchschnitt": 333 }, "Caerleon": { "Niedrigster": 646, "Höchster": 646, "Durchschnitt": 646 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "4.2": { "Bridgewatch": { "Niedrigster": 1112, "Höchster": 1382, "Durchschnitt": 1247 }, "Fort Sterling": { "Niedrigster": 1108, "Höchster": 1173, "Durchschnitt": 1141 }, "Lymhurst": { "Niedrigster": 1325, "Höchster": 1325, "Durchschnitt": 1325 }, "Martlock": { "Niedrigster": 1300, "Höchster": 1434, "Durchschnitt": 1367 }, "Thetford": { "Niedrigster": 1120, "Höchster": 1261, "Durchschnitt": 1191 }, "Caerleon": { "Niedrigster": 2288, "Höchster": 2288, "Durchschnitt": 2288 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "4.3": { "Bridgewatch": { "Niedrigster": 4533, "Höchster": 5542, "Durchschnitt": 5038 }, "Fort Sterling": { "Niedrigster": 4842, "Höchster": 5379, "Durchschnitt": 5111 }, "Lymhurst": { "Niedrigster": 5667, "Höchster": 5667, "Durchschnitt": 5667 }, "Martlock": { "Niedrigster": 5006, "Höchster": 6093, "Durchschnitt": 5550 }, "Thetford": { "Niedrigster": 4321, "Höchster": 5923, "Durchschnitt": 5122 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "4.4": { "Bridgewatch": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Fort Sterling": { "Niedrigster": 36500, "Höchster": 38974, "Durchschnitt": 37737 }, "Lymhurst": { "Niedrigster": 39602, "Höchster": 39602, "Durchschnitt": 39602 }, "Martlock": { "Niedrigster": 49988, "Höchster": 49988, "Durchschnitt": 49988 }, "Thetford": { "Niedrigster": 40986, "Höchster": 40986, "Durchschnitt": 40986 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 89990, "Höchster": 89990, "Durchschnitt": 89990 } },
  "5.0": { "Bridgewatch": { "Niedrigster": 686, "Höchster": 797, "Durchschnitt": 742 }, "Fort Sterling": { "Niedrigster": 805, "Höchster": 833, "Durchschnitt": 819 }, "Lymhurst": { "Niedrigster": 715, "Höchster": 751, "Durchschnitt": 733 }, "Martlock": { "Niedrigster": 820, "Höchster": 859, "Durchschnitt": 840 }, "Thetford": { "Niedrigster": 793, "Höchster": 813, "Durchschnitt": 803 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 1290, "Höchster": 1290, "Durchschnitt": 1290 } },
  "5.1": { "Bridgewatch": { "Niedrigster": 1181, "Höchster": 2033, "Durchschnitt": 1607 }, "Fort Sterling": { "Niedrigster": 817, "Höchster": 1088, "Durchschnitt": 953 }, "Lymhurst": { "Niedrigster": 653, "Höchster": 1035, "Durchschnitt": 844 }, "Martlock": { "Niedrigster": 813, "Höchster": 1484, "Durchschnitt": 1149 }, "Thetford": { "Niedrigster": 942, "Höchster": 1200, "Durchschnitt": 1071 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "5.2": { "Bridgewatch": { "Niedrigster": 3556, "Höchster": 3995, "Durchschnitt": 3776 }, "Fort Sterling": { "Niedrigster": 3528, "Höchster": 3686, "Durchschnitt": 3607 }, "Lymhurst": { "Niedrigster": 3670, "Höchster": 3964, "Durchschnitt": 3817 }, "Martlock": { "Niedrigster": 2443, "Höchster": 4058, "Durchschnitt": 3251 }, "Thetford": { "Niedrigster": 2507, "Höchster": 3882, "Durchschnitt": 3195 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 5487, "Höchster": 5487, "Durchschnitt": 5487 } },
  "5.3": { "Bridgewatch": { "Niedrigster": 19814, "Höchster": 24998, "Durchschnitt": 22406 }, "Fort Sterling": { "Niedrigster": 21000, "Höchster": 22995, "Durchschnitt": 21998 }, "Lymhurst": { "Niedrigster": 22297, "Höchster": 22297, "Durchschnitt": 22297 }, "Martlock": { "Niedrigster": 20002, "Höchster": 24595, "Durchschnitt": 22299 }, "Thetford": { "Niedrigster": 20554, "Höchster": 25353, "Durchschnitt": 22954 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 25990, "Höchster": 25990, "Durchschnitt": 25990 } },
  "5.4": { "Bridgewatch": { "Niedrigster": 114495, "Höchster": 114495, "Durchschnitt": 114495 }, "Fort Sterling": { "Niedrigster": 95135, "Höchster": 119928, "Durchschnitt": 107532 }, "Lymhurst": { "Niedrigster": 100999, "Höchster": 100999, "Durchschnitt": 100999 }, "Martlock": { "Niedrigster": 134999, "Höchster": 134999, "Durchschnitt": 134999 }, "Thetford": { "Niedrigster": 124980, "Höchster": 124980, "Durchschnitt": 124980 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 104995, "Höchster": 104995, "Durchschnitt": 104995 } },
  "6.0": { "Bridgewatch": { "Niedrigster": 2820, "Höchster": 3159, "Durchschnitt": 2990 }, "Fort Sterling": { "Niedrigster": 3106, "Höchster": 3190, "Durchschnitt": 3148 }, "Lymhurst": { "Niedrigster": 3172, "Höchster": 3172, "Durchschnitt": 3172 }, "Martlock": { "Niedrigster": 3021, "Höchster": 3218, "Durchschnitt": 3120 }, "Thetford": { "Niedrigster": 2765, "Höchster": 3240, "Durchschnitt": 3003 }, "Caerleon": { "Niedrigster": 3892, "Höchster": 3892, "Durchschnitt": 3892 }, "Brecilien": { "Niedrigster": 3350, "Höchster": 3350, "Durchschnitt": 3350 } },
  "6.1": { "Bridgewatch": { "Niedrigster": 4854, "Höchster": 5296, "Durchschnitt": 5075 }, "Fort Sterling": { "Niedrigster": 4731, "Höchster": 5298, "Durchschnitt": 5015 }, "Lymhurst": { "Niedrigster": 590, "Höchster": 5111, "Durchschnitt": 2851 }, "Martlock": { "Niedrigster": 2584, "Höchster": 4808, "Durchschnitt": 3696 }, "Thetford": { "Niedrigster": 4003, "Höchster": 5454, "Durchschnitt": 4729 }, "Caerleon": { "Niedrigster": 7427, "Höchster": 7427, "Durchschnitt": 7427 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "6.2": { "Bridgewatch": { "Niedrigster": 19003, "Höchster": 23253, "Durchschnitt": 21128 }, "Fort Sterling": { "Niedrigster": 19415, "Höchster": 21798, "Durchschnitt": 20607 }, "Lymhurst": { "Niedrigster": 21866, "Höchster": 21866, "Durchschnitt": 21866 }, "Martlock": { "Niedrigster": 20557, "Höchster": 22579, "Durchschnitt": 21568 }, "Thetford": { "Niedrigster": 19027, "Höchster": 22097, "Durchschnitt": 20562 }, "Caerleon": { "Niedrigster": 28982, "Höchster": 28982, "Durchschnitt": 28982 }, "Brecilien": { "Niedrigster": 20890, "Höchster": 20890, "Durchschnitt": 20890 } },
  "6.3": { "Bridgewatch": { "Niedrigster": 73355, "Höchster": 85790, "Durchschnitt": 79573 }, "Fort Sterling": { "Niedrigster": 78012, "Höchster": 81654, "Durchschnitt": 79833 }, "Lymhurst": { "Niedrigster": 77000, "Höchster": 80460, "Durchschnitt": 78730 }, "Martlock": { "Niedrigster": 77528, "Höchster": 82326, "Durchschnitt": 79927 }, "Thetford": { "Niedrigster": 66006, "Höchster": 83468, "Durchschnitt": 74737 }, "Caerleon": { "Niedrigster": 99999, "Höchster": 99999, "Durchschnitt": 99999 }, "Brecilien": { "Niedrigster": 88999, "Höchster": 88999, "Durchschnitt": 88999 } },
  "6.4": { "Bridgewatch": { "Niedrigster": 341998, "Höchster": 341998, "Durchschnitt": 341998 }, "Fort Sterling": { "Niedrigster": 292022, "Höchster": 323989, "Durchschnitt": 308006 }, "Lymhurst": { "Niedrigster": 332993, "Höchster": 332993, "Durchschnitt": 332993 }, "Martlock": { "Niedrigster": 339888, "Höchster": 339888, "Durchschnitt": 339888 }, "Thetford": { "Niedrigster": 334967, "Höchster": 334967, "Durchschnitt": 334967 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 349888, "Höchster": 349888, "Durchschnitt": 349888 } },
  "7.0": { "Bridgewatch": { "Niedrigster": 10006, "Höchster": 12548, "Durchschnitt": 11277 }, "Fort Sterling": { "Niedrigster": 10563, "Höchster": 11999, "Durchschnitt": 11281 }, "Lymhurst": { "Niedrigster": 10523, "Höchster": 12297, "Durchschnitt": 11410 }, "Martlock": { "Niedrigster": 10504, "Höchster": 13590, "Durchschnitt": 12047 }, "Thetford": { "Niedrigster": 11000, "Höchster": 13266, "Durchschnitt": 12133 }, "Caerleon": { "Niedrigster": 15400, "Höchster": 15400, "Durchschnitt": 15400 }, "Brecilien": { "Niedrigster": 12180, "Höchster": 12180, "Durchschnitt": 12180 } },
  "7.1": { "Bridgewatch": { "Niedrigster": 12522, "Höchster": 17399, "Durchschnitt": 14961 }, "Fort Sterling": { "Niedrigster": 16505, "Höchster": 17467, "Durchschnitt": 16986 }, "Lymhurst": { "Niedrigster": 14003, "Höchster": 16799, "Durchschnitt": 15401 }, "Martlock": { "Niedrigster": 10157, "Höchster": 16986, "Durchschnitt": 13572 }, "Thetford": { "Niedrigster": 14993, "Höchster": 17566, "Durchschnitt": 16280 }, "Caerleon": { "Niedrigster": 17398, "Höchster": 17398, "Durchschnitt": 17398 }, "Brecilien": { "Niedrigster": 17693, "Höchster": 17693, "Durchschnitt": 17693 } },
  "7.2": { "Bridgewatch": { "Niedrigster": 55002, "Höchster": 70997, "Durchschnitt": 63000 }, "Fort Sterling": { "Niedrigster": 57012, "Höchster": 68919, "Durchschnitt": 62966 }, "Lymhurst": { "Niedrigster": 72798, "Höchster": 72798, "Durchschnitt": 72798 }, "Martlock": { "Niedrigster": 55061, "Höchster": 70393, "Durchschnitt": 62727 }, "Thetford": { "Niedrigster": 60025, "Höchster": 70995, "Durchschnitt": 65510 }, "Caerleon": { "Niedrigster": 89996, "Höchster": 89996, "Durchschnitt": 89996 }, "Brecilien": { "Niedrigster": 82990, "Höchster": 82990, "Durchschnitt": 82990 } },
  "7.3": { "Bridgewatch": { "Niedrigster": 225000, "Höchster": 283333, "Durchschnitt": 254167 }, "Fort Sterling": { "Niedrigster": 182241, "Höchster": 223999, "Durchschnitt": 203120 }, "Lymhurst": { "Niedrigster": 185004, "Höchster": 223978, "Durchschnitt": 204491 }, "Martlock": { "Niedrigster": 215100, "Höchster": 232968, "Durchschnitt": 224034 }, "Thetford": { "Niedrigster": 85000, "Höchster": 227765, "Durchschnitt": 156383 }, "Caerleon": { "Niedrigster": 266663, "Höchster": 266663, "Durchschnitt": 266663 }, "Brecilien": { "Niedrigster": 249982, "Höchster": 249982, "Durchschnitt": 249982 } },
  "7.4": { "Bridgewatch": { "Niedrigster": 1088998, "Höchster": 1088998, "Durchschnitt": 1088998 }, "Fort Sterling": { "Niedrigster": 900004, "Höchster": 999997, "Durchschnitt": 950001 }, "Lymhurst": { "Niedrigster": 550002, "Höchster": 1044898, "Durchschnitt": 797450 }, "Martlock": { "Niedrigster": 999991, "Höchster": 999991, "Durchschnitt": 999991 }, "Thetford": { "Niedrigster": 1050000, "Höchster": 1050000, "Durchschnitt": 1050000 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 1199877, "Höchster": 1199877, "Durchschnitt": 1199877 } },
  "8.0": { "Bridgewatch": { "Niedrigster": 32100, "Höchster": 38775, "Durchschnitt": 35438 }, "Fort Sterling": { "Niedrigster": 33426, "Höchster": 35506, "Durchschnitt": 34466 }, "Lymhurst": { "Niedrigster": 35797, "Höchster": 35797, "Durchschnitt": 35797 }, "Martlock": { "Niedrigster": 30005, "Höchster": 38867, "Durchschnitt": 34436 }, "Thetford": { "Niedrigster": 31601, "Höchster": 37869, "Durchschnitt": 34735 }, "Caerleon": { "Niedrigster": 39966, "Höchster": 39966, "Durchschnitt": 39966 }, "Brecilien": { "Niedrigster": 37295, "Höchster": 37295, "Durchschnitt": 37295 } },
  "8.1": { "Bridgewatch": { "Niedrigster": 27462, "Höchster": 62545, "Durchschnitt": 45004 }, "Fort Sterling": { "Niedrigster": 57009, "Höchster": 67753, "Durchschnitt": 62381 }, "Lymhurst": { "Niedrigster": 63991, "Höchster": 63991, "Durchschnitt": 63991 }, "Martlock": { "Niedrigster": 45016, "Höchster": 70990, "Durchschnitt": 58003 }, "Thetford": { "Niedrigster": 48582, "Höchster": 64321, "Durchschnitt": 56452 }, "Caerleon": { "Niedrigster": 63993, "Höchster": 63993, "Durchschnitt": 63993 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
  "8.2": { "Bridgewatch": { "Niedrigster": 165145, "Höchster": 225000, "Durchschnitt": 195073 }, "Fort Sterling": { "Niedrigster": 210003, "Höchster": 242984, "Durchschnitt": 226494 }, "Lymhurst": { "Niedrigster": 235848, "Höchster": 235848, "Durchschnitt": 235848 }, "Martlock": { "Niedrigster": 220000, "Höchster": 249996, "Durchschnitt": 234998 }, "Thetford": { "Niedrigster": 170122, "Höchster": 249995, "Durchschnitt": 210059 }, "Caerleon": { "Niedrigster": 229955, "Höchster": 229955, "Durchschnitt": 229955 }, "Brecilien": { "Niedrigster": 199999, "Höchster": 199999, "Durchschnitt": 199999 } },
  "8.3": { "Bridgewatch": { "Niedrigster": 630010, "Höchster": 722973, "Durchschnitt": 676492 }, "Fort Sterling": { "Niedrigster": 615565, "Höchster": 723953, "Durchschnitt": 669759 }, "Lymhurst": { "Niedrigster": 729963, "Höchster": 729963, "Durchschnitt": 729963 }, "Martlock": { "Niedrigster": 505120, "Höchster": 721975, "Durchschnitt": 613548 }, "Thetford": { "Niedrigster": 591010, "Höchster": 689994, "Durchschnitt": 640502 }, "Caerleon": { "Niedrigster": 799999, "Höchster": 799999, "Durchschnitt": 799999 }, "Brecilien": { "Niedrigster": 719900, "Höchster": 719900, "Durchschnitt": 719900 } },
  "8.4": { "Bridgewatch": { "Niedrigster": 3299998, "Höchster": 3299998, "Durchschnitt": 3299998 }, "Fort Sterling": { "Niedrigster": 2800006, "Höchster": 3199990, "Durchschnitt": 2999998 }, "Lymhurst": { "Niedrigster": 3339999, "Höchster": 3339999, "Durchschnitt": 3339999 }, "Martlock": { "Niedrigster": 3349997, "Höchster": 3349997, "Durchschnitt": 3349997 }, "Thetford": { "Niedrigster": 3499999, "Höchster": 3499999, "Durchschnitt": 3499999 }, "Caerleon": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 }, "Brecilien": { "Niedrigster": 0, "Höchster": 0, "Durchschnitt": 0 } },
};

const sourceText = "Quelle: https://albiononlinegrind.com/resource-prices | Server: Europe | Werte aus vom Nutzer kopiertem Seiteninhalt. Kleinster/Höchster/Durchschnitt aus vorhandenen Sell-/Buy-Werten je Stadt berechnet.";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialNumericMap() {
  return Object.fromEntries(tiers.map((tier) => [tier, 0]));
}

function createInitialHerstellung() {
  return Object.fromEntries(
    tiers.map((tier) => [
      tier,
      Object.fromEntries(weapons.map((weapon) => [weapon.key, { ziel: 0, end: 0 }])),
    ]),
  );
}

function createDefaultState() {
  return {
    settings: {
      city: "Thetford",
      priceType: "Niedrigster",
      storageEnabled: true,
    },
    rohstoff: {
      production: createInitialNumericMap(),
      stockWood: createInitialNumericMap(),
      stockPlanks: createInitialNumericMap(),
    },
    marketWood: deepClone(defaultMarketWood),
    marketPlanks: deepClone(defaultMarketPlanks),
    herstellung: createInitialHerstellung(),
  };
}

let state = loadState();
let computed = { rohstoffRows: [], rohstoffTotalCost: 0, herstellungRows: [], herstellungTotals: {} };

const herstellungReferenceRows = {
  "2": { label: "Großer Feuerstab", planks: 20, bars: 12, artifact: "" },
  "3": { label: "Feuerstab", planks: 16, bars: 8, artifact: "" },
  "4.0": { label: "Inferno", planks: 20, bars: 12, artifact: "" },
  "4.1": { label: "Wildfeuer", planks: 16, bars: 8, artifact: "Wildfeuer Orb" },
  "4.2": { label: "Morgenlied", planks: 16, bars: 8, artifact: "Glowing Hormonic Ring" },
  "4.3": { label: "Blaizing", planks: 20, bars: 12, artifact: "Unholy Scroll" },
  "4.4": { label: "Brimstone", planks: 20, bars: 12, artifact: "Burning Orb" },
  "5.0": { label: "Flammenläufer", planks: 16, bars: 8, artifact: "Pyreheart Crystal" },
  "5.1": { label: "Hinweis", planks: "Ziel = gewünschter Bestand je Stab und Tier.", bars: "", artifact: "" },
  "5.2": { label: "Hinweis", planks: "End = vorhandener Endbestand. Fehlmenge = Ziel - End.", bars: "", artifact: "" },
  "5.3": { label: "Hinweis", planks: "Einsatz rechnet nur die noch herzustellende Fehlmenge.", bars: "", artifact: "" },
  "5.4": { label: "Hinweis", planks: "Kapitalwerte folgen nur dem Plankenpreis.", bars: "", artifact: "" },
};

function loadState() {
  const defaults = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    return mergeState(defaults, JSON.parse(raw));
  } catch (error) {
    console.warn("Konnte gespeicherten Zustand nicht laden:", error);
    return defaults;
  }
}

function mergeState(defaults, incoming) {
  const merged = deepClone(defaults);
  if (!incoming || typeof incoming !== "object") {
    return merged;
  }

  merged.settings = { ...merged.settings, ...(incoming.settings || {}) };

  for (const group of ["production", "stockWood", "stockPlanks"]) {
    for (const tier of tiers) {
      merged.rohstoff[group][tier] = sanitizeNumber(incoming?.rohstoff?.[group]?.[tier]);
    }
  }

  for (const tier of tiers) {
    for (const city of cities) {
      for (const priceType of priceTypes) {
        merged.marketWood[tier][city][priceType] = sanitizeNumber(incoming?.marketWood?.[tier]?.[city]?.[priceType]);
        merged.marketPlanks[tier][city][priceType] = sanitizeNumber(incoming?.marketPlanks?.[tier]?.[city]?.[priceType]);
      }
    }
  }

  for (const tier of tiers) {
    for (const weapon of weapons) {
      merged.herstellung[tier][weapon.key].ziel = sanitizeNumber(incoming?.herstellung?.[tier]?.[weapon.key]?.ziel);
      merged.herstellung[tier][weapon.key].end = sanitizeNumber(incoming?.herstellung?.[tier]?.[weapon.key]?.end);
    }
  }

  return merged;
}

function saveState() {
  if (!state.settings.storageEnabled) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeNumber(value) {
  const numeric = Number(String(value ?? "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.html !== undefined) element.innerHTML = options.html;
  return element;
}

function computeRohstoffData() {
  const plan = {};
  for (const tier of [...tiers].reverse()) {
    const downstreamDemand = craftingRules[tier].downstream.reduce((sum, childTier) => sum + (plan[childTier]?.produce || 0), 0);
    const desired = sanitizeNumber(state.rohstoff.production[tier]);
    const stockPlanks = sanitizeNumber(state.rohstoff.stockPlanks[tier]);
    const produce = Math.max(desired + downstreamDemand - stockPlanks, 0);
    const restPlanks = Math.max(stockPlanks + produce - downstreamDemand, 0);

    const stockWood = sanitizeNumber(state.rohstoff.stockWood[tier]);
    const woodPerPlank = craftingRules[tier].woodPerPlank;
    const requiredWood = produce * woodPerPlank;
    const buyWood = Math.max(requiredWood - stockWood, 0);
    const restWood = Math.max(stockWood + buyWood - requiredWood, 0);
    const unitPrice = sanitizeNumber(state.marketWood[tier][state.settings.city][state.settings.priceType]);
    const purchaseCost = buyWood * unitPrice;

    plan[tier] = {
      tier,
      desired,
      stockWood,
      buyWood,
      restWood,
      unitPrice,
      purchaseCost,
      stockPlanks,
      produce,
      restPlanks,
      downstreamDemand,
      explanation: buildRohstoffExplanation(tier),
    };
  }

  const rows = tiers.map((tier) => plan[tier]);
  const totalCost = rows.reduce((sum, row) => sum + row.purchaseCost, 0);
  return { rows, totalCost };
}

function buildRohstoffExplanation(tier) {
  const rule = craftingRules[tier];
  if (!rule.previous) {
    return `1x ${tier}er Holz = 1x ${tier}er Planke`;
  }
  return `1x ${rule.previous}er Planke + ${rule.woodPerPlank}x ${tier}er Holz = 1x ${tier}er Planke`;
}

function computeHerstellungData() {
  const rows = tiers.map((tier) => {
    let barsInput = 0;
    let planksInput = 0;
    let artifactInput = 0;
    let barsReturn = 0;
    let planksReturn = 0;
    const itemDetails = {};

    for (const weapon of weapons) {
      const values = state.herstellung[tier][weapon.key];
      const ziel = sanitizeNumber(values.ziel);
      const end = sanitizeNumber(values.end);
      const missing = Math.max(ziel - end, 0);
      const existingContribution = Math.min(ziel, end);

      barsInput += missing * weapon.bars;
      planksInput += missing * weapon.planks;
      if (weapon.artifact) {
        artifactInput += missing;
      }

      barsReturn += existingContribution * weapon.bars;
      planksReturn += existingContribution * weapon.planks;

      itemDetails[weapon.key] = { ziel, end, missing, existingContribution };
    }

    const plankPrice = sanitizeNumber(state.marketPlanks[tier][state.settings.city][state.settings.priceType]);
    const capitalInput = planksInput * plankPrice;
    const capitalReturn = planksReturn * plankPrice;

    return {
      tier,
      barsInput,
      planksInput,
      artifactInput,
      capitalInput,
      barsReturn,
      planksReturn,
      capitalReturn,
      itemDetails,
    };
  });

  const totals = rows.reduce((acc, row) => {
    acc.barsInput += row.barsInput;
    acc.planksInput += row.planksInput;
    acc.artifactInput += row.artifactInput;
    acc.capitalInput += row.capitalInput;
    acc.barsReturn += row.barsReturn;
    acc.planksReturn += row.planksReturn;
    acc.capitalReturn += row.capitalReturn;
    return acc;
  }, { barsInput: 0, planksInput: 0, artifactInput: 0, capitalInput: 0, barsReturn: 0, planksReturn: 0, capitalReturn: 0 });

  return { rows, totals };
}

function renderAll() {
  const rohstoffComputed = computeRohstoffData();
  const herstellungComputed = computeHerstellungData();

  computed = {
    rohstoffRows: rohstoffComputed.rows,
    rohstoffTotalCost: rohstoffComputed.totalCost,
    herstellungRows: herstellungComputed.rows,
    herstellungTotals: herstellungComputed.totals,
  };

  renderSelectors();
  renderRohstoffTable();
  renderMarketTable("holzTable", state.marketWood);
  renderMarketTable("plankenTable", state.marketPlanks);
  renderHerstellungTable();
  renderNotes("rohstoffNotes", rohstoffNotes);
  renderNotes("herstellungNotes", herstellungNotes);
  document.getElementById("holzSource").textContent = sourceText;
  document.getElementById("plankenSource").textContent = sourceText;
  document.getElementById("storageEnabled").checked = !!state.settings.storageEnabled;
  saveState();
}

function renderSelectors() {
  const citySelect = document.getElementById("citySelect");
  const priceTypeSelect = document.getElementById("priceTypeSelect");

  citySelect.innerHTML = "";
  priceTypeSelect.innerHTML = "";

  cities.forEach((city) => {
    const option = createElement("option", { text: city });
    option.value = city;
    option.selected = city === state.settings.city;
    citySelect.appendChild(option);
  });

  priceTypes.forEach((priceType) => {
    const option = createElement("option", { text: priceType });
    option.value = priceType;
    option.selected = priceType === state.settings.priceType;
    priceTypeSelect.appendChild(option);
  });
}

function renderNotes(containerId, notes) {
  const list = document.getElementById(containerId);
  list.innerHTML = "";
  notes.forEach((note) => {
    const item = createElement("li", { text: note });
    list.appendChild(item);
  });
}

function renderRohstoffTable() {
  const table = document.getElementById("rohstoffTable");
  table.innerHTML = "";

  const titleRow = createElement("tr", { className: "table-title" });
  titleRow.appendChild(createHeader("Albion Holz -> Planken Rechner", 12));
  table.appendChild(titleRow);

  const headerRow = createElement("tr", { className: "header-row" });
  [
    "Rohstoff / Planke",
    "Produktionswunsch (Planken)",
    "IST Holz Lager",
    "Soll Holz kaufen",
    "Restholz Lager",
    "Holzpreis Kauf",
    "IST Planken Lager",
    "Soll Planken aus Herstellung",
    "Restplanken Lager",
    "Rechnung Plankenherstellung",
    "Hinweis",
  ].forEach((label) => headerRow.appendChild(createHeader(label)));
  table.appendChild(headerRow);

  computed.rohstoffRows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.tier, "tier-cell"));
    tr.appendChild(createNumberInputCell(state.rohstoff.production, row.tier, "production"));
    tr.appendChild(createNumberInputCell(state.rohstoff.stockWood, row.tier, "stockWood"));
    tr.appendChild(createCell(formatNumber(row.buyWood), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.restWood), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.purchaseCost), "formula-cell"));
    tr.appendChild(createNumberInputCell(state.rohstoff.stockPlanks, row.tier, "stockPlanks"));
    tr.appendChild(createCell(formatNumber(row.produce), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.restPlanks), "formula-cell"));
    tr.appendChild(createCell(row.explanation, "formula-cell text-cell"));
    tr.appendChild(createCell(rohstoffNotes[index % rohstoffNotes.length], "formula-cell text-cell"));
    table.appendChild(tr);
  });

  const totalRow = createElement("tr", { className: "summary-row" });
  totalRow.appendChild(createHeader(""));
  totalRow.appendChild(createCell(""));
  totalRow.appendChild(createCell(""));
  totalRow.appendChild(createCell(""));
  totalRow.appendChild(createHeader("Gesamt Holzpreis Kauf"));
  totalRow.appendChild(createCell(formatNumber(computed.rohstoffTotalCost), "formula-cell"));
  for (let i = 0; i < 5; i += 1) {
    totalRow.appendChild(createCell(""));
  }
  table.appendChild(totalRow);
}

function createHeader(text, colSpan = 1, className = "") {
  const th = createElement("th", { text, className });
  th.colSpan = colSpan;
  return th;
}

function createCell(text, className = "") {
  return createElement("td", { text, className });
}

function createNumberInputCell(targetGroup, tier, groupName) {
  const td = createElement("td", { className: "input-cell" });
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = sanitizeNumber(targetGroup[tier]) || "";
  input.addEventListener("input", () => {
    targetGroup[tier] = sanitizeNumber(input.value);
    renderAll();
  });
  input.dataset.group = groupName;
  input.dataset.tier = tier;
  td.appendChild(input);
  return td;
}

function renderMarketTable(tableId, marketState) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  const titleRow = createElement("tr", { className: "table-title" });
  titleRow.appendChild(createHeader(tableId === "holzTable" ? "Holzpreise" : "Plankenpreise", 22));
  table.appendChild(titleRow);

  const cityRow = document.createElement("tr");
  cityRow.appendChild(createHeader("Tier", 1, "market-header"));
  cities.forEach((city) => cityRow.appendChild(createHeader(city, 3, "market-header")));
  table.appendChild(cityRow);

  const typeRow = document.createElement("tr");
  typeRow.appendChild(createHeader("", 1, "market-subheader"));
  cities.forEach(() => {
    priceTypes.forEach((priceType) => typeRow.appendChild(createHeader(priceType, 1, "market-subheader")));
  });
  table.appendChild(typeRow);

  tiers.forEach((tier) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(tier, "tier-cell"));
    cities.forEach((city) => {
      priceTypes.forEach((priceType) => {
        tr.appendChild(createMarketInputCell(marketState, tier, city, priceType));
      });
    });
    table.appendChild(tr);
  });
}

function createMarketInputCell(targetMarket, tier, city, priceType) {
  const td = createElement("td", { className: "input-cell market-input" });
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = sanitizeNumber(targetMarket[tier][city][priceType]) || "";
  input.addEventListener("input", () => {
    targetMarket[tier][city][priceType] = sanitizeNumber(input.value);
    renderAll();
  });
  td.appendChild(input);
  return td;
}

function renderHerstellungTable() {
  const table = document.getElementById("herstellungTable");
  table.innerHTML = "";

  const titleRow = createElement("tr", { className: "table-title" });
  titleRow.appendChild(createHeader("Albion Herstellung - Feuerstäbe", 28));
  table.appendChild(titleRow);

  const topRow = document.createElement("tr");
  topRow.appendChild(createHeader("", 24, "market-subheader"));
  topRow.appendChild(createHeader("Berechnungsgrundlage je 1x", 4, "market-subheader"));
  table.appendChild(topRow);

  const headerRow = createElement("tr", { className: "header-row" });
  [
    "Tier",
    "Rohstoffeinsatz Barren",
    "Rohstoffeinsatz Planken",
    "Rohstoffeinsatz Artefakt",
    "Kapital-Einsatz",
    "Rohstoffrückgewinn Barren",
    "Rohstoffrückgewinn Planken",
    "Kapital-Rückgewinn",
  ].forEach((label) => headerRow.appendChild(createHeader(label)));
  weapons.forEach((weapon) => headerRow.appendChild(createHeader(weapon.label, 2, "weapon-group")));
  headerRow.appendChild(createHeader("Gegenstand"));
  headerRow.appendChild(createHeader("Planke"));
  headerRow.appendChild(createHeader("Barren"));
  headerRow.appendChild(createHeader("Artefakt je 1x"));
  table.appendChild(headerRow);

  const inputHeader = document.createElement("tr");
  for (let i = 0; i < 8; i += 1) {
    inputHeader.appendChild(createHeader("", 1, "sub-col"));
  }
  weapons.forEach(() => {
    inputHeader.appendChild(createHeader("Ziel", 1, "sub-col"));
    inputHeader.appendChild(createHeader("End", 1, "sub-col"));
  });
  inputHeader.appendChild(createHeader("Großer Feuerstab", 1, "sub-col"));
  inputHeader.appendChild(createHeader("20", 1, "sub-col"));
  inputHeader.appendChild(createHeader("12", 1, "sub-col"));
  inputHeader.appendChild(createHeader("", 1, "sub-col"));
  table.appendChild(inputHeader);

  computed.herstellungRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.tier, "tier-cell"));
    tr.appendChild(createCell(formatNumber(row.barsInput), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.planksInput), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.artifactInput), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.capitalInput), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.barsReturn), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.planksReturn), "formula-cell"));
    tr.appendChild(createCell(formatNumber(row.capitalReturn), "formula-cell"));

    weapons.forEach((weapon) => {
      tr.appendChild(createHerstellungInputCell(row.tier, weapon.key, "ziel"));
      tr.appendChild(createHerstellungInputCell(row.tier, weapon.key, "end"));
    });

    const reference = herstellungReferenceRows[row.tier];
    tr.appendChild(createCell(reference?.label || "", "formula-cell text-cell"));
    tr.appendChild(createCell(formatReferenceValue(reference?.planks), "formula-cell text-cell"));
    tr.appendChild(createCell(formatReferenceValue(reference?.bars), "formula-cell text-cell"));
    tr.appendChild(createCell(formatReferenceValue(reference?.artifact), "formula-cell text-cell"));

    table.appendChild(tr);
  });

  const totalRow = createElement("tr", { className: "summary-row" });
  totalRow.appendChild(createHeader("Gesamt"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.barsInput), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.planksInput), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.artifactInput), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.capitalInput), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.barsReturn), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.planksReturn), "formula-cell"));
  totalRow.appendChild(createCell(formatNumber(computed.herstellungTotals.capitalReturn), "formula-cell"));
  for (let i = 0; i < weapons.length * 2 + 4; i += 1) {
    totalRow.appendChild(createCell(""));
  }
  table.appendChild(totalRow);
}

function createHerstellungInputCell(tier, weaponKey, field) {
  const td = createElement("td", { className: "input-cell" });
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = sanitizeNumber(state.herstellung[tier][weaponKey][field]) || "";
  input.addEventListener("input", () => {
    state.herstellung[tier][weaponKey][field] = sanitizeNumber(input.value);
    renderAll();
  });
  td.appendChild(input);
  return td;
}

function formatReferenceValue(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return typeof value === "number" ? formatNumber(value) : String(value);
}

function wireEvents() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.toggle("active", tab === button));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(`tab-${button.dataset.tab}`).classList.add("active");
    });
  });

  document.getElementById("citySelect").addEventListener("change", (event) => {
    state.settings.city = event.target.value;
    renderAll();
  });

  document.getElementById("priceTypeSelect").addEventListener("change", (event) => {
    state.settings.priceType = event.target.value;
    renderAll();
  });

  document.getElementById("storageEnabled").addEventListener("change", (event) => {
    state.settings.storageEnabled = event.target.checked;
    saveState();
  });

  document.getElementById("recalcBtn").addEventListener("click", () => renderAll());

  document.getElementById("resetBtn").addEventListener("click", () => {
    state = createDefaultState();
    renderAll();
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rohstoffrechner-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("importInput").addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }
    try {
      const content = await file.text();
      state = mergeState(createDefaultState(), JSON.parse(content));
      renderAll();
    } catch (error) {
      alert("Die JSON-Datei konnte nicht gelesen werden.");
      console.error(error);
    } finally {
      event.target.value = "";
    }
  });
}

function runTests() {
  // Testfall 1: 2000x 6.1-Planken müssen die gesamte Kaskade bis T2 auslösen.
  {
    const testState = createDefaultState();
    testState.rohstoff.production["6.1"] = 2000;
    const result = computeRohstoffForState(testState);
    console.assert(result["6.1"].produce === 2000, "Test 1: 6.1 sollte 2000 produzieren");
    console.assert(result["5.1"].produce === 2000, "Test 1: 5.1 sollte 2000 als Vorstufe produzieren");
    console.assert(result["4.1"].produce === 2000, "Test 1: 4.1 sollte 2000 als Vorstufe produzieren");
    console.assert(result["3"].produce === 2000, "Test 1: 3 sollte 2000 als Vorstufe produzieren");
    console.assert(result["2"].produce === 2000, "Test 1: 2 sollte 2000 als Vorstufe produzieren");
  }

  // Testfall 2: Vorhandene 6.0-Planken und 6.0-Holz reduzieren Produktion und Kaufbedarf.
  {
    const testState = createDefaultState();
    testState.rohstoff.production["6.0"] = 1000;
    testState.rohstoff.stockPlanks["6.0"] = 300;
    testState.rohstoff.stockWood["6.0"] = 1000;
    const result = computeRohstoffForState(testState);
    console.assert(result["6.0"].produce === 700, "Test 2: 6.0 sollte nur 700 produzieren");
    console.assert(result["6.0"].buyWood === 1800, "Test 2: 6.0-Holzkauf sollte 1800 sein");
  }

  // Testfall 3: Vorhandene Vorstufen-Planken reduzieren den Holzbedarf tieferer Stufen.
  {
    const testState = createDefaultState();
    testState.rohstoff.production["5.2"] = 500;
    testState.rohstoff.stockPlanks["4.2"] = 450;
    const result = computeRohstoffForState(testState);
    console.assert(result["4.2"].produce === 50, "Test 3: 4.2 sollte wegen vorhandener Planken nur 50 produzieren");
    console.assert(result["3"].produce === 50, "Test 3: T3 sollte nur den reduzierten 4.2-Bedarf tragen");
  }
}

function computeRohstoffForState(testState) {
  const previousState = state;
  state = testState;
  const result = computeRohstoffData().rows.reduce((acc, row) => {
    acc[row.tier] = row;
    return acc;
  }, {});
  state = previousState;
  return result;
}

wireEvents();
renderAll();
runTests();
