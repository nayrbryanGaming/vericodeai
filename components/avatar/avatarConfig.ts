// 3D-style customizable avatar (Bitmoji / Snapchat-like) built on DiceBear "avataaars".
// Rendering is 100% local in the browser — no data leaves the device.
import { createAvatar, type Style, type StyleOptions } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

type AvataaarsOptions = typeof avataaars extends Style<infer O> ? StyleOptions<O> : never;

export type AvatarConfig = {
  skinColor: string;
  top: string; // hair style or hat
  hairColor: string;
  eyebrows: string;
  eyes: string;
  mouth: string;
  facialHair: string; // "none" or a value
  accessories: string; // "none" or glasses
  clothing: string;
  clothesColor: string;
  backgroundColor: string;
};

export type CategoryKey = keyof AvatarConfig;

type Option = { value: string; label: string };
export type Category = {
  key: CategoryKey;
  label: string;
  icon: string; // lucide icon name
  type: "color" | "style";
  options: Option[];
};

// ---- Option catalogs (curated for a clean Bitmoji-style picker) ----
const SKIN: Option[] = [
  { value: "ffdbb4", label: "Light" },
  { value: "edb98a", label: "Fair" },
  { value: "fd9841", label: "Tan" },
  { value: "f8d25c", label: "Golden" },
  { value: "d08b5b", label: "Brown" },
  { value: "ae5d29", label: "Deep" },
  { value: "614335", label: "Dark" },
];

const HAIR_COLOR: Option[] = [
  { value: "2c1b18", label: "Black" },
  { value: "4a312c", label: "Dark Brown" },
  { value: "724133", label: "Brown" },
  { value: "a55728", label: "Auburn" },
  { value: "b58143", label: "Light Brown" },
  { value: "d6b370", label: "Blonde" },
  { value: "ecdcbf", label: "Platinum" },
  { value: "c93305", label: "Red" },
  { value: "e8e1e1", label: "Gray" },
  { value: "f59797", label: "Pink" },
];

const TOP: Option[] = [
  { value: "shortFlat", label: "Short Flat" },
  { value: "shortRound", label: "Short Round" },
  { value: "shortWaved", label: "Short Waved" },
  { value: "shortCurly", label: "Short Curly" },
  { value: "theCaesar", label: "Caesar" },
  { value: "shavedSides", label: "Shaved Sides" },
  { value: "dreads01", label: "Dreads" },
  { value: "fro", label: "Afro" },
  { value: "froBand", label: "Afro Band" },
  { value: "curly", label: "Curly" },
  { value: "bob", label: "Bob" },
  { value: "bun", label: "Bun" },
  { value: "longButNotTooLong", label: "Long" },
  { value: "straight01", label: "Straight" },
  { value: "straightAndStrand", label: "Straight + Strand" },
  { value: "miaWallace", label: "Mia" },
  { value: "bigHair", label: "Big Hair" },
  { value: "frida", label: "Frida" },
  { value: "hijab", label: "Hijab" },
  { value: "turban", label: "Turban" },
  { value: "hat", label: "Hat" },
  { value: "winterHat02", label: "Beanie" },
  { value: "noHair", label: "Bald" },
];

const EYEBROWS: Option[] = [
  { value: "default", label: "Default" },
  { value: "defaultNatural", label: "Natural" },
  { value: "flatNatural", label: "Flat" },
  { value: "raisedExcited", label: "Raised" },
  { value: "angryNatural", label: "Angry" },
  { value: "sadConcerned", label: "Sad" },
  { value: "upDown", label: "Up Down" },
  { value: "unibrowNatural", label: "Unibrow" },
];

const EYES: Option[] = [
  { value: "default", label: "Default" },
  { value: "happy", label: "Happy" },
  { value: "wink", label: "Wink" },
  { value: "squint", label: "Squint" },
  { value: "surprised", label: "Surprised" },
  { value: "hearts", label: "Hearts" },
  { value: "side", label: "Side" },
  { value: "closed", label: "Closed" },
  { value: "cry", label: "Cry" },
  { value: "eyeRoll", label: "Roll" },
  { value: "winkWacky", label: "Wacky" },
  { value: "xDizzy", label: "Dizzy" },
];

const MOUTH: Option[] = [
  { value: "smile", label: "Smile" },
  { value: "default", label: "Default" },
  { value: "twinkle", label: "Twinkle" },
  { value: "tongue", label: "Tongue" },
  { value: "serious", label: "Serious" },
  { value: "grimace", label: "Grin" },
  { value: "eating", label: "Eating" },
  { value: "concerned", label: "Concerned" },
  { value: "sad", label: "Sad" },
  { value: "disbelief", label: "Disbelief" },
  { value: "screamOpen", label: "Scream" },
];

const FACIAL_HAIR: Option[] = [
  { value: "none", label: "None" },
  { value: "beardLight", label: "Light Beard" },
  { value: "beardMedium", label: "Medium Beard" },
  { value: "beardMajestic", label: "Full Beard" },
  { value: "moustacheFancy", label: "Moustache" },
  { value: "moustacheMagnum", label: "Magnum" },
];

const ACCESSORIES: Option[] = [
  { value: "none", label: "None" },
  { value: "prescription01", label: "Glasses" },
  { value: "prescription02", label: "Rounded" },
  { value: "round", label: "Round" },
  { value: "wayfarers", label: "Wayfarers" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "eyepatch", label: "Eyepatch" },
];

const CLOTHING: Option[] = [
  { value: "shirtCrewNeck", label: "Crew Neck" },
  { value: "shirtVNeck", label: "V-Neck" },
  { value: "shirtScoopNeck", label: "Scoop Neck" },
  { value: "hoodie", label: "Hoodie" },
  { value: "collarAndSweater", label: "Sweater" },
  { value: "blazerAndShirt", label: "Blazer" },
  { value: "blazerAndSweater", label: "Blazer + Sweater" },
  { value: "graphicShirt", label: "Graphic Tee" },
  { value: "overall", label: "Overall" },
];

const CLOTHES_COLOR: Option[] = [
  { value: "262e33", label: "Charcoal" },
  { value: "3c4f5c", label: "Slate" },
  { value: "25557c", label: "Navy" },
  { value: "5199e4", label: "Blue" },
  { value: "65c9ff", label: "Sky" },
  { value: "929598", label: "Gray" },
  { value: "a7ffc4", label: "Mint" },
  { value: "ff488e", label: "Pink" },
  { value: "ff5c5c", label: "Red" },
  { value: "ffafb9", label: "Rose" },
  { value: "ffffb1", label: "Lemon" },
  { value: "e6e6e6", label: "White" },
];

const BACKGROUND: Option[] = [
  { value: "b6e3f4", label: "Sky" },
  { value: "c0aede", label: "Lavender" },
  { value: "d1d4f9", label: "Periwinkle" },
  { value: "ffd5dc", label: "Blush" },
  { value: "ffdfbf", label: "Peach" },
  { value: "c8f7c5", label: "Mint" },
  { value: "fff3c4", label: "Cream" },
  { value: "transparent", label: "None" },
];

export const CATEGORIES: Category[] = [
  { key: "skinColor", label: "Skin", icon: "Smile", type: "color", options: SKIN },
  { key: "top", label: "Hair", icon: "Scissors", type: "style", options: TOP },
  { key: "hairColor", label: "Hair Color", icon: "Palette", type: "color", options: HAIR_COLOR },
  { key: "eyes", label: "Eyes", icon: "Eye", type: "style", options: EYES },
  { key: "eyebrows", label: "Brows", icon: "Minus", type: "style", options: EYEBROWS },
  { key: "mouth", label: "Mouth", icon: "MessageCircle", type: "style", options: MOUTH },
  { key: "facialHair", label: "Beard", icon: "User", type: "style", options: FACIAL_HAIR },
  { key: "accessories", label: "Glasses", icon: "Glasses", type: "style", options: ACCESSORIES },
  { key: "clothing", label: "Outfit", icon: "Shirt", type: "style", options: CLOTHING },
  { key: "clothesColor", label: "Outfit Color", icon: "Droplet", type: "color", options: CLOTHES_COLOR },
  { key: "backgroundColor", label: "Background", icon: "Image", type: "color", options: BACKGROUND },
];

export const DEFAULT_CONFIG: AvatarConfig = {
  skinColor: "edb98a",
  top: "shortFlat",
  hairColor: "2c1b18",
  eyebrows: "default",
  eyes: "default",
  mouth: "smile",
  facialHair: "none",
  accessories: "none",
  clothing: "shirtCrewNeck",
  clothesColor: "5199e4",
  backgroundColor: "b6e3f4",
};

// ---- Rendering ----
export function buildAvatarSvg(c: AvatarConfig): string {
  // Our catalog values are plain strings; cast to DiceBear's literal-union schema.
  const options = {
    seed: "vericode",
    skinColor: [c.skinColor],
    top: [c.top],
    hairColor: [c.hairColor],
    hatColor: [c.clothesColor],
    eyebrows: [c.eyebrows],
    eyes: [c.eyes],
    mouth: [c.mouth],
    facialHair: c.facialHair === "none" ? [] : [c.facialHair],
    facialHairProbability: c.facialHair === "none" ? 0 : 100,
    accessories: c.accessories === "none" ? [] : [c.accessories],
    accessoriesProbability: c.accessories === "none" ? 0 : 100,
    clothing: [c.clothing],
    clothesColor: [c.clothesColor],
    backgroundColor: c.backgroundColor === "transparent" ? [] : [c.backgroundColor],
    backgroundType: ["gradientLinear"],
    radius: 50,
  };
  return createAvatar(avataaars, options as AvataaarsOptions).toString();
}

export function buildAvatarDataUri(c: AvatarConfig): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildAvatarSvg(c))}`;
}

// Preview for a single option (used in the picker grid).
export function buildOptionPreview(base: AvatarConfig, key: CategoryKey, value: string): string {
  return buildAvatarDataUri({ ...base, [key]: value });
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomConfig(): AvatarConfig {
  return {
    skinColor: pick(SKIN).value,
    top: pick(TOP).value,
    hairColor: pick(HAIR_COLOR).value,
    eyebrows: pick(EYEBROWS).value,
    eyes: pick(EYES).value,
    mouth: pick(MOUTH).value,
    facialHair: pick(FACIAL_HAIR).value,
    accessories: Math.random() > 0.5 ? pick(ACCESSORIES).value : "none",
    clothing: pick(CLOTHING).value,
    clothesColor: pick(CLOTHES_COLOR).value,
    backgroundColor: pick(BACKGROUND).value,
  };
}
