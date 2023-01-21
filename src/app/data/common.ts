export enum SpecializedType {
  None = "___",
  Atk = "atk",
  Def = "def",
  Hp = "hp",
  DmgBonus = "dmg bonus",
  CritDmg = "crit dmg",
  CritRate = "crit rate",
  EM = "elemental mastery",
  ER = "energy recharge",
}

export enum CharacterType {
  Aether = "Aether",
  Albedo = "Albedo",
  Alhaitham = "Alhaitham",
  Aloy = "Aloy",
  Amber = "Amber",
  AratakiItto = "AratakiItto",
  Barbara = "Barbara",
  Beidou = "Beidou",
  Bennett = "Bennett",
  Candace = "Candace",
  Chongyun = "Chongyun",
  Collei = "Collei",
  Cyno = "Cyno",
  Diluc = "Diluc",
  Diona = "Diona",
  Dori = "Dori",
  Eula = "Eula",
  Faruzan = "Faruzan",
  Fischl = "Fischl",
  Ganyu = "Ganyu",
  Gorou = "Gorou",
  HuTao = "HuTao",
  Jean = "Jean",
  KaedeharaKazuha = "KaedeharaKazuha",
  Kaeya = "Kaeya",
  KamisatoAyaka = "KamisatoAyaka",
  KamisatoAyato = "KamisatoAyato",
  Keqing = "Keqing",
  Klee = "Klee",
  KujouSara = "KujouSara",
  KukiShinobu = "KukiShinobu",
  Layla = "Layla",
  Lisa = "Lisa",
  Lumine = "Lumine",
  Mona = "Mona",
  Nahida = "Nahida",
  Nilou = "Nilou",
  Ningguang = "Ningguang",
  Noelle = "Noelle",
  Qiqi = "Qiqi",
  RaidenShogun = "RaidenShogun",
  Razor = "Razor",
  Rosaria = "Rosaria",
  SangonomiyaKokomi = "SangonomiyaKokomi",
  Sayu = "Sayu",
  Shenhe = "Shenhe",
  ShikanoinHeizou = "ShikanoinHeizou",
  Sucrose = "Sucrose",
  Tartaglia = "Tartaglia",
  Thoma = "Thoma",
  Tighnari = "Tighnari",
  Venti = "Venti",
  Wanderer = "Wanderer",
  Xiangling = "Xiangling",
  Xiao = "Xiao",
  Xingqiu = "Xingqiu",
  Xinyan = "Xinyan",
  YaeMiko = "YaeMiko",
  Yanfei = "Yanfei",
  Yelan = "Yelan",
  Yoimiya = "Yoimiya",
  YunJin = "YunJin",
  Zhongli = "Zhongli",
}

export interface ICharacter {
  get atk(): number;
  get hp(): number;
  get def(): number;
  get dmgBonus(): number;
  get critDmg(): number;
  get critRate(): number;
  get em(): number;
  get er(): number;
}

export enum ValueType {
  AtkFlat = "AtkFlat",
  AtkPercent = "AtkPercent",
  DefFlat = "DefFlat",
  DefPercent = "DefPercent",
  HpFlat = "HpFlat",
  HpPercent = "HpPercent",
  EmFlat = "EmFlat",
  EmPercent = "EmPercent",
  Er = "Er",
  CritRate = "CritRate",
  CritDmg = "CritDmg",
  DmgBonus = "DmgBonus",
  HealBonus = "HealBonus",
  FlatDmg = "FlatDmg",
  ResistanceReduction = "ResistanceReduction",
  DefReduction = "DefReduction",
  DefIgnore = "DefIgnore"
}

export interface MainStat {
  sandType: ValueType;
  gobletType: ValueType;
  circletType: ValueType;
}