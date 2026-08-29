import { wikimediaFileFromUrl } from "./wikimedia.ts";

/** Landscape 4:3 when a file is missing from the catalog. */
export const FALLBACK_ARTWORK_SIZE = { width: 4, height: 3 } as const;

/**
 * Intrinsic pixel size of each Wikimedia file. Cards use this as `aspect-ratio`
 * so the timeline does not jump when the image bytes arrive. Add an entry when
 * adding artwork.
 */
export const ARTWORK_INTRINSIC_SIZE: Record<string, readonly [number, number]> = {
  "1531_Nuestra_Señora_de_Guadalupe_anagoria.jpg": [3168, 4752],
  "Bartolomeo_Passarotti_-_Portrait_of_Pope_Pius_V_-_Walters_37453.jpg": [1342, 1799],
  "Bellini,Giovanni_-_Agony_in_the_Garden_-_National_Gallery.jpg": [6000, 3785],
  "Bloch-SermonOnTheMount.jpg": [1377, 1545],
  "Caravaggio_-_San_Gerolamo.jpg": [1091, 791],
  "Carlo_Crivelli_007.jpg": [2024, 3144],
  "Christ_Pantocrator_Deesis_mosaic_Hagia_Sophia.jpg": [2430, 3084],
  "Conversion_on_the_Way_to_Damascus-Caravaggio_(c.1600-1).jpg": [6711, 8817],
  "Diego_Velázquez_012.jpg": [2292, 3051],
  "El_Greco_-_Christ_Carrying_the_Cross_-_Google_Art_Project.jpg": [3004, 4692],
  "El_Greco_-_Saint_Dominic,_Toledo.jpg": [601, 793],
  "El_Greco_006.jpg": [1428, 3126],
  "Entrega_de_las_llaves_a_San_Pedro_(Perugino).jpg": [3187, 1923],
  "First_Council_of_Nicaea_Michael_Damaskinos.png": [1324, 1689],
  "Fra_Angelico_069.jpg": [2024, 1690],
  "Francis_of_Assisi_-_Cimabue.jpg": [450, 1371],
  "Giotto_-_Scrovegni_-_-16-_-_Visitation.jpg": [792, 854],
  "Giotto_-_Scrovegni_-_-17-_-_Nativity,_Birth_of_Jesus.jpg": [774, 782],
  "Giotto_-_Scrovegni_-_-22-_-_Christ_among_the_Doctors.jpg": [726, 728],
  "Giotto_-_Scrovegni_-_-38-_-_Ascension.jpg": [632, 600],
  "Giotto_di_Bondone_-_No._19_Scenes_from_the_Life_of_Christ_-_3._Presentation_of_Christ_at_the_Temple_-_WGA09197.jpg":
    [950, 960],
  "KellsFol292rIncipJohn.jpg": [760, 1012],
  "Lamgods_open.jpg": [6265, 4581],
  "Masaccio-TheExpulsionOfAdamAndEveFromEden-Restoration.jpg": [913, 1173],
  "Mathis_Gothart_Grünewald_016.jpg": [2536, 3092],
  "Michelangelo,_profeti,_Isaiah_01.jpg": [943, 960],
  "Michelangelo_-_Creation_of_Adam_(cropped).jpg": [3524, 1599],
  "Murillo_-_Inmaculada_Concepción_de_los_Venerables_o_de_Soult_(Museo_del_Prado,_1678).jpg":
    [2080, 3051],
  "Pasquale_Cati_Da_Iesi_-_The_Council_of_Trent_-_WGA04574.jpg": [1000, 1081],
  "Peter_Paul_Rubens_-_Christ's_Charge_to_Peter.jpg": [1561, 1918],
  "Peter_Paul_Rubens_138.jpg": [1215, 1203],
  "Piero_della_Francesca_-_Resurrection_-_WGA17609.jpg": [1130, 1200],
  "Portrait_of_Pope_Paul_III_Farnese_(by_Titian)_-_National_Museum_of_Capodimonte.jpg":
    [2922, 3813],
  "Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg": [4000, 4990],
  "Rembrandt_Harmensz._van_Rijn_-_The_Return_of_the_Prodigal_Son.jpg": [6347, 8140],
  "Sacrifice_of_Isaac-Caravaggio_(c._1603).jpg": [9449, 6496],
  "Saint_Augustine_by_Philippe_de_Champaigne.jpg": [3135, 4000],
  "Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_138.png": [1109, 900],
  "The_Beloved_D-G-Rossetti-1866.jpg": [1220, 1386],
  "The_Crowning_with_Thorns-Caravaggio_(1602).jpg": [11037, 8443],
  "The_Flagellation_of_Christ-Caravaggio_(1607).jpg": [7913, 10695],
  "The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg": [9600, 4800],
  "Tiziano,_l'assunta,_1516-18.JPG": [2112, 3272],
  "Transfiguration_Raphael.jpg": [1067, 1608],
  "Veronese,_The_Marriage_at_Cana_(1563).jpg": [3867, 2603],
  "Verrocchio,_Leonardo_da_Vinci_-_Battesimo_di_Cristo.jpg": [2528, 2970],
};

export function artworkSizeForFile(file: string): { width: number; height: number } {
  const pair = ARTWORK_INTRINSIC_SIZE[file];
  if (!pair) {
    return { width: FALLBACK_ARTWORK_SIZE.width, height: FALLBACK_ARTWORK_SIZE.height };
  }
  return { width: pair[0], height: pair[1] };
}

export function artworkSizeForUrl(url: string): { width: number; height: number } {
  const file = wikimediaFileFromUrl(url);
  return artworkSizeForFile(file ?? "");
}

export function hasCataloguedArtworkSize(url: string): boolean {
  const file = wikimediaFileFromUrl(url);
  return Boolean(file && ARTWORK_INTRINSIC_SIZE[file]);
}

export function artworkHeightForWidth(url: string, widthPx: number): number {
  const { width, height } = artworkSizeForUrl(url);
  return Math.max(1, Math.round(widthPx * (height / width)));
}
