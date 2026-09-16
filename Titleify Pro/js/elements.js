/**
 * Titleify Pro - Complete Periodic Table Dataset & Element Matcher
 * All 118 Elements with authentic Atomic Weights, Oxidation States,
 * Electron Shell Configurations, and Periodic Grid Coordinates.
 */

const PERIODIC_TABLE = [
  {
    "number": 1,
    "symbol": "H",
    "name": "Hydrogen",
    "mass": "1.008",
    "electrons": "1",
    "oxidation": [
      "+1",
      "-1"
    ],
    "col": 1,
    "row": 1
  },
  {
    "number": 2,
    "symbol": "He",
    "name": "Helium",
    "mass": "4.0026",
    "electrons": "2",
    "oxidation": [
      "0"
    ],
    "col": 18,
    "row": 1
  },
  {
    "number": 3,
    "symbol": "Li",
    "name": "Lithium",
    "mass": "6.94",
    "electrons": "2-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 2
  },
  {
    "number": 4,
    "symbol": "Be",
    "name": "Beryllium",
    "mass": "9.0122",
    "electrons": "2-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 2
  },
  {
    "number": 5,
    "symbol": "B",
    "name": "Boron",
    "mass": "10.81",
    "electrons": "2-3",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 2
  },
  {
    "number": 6,
    "symbol": "C",
    "name": "Carbon",
    "mass": "12.011",
    "electrons": "2-4",
    "oxidation": [
      "+4",
      "+2",
      "-4"
    ],
    "col": 14,
    "row": 2
  },
  {
    "number": 7,
    "symbol": "N",
    "name": "Nitrogen",
    "mass": "14.007",
    "electrons": "2-5",
    "oxidation": [
      "-3",
      "+5",
      "+4",
      "+3",
      "+2"
    ],
    "col": 15,
    "row": 2
  },
  {
    "number": 8,
    "symbol": "O",
    "name": "Oxygen",
    "mass": "15.999",
    "electrons": "2-6",
    "oxidation": [
      "-2",
      "-1"
    ],
    "col": 16,
    "row": 2
  },
  {
    "number": 9,
    "symbol": "F",
    "name": "Fluorine",
    "mass": "18.998",
    "electrons": "2-7",
    "oxidation": [
      "-1"
    ],
    "col": 17,
    "row": 2
  },
  {
    "number": 10,
    "symbol": "Ne",
    "name": "Neon",
    "mass": "20.180",
    "electrons": "2-8",
    "oxidation": [
      "0"
    ],
    "col": 18,
    "row": 2
  },
  {
    "number": 11,
    "symbol": "Na",
    "name": "Sodium",
    "mass": "22.990",
    "electrons": "2-8-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 3
  },
  {
    "number": 12,
    "symbol": "Mg",
    "name": "Magnesium",
    "mass": "24.305",
    "electrons": "2-8-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 3
  },
  {
    "number": 13,
    "symbol": "Al",
    "name": "Aluminium",
    "mass": "26.982",
    "electrons": "2-8-3",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 3
  },
  {
    "number": 14,
    "symbol": "Si",
    "name": "Silicon",
    "mass": "28.085",
    "electrons": "2-8-4",
    "oxidation": [
      "+4",
      "-4"
    ],
    "col": 14,
    "row": 3
  },
  {
    "number": 15,
    "symbol": "P",
    "name": "Phosphorus",
    "mass": "30.974",
    "electrons": "2-8-5",
    "oxidation": [
      "+5",
      "+3",
      "-3"
    ],
    "col": 15,
    "row": 3
  },
  {
    "number": 16,
    "symbol": "S",
    "name": "Sulfur",
    "mass": "32.06",
    "electrons": "2-8-6",
    "oxidation": [
      "+6",
      "+4",
      "-2"
    ],
    "col": 16,
    "row": 3
  },
  {
    "number": 17,
    "symbol": "Cl",
    "name": "Chlorine",
    "mass": "35.45",
    "electrons": "2-8-7",
    "oxidation": [
      "-1",
      "+1",
      "+3",
      "+5",
      "+7"
    ],
    "col": 17,
    "row": 3
  },
  {
    "number": 18,
    "symbol": "Ar",
    "name": "Argon",
    "mass": "39.948",
    "electrons": "2-8-8",
    "oxidation": [
      "0"
    ],
    "col": 18,
    "row": 3
  },
  {
    "number": 19,
    "symbol": "K",
    "name": "Potassium",
    "mass": "39.098",
    "electrons": "2-8-8-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 4
  },
  {
    "number": 20,
    "symbol": "Ca",
    "name": "Calcium",
    "mass": "40.078",
    "electrons": "2-8-8-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 4
  },
  {
    "number": 21,
    "symbol": "Sc",
    "name": "Scandium",
    "mass": "44.956",
    "electrons": "2-8-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 3,
    "row": 4
  },
  {
    "number": 22,
    "symbol": "Ti",
    "name": "Titanium",
    "mass": "47.867",
    "electrons": "2-8-10-2",
    "oxidation": [
      "+4",
      "+3",
      "+2"
    ],
    "col": 4,
    "row": 4
  },
  {
    "number": 23,
    "symbol": "V",
    "name": "Vanadium",
    "mass": "50.942",
    "electrons": "2-8-11-2",
    "oxidation": [
      "+5",
      "+4",
      "+3",
      "+2"
    ],
    "col": 5,
    "row": 4
  },
  {
    "number": 24,
    "symbol": "Cr",
    "name": "Chromium",
    "mass": "51.996",
    "electrons": "2-8-13-1",
    "oxidation": [
      "+2",
      "+3",
      "+6"
    ],
    "col": 6,
    "row": 4
  },
  {
    "number": 25,
    "symbol": "Mn",
    "name": "Manganese",
    "mass": "54.938",
    "electrons": "2-8-13-2",
    "oxidation": [
      "+2",
      "+4",
      "+7"
    ],
    "col": 7,
    "row": 4
  },
  {
    "number": 26,
    "symbol": "Fe",
    "name": "Iron",
    "mass": "55.845",
    "electrons": "2-8-14-2",
    "oxidation": [
      "+2",
      "+3",
      "+6"
    ],
    "col": 8,
    "row": 4
  },
  {
    "number": 27,
    "symbol": "Co",
    "name": "Cobalt",
    "mass": "58.933",
    "electrons": "2-8-15-2",
    "oxidation": [
      "+2",
      "+3"
    ],
    "col": 9,
    "row": 4
  },
  {
    "number": 28,
    "symbol": "Ni",
    "name": "Nickel",
    "mass": "58.693",
    "electrons": "2-8-16-2",
    "oxidation": [
      "+2",
      "+3"
    ],
    "col": 10,
    "row": 4
  },
  {
    "number": 29,
    "symbol": "Cu",
    "name": "Copper",
    "mass": "63.546",
    "electrons": "2-8-18-1",
    "oxidation": [
      "+1",
      "+2"
    ],
    "col": 11,
    "row": 4
  },
  {
    "number": 30,
    "symbol": "Zn",
    "name": "Zinc",
    "mass": "65.38",
    "electrons": "2-8-18-2",
    "oxidation": [
      "+2"
    ],
    "col": 12,
    "row": 4
  },
  {
    "number": 31,
    "symbol": "Ga",
    "name": "Gallium",
    "mass": "69.723",
    "electrons": "2-8-18-3",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 4
  },
  {
    "number": 32,
    "symbol": "Ge",
    "name": "Germanium",
    "mass": "72.630",
    "electrons": "2-8-18-4",
    "oxidation": [
      "+4",
      "+2"
    ],
    "col": 14,
    "row": 4
  },
  {
    "number": 33,
    "symbol": "As",
    "name": "Arsenic",
    "mass": "74.922",
    "electrons": "2-8-18-5",
    "oxidation": [
      "+3",
      "+5",
      "-3"
    ],
    "col": 15,
    "row": 4
  },
  {
    "number": 34,
    "symbol": "Se",
    "name": "Selenium",
    "mass": "78.971",
    "electrons": "2-8-18-6",
    "oxidation": [
      "+4",
      "+6",
      "-2"
    ],
    "col": 16,
    "row": 4
  },
  {
    "number": 35,
    "symbol": "Br",
    "name": "Bromine",
    "mass": "79.904",
    "electrons": "2-8-18-7",
    "oxidation": [
      "-1",
      "+1",
      "+5"
    ],
    "col": 17,
    "row": 4
  },
  {
    "number": 36,
    "symbol": "Kr",
    "name": "Krypton",
    "mass": "83.798",
    "electrons": "2-8-18-8",
    "oxidation": [
      "0",
      "+2"
    ],
    "col": 18,
    "row": 4
  },
  {
    "number": 37,
    "symbol": "Rb",
    "name": "Rubidium",
    "mass": "85.468",
    "electrons": "2-8-18-8-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 5
  },
  {
    "number": 38,
    "symbol": "Sr",
    "name": "Strontium",
    "mass": "87.62",
    "electrons": "2-8-18-8-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 5
  },
  {
    "number": 39,
    "symbol": "Y",
    "name": "Yttrium",
    "mass": "88.906",
    "electrons": "2-8-18-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 3,
    "row": 5
  },
  {
    "number": 40,
    "symbol": "Zr",
    "name": "Zirconium",
    "mass": "91.224",
    "electrons": "2-8-18-10-2",
    "oxidation": [
      "+4"
    ],
    "col": 4,
    "row": 5
  },
  {
    "number": 41,
    "symbol": "Nb",
    "name": "Niobium",
    "mass": "92.906",
    "electrons": "2-8-18-12-1",
    "oxidation": [
      "+5",
      "+3"
    ],
    "col": 5,
    "row": 5
  },
  {
    "number": 42,
    "symbol": "Mo",
    "name": "Molybdenum",
    "mass": "95.95",
    "electrons": "2-8-18-13-1",
    "oxidation": [
      "+6",
      "+4"
    ],
    "col": 6,
    "row": 5
  },
  {
    "number": 43,
    "symbol": "Tc",
    "name": "Technetium",
    "mass": "[98]",
    "electrons": "2-8-18-13-2",
    "oxidation": [
      "+7",
      "+4"
    ],
    "col": 7,
    "row": 5
  },
  {
    "number": 44,
    "symbol": "Ru",
    "name": "Ruthenium",
    "mass": "101.07",
    "electrons": "2-8-18-15-1",
    "oxidation": [
      "+3",
      "+4",
      "+8"
    ],
    "col": 8,
    "row": 5
  },
  {
    "number": 45,
    "symbol": "Rh",
    "name": "Rhodium",
    "mass": "102.91",
    "electrons": "2-8-18-16-1",
    "oxidation": [
      "+3"
    ],
    "col": 9,
    "row": 5
  },
  {
    "number": 46,
    "symbol": "Pd",
    "name": "Palladium",
    "mass": "106.42",
    "electrons": "2-8-18-18",
    "oxidation": [
      "+2",
      "+4"
    ],
    "col": 10,
    "row": 5
  },
  {
    "number": 47,
    "symbol": "Ag",
    "name": "Silver",
    "mass": "107.87",
    "electrons": "2-8-18-18-1",
    "oxidation": [
      "+1"
    ],
    "col": 11,
    "row": 5
  },
  {
    "number": 48,
    "symbol": "Cd",
    "name": "Cadmium",
    "mass": "112.41",
    "electrons": "2-8-18-18-2",
    "oxidation": [
      "+2"
    ],
    "col": 12,
    "row": 5
  },
  {
    "number": 49,
    "symbol": "In",
    "name": "Indium",
    "mass": "114.82",
    "electrons": "2-8-18-18-3",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 5
  },
  {
    "number": 50,
    "symbol": "Sn",
    "name": "Tin",
    "mass": "118.71",
    "electrons": "2-8-18-18-4",
    "oxidation": [
      "+4",
      "+2"
    ],
    "col": 14,
    "row": 5
  },
  {
    "number": 51,
    "symbol": "Sb",
    "name": "Antimony",
    "mass": "121.76",
    "electrons": "2-8-18-18-5",
    "oxidation": [
      "+3",
      "+5"
    ],
    "col": 15,
    "row": 5
  },
  {
    "number": 52,
    "symbol": "Te",
    "name": "Tellurium",
    "mass": "127.60",
    "electrons": "2-8-18-18-6",
    "oxidation": [
      "+4",
      "+6",
      "-2"
    ],
    "col": 16,
    "row": 5
  },
  {
    "number": 53,
    "symbol": "I",
    "name": "Iodine",
    "mass": "126.90",
    "electrons": "2-8-18-18-7",
    "oxidation": [
      "-1",
      "+1",
      "+5",
      "+7"
    ],
    "col": 17,
    "row": 5
  },
  {
    "number": 54,
    "symbol": "Xe",
    "name": "Xenon",
    "mass": "131.29",
    "electrons": "2-8-18-18-8",
    "oxidation": [
      "0",
      "+2",
      "+4",
      "+6"
    ],
    "col": 18,
    "row": 5
  },
  {
    "number": 55,
    "symbol": "Cs",
    "name": "Caesium",
    "mass": "132.91",
    "electrons": "2-8-18-18-8-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 6
  },
  {
    "number": 56,
    "symbol": "Ba",
    "name": "Barium",
    "mass": "137.33",
    "electrons": "2-8-18-18-8-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 6
  },
  {
    "number": 57,
    "symbol": "La",
    "name": "Lanthanum",
    "mass": "138.91",
    "electrons": "2-8-18-18-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 3,
    "row": 6
  },
  {
    "number": 58,
    "symbol": "Ce",
    "name": "Cerium",
    "mass": "140.12",
    "electrons": "2-8-18-19-9-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 4,
    "row": 8
  },
  {
    "number": 59,
    "symbol": "Pr",
    "name": "Praseodymium",
    "mass": "140.91",
    "electrons": "2-8-18-21-8-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 5,
    "row": 8
  },
  {
    "number": 60,
    "symbol": "Nd",
    "name": "Neodymium",
    "mass": "144.24",
    "electrons": "2-8-18-22-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 6,
    "row": 8
  },
  {
    "number": 61,
    "symbol": "Pm",
    "name": "Promethium",
    "mass": "[145]",
    "electrons": "2-8-18-23-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 7,
    "row": 8
  },
  {
    "number": 62,
    "symbol": "Sm",
    "name": "Samarium",
    "mass": "150.36",
    "electrons": "2-8-18-24-8-2",
    "oxidation": [
      "+3",
      "+2"
    ],
    "col": 8,
    "row": 8
  },
  {
    "number": 63,
    "symbol": "Eu",
    "name": "Europium",
    "mass": "151.96",
    "electrons": "2-8-18-25-8-2",
    "oxidation": [
      "+3",
      "+2"
    ],
    "col": 9,
    "row": 8
  },
  {
    "number": 64,
    "symbol": "Gd",
    "name": "Gadolinium",
    "mass": "157.25",
    "electrons": "2-8-18-25-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 10,
    "row": 8
  },
  {
    "number": 65,
    "symbol": "Tb",
    "name": "Terbium",
    "mass": "158.93",
    "electrons": "2-8-18-27-8-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 11,
    "row": 8
  },
  {
    "number": 66,
    "symbol": "Dy",
    "name": "Dysprosium",
    "mass": "162.50",
    "electrons": "2-8-18-28-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 12,
    "row": 8
  },
  {
    "number": 67,
    "symbol": "Ho",
    "name": "Holmium",
    "mass": "164.93",
    "electrons": "2-8-18-29-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 8
  },
  {
    "number": 68,
    "symbol": "Er",
    "name": "Erbium",
    "mass": "167.26",
    "electrons": "2-8-18-30-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 14,
    "row": 8
  },
  {
    "number": 69,
    "symbol": "Tm",
    "name": "Thulium",
    "mass": "168.93",
    "electrons": "2-8-18-31-8-2",
    "oxidation": [
      "+3",
      "+2"
    ],
    "col": 15,
    "row": 8
  },
  {
    "number": 70,
    "symbol": "Yb",
    "name": "Ytterbium",
    "mass": "173.05",
    "electrons": "2-8-18-32-8-2",
    "oxidation": [
      "+3",
      "+2"
    ],
    "col": 16,
    "row": 8
  },
  {
    "number": 71,
    "symbol": "Lu",
    "name": "Lutetium",
    "mass": "174.97",
    "electrons": "2-8-18-32-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 17,
    "row": 8
  },
  {
    "number": 72,
    "symbol": "Hf",
    "name": "Hafnium",
    "mass": "178.49",
    "electrons": "2-8-18-32-10-2",
    "oxidation": [
      "+4"
    ],
    "col": 4,
    "row": 6
  },
  {
    "number": 73,
    "symbol": "Ta",
    "name": "Tantalum",
    "mass": "180.95",
    "electrons": "2-8-18-32-11-2",
    "oxidation": [
      "+5"
    ],
    "col": 5,
    "row": 6
  },
  {
    "number": 74,
    "symbol": "W",
    "name": "Tungsten",
    "mass": "183.84",
    "electrons": "2-8-18-32-12-2",
    "oxidation": [
      "+6",
      "+4"
    ],
    "col": 6,
    "row": 6
  },
  {
    "number": 75,
    "symbol": "Re",
    "name": "Rhenium",
    "mass": "186.21",
    "electrons": "2-8-18-32-13-2",
    "oxidation": [
      "+7",
      "+4"
    ],
    "col": 7,
    "row": 6
  },
  {
    "number": 76,
    "symbol": "Os",
    "name": "Osmium",
    "mass": "190.23",
    "electrons": "2-8-18-32-14-2",
    "oxidation": [
      "+4",
      "+8"
    ],
    "col": 8,
    "row": 6
  },
  {
    "number": 77,
    "symbol": "Ir",
    "name": "Iridium",
    "mass": "192.22",
    "electrons": "2-8-18-32-15-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 9,
    "row": 6
  },
  {
    "number": 78,
    "symbol": "Pt",
    "name": "Platinum",
    "mass": "195.08",
    "electrons": "2-8-18-32-17-1",
    "oxidation": [
      "+2",
      "+4"
    ],
    "col": 10,
    "row": 6
  },
  {
    "number": 79,
    "symbol": "Au",
    "name": "Gold",
    "mass": "196.97",
    "electrons": "2-8-18-32-18-1",
    "oxidation": [
      "+1",
      "+3"
    ],
    "col": 11,
    "row": 6
  },
  {
    "number": 80,
    "symbol": "Hg",
    "name": "Mercury",
    "mass": "200.59",
    "electrons": "2-8-18-32-18-2",
    "oxidation": [
      "+1",
      "+2"
    ],
    "col": 12,
    "row": 6
  },
  {
    "number": 81,
    "symbol": "Tl",
    "name": "Thallium",
    "mass": "204.38",
    "electrons": "2-8-18-32-18-3",
    "oxidation": [
      "+1",
      "+3"
    ],
    "col": 13,
    "row": 6
  },
  {
    "number": 82,
    "symbol": "Pb",
    "name": "Lead",
    "mass": "207.2",
    "electrons": "2-8-18-32-18-4",
    "oxidation": [
      "+2",
      "+4"
    ],
    "col": 14,
    "row": 6
  },
  {
    "number": 83,
    "symbol": "Bi",
    "name": "Bismuth",
    "mass": "208.98",
    "electrons": "2-8-18-32-18-5",
    "oxidation": [
      "+3",
      "+5"
    ],
    "col": 15,
    "row": 6
  },
  {
    "number": 84,
    "symbol": "Po",
    "name": "Polonium",
    "mass": "[209]",
    "electrons": "2-8-18-32-18-6",
    "oxidation": [
      "+2",
      "+4"
    ],
    "col": 16,
    "row": 6
  },
  {
    "number": 85,
    "symbol": "At",
    "name": "Astatine",
    "mass": "[210]",
    "electrons": "2-8-18-32-18-7",
    "oxidation": [
      "-1",
      "+1"
    ],
    "col": 17,
    "row": 6
  },
  {
    "number": 86,
    "symbol": "Rn",
    "name": "Radon",
    "mass": "[222]",
    "electrons": "2-8-18-32-18-8",
    "oxidation": [
      "0"
    ],
    "col": 18,
    "row": 6
  },
  {
    "number": 87,
    "symbol": "Fr",
    "name": "Francium",
    "mass": "[223]",
    "electrons": "2-8-18-32-18-8-1",
    "oxidation": [
      "+1"
    ],
    "col": 1,
    "row": 7
  },
  {
    "number": 88,
    "symbol": "Ra",
    "name": "Radium",
    "mass": "[226]",
    "electrons": "2-8-18-32-18-8-2",
    "oxidation": [
      "+2"
    ],
    "col": 2,
    "row": 7
  },
  {
    "number": 89,
    "symbol": "Ac",
    "name": "Actinium",
    "mass": "[227]",
    "electrons": "2-8-18-32-18-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 3,
    "row": 7
  },
  {
    "number": 90,
    "symbol": "Th",
    "name": "Thorium",
    "mass": "232.04",
    "electrons": "2-8-18-32-18-10-2",
    "oxidation": [
      "+4"
    ],
    "col": 4,
    "row": 9
  },
  {
    "number": 91,
    "symbol": "Pa",
    "name": "Protactinium",
    "mass": "231.04",
    "electrons": "2-8-18-32-20-9-2",
    "oxidation": [
      "+5",
      "+4"
    ],
    "col": 5,
    "row": 9
  },
  {
    "number": 92,
    "symbol": "U",
    "name": "Uranium",
    "mass": "238.03",
    "electrons": "2-8-18-32-21-9-2",
    "oxidation": [
      "+6",
      "+5",
      "+4",
      "+3"
    ],
    "col": 6,
    "row": 9
  },
  {
    "number": 93,
    "symbol": "Np",
    "name": "Neptunium",
    "mass": "[237]",
    "electrons": "2-8-18-32-22-9-2",
    "oxidation": [
      "+5",
      "+6",
      "+4",
      "+3"
    ],
    "col": 7,
    "row": 9
  },
  {
    "number": 94,
    "symbol": "Pu",
    "name": "Plutonium",
    "mass": "[244]",
    "electrons": "2-8-18-32-24-8-2",
    "oxidation": [
      "+4",
      "+5",
      "+6",
      "+3"
    ],
    "col": 8,
    "row": 9
  },
  {
    "number": 95,
    "symbol": "Am",
    "name": "Americium",
    "mass": "[243]",
    "electrons": "2-8-18-32-25-8-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 9,
    "row": 9
  },
  {
    "number": 96,
    "symbol": "Cm",
    "name": "Curium",
    "mass": "[247]",
    "electrons": "2-8-18-32-25-9-2",
    "oxidation": [
      "+3"
    ],
    "col": 10,
    "row": 9
  },
  {
    "number": 97,
    "symbol": "Bk",
    "name": "Berkelium",
    "mass": "[247]",
    "electrons": "2-8-18-32-27-8-2",
    "oxidation": [
      "+3",
      "+4"
    ],
    "col": 11,
    "row": 9
  },
  {
    "number": 98,
    "symbol": "Cf",
    "name": "Californium",
    "mass": "[251]",
    "electrons": "2-8-18-32-28-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 12,
    "row": 9
  },
  {
    "number": 99,
    "symbol": "Es",
    "name": "Einsteinium",
    "mass": "[252]",
    "electrons": "2-8-18-32-29-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 13,
    "row": 9
  },
  {
    "number": 100,
    "symbol": "Fm",
    "name": "Fermium",
    "mass": "[257]",
    "electrons": "2-8-18-32-30-8-2",
    "oxidation": [
      "+3"
    ],
    "col": 14,
    "row": 9
  },
  {
    "number": 101,
    "symbol": "Md",
    "name": "Mendelevium",
    "mass": "[258]",
    "electrons": "2-8-18-32-31-8-2",
    "oxidation": [
      "+2",
      "+3"
    ],
    "col": 15,
    "row": 9
  },
  {
    "number": 102,
    "symbol": "No",
    "name": "Nobelium",
    "mass": "[259]",
    "electrons": "2-8-18-32-32-8-2",
    "oxidation": [
      "+2",
      "+3"
    ],
    "col": 16,
    "row": 9
  },
  {
    "number": 103,
    "symbol": "Lr",
    "name": "Lawrencium",
    "mass": "[266]",
    "electrons": "2-8-18-32-32-8-3",
    "oxidation": [
      "+3"
    ],
    "col": 17,
    "row": 9
  },
  {
    "number": 104,
    "symbol": "Rf",
    "name": "Rutherfordium",
    "mass": "[267]",
    "electrons": "2-8-18-32-32-10-2",
    "oxidation": [
      "+4"
    ],
    "col": 4,
    "row": 7
  },
  {
    "number": 105,
    "symbol": "Db",
    "name": "Dubnium",
    "mass": "[268]",
    "electrons": "2-8-18-32-32-11-2",
    "oxidation": [
      "+5"
    ],
    "col": 5,
    "row": 7
  },
  {
    "number": 106,
    "symbol": "Sg",
    "name": "Seaborgium",
    "mass": "[269]",
    "electrons": "2-8-18-32-32-12-2",
    "oxidation": [
      "+6"
    ],
    "col": 6,
    "row": 7
  },
  {
    "number": 107,
    "symbol": "Bh",
    "name": "Bohrium",
    "mass": "[270]",
    "electrons": "2-8-18-32-32-13-2",
    "oxidation": [
      "+7"
    ],
    "col": 7,
    "row": 7
  },
  {
    "number": 108,
    "symbol": "Hs",
    "name": "Hassium",
    "mass": "[270]",
    "electrons": "2-8-18-32-32-14-2",
    "oxidation": [
      "+8"
    ],
    "col": 8,
    "row": 7
  },
  {
    "number": 109,
    "symbol": "Mt",
    "name": "Meitnerium",
    "mass": "[278]",
    "electrons": "2-8-18-32-32-15-2",
    "oxidation": [
      "+9"
    ],
    "col": 9,
    "row": 7
  },
  {
    "number": 110,
    "symbol": "Ds",
    "name": "Darmstadtium",
    "mass": "[281]",
    "electrons": "2-8-18-32-32-17-1",
    "oxidation": [
      "+6"
    ],
    "col": 10,
    "row": 7
  },
  {
    "number": 111,
    "symbol": "Rg",
    "name": "Roentgenium",
    "mass": "[282]",
    "electrons": "2-8-18-32-32-18-1",
    "oxidation": [
      "+3"
    ],
    "col": 11,
    "row": 7
  },
  {
    "number": 112,
    "symbol": "Cn",
    "name": "Copernicium",
    "mass": "[285]",
    "electrons": "2-8-18-32-32-18-2",
    "oxidation": [
      "+2"
    ],
    "col": 12,
    "row": 7
  },
  {
    "number": 113,
    "symbol": "Nh",
    "name": "Nihonium",
    "mass": "[286]",
    "electrons": "2-8-18-32-32-18-3",
    "oxidation": [
      "+1"
    ],
    "col": 13,
    "row": 7
  },
  {
    "number": 114,
    "symbol": "Fl",
    "name": "Flerovium",
    "mass": "[289]",
    "electrons": "2-8-18-32-32-18-4",
    "oxidation": [
      "+2"
    ],
    "col": 14,
    "row": 7
  },
  {
    "number": 115,
    "symbol": "Mc",
    "name": "Moscovium",
    "mass": "[290]",
    "electrons": "2-8-18-32-32-18-5",
    "oxidation": [
      "+1",
      "+3"
    ],
    "col": 15,
    "row": 7
  },
  {
    "number": 116,
    "symbol": "Lv",
    "name": "Livermorium",
    "mass": "[293]",
    "electrons": "2-8-18-32-32-18-6",
    "oxidation": [
      "+2",
      "+4"
    ],
    "col": 16,
    "row": 7
  },
  {
    "number": 117,
    "symbol": "Ts",
    "name": "Tennessine",
    "mass": "[294]",
    "electrons": "2-8-18-32-32-18-7",
    "oxidation": [
      "-1",
      "+1"
    ],
    "col": 17,
    "row": 7
  },
  {
    "number": 118,
    "symbol": "Og",
    "name": "Oganesson",
    "mass": "[294]",
    "electrons": "2-8-18-32-32-18-8",
    "oxidation": [
      "0"
    ],
    "col": 18,
    "row": 7
  }
];

const SYMBOL_MAP = new Map();
PERIODIC_TABLE.forEach(elem => {
  SYMBOL_MAP.set(elem.symbol.toLowerCase(), elem);
});

function findElementMatches(text) {
  if (!text || typeof text !== 'string') return [];
  const clean = text.trim();
  if (clean.length === 0) return [];

  const matches = [];

  // Look for 2-letter matches
  for (let i = 0; i <= clean.length - 2; i++) {
    const sub = clean.slice(i, i + 2).toLowerCase();
    const elem = SYMBOL_MAP.get(sub);
    if (elem) {
      matches.push({
        element: elem,
        startIndex: i,
        length: 2,
        priority: i === 0 ? 1 : 3
      });
    }
  }

  // Look for 1-letter matches
  for (let i = 0; i < clean.length; i++) {
    const sub = clean.slice(i, i + 1).toLowerCase();
    const elem = SYMBOL_MAP.get(sub);
    if (elem) {
      matches.push({
        element: elem,
        startIndex: i,
        length: 1,
        priority: i === 0 ? 2 : 4
      });
    }
  }

  // Sort by priority (1 is highest), then by position
  matches.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.startIndex - b.startIndex;
  });

  return matches;
}

function tokenizeWord(word, selectedMatch = null) {
  if (!word) {
    return { prefix: '', element: null, suffix: '', rawWord: '', hasElement: false };
  }

  const matches = findElementMatches(word);
  if (matches.length === 0) {
    return { prefix: word, element: null, suffix: '', rawWord: word, hasElement: false };
  }

  const match = selectedMatch || matches[0];
  const start = match.startIndex;
  const end = start + match.length;

  return {
    prefix: word.slice(0, start),
    element: match.element,
    suffix: word.slice(end),
    rawWord: word,
    matchInfo: match,
    allMatches: matches,
    hasElement: true
  };
}

function tokenizeSubtitle(text) {
  if (!text || typeof text !== 'string') return { line1: '', line2: '', token1: null };
  const clean = text.trim();
  if (!clean) return { line1: '', line2: '', token1: null };

  const lines = clean.split(/[\n\r]+/);
  if (lines.length > 1) {
    const line1 = lines[0].trim();
    const line2 = lines.slice(1).join(' ').trim();
    return {
      line1,
      line2,
      token1: tokenizeWord(line1)
    };
  }

  // If single line like 'Created by Vince Gilligan'
  const parts = clean.split(/\s+/);
  if (parts.length >= 3 && parts[1].toLowerCase() === 'by') {
    const line1Prefix = parts[0]; // e.g. 'Created'
    return {
      line1: line1Prefix + ' ' + parts[1],
      line2: parts.slice(2).join(' '),
      token1: tokenizeWord(line1Prefix),
      token1Suffix: ' ' + parts[1]
    };
  }

  return {
    line1: clean,
    line2: '',
    token1: tokenizeWord(clean),
    token1Suffix: ''
  };
}

window.PERIODIC_TABLE = PERIODIC_TABLE;
window.SYMBOL_MAP = SYMBOL_MAP;
window.findElementMatches = findElementMatches;
window.tokenizeWord = tokenizeWord;
window.tokenizeSubtitle = tokenizeSubtitle;
