// Imported from ANV Foxhole Factory Calculator data/foxhole.json; bundled locally for offline use.
export type FactoryFaction = "neutral" | "colonial" | "warden";
export type FactoryFacility = "factory" | "mpf";
export interface FactoryItem {
  itemName: string; itemDesc?: string; itemCategory: string; itemClass?: string; faction: FactoryFaction[]; imgName: string; numberProduced: number | string; numberProducedBonus?: number | string; isTeched?: boolean; isMpfCraftable?: boolean; craftLocation: FactoryFacility[]; cost: Record<string, number | string>; ammoUsed?: string; damageType?: string; damageDesc?: string; outfitBuffs?: unknown; vehiclePen?: number | string; highVelocityBonus?: number | string; vehiclePenChance?: number | string; isMountable?: boolean;
}
export const FACTORY_ITEMS: FactoryItem[] = [
  {
    "itemName": "\"Dusk\" ce.III",
    "itemDesc": "This unique assault rifle includes a high-capacity drum magazine designed for sustained rapid fire.",
    "itemCategory": "small_arms",
    "itemClass": "Assault Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Dusk_ce_III.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 15
    },
    "ammoUsed": "7.92mm"
  },
  {
    "itemName": "Booker Storm Rifle Model 838",
    "itemDesc": "The Booker is a high-impact three-round burst Storm Rifle for those who like to shoot first.",
    "itemCategory": "small_arms",
    "itemClass": "Assault Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Booker_Storm_Rifle_Model_838.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 15
    },
    "ammoUsed": "7.92mm"
  },
  {
    "itemName": "Aalto Storm Rifle 24",
    "itemDesc": "Widely considered to be the first storm rifle, the Aalto is a marvel in Caoivish engineering. With its two fire modes, it can be used as a rapid-fire assault weapon or a mid-range rifle.",
    "itemCategory": "small_arms",
    "itemClass": "Assault Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Aalto_Storm_Rifle_24.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 15
    },
    "ammoUsed": "7.92mm"
  },
  {
    "itemName": "7.92mm",
    "itemDesc": "Standard ammunition for storm rifles, light machine guns, and armored cars.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "7_92mm.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "Catara mo.II",
    "itemDesc": "A titanic light machine gun capable of scattering infantry lines with ease, the Catara is a modern weapon for the modern Colonial.",
    "itemCategory": "small_arms",
    "itemClass": "Light Machine Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Catara_mo_II.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 15
    },
    "ammoUsed": "12.7mm"
  },
  {
    "itemName": "KRN886-127 Gast Machine Gun",
    "itemDesc": "The Gast is a deadly but cumbersome Kraunian heavy machine gun. It is best suited to holding and defending established fortifications or garrisoned structures against encroaching infantry.",
    "itemCategory": "small_arms",
    "itemClass": "Machine Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "KRN886_127_Gast_Machine_Gun.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 25
    },
    "ammoUsed": "12.7mm",
    "damageType": "Deals heavy kinetic damage"
  },
  {
    "itemName": "Malone MK.2",
    "itemDesc": "This heavy machine gun is bulky enough to require a steady surface to maintain stability. The Malone series of machine guns are unmatched defenders on the battlefield.",
    "itemCategory": "small_arms",
    "itemClass": "Machine Gun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Malone_MK_2.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "rmat": 25
    },
    "ammoUsed": "12.7mm"
  },
  {
    "itemName": "A3 Harpa Fragmentation Grenade",
    "itemDesc": "This anti-personnel fragmentation grenade is designed with pull-pin mechanics and a time fuse for user safety. Serrations in the casing allow for a better grip and increased fragmentation effectiveness.",
    "itemCategory": "small_arms",
    "itemClass": "Grenade",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "A3_Harpa_Fragmentation_Grenade.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "emat": 40
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "Cascadier 873",
    "itemDesc": "This unique sidearm fires in three-round bursts. The Cascadier may not have the stopping power of its cousins, but it more than makes up for it with its lightweight frame, concealability, and fire rate.",
    "itemCategory": "small_arms",
    "itemClass": "Pistol",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Cascadier_873.png",
    "numberProduced": 40,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60
    },
    "ammoUsed": "8mm"
  },
  {
    "itemName": "Bomastone Grenade",
    "itemDesc": "The bomastone is a 'stick' style fragmentation grenade with a handle designed to aid in lobbing over moderate distances.",
    "itemCategory": "small_arms",
    "itemClass": "Grenade",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Bomastone_Grenade.png",
    "numberProduced": 25,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "emat": 40
    },
    "damageType": "Deals shrapnel damage",
    "damageDesc": "Always causes target to bleed"
  },
  {
    "itemName": "8mm",
    "itemDesc": "Standard ammunition for pistols.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "8mm.png",
    "numberProduced": 40,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 40
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "Cometa T2-9",
    "itemDesc": "The Cometa T2-9 boasts remarkable stopping power for a sidearm. This Estrellan mainstay has lived through several generations due to its fine craftsmanship design.",
    "itemCategory": "small_arms",
    "itemClass": "Revolver",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Cometa_T2_9.png",
    "numberProduced": 30,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60
    },
    "ammoUsed": ".44"
  },
  {
    "itemName": "The Hangman 757",
    "itemDesc": "The weapon of choice for pirates and smugglers, its legend is well-earned. With incredibly high stopping power and unique revolver mechanism, the Hangman often playes judge, jury, and executioner.",
    "itemCategory": "small_arms",
    "itemClass": "Heavy Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "The_Hangman_757.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 125
    },
    "ammoUsed": ".44"
  },
  {
    "itemName": ".44",
    "itemDesc": "Standard ammunition for revolvers.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "44.png",
    "numberProduced": 40,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 40
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "Catena rt.IV Auto-Rifle",
    "itemDesc": "An auto-firing rifle that played a pivotal role in maintaining Mesean interests on the Katoman continent. While not quite as rapid-firing as its assault rifle bretheren, many soldiers speak fondly of the Catena as a sturdy, easy-to-use, and reliable firearm. It doesn't boast high points in any particular area but performs admirably as a general-purpose rifle.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Catena_rt_IV_Auto_Rifle.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Argenti r.II Rifle",
    "itemDesc": "The primary infantry rifle of the Colonial legion. Its predecessor, the Volta repeater, was a sturdy, reliable firearm but had many limitations, namely, fire rate. The Argenti solves this limitation as well as being more compact and lightweight.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Argenti_R_II.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Volta r.I Repeater",
    "itemDesc": "An old war Mesean rifle. It boasts high stopping power, but not as accurate as its modern variant. A weapon of legend, the Howling Lions wielded the Volta during their raid on the beaches of Fisherman's Row.",
    "itemCategory": "small_arms",
    "itemClass": "Heavy Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Volta_r_I_Repeater.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Fuscina pi.I",
    "itemDesc": "This unique rifle fires three rounds in rapid succession. The Fuscina is the first of its kind, designed for laying down suppressive fire during assaults on fortified enemy entrenchments.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Fuscina_pi_I.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 140
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "KRR2-790 Omen",
    "itemDesc": "An older but reliable model of Kraunian long rifle. The Omen is a sturdy, simple weapon best used in long-distance skirmishes.",
    "itemCategory": "small_arms",
    "itemClass": "Long Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "KRR2_790_Omen.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 155
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "KRR3-792 Auger",
    "itemDesc": "A Kraunian rifle modified for long-range engagements. It doesn't have the range or stopping power of other marksman rifles but more than makes up for it with unmatched reliability in a range of environments and a superior effective rate of fire.",
    "itemCategory": "small_arms",
    "itemClass": "Sniper Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "KRR3_792_Auger.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 250,
      "rmat": 30
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Sampo Auto-Rifle 77",
    "itemDesc": "The precursor to the storm rifle, the Sampo Auto-Rifle, is a mastercraft of its day. With a single shot and automatic fire mode, this versatile rifle may not reach the fire rates of automatic weapons but more than makes up for it with utility.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Sampo_Auto_Rifle_77.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 125
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Blakerow 871",
    "itemDesc": "The Blakerow is a carbine with a high rate of fire compared to its bolt-action predecessor. This increased fire rate does come at the cost of innate stopping power; however, its versatility and lightweight frame more than makes up for any perceived shortcomings.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Blakerow_871.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 140
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Clancy Cinder M3",
    "itemDesc": "The Clancy Cinder is a classic, high-powered long rifle designed for use in mid-to-long range encounters. First deployed with the Hands during a high-risk operation in Acrithia.",
    "itemCategory": "small_arms",
    "itemClass": "Long Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Clancy_Cinder_M3.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 130
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "No. 2B Hawthorne",
    "itemDesc": "Initially a field-modified Loughcaster, the Hawthorne sports a sawed-off barrel and a much lower profile than its ancestor. While sacrificing accuracy, its lightweight frame opens up the Hawthorne to a much higher degree of flexibility in battle and can be carried alongside a heavier primary firearm.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "No_2B_Hawthorne.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 70
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "No.2 Loughcaster",
    "itemDesc": "Standard-issue Warden rifle. This bolt-action firearm is as robust as they come and has seen over a century of use on the battlefield.",
    "itemCategory": "small_arms",
    "itemClass": "Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "No_2_Loughcaster.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "Clancy-Raca M4",
    "itemDesc": "A heavy-duty, long-range marksman rifle. The Clancy-Raca has one hell of a kick but is fitted with a powerful scope, allowing infantry to survey the battlefield and provide support from a safe location.",
    "itemCategory": "small_arms",
    "itemClass": "Sniper Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Clancy_Raca_M4.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 250,
      "rmat": 25
    },
    "ammoUsed": "7.62mm"
  },
  {
    "itemName": "7.62mm",
    "itemDesc": "Standard ammunition for rifles.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "7_62mm.png",
    "numberProduced": 40,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "KRF1-750 Dragonfly",
    "itemDesc": "A short-ranged firearm that has origins in both sport shooting and bird hunting. Its long stock and sturdy undercarriage give the Dragonfly stability and control that make it a worthy companion to many Kraunian soldiers deployed in urban centres. Dismantling haphazard barricades and clearing tight rooms are paltry tasks for the KRF1-750 Dragonfly.",
    "itemCategory": "small_arms",
    "itemClass": "Shotgun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "KRF1_750_Dragonfly.webp",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 130
    },
    "ammoUsed": "Buckshot"
  },
  {
    "itemName": "No.4 The Pillory Scattergun",
    "itemDesc": "A hunting shotgun with a sawn-off barrel for higher stopping power and mobility at the expense of accuracy. This traditional civilian firearm can fire two shots in rapid succession before needing to be reloaded. It became a favourite sidearm among Caoivish Watchers and has since earned quite an ominous reputation as a result.",
    "itemCategory": "small_arms",
    "itemClass": "Shotgun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "No_4_The_Pillary_Scattergun.webp",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    },
    "ammoUsed": "Buckshot"
  },
  {
    "itemName": "Buckshot",
    "itemDesc": "Standard ammunition for Shotguns.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Buckshot.png",
    "numberProduced": 40,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "No.1 \"The Liar\" Submachinegun",
    "itemDesc": "This unique, heavy-duty submachine gun is not very useful on the run, but with careful aim and adequate cover, becomes a razorblade in the night.",
    "itemCategory": "small_arms",
    "itemClass": "Submachine Gun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "No_1_The_Liar_Submachine_Gun.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "ammoUsed": "9mm SMG"
  },
  {
    "itemName": "Fiddler Submachine Gun Model 868",
    "itemDesc": "The Fiddler Submachine gun is a widely used urban combat weapon. Its high rate of fire and compact frame makes it ideal for close-quarters engagements.",
    "itemCategory": "small_arms",
    "itemClass": "Submachine Gun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Fiddler_Submachine_Gun_Model_868.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "ammoUsed": "9mm SMG"
  },
  {
    "itemName": "\"The Pitch Gun\" mc. V",
    "itemDesc": "This classic submachine gun is sturdy and irreplaceable as a general tool for close-range engagements. The \"Pitch Gun\" earned its namesake from Mesean sailors who employed the weapon to successfully defend against a night raid on the Geraston docks.",
    "itemCategory": "small_arms",
    "itemClass": "Submachine Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "The_Pitch_Gun_mc_V.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    },
    "ammoUsed": "9mm SMG"
  },
  {
    "itemName": "\"Lionclaw\" mc.VIII",
    "itemDesc": "A heavier, modern variation of the Pitch Gun, the Lionclaw Performs well as a decent, all-around submachine gun designed as a primary firearm in urban and close-quarters combat operations.",
    "itemCategory": "small_arms",
    "itemClass": "Submachine Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Lionclaw_mc_VIII.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "ammoUsed": "9mm SMG"
  },
  {
    "itemName": "9mm SMG",
    "itemDesc": "Standard ammunition for submachine guns.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "9mm_SMG.png",
    "numberProduced": 40,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    },
    "damageType": "Deals light kinetic damage"
  },
  {
    "itemName": "PT-815 Smoke Grenade",
    "itemDesc": "A standard smoke grenade designed for concealing allied movement or screening the enemy's vision.",
    "itemCategory": "small_arms",
    "itemClass": "Smoke Grenade",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "PT_815_Smoke_Grenade.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "Green Ash Grenade",
    "itemDesc": "Green ash is an asphyxiating toxin. Inhaling it without protection will result in a quick death. Be sure to wear a gas mask with fresh filters when handling green ash.",
    "itemCategory": "small_arms",
    "itemClass": "Gas Grenade",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Green_Ash_Grenade.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 140
    },
    "damageType": "Deals poisonous gas damage",
    "damageDesc": "Causes damage over time"
  },
  {
    "itemName": "12.7mm",
    "itemDesc": "Standard ammunition for all machine guns, including vehicle mounted weapons like those on the half-track and battle tank.",
    "itemCategory": "small_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "12_7mm.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    }
  },
  {
    "itemName": "\"Typhon\" ra.XII",
    "itemDesc": "This mounted anti-tank rifle boasts improved accuracy over its free-standing counterparts. The Typhon was specifically designed with shock absorption in mind, allowing for faster, more consistent firing patterns.",
    "itemCategory": "heavy_arms",
    "itemClass": "Mounted Anti-Tank Rifle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Typhon_ra_XII.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "20mm",
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 50% extra damage per shot.",
    "isMountable": true
  },
  {
    "itemName": "135 Neville Anti-Tank Rifle",
    "itemDesc": "The Neville is unmatched in its versatility as a portable, magazine-based anti-armor firearm.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank Rifle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "135_Neville_Anti_Tank_Rifle.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 150
    },
    "ammoUsed": "20mm"
  },
  {
    "itemName": "14.5mm",
    "itemDesc": "Standard ammunition for anti-tank rifles.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "145mm.png",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "damageType": "Deals anti-tank explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "Venom c.II 35",
    "itemDesc": "The venom RPG launcher fires anti-tank charges. Its simple design makes it easy to deploy, even in high-stakes operations",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Venom_c_II.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 15
    },
    "ammoUsed": "AP/RPG",
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "Carnyx Anti-Tank Rocket Launcher",
    "itemDesc": "Allows infantry to bombard armoured vehicles from safe distances. This anti-tank rocket launcher is surprisingly light when compared to its contemporaries. Its weight is a double-edged sword, as firing heavy anti-tank ordinance requires a Carnyx operator to prepare for heavy recoil.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Carnyx_Anti_Tank_Rocket_Launcher.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 125,
      "rmat": 15
    },
    "ammoUsed": "AP/RPG",
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "Bane 45",
    "itemDesc": "This shoulder-mounted heavy launcher is the first of its kind. It features heavy blast shielding and is capable of launching anti-tank charges over relatively large distances.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Bane_45.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 150,
      "rmat": 40
    },
    "ammoUsed": "AP/RPG",
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "AP/RPG",
    "itemDesc": "An anti-tank projectile fired from an R.P.G.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "A_T_R_P_G_Shell.png",
    "numberProduced": 15,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 150
    },
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "Mounted Bonesaw MK.3",
    "itemDesc": "This variant of the Bonesaw MK.3 is specially designed for use with tripod mounts. This affords it with increased stability and maximum potential range.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Mounted_Bonesaw_MK_3.webp",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "ARC/RPG",
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "Bonesaw MK.3",
    "itemDesc": "The pride of the Warden anti-armored arsenal, the Bonesaw Mk.3 has one job; to cut through heavy metal plating of Colonial tanks.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Bonesaw_MK_3.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 25
    },
    "ammoUsed": "ARC/RPG",
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "ARC/RPG",
    "itemDesc": "An anti-tank projectile fired from indirect R.P.G. weapons.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "A_T_R_P_G_Indirect_Shell.png",
    "numberProduced": 15,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 150
    },
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "\"Molten Wind\" v.II Flame Torch",
    "itemDesc": "Using a deadly mix of flammable gasses and chemical compounds, the \"Molten Wind\" is the Colonial Legion's most devasting infantry weapon. Employing ancient techniques, Mesean chemists developed a technique to stabilize and weaponize liquid flames, which quickly transform any flammable structure into a raging inferno.",
    "itemCategory": "heavy_arms",
    "itemClass": "Flamethrower",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Molten_Wind_v_II_Flame_Torch.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 185,
      "rmat": 25
    },
    "ammoUsed": "\"Molten Wind\" v.II Ammo",
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 50% extra damage per shot.",
    "isMountable": true
  },
  {
    "itemName": "KLG901-2 Lunaire F",
    "itemDesc": "A weapon designed to launch specialty grenades over long-distances. This modern Kraunian firearm uses advanced propulsion designed for increased efficiency due to the overall weight of the weapon and projectiles.",
    "itemCategory": "heavy_arms",
    "itemClass": "Grenade Launcher",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "KLG901_2_Lunaire_F.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 50,
      "rmat": 15
    },
    "ammoUsed": "Green Ash Grenade, PT-815 Smoke Grenade, Tremola Grenade GPb-1"
  },
  {
    "itemName": "Mounted Fissura gd.I",
    "itemDesc": "Capable of firing different grenades, quickly and at long range, the Fissura gd.I is mobile enough for easy transport, while increasing the effectiveness of infantry ordinance.",
    "itemCategory": "heavy_arms",
    "itemClass": "Grenade Launcher",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Mounted_Fissura_gd_I.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "Tremola Grenade GPb-1, PT-815 Smoke Grenade, Green Ash Grenade"
  },
  {
    "itemName": "Willow's Bane Model 845",
    "itemDesc": "Named for the unfortunate trees harmed in the development of this highly destructive weapon, the Willow's Bane utilizes flammable checmicals and fires them into a concentrated stream through an open flame. This liquid flame ignites Colonial emplacements and garrisons to route infantry while reducing their defenses to a pile of ash.",
    "itemCategory": "heavy_arms",
    "itemClass": "Flamethrower",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Willows_Bane_Model_845.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 165,
      "rmat": 30
    }
  },
  {
    "itemName": "Tremola Grenade GPb-1",
    "itemDesc": "An expolosive Estrllan grenade specially designed for use with handheld grenade launchers. This modern grenade boasts a large payload and is deadly to lingering infantry and structural supports.",
    "itemCategory": "heavy_arms",
    "itemClass": "Grenade",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Tremola_Grenade_GPb_1.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 75,
      "emat": 100
    }
  },
  {
    "itemName": "Lamentum mm.IV",
    "itemDesc": "Built on the bones of the first automatic weapons introduced to the Legion, the \"Lamentum\" mm.IV is still quite an intimidating force to encounter on the battlefield. Boasting a large magazine and impressive active range, this mounted machinegun excels at laying down consistent suppressive fire.",
    "itemCategory": "heavy_arms",
    "itemClass": "Mounted machinegun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Lamentum_mm_IV.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "12.7mm",
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 50% extra damage per shot.",
    "isMountable": true
  },
  {
    "itemName": "Malone Ratcatcher MK.1",
    "itemDesc": "Early iterations of this machinegun were built to be emplaced in bunkers and on the decks of lightly armed warships, the Ratcatcher is Harvey Malone’s first freely mountable infantry weapon designed for field use. Just like its predecessors, this heavy weapon suppresses enemy soldiers with unmatched efficiency.",
    "itemCategory": "heavy_arms",
    "itemClass": "Mounted Machinegun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Malone_Ratcatcher_MK_1.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "12.7mm",
    "isMountable": true
  },
  {
    "itemName": "Daucus isg.III",
    "itemDesc": "This heavy infantry cannon requires a tripod for stability. The Daucus is designed to give infantry a foothold against enemy vehicles and light fortifications or established fortified garrisons.",
    "itemCategory": "heavy_arms",
    "itemClass": "Infantry Support Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Daucus_isg_III.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "30mm"
  },
  {
    "itemName": "30mm",
    "itemDesc": "Standard explosive shell for small vehicles or infantry weapons.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "30mm.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 80,
      "emat": 40
    },
    "damageType": "Deals explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "Cremari Mortar",
    "itemDesc": "This short-range cannon is designed to bombard enemy infantry with indirect fire.",
    "itemCategory": "heavy_arms",
    "itemClass": "Mortar",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Cremari_Mortar.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 25
    },
    "ammoUsed": "Mortar Shell, Mortar Shrapnel Shell, Mortar Flare Shell"
  },
  {
    "itemName": "Mortar Flare Shell",
    "itemDesc": "A shell that ignites midair and illuminates a large area, revealing enemy targets.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Mortar_Shell_Flare.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 15
    }
  },
  {
    "itemName": "Mortar Shrapnel Shell",
    "itemDesc": "A shell that explodes into shrapnel on impact, devastating nearby infantry.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Mortar_Shell_Shrapnel.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 20
    },
    "damageType": "Deals shrapnel damage",
    "damageDesc": "Always causes target to bleed"
  },
  {
    "itemName": "Mortar Shell",
    "itemDesc": "An explosive projectile fired from a mortar.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Mortar_Shell.png",
    "numberProduced": 15,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 70
    },
    "damageType": "Deals high explosive damage",
    "damageDesc": "Reduced damage against trenches"
  },
  {
    "itemName": "Ignifist 30",
    "itemDesc": "This single-use rocket can be fired a short distance. Designed to punch holes into tanks, the ignifist is the perfect tool for infantry anticipating armored resistance.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank RPG",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Ignifist_30.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 85,
      "emat": 70
    },
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "BF5 White Ash Flask Grenade",
    "itemDesc": "An explosive flask used for melting enemy armor. This carefully designed liquid bomb explodes into a dazzling flash of molten debris upon impact.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank Grenade",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "BF5_White_Ash_Flask_Grenade.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "emat": 80
    },
    "damageType": "Deals anti-tank explosive damage",
    "damageDesc": "High chance of disabling Track subsystem"
  },
  {
    "itemName": "B2 Varsi Anti-Tank Grenade",
    "itemDesc": "A compact anti-tank grenade that can be fired from rifle grenade launcher attachments or grenade turrets. Its dense payload excels at crippling armoured vehicles while being versatile and easy to transport.",
    "itemCategory": "heavy_arms",
    "itemClass": "Anti-Tank Grenade",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "B2_Varsi_Anti_Tank_Grenade.webp",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 95,
      "emat": 125
    },
    "damageType": "Deals anti-tank explosive damage",
    "damageDesc": "High chance of disabling Track subsystem"
  },
  {
    "itemName": "Mammon 91-b",
    "itemDesc": "This densely packed, high-explosive grenade is designed to damage structures and vehicles.",
    "itemCategory": "heavy_arms",
    "itemClass": "HE Grenade",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Mammon_91_b.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "emat": 20
    },
    "damageType": "Deals explosive damage"
  },
  {
    "itemName": "Anti-Tank Sticky Bomb",
    "itemDesc": "An adherable grenade designed to penetrate heavy tank armor. The sticky bomb can only be thrown a short distance and is ineffective against structures.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Anti_Tank_Sticky_Bomb.png",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 50,
      "emat": 100
    },
    "damageType": "Deals anti-tank explosive damage",
    "damageDesc": "High chance of disabling Track subsystem"
  },
  {
    "itemName": "Cutler Foebreaker",
    "itemDesc": "This unique duel-barrelled RPG launcher can fire two RPG shells in relatively quick succession. This increase in firepower makes it nearly impossible for a single soldier to operate without the support of a sturdy mount.",
    "itemCategory": "heavy_arms",
    "itemClass": "Mounted RPG Launcher",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Cutler_Foebreaker.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 5
    },
    "ammoUsed": "R.P.G. Shell",
    "damageType": "Deals explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "Cutler Launcher 4",
    "itemDesc": "The Cutler Launcher is capable of firing and unguided, rocket-propelled grenade over short distances with startling efficiency. Its simple design allows for easy deployment and storage.",
    "itemCategory": "heavy_arms",
    "itemClass": "RPG",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Cutler_Launcher_4.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100,
      "rmat": 35
    },
    "ammoUsed": "R.P.G. Shell",
    "damageType": "Deals explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "R.P.G Shell",
    "itemDesc": "An explosive projectile fired from an R.P.G.",
    "itemCategory": "heavy_arms",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "R_P_G_Shell.png",
    "numberProduced": 15,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 60,
      "emat": 90
    },
    "damageType": "Deals explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "20mm",
    "itemDesc": "Standard ammunition for anti-aircraft machine guns.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "20mm.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120
    },
    "damageType": "Deals shrapnel damage",
    "damageDesc": "Always causes target to bleed"
  },
  {
    "itemName": "Shatter Missle",
    "itemDesc": "Short-range rockets that specialize in breaching bunker and devastating enemy structures.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Shatter_Missile.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 250,
      "hemat": 250
    },
    "damageType": "Deals Demolition Damage",
    "damageDesc": "Can ruin structures that have been severly damaged by artillery"
  },
  {
    "itemName": "150mm",
    "itemDesc": "Payload for heavy artillery weapons.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "150mm.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120,
      "hemat": 60
    },
    "damageType": "Deals high explosive damage",
    "damageDesc": "Reduced damage against trenches"
  },
  {
    "itemName": "120mm",
    "itemDesc": "Payload for light artillery weapons.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "120mm.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120,
      "hemat": 10
    },
    "damageType": "Deals high explosive damage",
    "damageDesc": "Reduced damage against trenches"
  },
  {
    "itemName": "250mm \"Purity\" Shell",
    "itemDesc": "A shell that is launched over short distances by a spigot mortar.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "250mm.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120,
      "hemat": 100
    },
    "damageType": "Deals demolition damage"
  },
  {
    "itemName": "250mm \"Fury\" Shell",
    "itemDesc": "A breaching shell that's launched by a spigot mortar.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "250mm_Fury_Shell.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 250,
      "hemat": 200
    },
    "damageType": "Deals demolition damage",
    "damageDesc": "Can ruin structures that have been severly damaged by artillery"
  },
  {
    "itemName": "68mm",
    "itemDesc": "An anti-tank shell that's effective against penetrating tank armor.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "68mm.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 120,
      "emat": 240
    },
    "damageType": "Deals armor piercing damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles.",
    "vehiclePenChance": "High chance to penetrate armored vehicles."
  },
  {
    "itemName": "40mm",
    "itemDesc": "Standard payload for light tanks.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "40mm.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 160,
      "emat": 240
    },
    "damageType": "Deals explosive damage",
    "damageDesc": "Can penetrate armored vehicles",
    "vehiclePen": "Damage to the sides and rear of armored vehicles have a higher chance to penetrate at close range and at direct angles."
  },
  {
    "itemName": "E6881-B Hullbreaker Mine",
    "itemDesc": "A specialized sea mine that floats near the surface, causing destructive damage to ship hulls.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "E681_B_Hullbreaker_Mine.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 125,
      "emat": 35
    },
    "damageType": "",
    "damageDesc": ""
  },
  {
    "itemName": "Quillback Torpedo",
    "itemDesc": "Designed as a lightweight version of the Moray Torpedo for mounting on light aircraft.",
    "itemCategory": "heavy_ammunition",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Quillback_Torpedo.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 125,
      "emat": 75
    },
    "damageType": "Deals Amour Piercing damage",
    "damageDesc": "High chance to penetrate armoured vehicles"
  },
  {
    "itemName": "Barbed Wire",
    "itemDesc": "Used to construct Barbed Wire defenses.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Barbed_Wire.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 15
    }
  },
  {
    "itemName": "Buckhorn CCQ-18",
    "itemDesc": "Attached to the barrel of a rifle, this short blade can spear enemies in close quarters encounters.",
    "itemCategory": "utilities",
    "itemClass": "Bayonet",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Buckhorn_CCQ_18.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 40
    }
  },
  {
    "itemName": "Binoculars",
    "itemDesc": "An optical instrument used for viewing distant objects.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Binoculars.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75
    }
  },
  {
    "itemName": "Hydra's Whisper",
    "itemDesc": "This unique demolotion tool is a long, metal tube packed with explosives. The Hydra's Whisper is designed to destroy out-of-reach movement impairing structures and detonate any mines along the length of the tube.",
    "itemCategory": "utilities",
    "itemClass": "Explosive",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Hydras_Whisper.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 100,
      "emat": 80
    },
    "damageType": "Deals demolition damage",
    "damageDesc": "Destroys obstacles that can otherwise only be dismantled with Wrenches"
  },
  {
    "itemName": "Havoc Charge",
    "itemDesc": "A high-powered explosive charge that requires an accompanyting detonator. The Havoc Charge is highly effective at demoloshing large structures. The charge must be detonated via gunshot. The Havoc Charge's true potential is unleashed when executing strategic demolitions at safe distances.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Havoc_Charge.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75,
      "hemat": 40
    }
  },
  {
    "itemName": "Willow's Bane Ammo",
    "itemDesc": "Ammo for Willow's Bane Model 845",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Willows_Bane_Ammo.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 135,
      "hemat": 20
    }
  },
  {
    "itemName": "\"Molten Wind\" v.II Ammo",
    "itemDesc": "Ammo for the \"Molten Wind\" v.II Flame Torch",
    "itemCategory": "utilities",
    "itemClass": "Flamethrower Ammo",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Molten_Wind_v_II_Ammo.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 160,
      "hemat": 20
    }
  },
  {
    "itemName": "Listening Kit",
    "itemDesc": "A device used to intercept enemy radio broadcasts transmitted from nearby sources.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Listening_Kit.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 150
    }
  },
  {
    "itemName": "Falias Raiding Club",
    "itemDesc": "A heavy mace constructed from solid wood and dotted with lead rivets. Commonly used when raiding entrenched positions in close quarters where firearms are less effective and an old-fashioned bludgeoning is better suited for the job.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Falias_Raiding_Club.png",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 200
    }
  },
  {
    "itemName": "Metal Beam",
    "itemDesc": "Used to construct Metal Beam defenses.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Metal_Beam.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 25
    }
  },
  {
    "itemName": "Radio Backpack",
    "itemDesc": "Automatically gathers map intel periodically when equipped. The radio backpack is also used to transmit other sensitive information across long distances.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Radio_Backpack.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 150
    }
  },
  {
    "itemName": "Sandbag",
    "itemDesc": "Used to construct Sandbag defenses.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Sandbag.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 15
    }
  },
  {
    "itemName": "Havoc Charge Detonator",
    "itemDesc": "Required to detonate Havoc Charges. The Havoc Charge must be placed before the detonator can be deployed.",
    "itemCategory": "utilities",
    "itemClass": "Explosive Charge",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Havoc_Charge_Detonator.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75,
      "hemat": 20
    }
  },
  {
    "itemName": "Alligator Charge",
    "itemDesc": "This heavy-duty explosive device is designed to deal significant damage to structures and stationary vehicles.",
    "itemCategory": "utilities",
    "itemClass": "Satchel Charge",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Alligator_Charge.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 150,
      "emat": 160
    },
    "damageType": "Deals demolition damage"
  },
  {
    "itemName": "Shovel",
    "itemDesc": "A tool for digging trenches and other entrenched structures.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Shovel.png",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 200
    }
  },
  {
    "itemName": "Sledge Hammer",
    "itemDesc": "A tool used to salvage components from remains of old vehicles and equipment.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Sledge_Hammer.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 200
    }
  },
  {
    "itemName": "Eleos Infantry Dagger",
    "itemDesc": "Standard-issue Mesean military dagger. Its long, slender blade excels in close-quarter combat as well as a plethora of uses in everyday operations.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Eleos_Infantry_Dagger.png",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 200
    }
  },
  {
    "itemName": "Tripod",
    "itemDesc": "A mount point for deployable infantry weapons and equipment.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Tripod.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 100
    }
  },
  {
    "itemName": "Wind Sock",
    "itemDesc": "A sturdy fabric cylinder mounted on a tripod that's designed to help nearby operators determine the speed and direction of the wind.",
    "itemCategory": "utilities",
    "itemClass": "Equipment",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Wind_Sock.webp",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 150
    }
  },
  {
    "itemName": "Wrench",
    "itemDesc": "A multipurpose tool. Can be used to dismantle mines/barbed wire and unlock vehicles.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Wrench.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75
    }
  },
  {
    "itemName": "Water Bucket",
    "itemDesc": "A bucket that holds water. You can toss water onto fires to extinguish them.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Water_Bucket.png",
    "numberProduced": 50,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "Gas Mask",
    "itemDesc": "Protects against poison gas.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Gas_Mask.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 160
    }
  },
  {
    "itemName": "Gas Mask Filter",
    "itemDesc": "When attached to a gas mask, this filter provides fresh air to the wearer.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Gas_Mask_Filter.png",
    "numberProduced": 20,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 100
    }
  },
  {
    "itemName": "The Ospreay",
    "itemDesc": "A rifle attachment that fires grenades with pneumatic force. Along with specialized grenades, it can launch standard grenades.",
    "itemCategory": "utilities",
    "itemClass": "Grenade Launcher",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "The_Ospreay.png",
    "numberProduced": 20,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 85,
      "rmat": 10
    }
  },
  {
    "itemName": "Radio",
    "itemDesc": "Receives map intelligence updates.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Radio.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75
    }
  },
  {
    "itemName": "Liason Transmitter",
    "itemDesc": "Allows receiving map intelligence reports on detected airborne targets.",
    "itemCategory": "utilities",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Liason_Transmitter.png",
    "numberProduced": 5,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 75
    }
  },
  {
    "itemName": "Bandages",
    "itemDesc": "Used to stem bleeding.",
    "itemCategory": "medical",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Bandages.png",
    "numberProduced": 50,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "First Aid Kit",
    "itemDesc": "Used by medics to heal other soldiers.",
    "itemCategory": "medical",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "First_Aid_kit.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 60
    }
  },
  {
    "itemName": "Trauma Kit",
    "itemDesc": "Used by medics to revive wounded soldiers.",
    "itemCategory": "medical",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Trauma_Kit.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "Blood Plasma",
    "itemDesc": "A blood component used to treat wounded soldiers on the battlefield.",
    "itemCategory": "medical",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Blood_Plasma.png",
    "numberProduced": 50,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "Soldier Supplies",
    "itemDesc": "A standard issue set of supplies for foot soldiers. Bases must be stockpiled with soldier supplies in order for players to spawn.",
    "itemCategory": "medical",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Soldier_Supplies.webp",
    "numberProduced": 10,
    "isTeched": false,
    "isMpfCraftable": false,
    "craftLocation": [
      "factory"
    ],
    "cost": {
      "bmat": 80
    }
  },
  {
    "itemName": "Maintenance Supplies",
    "itemDesc": "Supplies for maintaining structures. Store at Bases or Maintenance Tunnels to prevent decay on surrounding structures.",
    "itemCategory": "supplies",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Maintenance_Supplies.png",
    "numberProduced": 100,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 250
    }
  },
  {
    "itemName": "Material pallet",
    "itemDesc": "A material pallet.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Material_Pallet.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 75
    }
  },
  {
    "itemName": "Resource Container",
    "itemDesc": "A container that can carry large quantities of resources and can be transported by certain vehicles.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Resource_Container.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 150
    }
  },
  {
    "itemName": "Shipping Container",
    "itemDesc": "A container for shipping very large quantities of Crates using Crane loaded vehicles. This type of container can only be unloaded at Storage Depots and Seaports.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Shipping_Container.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "Leary AA-70 Bolas",
    "itemDesc": "A late entry into the Leary arsenal, the AA-70 Bolas was a direct response to a sudden uptick in Colonial aerial aggression. This emplaced cannon excels equally at both slowing and bringing down enemy aircraft.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Leary_AA_70_Bolas.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 525
    }
  },
  {
    "itemName": "Leary Shellbore 68mm",
    "itemDesc": "A defensive emplacement with a 68mm Anti-tank cannon. This rudimentary weapon was once built to fit onto the hell of large naval vessels, but was eventually phased out and repurposed.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "68mm_Anti_Tank_Cannon.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 450
    }
  },
  {
    "itemName": "DAE 5b \"Zeal\"",
    "itemDesc": "A sturdy, stationary cannon for bombarding high-flying enemy aircrafts with explosive shrapnel shells. The DAE 5b anti-aircraft emplacement has become infamous for walls of black smoke its payload leaves behind.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "DAE_5b_Zeal.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 525
    }
  },
  {
    "itemName": "50-500 \"Thunderbolt\" Cannon",
    "itemDesc": "This heavy artillery cannon is designed to cripple enemy fortifcations from an entrenched position. Its long heavy barrel gives the \"Thunderbolt\" outstanding range.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "50_500_Thunderbolt_Cannon.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 585
    }
  },
  {
    "itemName": "Huber Exalt 150mm",
    "itemDesc": "A heavy cannon designed to shatter the garrisons and fortifications of advancing forces. The Exalt is best utilized when placed into a defensive position to take advantage of its impressive range.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Huber_Exalt_150mm.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 525
    }
  },
  {
    "itemName": "Leary Snare Trap 127",
    "itemDesc": "The Snare Trap is a repurposed anti-aircraft flak cannon used to fortify emplaced positions with twin anti-infantry machine guns.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "12_7_Anti_Infantry_Flak_Gun.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 225
    }
  },
  {
    "itemName": "Huber Lariat 120mm",
    "itemDesc": "A light artillery cannon designed to be a fixture in defensive fortifications. The Lariat sports a formidable long-range 120mm cannon designed to put immense pressure on the enemy infantry.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Huber_Lariat_120mm.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 105
    }
  },
  {
    "itemName": "DAE 1o-3 \"Polybolos\"",
    "itemDesc": "To combat Caoivish ingenuity, the Meseans developed their own indirect RPG propulsion system. Duel launchers are fitted on a large emplacement platform to maximize coverage in an established position, rather than being related to a guerilla warfare tool.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "DAE_1o_3_Polybolos.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 375
    }
  },
  {
    "itemName": "DAE 1b-2 \"Serra\"",
    "itemDesc": "Built like a saw blade, the DAE 1b-2 emplacement gun is fitted with three cascading machine gun turrets. What the \"Serra\" lacks in power, it makes up for in sheer rate of fire for a weapon of its size.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "DAE_1b_2_Serra.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "Concrete Mixer",
    "itemDesc": "A portable device that mixes various materials to form Concrete, which are used to build heavily fortified structures.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Concrete_Mixer.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 225
    }
  },
  {
    "itemName": "Construction Equipment",
    "itemDesc": "An automated excavator that can be fuelled with Gravel to assist with construction projects.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Construction_Equipment.webp",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 150
    }
  },
  {
    "itemName": "Liquid Container",
    "itemDesc": "Stores a high volume liquids, supporting a variety of fuel types. Nearby structures or vehicles can be refueled directly from this container.",
    "itemCategory": "shipables",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Fuel_Container.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "T3 \"Xiphos\"",
    "itemDesc": "Colonial Armored Cars are quick, well-rounded urban assault platforms. These anti-infantry vehicles are equipped with twin-barelled machineguns.",
    "itemCategory": "vehicles",
    "itemClass": "Armored Car",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "T3_Xiphos.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 75
    }
  },
  {
    "itemName": "O'Brien v.190 Knave",
    "itemDesc": "One of Conor O'Brien's best traits was his ability to modernize and make use of older technology in his designs. The v.190 Knave is the perfect example of this philosophy. Fitted with a modified, outdated twin-grenade launcher turret, the Knave is a surprising combination of speed and subterfuge that quickly routs the enemy, leaving them befuddled.",
    "itemCategory": "vehicles",
    "itemClass": "Armored Car",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "O_Brien_v_190_Knave.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 120
    }
  },
  {
    "itemName": "O'Brien v.110",
    "itemDesc": "Warden Armoured Cars are quick, well-rounded urban assault platforms. These anti-infantry vehicles are equipped with twin-barrelled machineguns.",
    "itemCategory": "vehicles",
    "itemClass": "Armored Car",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "O_Brien_v_110.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 75
    }
  },
  {
    "itemName": "Noble Widow MK. XIV",
    "itemDesc": "This deadly tank turns predator into prey. A tank Destroyer, the Noble Widow specializes in ambush tactics, waiting for its quarry and striking with destructive high-velocity shells",
    "itemCategory": "vehicles",
    "itemClass": "Destroyer Tank",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Noble_Widow_MK_XIV.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 480
    },
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 75% extra damage per shot."
  },
  {
    "itemName": "Collins Cannon 68mm",
    "itemDesc": "The Collins Cannon is a mobile Anti-Tank field gun firing 68mm armor-piercing rounds.",
    "itemCategory": "vehicles",
    "itemClass": "Field AT Gun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Collins_Cannon_68mm.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "Balfour Wolfhound 40mm",
    "itemDesc": "This destructive short-ranged cannon is designed for direct engagement with enemy fortifications. The Wolfhound is fitted with reinforced shielding and a 40mm barrel.",
    "itemCategory": "vehicles",
    "itemClass": "Field Cannon",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Balfour_Wolfhound_40mm.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "Swallowtail 988/127-2",
    "itemDesc": "A duel barrelled, high calibre anti-infantry machine gun. The Swallowtail is fitted with forward-facing armor plating and is excellent for suppression.",
    "itemCategory": "vehicles",
    "itemClass": "Field Machine Gun",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Swallowtail_988_127_2.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    },
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 20% extra damage per shot."
  },
  {
    "itemName": "Balfour Falconer 250mm",
    "itemDesc": "A heavy mobile mortar platform fitted with a thick frontal sheild for assaulting fortified locations.",
    "itemCategory": "vehicles",
    "itemClass": "Field Mortar",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Balfour_Falconer_250mm.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 105
    }
  },
  {
    "itemName": "Niska Mk. I Gun Motor Carriage",
    "itemDesc": "Designed for escort missions and to support infantry operations, the Niska Gun Motor Carriage Half-Track is an armored, versatile all-terrain vehicle equipped with a mounted machinegun.",
    "itemCategory": "vehicles",
    "itemClass": "Half-Track",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Niska_Mk_I_Gun_Motor_Carriage.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 180
    }
  },
  {
    "itemName": "Mulloy LPC",
    "itemDesc": "The Mulloy Landing Personnel Carrier is an armored amphibious vehicle designed for carrying troops across large bodies of water to aid in coordinated beach landings and flanking assaults.",
    "itemCategory": "vehicles",
    "itemClass": "Landing APC",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Mulloy_LPC.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "Devitt Mk. III",
    "itemDesc": "A highly maneuverable lightweight tank. Designed for urban environments, the Devitt is fitted with a 40mm cannon.",
    "itemCategory": "vehicles",
    "itemClass": "Light Tank",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Devitt_Mk_III.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 360
    }
  },
  {
    "itemName": "AA-2 Battering Ram",
    "itemDesc": "The Battering Ram is a mobile Anti-Tank field gun firing 68mm armor piercing rounds.",
    "itemCategory": "vehicles",
    "itemClass": "Field AT Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "AA_2_Battering_Ram.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "G40 \"Sagittarii\"",
    "itemDesc": "A duel barrelled, high calibre anti-infantry machine gun. The \"Sagittarii\" is fitted with forward-facing armor plating and is excellent for suppression.",
    "itemCategory": "vehicles",
    "itemClass": "Field Machine Gun",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "G40_Sagittarii.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "30-250 \"Tisiphone\" Field Cannon",
    "itemDesc": "The 30-250 \"Tisiphone\" Field Cannon is mobilized destruction incarnate. An infantry unit armed with these mortar cannons signal imminent devastation to enemy structures and emplacements.",
    "itemCategory": "vehicles",
    "itemClass": "Field Mortar",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "30_250_Tisiphone_Field_Cannon.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 105
    }
  },
  {
    "itemName": "120-68 \"Koronides\" Field Gun",
    "itemDesc": "A long range Colonial mobile artillery used to lay siege to fortified positions",
    "itemCategory": "vehicles",
    "itemClass": "Field Artillery",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "120_68_Koronides_Field_Gun.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 150
    }
  },
  {
    "itemName": "HH-a \"Javelin\"",
    "itemDesc": "Designed for escort missions and to support infantry operations, the HH-a class \"Javelin\" Half-Track is an armored, versatile all-terrain vehicle equipped with a mounted machinegun.",
    "itemCategory": "vehicles",
    "itemClass": "Half-Track",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "HH_a_Javelin.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 165
    }
  },
  {
    "itemName": "AB-8 \"Acheron\"",
    "itemDesc": "The Acheron is an armored amphibious vehicle designed for carrying troops across large bodies of water to aid in coordinated beach landings and flanking assaults.",
    "itemCategory": "vehicles",
    "itemClass": "Landing APC",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "AB_8_Acheron.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 60
    }
  },
  {
    "itemName": "H5 \"Hatchet\"",
    "itemDesc": "A highly maneuverable lightweight tank. Designed for urban environments, the \"Hatchet\" is fitted with a 40mm cannon.",
    "itemCategory": "vehicles",
    "itemClass": "Light Tank",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "H5_Hatchet.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 345
    }
  },
  {
    "itemName": "r-12 - \"Salus\" Ambulance",
    "itemDesc": "The \"salus\" Ambulance is efficient at transporting Critcally Wounded Soldiers and carrying medical supplies.",
    "itemCategory": "vehicles",
    "itemClass": "Ambulance",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "r_12_Salus_Ambulance.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 450
    }
  },
  {
    "itemName": "Dunne Responder 3e",
    "itemDesc": "The Responder Ambuleance is efficient at transporting Critically Wounded Soldiers and carrying medical supplies.",
    "itemCategory": "vehicles",
    "itemClass": "Ambulance",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Dunne_Responder_3e.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 450
    }
  },
  {
    "itemName": "R-15 - \"Chariot\"",
    "itemDesc": "The \"Chariot\" is a transport vehicle used to shuttle personnel to the front line.",
    "itemCategory": "vehicles",
    "itemClass": "Transport Bus",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "R_15_Chariot.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "Dunne Caravaner 2F",
    "itemDesc": "The Caravaner is a transport vehicle used to shuttle personnel to the front line.",
    "itemCategory": "vehicles",
    "itemClass": "Transport Bus",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Dunne_Caravaner_2f.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "BMS - Universal Assemly Rig",
    "itemDesc": "A specialized vehicle designed by the Basset Motor Society used in the construction of large structures.",
    "itemCategory": "vehicles",
    "itemClass": "Construction Vehicle",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "BMS_Universal_Assemly_Rig.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "BMS - Class 2 Mobile Auto-Crane",
    "itemDesc": "The Basset Motor Society's Class 2 Mobile Auto-Crane is used to lift and reposition vehicles and very heavy equipment.",
    "itemCategory": "vehicles",
    "itemClass": "Crane",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "BMS_Class_2_Mobile_Auto_Crane.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 375
    }
  },
  {
    "itemName": "BMS - Packmule Flatbed",
    "itemDesc": "A heavy duty shipping transport truck designed by Bassett Motor Society. It's built for hauling the heaviest of equipment over long distances with ease.",
    "itemCategory": "vehicles",
    "itemClass": "Flatbed Truck",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "BMS_Packmule_Flatbed.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 90
    }
  },
  {
    "itemName": "RR-3 \"Stolon\" Tanker.",
    "itemDesc": "The \"Stolen\" Tanker is a heavier R-series rig designed to transport and distribute large quantities of Fuel.",
    "itemCategory": "vehicles",
    "itemClass": "Fuel Tanker",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "RR_3_Stolon_Tanker.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "Dunne Fuelrunner 2d",
    "itemDesc": "The Fuelrunner is a heavy Dunne rig designed to transport and distribute large quantities of Fuel.",
    "itemCategory": "vehicles",
    "itemClass": "Fuel Tanker",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Dunne_Fuelrunner_2d.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "86K-a \"Bardiche\"",
    "itemDesc": "Unlike the 85-series, the Bardiche sports a heavier, more durable build and is fitted with a coaxial heavy machinegun along with a powerful, short-barrelled 68mm turret. Modern Kraunian engineering allows for a fast reload, making it an ideal tool to combat enemy armor.",
    "itemCategory": "vehicles",
    "itemClass": "Assault Tank",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "86K_a_Bardiche.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 495
    }
  },
  {
    "itemName": "90T-v \"Nemesis\"",
    "itemDesc": "With immense off-road capabilities, the 90T-v \"Nemesis\" is a highly versatile armoured vehicle. While it may not boast the defensive capabilities of its more heavily armoured cousins, the \"Nemsis\" shatters enemy formations with its deadly 68mm cannon and auxiliary grenade launcher. This unique vehicle earned its namesake on its first deployment during an expedition into the Alliant Union. A Nevish Alliance armed convoy was crossing through wetlands when a wave of 90T-v tanks intercepted the convoy from between reeds and murky terrain.",
    "itemCategory": "vehicles",
    "itemClass": "Assault Tank",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "90T_v_Nemesis.webp",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 450
    }
  },
  {
    "itemName": "85K-b \"Falchion\"",
    "itemDesc": "Designed for mass-production in Kraunia, this assault tank features a modular turret system for maximum versatility.The \"Falchion\" Class features a powerful if understated, 40mm cannon.",
    "itemCategory": "vehicles",
    "itemClass": "Assault Tank",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "85K_b_Falchion.png",
    "numberProduced": 5,
    "numberProducedBonus": "2x bonus vehicles produced per crate",
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 405
    }
  },
  {
    "itemName": "HC-2 \"Scorpion\"",
    "itemDesc": "The \"Scorpion\" HC-class tank is a moderately armored infantry support vehicle with twin, high-powered heavy machine guns and short-range radios for improved intelligence support. In addition, exterior seating is available for infantry.",
    "itemCategory": "vehicles",
    "itemClass": "Light Infantry Tank",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "HC_2_Scorpion.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 300
    },
    "highVelocityBonus": "Equipped with a high velocity barrel that deals 20% extra damage per shot."
  },
  {
    "itemName": "03MM \"Caster\"",
    "itemDesc": "A motorcycle and sidecar used to patrol large areas. Speed can be boosted at the cost of additional fuel.",
    "itemCategory": "vehicles",
    "itemClass": "Motorcyle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "03MM_Caster.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 255
    }
  },
  {
    "itemName": "Gallagher Brigand Mk. I",
    "itemDesc": "The first Colm Gallagher's mid-sized tanks, the Brigand is a true brute on the battlefield. Not quite as sturdy as its younger siblings, the Brigand compensates with higher mobility, which, when paired with a mounted machine gun and 30mm repeater cannon, is a deadly force in any armour division. Seeing his hometown sundered at the hands of the Swords in a border skirmish before the onset of the Boreal Wars, Gallagher grew fixated on engineering a versatile yet sturdy tank. The Brigand was the result of his fixation.",
    "itemCategory": "vehicles",
    "itemClass": "Cruiser Tank",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Gallagher_Brigand_Mk_I.webp",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 450
    },
    "highVelocityBonus": "Engine can be boosted for increased top speed."
  },
  {
    "itemName": "Silverhand - Mk. IV",
    "itemDesc": "The Silverhand assault tank is fitted with destructive dual-barrel armaments, and heavy frontal and rear armor. Its 68mm frontal cannon is pared with a lighter 40mm turret.",
    "itemCategory": "vehicles",
    "itemClass": "Assault Tank",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Silverhand_Mk_IV.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 465
    }
  },
  {
    "itemName": "Kivela Power Wheel 80-1",
    "itemDesc": "A Warden Motorcycle used in patrols and fitted with a sidecar. The Kivela Power Wheel can also gain a momentary speed boost by burning additional fuel.",
    "itemCategory": "vehicles",
    "itemClass": "Motorcycle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Kivela_Power_Wheel_80_1.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 255
    }
  },
  {
    "itemName": "UV-05a \"Argonaut\"",
    "itemDesc": "This stripped down Light Utility Vehicle provides extra seating for a small crew to engage in hit and run tactices.",
    "itemCategory": "vehicles",
    "itemClass": "Light Utility Vehicle",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "UV_05a_Argonaut.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 30
    }
  },
  {
    "itemName": "T12 \"Actaeon\" Tankette",
    "itemDesc": "This complete overhaul of the T3 Armored Car is reinforced with tank armor. While these extra defenses lower the T12's overall speed and handling, the addition of treads provide increased performace in less than ideal terrain.",
    "itemCategory": "vehicles",
    "itemClass": "Armored Car",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "T12_Actaeon_Tankette.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 105
    }
  },
  {
    "itemName": "King Spire Mk. I",
    "itemDesc": "This small tank has been recently recommissioned to the Warden arsenal. It b oasts high maneuverability and an antenna that allows for long-range communications during high-stakes recon operations.",
    "itemCategory": "vehicles",
    "itemClass": "Scout Tank",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "King_Spire_MK_I.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 210
    }
  },
  {
    "itemName": "Drummond 100a",
    "itemDesc": "A maltipurpose off-road Warden vehicle that can scout nearby targets.",
    "itemCategory": "vehicles",
    "itemClass": "Light Utility Vehicle",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Drummond_100a.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 30
    }
  },
  {
    "itemName": "Rooster - Junkwagon",
    "itemDesc": "A simple towable trailer that holds common building resources.",
    "itemCategory": "vehicles",
    "itemClass": "Trailer",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Rooster_Junkwagon.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 30
    }
  },
  {
    "itemName": "Dunne Loadlugger 3c",
    "itemDesc": "This standard Truck is fitted with a resource hopper in place of the standard cargo hold. This allows for a much greater capacity for resources at the expense of space for cargo.",
    "itemCategory": "vehicles",
    "itemClass": "Truck",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Dunne_Loadlugger_3c.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 360
    }
  },
  {
    "itemName": "Dunne Transport",
    "itemDesc": "A heavy-duty Warden truck used to mobilize troops and supplies.",
    "itemCategory": "vehicles",
    "itemClass": "Truck",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Dunne_Transport.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "R-1 Hauler",
    "itemDesc": "A heavy-duty Colonial truck used to mobilize troops and supplies.",
    "itemCategory": "vehicles",
    "itemClass": "Truck",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "R_1_Hauler.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "R-5 \"Atlas\" Hauler",
    "itemDesc": "This standard Truck is fitted with a resource hopper in place of the standard cargo hold. This allows for a much greater capacity for resources at the expense of space for cargo.",
    "itemCategory": "vehicles",
    "itemClass": "Truck",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "R_5_Atlas_Hauler.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 360
    }
  },
  {
    "itemName": "Type B - \"Lucian\"",
    "itemDesc": "This shoreline \"bunker buster\" packs quite the punch to any unfortunately positioned enemy emplacements. The Type B was gifted its colloquial name in jest in response to the discovery that its first-ever captain, Lucian Kelly, once served in the Caoivish Naval Command.",
    "itemCategory": "vehicles",
    "itemClass": "Siege Boat",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Type_B_Lucian.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 300
    }
  },
  {
    "itemName": "Type C - \"Charon\"",
    "itemDesc": "Designed for river patrols, the Type-C Charon is fitted with twin tripod mounts, and a midship mortar cannon designed to sunder any armoured resistance on the shore or on open waters.",
    "itemCategory": "vehicles",
    "itemClass": "Gunboat",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Type_C_Charon.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 420
    }
  },
  {
    "itemName": "81f-f Ronan Blackguard",
    "itemDesc": "A shore-strafing gunship, the Blackguard's heavy mortar blitz makes short work of coastline bunker networks. Sporting ample storage for mortar shells means a no-frills approach to overall engineering. While the Blackguard may need a nearby escort, it more than makes up for it with pure guile.",
    "itemCategory": "vehicles",
    "itemClass": "Siege Boat",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "81f_F_Ronan_Blackguard.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 300
    }
  },
  {
    "itemName": "74b-1 Ronan Gunship",
    "itemDesc": "The 74b-1 Ronan Gunship specializes in roaming between larger vessels at high-speeds and boring into their hulls with ease. It's armed with multiple tripod mounts to support the midship high-explosive mortar cannon.",
    "itemCategory": "vehicles",
    "itemClass": "Gunboat",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "74b_1_Ronan_Gunship.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "rmat": 420
    }
  },
  {
    "itemName": "Das Krokodil by VAC",
    "itemDesc": "This deep water Venchin Auto Corporation light freighter is a sturdy vessel that specializes in seaport-to-seaport deliveries. As a deep water ship, Das Krokodil can't safely reach land-based shipping structures.",
    "itemCategory": "vehicles",
    "itemClass": "Light Freighter",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Das_Krokodil_By_VAC.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 300
    }
  },
  {
    "itemName": "K-81e \"Sombre\"",
    "itemDesc": "The \"Sombre\" is an excort gunship that excels at deterring air-to-naval aggression. Fitted with paired machine gun turrets and boasting a heavier frame than most vessels of comparable size, this Kraunian-made K81e emerges at a moment's notice to defend its charge.",
    "itemCategory": "vehicles",
    "itemClass": "Infantry Boat",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "K_81e_Sombre.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 600
    }
  },
  {
    "itemName": "68A-4 Ronan Fathomer",
    "itemDesc": "This naval escort ship excels at sea-to-air engagements, providing friendly naval vessels with critical protection from enemy aircraft. The 68-series remains one of Patrick Ronan's favourite designs. Having been commissioned by the Watchers to aid in coastal investigations, this modification - given the designation A-4 - has since eclipsed its forebear's ubiquity.",
    "itemCategory": "vehicles",
    "itemClass": "Infantry Boat",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "68A_4_Ronan_Fathomer.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 750
    }
  },
  {
    "itemName": "BMS - Aquatipper",
    "itemDesc": "A large shipping vessel, the Aquatipper is used to transport vehicles, equipment, and personnel over large bodies of water.",
    "itemCategory": "vehicles",
    "itemClass": "Barge",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "BMS_Aquatipper.png",
    "numberProduced": 3,
    "isTeched": false,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 450
    }
  },
  {
    "itemName": "BMS - Ironship",
    "itemDesc": "The Basset Motor Society's Ironship-class shipping vessel is used to freight shippable goods and heavy vehicles.",
    "itemCategory": "vehicles",
    "itemClass": "Freighter",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "BMS_Ironship.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 1500
    }
  },
  {
    "itemName": "Strider",
    "itemDesc": "A small but sturdy naval weapons plateform excelling in ship-to-ship combat. Deadly to both enemy vessels and crew, the Type D comes fitted with starboard and port-facing machine guns alongside bow and stern-facing cannons.",
    "itemCategory": "vehicles",
    "itemClass": "Gunship",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Strider.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 1500
    }
  },
  {
    "itemName": "Rinnspeir Ornitier-Class Gunship",
    "itemDesc": "Known as the \"Bounty Hunter of the Sea\", the Ornitier is a deadly ship-to-ship weapons platform. While not as manoeuvrable as smaller vessels, its sturdy frame allows it to take much more punishment. Twin gunwale-mounted cannons provide ample firepower to punch holes in enemy ships, while its bow-mounted RPG launcher ends any chase before it has a chance to begin.",
    "itemCategory": "vehicles",
    "itemClass": "Gunship",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Rinnspeir_Ornitier_Class_Gunship.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 1350
    }
  },
  {
    "itemName": "Bellweather by VAC",
    "itemDesc": "A simple vessel designed to lay out and maintain naval mines. Manufactured by the Venchin Auto Corporation, the Bellweather was originally commissioned by the Wenitan Naval Guard. Sensing further opportunities to profit, VAC began marketing the Bellweather to navies beyond Katoma, finally reaching Caoivish shores.",
    "itemCategory": "vehicles",
    "itemClass": "Mine Boat",
    "faction": [
      "neutral",
      "colonial",
      "warden"
    ],
    "imgName": "Bellweather_By_VAC.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "mpf"
    ],
    "cost": {
      "bmat": 450
    }
  },
  {
    "itemName": "Velian Flak Vest",
    "itemDesc": "A heavily reinforced vest designed to protect grenadiers from shrapnel back blasts. As such, the Flak Vest reduces cuts and scrapes on top of dampening bullet impacts.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Armour Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Velian_Flak_Vest.png",
    "numberProduced": 10,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 200
    },
    "outfitBuffs": [
      "3 backpack slots"
    ]
  },
  {
    "itemName": "Fabri Rucksack",
    "itemDesc": "Engineers are the bones of the Mesean Republic. They are outfitted with a heavy bag and belts for easy access to tools and handheld materials.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Engineering Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Fabri_Rucksack.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "8 backpack slots",
      "Materials have reduced encumberance"
    ]
  },
  {
    "itemName": "Grenadier's Baldric",
    "itemDesc": "Of the most distinguished divisions of the Legion are the Grenadiers. They are outfitted with specialized satchels and pockets for maximizing their capacity to hail explosives.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Grenade Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Grenadiers_Baldric.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Grenades stack",
      "Grenades have reduced encumberance"
    ]
  },
  {
    "itemName": "Medic Fatigues",
    "itemDesc": "For medics of the Legion, this uniform has a plethora of pockets and bags designed to carry and deploy first aid gear easily.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Medic Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Medic_Fatigues.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Bandages and Blood Plasma stack",
      "First Aid Kits and Trauma Kits have reduced encumberance"
    ]
  },
  {
    "itemName": "Remex Garb",
    "itemDesc": "Standard-issue uniform for sailors in the Velian branc of the Republic Coastal Legion. Dressed for practicality, Velian Remiges are second to none at keeping ships in top-top condition while wading through water levels that would see most men praying for a swift death.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Naval Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Remex_Garb.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Basic Materials have reduced encumbrance",
      "Water has reduced encumbrance",
      "Increased movement in heavily flooded compartments"
    ]
  },
  {
    "itemName": "Officialis' Attire",
    "itemDesc": "This uniform, while impractical in combat, denotes the head of a regiment. Appropriately dressed officers may freely discipline their subordinates. Ancient Mesean officialis were key to the Legion's organization. This modern attire honours their lasting legacy.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Officer Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Officialis_Attire.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots"
    ]
  },
  {
    "itemName": "Legionary's Oilcoat",
    "itemDesc": "Quite accustomed to the temperate climates of the south, Colonials wear this oilcloth jacket paired with thick boots to operate at high efficiency in all but the heaviest storms.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Rain Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Legionarys_Oilcoat.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Kinetic weapon light ammunition stacks",
      "High resistance to Rain Storms"
    ]
  },
  {
    "itemName": "Recon Camo",
    "itemDesc": "Legion scouts are deployed on the most dangerous missions. Their gear is lightweight, sturdy and well-suited for extended operations in rugged terrain.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Scout Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Recon_Camo.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "5 backpack slots",
      "High chance of not being detected by enemy intelligence"
    ]
  },
  {
    "itemName": "Heavy Topcoat",
    "itemDesc": "Unaccustomed to the cold, Legionaries must always adapt. This heavy topcoat is designed to mitigate the effects of cold while still allowing for optimal mobility and combat effectiveness.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Snow Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Heavy_Topcoat.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Kinetic weapon light ammunition stacks",
      "Low resistance to Snow Storms"
    ]
  },
  {
    "itemName": "Tankman's Coveralls",
    "itemDesc": "Nothing compares to the efficiency and destructive capabilities of the Colonial armor division. Tank crew are provided with sturdy coveralls and satchel belts for easy access to essential tools required for tank maintenance and operation.",
    "itemCategory": "uniforms",
    "itemClass": "Colonial Tank Uniform",
    "faction": [
      "neutral",
      "colonial"
    ],
    "imgName": "Tankmans_Coveralls.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "7 backpack slots",
      "Gas Mask Filters stack",
      "Basic Materials have reduced encumbrance"
    ]
  },
  {
    "itemName": "Specialist's Overcoat",
    "itemDesc": "Warden specialists require a uniform designed to optimize their capacity to haul a variety of heavy ammunition.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Heavy Ammo Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Specialists_Overcoat.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "5 backpack slots",
      "Heavy ammunition has reduced encumbrance"
    ]
  },
  {
    "itemName": "Gunner's Breastplate",
    "itemDesc": "Repurposed from ancient wars, these armour plates are highly effective at stopping enemy small arms fire. That protection comes at the cost of weight, and the wearer will feel quite restricted.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Armour Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Gunners_Breastplate.png",
    "numberProduced": 5,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 150
    },
    "outfitBuffs": [
      "3 backpack slots"
    ]
  },
  {
    "itemName": "Sapper Gear",
    "itemDesc": "Caovish engineers are legendary in song and stature. They wear specialized uniforms, outfitted with belts and bags for easy access to tools and handheld materials.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Engineering Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Sapper_Gear.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "8 backpack slots",
      "Materials have reduced encumbrance"
    ]
  },
  {
    "itemName": "Physician's Jacket",
    "itemDesc": "Physicians in the Warden army are unmatched and this uniform has a plethora of pockets and bags designed to carry and deploy first aid gear easily.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Medic Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Physicians_Jacket.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Bandages and Blood Plasma stack",
      "First Aid Kits and Trauma Kits have reduced encumbrance"
    ]
  },
  {
    "itemName": "Gentleman's Peacoat",
    "itemDesc": "Seamen of the Caoivish Naval Command are always prepared to operate at the highest levels, even in frigid, northern waters. Every Warden sailor's readiness paints a portrait of life or death; thus, cold-weather outerwear is an essential part of every CNC gentlemaan's kit.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Naval Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Gentlemans_Peacoat.webp",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Basic Materials have reduced encumbrance",
      "Water has reduced encumbrance",
      "Increased movement in heavily flooded compartments"
    ]
  },
  {
    "itemName": "Officer's Regalia",
    "itemDesc": "A formal uniform that denotes a regiment's leading officer. While impractical, the officer on duty may use their authority to discipline subordinates without reparation. Officers hold an important role in the Warden military, dating back to ancient times when Caoiva was ruled by a dozen kings.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Officer Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Officers_Regalia.png",
    "numberProduced": 3,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots"
    ]
  },
  {
    "itemName": "Outrider's Mantle",
    "itemDesc": "the Warden army relies on outriders to provide and recieve vital intelligence. Their gear is sturdy and well-suited for extended operations in rugged terrain and inclement weather.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Scout Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Outriders_Mantle.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "5 backpack slots",
      "High chance of not being detected by enemy intelligence",
      "Low resistance to Snow Storms"
    ]
  },
  {
    "itemName": "Caoivish Parka",
    "itemDesc": "Born and bred in the northern cold, this heavy parka protects Warden infantry from all but the worst blizzards.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Snow Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Caoivish_Parka.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "6 backpack slots",
      "Kinetic weapon light ammunition stacks",
      "High resistance to Snow Storms"
    ]
  },
  {
    "itemName": "Padded Boiler Suit",
    "itemDesc": "Caovish armor is unmatched in its design and resilience. All crew are provided with a sturdy boilersuit and satchel belts to access essential tools required for tank maintenance and operation.",
    "itemCategory": "uniforms",
    "itemClass": "Warden Tank Uniform",
    "faction": [
      "neutral",
      "warden"
    ],
    "imgName": "Padded_Boiler_Suit.png",
    "numberProduced": 15,
    "isTeched": true,
    "isMpfCraftable": true,
    "craftLocation": [
      "factory",
      "mpf"
    ],
    "cost": {
      "bmat": 100
    },
    "outfitBuffs": [
      "7 backpack slots",
      "Gas Mask Filters stack",
      "Basic Materials have reduced encumbrance"
    ]
  }
];
