import { cccUrl } from "./ccc.ts";
import type { ChurchEntry, EventPlace, TimelineArtifact } from "./types";
import { wikimediaFileUrl } from "./wikimedia.ts";

const DEI_VERBUM =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html";
const LUMEN_GENTIUM =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html";
const GAUDIUM_ET_SPES =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651207_gaudium-et-spes_en.html";
const SACROSANCTUM =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_en.html";
const VATICAN_II = "https://www.vatican.va/archive/hist_councils/ii_vatican_council/index.htm";
const FIDES_ET_RATIO =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html";
const REDEMPTOR_HOMINIS =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_04031979_redemptor-hominis.html";
const EVANGELIUM_VITAE =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25031995_evangelium-vitae.html";
const DEUS_CARITAS =
  "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html";
const SPE_SALVI =
  "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html";
const VERBUM_DOMINI =
  "https://www.vatican.va/content/benedict-xvi/en/apost_exhortations/documents/hf_ben-xvi_exh_20100930_verbum-domini.html";
const LAUDATO_SI =
  "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html";
const EVANGELII_GAUDIUM =
  "https://www.vatican.va/content/francesco/en/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html";
const FRATELLI_TUTTI =
  "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html";
const LUMEN_FIDEI =
  "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20130629_enciclica-lumen-fidei.html";
const MUNIFICENTISSIMUS =
  "https://www.vatican.va/content/pius-xii/en/apost_constitutions/documents/hf_p-xii_apc_19501101_munificentissimus-deus.html";
const DIVINO_AFFLANTE =
  "https://www.vatican.va/content/pius-xii/en/encyclicals/documents/hf_p-xii_enc_30091943_divino-afflante-spiritu.html";
const MYSTICI_CORPORIS =
  "https://www.vatican.va/content/pius-xii/en/encyclicals/documents/hf_p-xii_enc_29061943_mystici-corporis-christi.html";
const AETERNI_PATRIS =
  "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_04081879_aeterni-patris.html";
const RERUM_NOVARUM =
  "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_15051891_rerum-novarum.html";
const PASCENDI =
  "https://www.vatican.va/content/pius-x/en/encyclicals/documents/hf_p-x_enc_19070908_pascendi-dominici-gregis.html";
const QUAS_PRIMAS =
  "https://www.vatican.va/content/pius-xi/en/encyclicals/documents/hf_p-xi_enc_11121925_quas-primas.html";
const PACEM_IN_TERRIS =
  "https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_11041963_pacem.html";
const HUMANAE_VITAE =
  "https://www.vatican.va/content/paul-vi/en/encyclicals/documents/hf_p-vi_enc_25071968_humanae-vitae.html";
const EVANGELII_NUNTIANDI =
  "https://www.vatican.va/content/paul-vi/en/apost_exhortations/documents/hf_p-vi_exh_19751208_evangelii-nuntiandi.html";
const SLAVORUM =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_19850602_slavorum-apostoli.html";
const ROSARIUM =
  "https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html";
const DIVES =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_30111980_dives-in-misericordia.html";
const ECCLESIA_DE_EUCH =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_20030417_eccl-de-euch.html";

const AUD = (year: number, date: string) =>
  `https://www.vatican.va/content/benedict-xvi/en/audiences/${year}/documents/hf_ben-xvi_aud_${date}.html`;

/** Confirmed Catholic Encyclopedia article. Omit rather than guess a slug. */
function cathen(id: string): string {
  return `https://www.newadvent.org/cathen/${id}.htm`;
}

function a(partial: TimelineArtifact): TimelineArtifact {
  return partial;
}

function place(then: string, now: string): EventPlace {
  return { then, now };
}

function wiki(file: string): string {
  return wikimediaFileUrl(file);
}

export const CHURCH_ENTRIES: ChurchEntry[] = [
  {
    id: "pentecost",
    year: 33,
    era: "Apostolic Age",
    title: "Pentecost and the Apostolic Age",
    artifacts: [
      a({
        id: "ch-pentecost-event",
        type: "event",
        title: "Pentecost",
        subtitle: "The sending of the Holy Spirit",
        year: 33,
        location: place("Jerusalem, in the Roman province of Judea", "Jerusalem"),
        sourceUrl: cathen("15614b"),
        bibleRefs: ["Acts 2:1–4"],
      }),
      a({
        id: "ch-pentecost-ccc",
        type: "catechism",
        title: "CCC 731",
        subtitle: "The Spirit sent on the day of Pentecost",
        sourceUrl: cccUrl(731),
        bibleRefs: ["Acts 2"],
        year: 1992,
      }),
      a({
        id: "ch-pentecost-lg",
        type: "papal",
        title: "Lumen Gentium 4",
        subtitle: "Second Vatican Council",
        sourceUrl: LUMEN_GENTIUM,
        year: 1964,
      }),
      a({
        id: "ch-pentecost-art",
        type: "artwork",
        title: "Pentecost",
        subtitle: "El Greco, c. 1596–1600",
        year: 1596,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:El_Greco_006.jpg",
        imageUrl: wiki("El_Greco_006.jpg"),
        imageCredit:
          "El Greco, Pentecost, c. 1596–1600, Museo del Prado. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "peter",
    year: 64,
    era: "Apostolic Age",
    title: "St. Peter, Prince of the Apostles",
    artifacts: [
      a({
        id: "ch-peter-saint",
        type: "saint",
        title: "St. Peter",
        subtitle: "Martyrdom at Rome, c. 64–67",
        year: 64,
        sourceUrl: cathen("11744a"),
      }),
      a({
        id: "ch-peter-ccc",
        type: "catechism",
        title: "CCC 881",
        subtitle: "The office of Peter",
        sourceUrl: cccUrl(881),
        bibleRefs: ["Mt 16:18–19"],
        year: 1992,
      }),
      a({
        id: "ch-peter-art",
        type: "artwork",
        title: "Christ’s Charge to Peter",
        subtitle: "Peter Paul Rubens, c. 1616",
        year: 1616,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Peter_Paul_Rubens_-_Christ's_Charge_to_Peter.jpg",
        imageUrl: wiki("Peter_Paul_Rubens_-_Christ's_Charge_to_Peter.jpg"),
        imageCredit:
          "Peter Paul Rubens, Christ’s Charge to Peter, c. 1616. Wallace Collection, London. Public domain, via Wikimedia Commons.",
        bibleRefs: ["Jn 21:15–17"],
      }),
    ],
  },
  {
    id: "paul",
    year: 67,
    era: "Apostolic Age",
    title: "St. Paul, Apostle to the Nations",
    artifacts: [
      a({
        id: "ch-paul-saint",
        type: "saint",
        title: "St. Paul",
        subtitle: "Martyrdom at Rome, c. 64–67",
        year: 67,
        sourceUrl: cathen("11567b"),
        bibleRefs: ["Acts 9:1–22"],
      }),
      a({
        id: "ch-paul-dv",
        type: "papal",
        title: "Dei Verbum 7",
        subtitle: "The apostolic preaching",
        sourceUrl: DEI_VERBUM,
        year: 1965,
      }),
      a({
        id: "ch-paul-art",
        type: "artwork",
        title: "Conversion on the Way to Damascus",
        subtitle: "Caravaggio, c. 1600–1601",
        year: 1601,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Conversion_on_the_Way_to_Damascus-Caravaggio_(c.1600-1).jpg",
        imageUrl: wiki("Conversion_on_the_Way_to_Damascus-Caravaggio_(c.1600-1).jpg"),
        imageCredit:
          "Caravaggio, Conversion on the Way to Damascus, c. 1600–1601. Santa Maria del Popolo, Rome. Public domain, via Wikimedia Commons.",
        bibleRefs: ["Acts 9:1–22"],
      }),
    ],
  },
  {
    id: "clement",
    year: 99,
    era: "Apostolic Age",
    title: "St. Clement of Rome",
    artifacts: [
      a({
        id: "ch-clement-saint",
        type: "saint",
        title: "St. Clement of Rome",
        subtitle: "Pope — d. c. 99",
        year: 99,
        sourceUrl: cathen("04012c"),
      }),
      a({
        id: "ch-clement-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Clement of Rome — 7 March 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070307"),
      }),
    ],
  },
  {
    id: "ignatius",
    year: 107,
    era: "Apostolic Age",
    title: "St. Ignatius of Antioch",
    artifacts: [
      a({
        id: "ch-ignatius-saint",
        type: "saint",
        title: "St. Ignatius of Antioch",
        subtitle: "Bishop and martyr — d. c. 107",
        year: 107,
        sourceUrl: cathen("07644a"),
      }),
      a({
        id: "ch-ignatius-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Ignatius of Antioch — 14 March 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070314"),
      }),
    ],
  },
  {
    id: "justin",
    year: 165,
    era: "Apostolic Age",
    title: "St. Justin Martyr",
    artifacts: [
      a({
        id: "ch-justin-saint",
        type: "saint",
        title: "St. Justin Martyr",
        subtitle: "Philosopher and martyr — d. c. 165",
        year: 165,
        sourceUrl: cathen("08580c"),
      }),
      a({
        id: "ch-justin-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Justin, Philosopher and Martyr — 21 March 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070321"),
      }),
    ],
  },
  {
    id: "irenaeus",
    year: 202,
    era: "Apostolic Age",
    title: "St. Irenaeus of Lyons",
    artifacts: [
      a({
        id: "ch-irenaeus-saint",
        type: "saint",
        title: "St. Irenaeus of Lyons",
        subtitle: "Doctor of the Church — d. c. 202",
        year: 202,
        sourceUrl: cathen("08130b"),
      }),
      a({
        id: "ch-irenaeus-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Irenaeus of Lyons — 28 March 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070328"),
      }),
    ],
  },
  {
    id: "lateran",
    year: 324,
    era: "Imperial Church",
    title: "Construction of St. John Lateran",
    artifacts: [
      a({
        id: "ch-lateran-event",
        type: "event",
        title: "St. John Lateran",
        subtitle: "Constantinian cathedral of Rome, c. 324",
        year: 324,
        location: place("the Lateran, Rome, in the Roman Empire", "Rome, Italy"),
        sourceUrl: cathen("09014b"),
      }),
    ],
  },
  {
    id: "nicaea",
    year: 325,
    era: "Imperial Church",
    title: "First Council of Nicaea",
    artifacts: [
      a({
        id: "ch-nicaea-event",
        type: "event",
        title: "First Council of Nicaea",
        subtitle: "The consubstantial Son",
        year: 325,
        location: place("Nicaea, in Bithynia", "Iznik, northwestern Turkey"),
        sourceUrl: cathen("11044a"),
      }),
      a({
        id: "ch-nicaea-ccc",
        type: "catechism",
        title: "CCC 465",
        subtitle: "Homoousios with the Father",
        sourceUrl: cccUrl(465),
        year: 325,
      }),
      a({
        id: "ch-nicaea-art",
        type: "artwork",
        title: "First Council of Nicaea",
        subtitle: "Michael Damaskinos, 1591",
        year: 1591,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:First_Council_of_Nicaea_Michael_Damaskinos.png",
        imageUrl: wiki("First_Council_of_Nicaea_Michael_Damaskinos.png"),
        imageCredit:
          "Michael Damaskinos, First Council of Nicaea, 1591. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "st-peters",
    year: 326,
    era: "Imperial Church",
    title: "Construction of Old St. Peter’s",
    artifacts: [
      a({
        id: "ch-st-peters-event",
        type: "event",
        title: "Old St. Peter’s Basilica",
        subtitle: "Constantinian basilica over the tomb of the Apostle, c. 326",
        year: 326,
        location: place("Vatican Hill, Rome, in the Roman Empire", "Vatican City"),
        sourceUrl: cathen("13369b"),
      }),
    ],
  },
  {
    id: "holy-sepulchre",
    year: 336,
    era: "Imperial Church",
    title: "Dedication of the Holy Sepulchre",
    artifacts: [
      a({
        id: "ch-holy-sepulchre-event",
        type: "event",
        title: "Church of the Holy Sepulchre",
        subtitle: "Dedication of Constantine’s Anastasis, 336",
        year: 336,
        location: place(
          "Jerusalem, in the Roman province of Palestine",
          "Jerusalem",
        ),
        sourceUrl: cathen("07425a"),
      }),
    ],
  },
  {
    id: "athanasius",
    year: 373,
    era: "Imperial Church",
    title: "St. Athanasius",
    artifacts: [
      a({
        id: "ch-athanasius-saint",
        type: "saint",
        title: "St. Athanasius of Alexandria",
        subtitle: "Doctor of the Church — d. 373",
        year: 373,
        sourceUrl: cathen("02035a"),
      }),
      a({
        id: "ch-athanasius-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Athanasius of Alexandria — 20 June 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070620"),
      }),
    ],
  },
  {
    id: "basil",
    year: 379,
    era: "Imperial Church",
    title: "St. Basil the Great",
    artifacts: [
      a({
        id: "ch-basil-saint",
        type: "saint",
        title: "St. Basil the Great",
        subtitle: "Doctor of the Church — d. 379",
        year: 379,
        sourceUrl: cathen("02330b"),
      }),
      a({
        id: "ch-basil-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Basil — 4 July 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070704"),
      }),
    ],
  },
  {
    id: "constantinople-i",
    year: 381,
    era: "Imperial Church",
    title: "First Council of Constantinople",
    artifacts: [
      a({
        id: "ch-const1-event",
        type: "event",
        title: "First Council of Constantinople",
        subtitle: "The divinity of the Holy Spirit",
        year: 381,
        location: place("Constantinople, capital of the Eastern Roman Empire", "Istanbul, Turkey"),
        sourceUrl: cathen("04308a"),
      }),
      a({
        id: "ch-const1-ccc",
        type: "catechism",
        title: "CCC 245",
        subtitle: "The Spirit confessed at Constantinople (381)",
        sourceUrl: cccUrl(245),
        year: 381,
      }),
    ],
  },
  {
    id: "st-paul-walls",
    year: 386,
    era: "Imperial Church",
    title: "Construction of St. Paul Outside the Walls",
    artifacts: [
      a({
        id: "ch-st-paul-walls-event",
        type: "event",
        title: "St. Paul Outside the Walls",
        subtitle: "Theodosian basilica on the Ostian Way, c. 386",
        year: 386,
        location: place("the Ostian Way, Rome, in the Roman Empire", "Rome, Italy"),
        sourceUrl: cathen("13369a"),
      }),
    ],
  },
  {
    id: "gregory-naz",
    year: 390,
    era: "Imperial Church",
    title: "St. Gregory of Nazianzus",
    artifacts: [
      a({
        id: "ch-gregnaz-saint",
        type: "saint",
        title: "St. Gregory of Nazianzus",
        subtitle: "Doctor of the Church — d. 390",
        year: 390,
        sourceUrl: cathen("07010b"),
      }),
      a({
        id: "ch-gregnaz-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Gregory of Nazianzus — 8 August 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070808"),
      }),
    ],
  },
  {
    id: "ambrose",
    year: 397,
    era: "Patristic Age",
    title: "St. Ambrose of Milan",
    artifacts: [
      a({
        id: "ch-ambrose-saint",
        type: "saint",
        title: "St. Ambrose of Milan",
        subtitle: "Doctor of the Church — d. 397",
        year: 397,
        sourceUrl: cathen("01383c"),
      }),
      a({
        id: "ch-ambrose-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Ambrose of Milan — 24 October 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20071024"),
      }),
    ],
  },
  {
    id: "chrysostom",
    year: 407,
    era: "Patristic Age",
    title: "St. John Chrysostom",
    artifacts: [
      a({
        id: "ch-chrysostom-saint",
        type: "saint",
        title: "St. John Chrysostom",
        subtitle: "Doctor of the Church — d. 407",
        year: 407,
        sourceUrl: cathen("08452b"),
      }),
      a({
        id: "ch-chrysostom-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. John Chrysostom — 19 September 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20070919"),
      }),
    ],
  },
  {
    id: "jerome",
    year: 420,
    era: "Patristic Age",
    title: "St. Jerome",
    artifacts: [
      a({
        id: "ch-jerome-saint",
        type: "saint",
        title: "St. Jerome",
        subtitle: "Doctor of the Church — d. 420",
        year: 420,
        sourceUrl: cathen("08341a"),
      }),
      a({
        id: "ch-jerome-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Jerome — 7 November 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20071107"),
      }),
      a({
        id: "ch-jerome-dv",
        type: "papal",
        title: "Dei Verbum 25",
        subtitle: "Ignorance of the Scriptures is ignorance of Christ",
        sourceUrl: DEI_VERBUM,
        year: 1965,
      }),
      a({
        id: "ch-jerome-art",
        type: "artwork",
        title: "Saint Jerome Writing",
        subtitle: "Caravaggio, c. 1606",
        year: 1606,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Caravaggio_-_San_Gerolamo.jpg",
        imageUrl: wiki("Caravaggio_-_San_Gerolamo.jpg"),
        imageCredit:
          "Caravaggio, Saint Jerome Writing, c. 1606. Galleria Borghese, Rome. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "augustine",
    year: 430,
    era: "Patristic Age",
    title: "St. Augustine of Hippo",
    artifacts: [
      a({
        id: "ch-augustine-saint",
        type: "saint",
        title: "St. Augustine of Hippo",
        subtitle: "Doctor of the Church — d. 430",
        year: 430,
        sourceUrl: cathen("02084a"),
      }),
      a({
        id: "ch-augustine-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Augustine of Hippo — 16 January 2008",
        year: 2008,
        sourceUrl: AUD(2008, "20080116"),
      }),
      a({
        id: "ch-augustine-fr",
        type: "papal",
        title: "Fides et Ratio 40",
        subtitle: "St. John Paul II on Augustine",
        year: 1998,
        sourceUrl: FIDES_ET_RATIO,
      }),
      a({
        id: "ch-augustine-art",
        type: "artwork",
        title: "Saint Augustine",
        subtitle: "Philippe de Champaigne, c. 1645–1650",
        year: 1645,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Saint_Augustine_by_Philippe_de_Champaigne.jpg",
        imageUrl: wiki("Saint_Augustine_by_Philippe_de_Champaigne.jpg"),
        imageCredit:
          "Philippe de Champaigne, Saint Augustine, c. 1645–1650. Los Angeles County Museum of Art. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "ephesus",
    year: 431,
    era: "Patristic Age",
    title: "Council of Ephesus",
    artifacts: [
      a({
        id: "ch-ephesus-event",
        type: "event",
        title: "Council of Ephesus",
        subtitle: "Mary, Mother of God",
        year: 431,
        location: place(
          "Ephesus, in the Roman province of Asia",
          "ruins near Selcuk, western Turkey",
        ),
        sourceUrl: cathen("05491a"),
      }),
      a({
        id: "ch-ephesus-ccc",
        type: "catechism",
        title: "CCC 466",
        subtitle: "Theotokos",
        sourceUrl: cccUrl(466),
        year: 431,
      }),
      a({
        id: "ch-ephesus-495",
        type: "catechism",
        title: "CCC 495",
        subtitle: "Mother of God",
        sourceUrl: cccUrl(495),
        year: 431,
      }),
    ],
  },
  {
    id: "mary-major",
    year: 434,
    era: "Patristic Age",
    title: "Dedication of St. Mary Major",
    artifacts: [
      a({
        id: "ch-mary-major-event",
        type: "event",
        title: "St. Mary Major",
        subtitle: "Dedication of the Liberian basilica after Ephesus, c. 434",
        year: 434,
        location: place(
          "the Esquiline Hill, Rome, in the Western Roman Empire",
          "Rome, Italy",
        ),
        sourceUrl: cathen("11361c"),
      }),
    ],
  },
  {
    id: "cyril-alex",
    year: 444,
    era: "Patristic Age",
    title: "St. Cyril of Alexandria",
    artifacts: [
      a({
        id: "ch-cyril-saint",
        type: "saint",
        title: "St. Cyril of Alexandria",
        subtitle: "Doctor of the Church — d. 444",
        year: 444,
        sourceUrl: cathen("04592b"),
      }),
      a({
        id: "ch-cyril-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Cyril of Alexandria — 3 October 2007",
        year: 2007,
        sourceUrl: AUD(2007, "20071003"),
      }),
    ],
  },
  {
    id: "chalcedon",
    year: 451,
    era: "Patristic Age",
    title: "Council of Chalcedon",
    artifacts: [
      a({
        id: "ch-chalcedon-event",
        type: "event",
        title: "Council of Chalcedon",
        subtitle: "True God and true man",
        year: 451,
        location: place(
          "Chalcedon, in Bithynia, across the Bosporus from Constantinople",
          "Kadikoy, on the Asian side of Istanbul, Turkey",
        ),
        sourceUrl: cathen("03555a"),
      }),
      a({
        id: "ch-chalcedon-ccc",
        type: "catechism",
        title: "CCC 467",
        subtitle: "Two natures, without confusion",
        sourceUrl: cccUrl(467),
        year: 451,
      }),
    ],
  },
  {
    id: "leo-great",
    year: 461,
    era: "Patristic Age",
    title: "Pope St. Leo the Great",
    artifacts: [
      a({
        id: "ch-leo-pope",
        type: "pope",
        title: "Pope St. Leo the Great",
        subtitle: "Pope — d. 461",
        year: 461,
        sourceUrl: cathen("09154b"),
      }),
      a({
        id: "ch-leo-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Leo the Great — 5 March 2008",
        year: 2008,
        sourceUrl: AUD(2008, "20080305"),
      }),
    ],
  },
  {
    id: "hagia-sophia",
    year: 537,
    era: "Imperial Church",
    title: "Dedication of Hagia Sophia",
    artifacts: [
      a({
        id: "ch-hagia-sophia-event",
        type: "event",
        title: "Hagia Sophia",
        subtitle:
          "Great Church of Constantinople; Latin cathedral only 1204–1261; not a living Latin cathedral",
        year: 537,
        location: place("Constantinople, Eastern Roman Empire", "Istanbul, Turkey"),
        sourceUrl: cathen("04301a"),
      }),
    ],
  },
  {
    id: "benedict",
    year: 547,
    era: "Monastic Age",
    title: "St. Benedict and Western monasticism",
    artifacts: [
      a({
        id: "ch-benedict-saint",
        type: "saint",
        title: "St. Benedict of Nursia",
        subtitle: "Patron of Europe — d. c. 547",
        year: 547,
        sourceUrl: cathen("02467b"),
      }),
      a({
        id: "ch-benedict-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Benedict of Norcia — 9 April 2008",
        year: 2008,
        sourceUrl: AUD(2008, "20080409"),
      }),
    ],
  },
  {
    id: "constantinople-ii",
    year: 553,
    era: "Monastic Age",
    title: "Second Council of Constantinople",
    artifacts: [
      a({
        id: "ch-const2-event",
        type: "event",
        title: "Second Council of Constantinople",
        subtitle: "One of the Holy Trinity",
        year: 553,
        location: place("Constantinople, Eastern Roman Empire", "Istanbul, Turkey"),
        sourceUrl: cathen("04308b"),
      }),
      a({
        id: "ch-const2-ccc",
        type: "catechism",
        title: "CCC 468",
        subtitle: "The second council of Constantinople",
        sourceUrl: cccUrl(468),
        year: 553,
      }),
    ],
  },
  {
    id: "gregory-great",
    year: 604,
    era: "Monastic Age",
    title: "Pope St. Gregory the Great",
    artifacts: [
      a({
        id: "ch-greggreat-pope",
        type: "pope",
        title: "Pope St. Gregory the Great",
        subtitle: "Pope and Doctor — d. 604",
        year: 604,
        sourceUrl: cathen("06780a"),
      }),
      a({
        id: "ch-greggreat-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Gregory the Great — 28 May 2008",
        year: 2008,
        sourceUrl: AUD(2008, "20080528"),
      }),
    ],
  },
  {
    id: "constantinople-iii",
    year: 681,
    era: "Monastic Age",
    title: "Third Council of Constantinople",
    artifacts: [
      a({
        id: "ch-const3-event",
        type: "event",
        title: "Third Council of Constantinople",
        subtitle: "Two wills of Christ",
        year: 681,
        location: place("Constantinople, Eastern Roman Empire", "Istanbul, Turkey"),
        sourceUrl: cathen("04310a"),
      }),
      a({
        id: "ch-const3-ccc",
        type: "catechism",
        title: "CCC 475",
        subtitle: "Human will and divine will",
        sourceUrl: cccUrl(475),
        year: 681,
      }),
    ],
  },
  {
    id: "bede",
    year: 735,
    era: "Monastic Age",
    title: "St. Bede the Venerable",
    artifacts: [
      a({
        id: "ch-bede-saint",
        type: "saint",
        title: "St. Bede the Venerable",
        subtitle: "Doctor of the Church — d. 735",
        year: 735,
        sourceUrl: cathen("02384a"),
      }),
      a({
        id: "ch-bede-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "Bede, the Venerable — 18 February 2009",
        year: 2009,
        sourceUrl: AUD(2009, "20090218"),
      }),
    ],
  },
  {
    id: "damascene",
    year: 749,
    era: "Monastic Age",
    title: "St. John Damascene",
    artifacts: [
      a({
        id: "ch-damascene-saint",
        type: "saint",
        title: "St. John Damascene",
        subtitle: "Doctor of the Church — d. c. 749",
        year: 749,
        sourceUrl: cathen("08459b"),
      }),
      a({
        id: "ch-damascene-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "John Damascene — 6 May 2009",
        year: 2009,
        sourceUrl: AUD(2009, "20090506"),
      }),
    ],
  },
  {
    id: "nicaea-ii",
    year: 787,
    era: "Monastic Age",
    title: "Second Council of Nicaea",
    artifacts: [
      a({
        id: "ch-nicaea2-event",
        type: "event",
        title: "Second Council of Nicaea",
        subtitle: "The veneration of holy images",
        year: 787,
        location: place("Nicaea, in Bithynia", "Iznik, northwestern Turkey"),
        sourceUrl: cathen("11045a"),
      }),
      a({
        id: "ch-nicaea2-ccc",
        type: "catechism",
        title: "CCC 2131",
        subtitle: "Nicaea II and the icons",
        sourceUrl: cccUrl(2131),
        year: 787,
      }),
      a({
        id: "ch-nicaea2-art",
        type: "artwork",
        title: "Christ Pantocrator",
        subtitle: "Deësis mosaic, Hagia Sophia",
        year: 1261,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Christ_Pantocrator_Deesis_mosaic_Hagia_Sophia.jpg",
        imageUrl: wiki("Christ_Pantocrator_Deesis_mosaic_Hagia_Sophia.jpg"),
        imageCredit:
          "Christ Pantocrator, Deësis mosaic, Hagia Sophia, Constantinople, c. 1261. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "cyril-methodius",
    year: 885,
    era: "High Middle Ages",
    title: "Sts. Cyril and Methodius",
    artifacts: [
      a({
        id: "ch-cyrilmeth-saint",
        type: "saint",
        title: "Sts. Cyril and Methodius",
        subtitle: "Apostles of the Slavs",
        year: 885,
        sourceUrl: cathen("04592a"),
      }),
      a({
        id: "ch-cyrilmeth-papal",
        type: "papal",
        title: "Slavorum Apostoli",
        subtitle: "St. John Paul II, 2 June 1985",
        year: 1985,
        sourceUrl: SLAVORUM,
      }),
    ],
  },
  {
    id: "compostela",
    year: 1075,
    era: "High Middle Ages",
    title: "Construction of Santiago de Compostela",
    artifacts: [
      a({
        id: "ch-compostela-event",
        type: "event",
        title: "Santiago de Compostela",
        subtitle: "Romanesque cathedral begun over the shrine of St. James, 1075",
        year: 1075,
        location: place(
          "Santiago de Compostela, in the Kingdom of Galicia",
          "Santiago de Compostela, Spain",
        ),
        sourceUrl: cathen("04187b"),
      }),
    ],
  },
  {
    id: "gregory-vii",
    year: 1085,
    era: "High Middle Ages",
    title: "Pope St. Gregory VII",
    artifacts: [
      a({
        id: "ch-gregory-vii-pope",
        type: "pope",
        title: "Pope St. Gregory VII",
        subtitle: "Pope — d. 1085; the Gregorian Reform",
        year: 1085,
        sourceUrl: cathen("06791c"),
      }),
    ],
  },
  {
    id: "notre-dame-paris",
    year: 1163,
    era: "High Middle Ages",
    title: "Construction of Notre-Dame de Paris",
    artifacts: [
      a({
        id: "ch-notre-dame-paris-event",
        type: "event",
        title: "Notre-Dame de Paris",
        subtitle: "Gothic cathedral begun on the Île de la Cité, 1163",
        year: 1163,
        location: place(
          "the Île de la Cité, Paris, in the Kingdom of France",
          "Paris, France",
        ),
        sourceUrl: cathen("11480c"),
      }),
    ],
  },
  {
    id: "chartres",
    year: 1194,
    era: "High Middle Ages",
    title: "Rebuilding of Notre-Dame de Chartres",
    artifacts: [
      a({
        id: "ch-chartres-event",
        type: "event",
        title: "Notre-Dame de Chartres",
        subtitle: "Rebuilding of the cathedral after the fire of 1194",
        year: 1194,
        location: place("Chartres, in the Kingdom of France", "Chartres, France"),
        sourceUrl: cathen("03635a"),
      }),
    ],
  },
  {
    id: "lateran-iv",
    year: 1215,
    era: "High Middle Ages",
    title: "Fourth Lateran Council",
    artifacts: [
      a({
        id: "ch-lat4-event",
        type: "event",
        title: "Fourth Lateran Council",
        subtitle: "1215",
        year: 1215,
        location: place(
          "Basilica of St. John Lateran, Rome, in the Papal States",
          "Archbasilica of St. John Lateran, Rome, Italy",
        ),
        sourceUrl: cathen("09018a"),
      }),
      a({
        id: "ch-lat4-ccc",
        type: "catechism",
        title: "CCC 1376",
        subtitle: "Transubstantiation",
        sourceUrl: cccUrl(1376),
        year: 1215,
      }),
    ],
  },
  {
    id: "innocent-iii",
    year: 1216,
    era: "High Middle Ages",
    title: "Pope Innocent III",
    artifacts: [
      a({
        id: "ch-innocent-iii-pope",
        type: "pope",
        title: "Pope Innocent III",
        subtitle: "Pope — d. 1216; Fourth Lateran Council",
        year: 1216,
        sourceUrl: cathen("08013a"),
      }),
    ],
  },
  {
    id: "dominic",
    year: 1221,
    era: "High Middle Ages",
    title: "St. Dominic",
    artifacts: [
      a({
        id: "ch-dominic-saint",
        type: "saint",
        title: "St. Dominic",
        subtitle: "Founder of the Order of Preachers — d. 1221",
        year: 1221,
        sourceUrl: cathen("05106a"),
      }),
      a({
        id: "ch-dominic-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Dominic — 3 February 2010",
        year: 2010,
        sourceUrl: AUD(2010, "20100203"),
      }),
      a({
        id: "ch-dominic-art",
        type: "artwork",
        title: "Saint Dominic in Prayer",
        subtitle: "El Greco, c. 1600",
        year: 1600,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Saint_Dominic,_Toledo.jpg",
        imageUrl: wiki("El_Greco_-_Saint_Dominic,_Toledo.jpg"),
        imageCredit:
          "El Greco, Saint Dominic in Prayer, c. 1600. Toledo. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "francis-assisi",
    year: 1226,
    era: "High Middle Ages",
    title: "St. Francis of Assisi",
    artifacts: [
      a({
        id: "ch-francis-saint",
        type: "saint",
        title: "St. Francis of Assisi",
        subtitle: "d. 3 October 1226",
        year: 1226,
        sourceUrl: cathen("06221a"),
      }),
      a({
        id: "ch-francis-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Francis of Assisi — 27 January 2010",
        year: 2010,
        sourceUrl: AUD(2010, "20100127"),
      }),
      a({
        id: "ch-francis-assisi-ls",
        type: "papal",
        title: "Laudato Si’ 10–12",
        subtitle: "Pope Francis on the Poverello of Assisi",
        year: 2015,
        sourceUrl: LAUDATO_SI,
      }),
      a({
        id: "ch-francis-art",
        type: "artwork",
        title: "Saint Francis of Assisi",
        subtitle: "Cimabue, c. 1278–1280",
        year: 1280,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Francis_of_Assisi_-_Cimabue.jpg",
        imageUrl: wiki("Francis_of_Assisi_-_Cimabue.jpg"),
        imageCredit:
          "Cimabue, Saint Francis of Assisi, c. 1278–1280. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "cologne",
    year: 1248,
    era: "High Middle Ages",
    title: "Construction of Cologne Cathedral",
    artifacts: [
      a({
        id: "ch-cologne-event",
        type: "event",
        title: "Cologne Cathedral",
        subtitle: "Gothic cathedral begun, 1248",
        year: 1248,
        location: place("Cologne, in the Holy Roman Empire", "Cologne, Germany"),
        sourceUrl: cathen("04116a"),
      }),
    ],
  },
  {
    id: "bonaventure",
    year: 1274,
    era: "High Middle Ages",
    title: "St. Bonaventure",
    artifacts: [
      a({
        id: "ch-bonaventure-saint",
        type: "saint",
        title: "St. Bonaventure",
        subtitle: "Seraphic Doctor — d. 1274",
        year: 1274,
        sourceUrl: cathen("02648c"),
      }),
      a({
        id: "ch-bonaventure-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Bonaventure — 3 March 2010",
        year: 2010,
        sourceUrl: AUD(2010, "20100303"),
      }),
    ],
  },
  {
    id: "aquinas",
    year: 1274,
    era: "High Middle Ages",
    title: "St. Thomas Aquinas",
    artifacts: [
      a({
        id: "ch-aquinas-saint",
        type: "saint",
        title: "St. Thomas Aquinas",
        subtitle: "Angelic Doctor — d. 1274",
        year: 1274,
        sourceUrl: cathen("14663b"),
      }),
      a({
        id: "ch-aquinas-fr",
        type: "papal",
        title: "Fides et Ratio 43",
        subtitle: "St. John Paul II on St. Thomas",
        year: 1998,
        sourceUrl: FIDES_ET_RATIO,
      }),
      a({
        id: "ch-aquinas-ap",
        type: "papal",
        title: "Aeterni Patris",
        subtitle: "Leo XIII, 4 August 1879",
        year: 1879,
        sourceUrl: AETERNI_PATRIS,
      }),
      a({
        id: "ch-aquinas-bxvi",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Thomas Aquinas — 2 June 2010",
        year: 2010,
        sourceUrl: AUD(2010, "20100602"),
      }),
      a({
        id: "ch-aquinas-art",
        type: "artwork",
        title: "Saint Thomas Aquinas",
        subtitle: "Carlo Crivelli, 1476",
        year: 1476,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Carlo_Crivelli_007.jpg",
        imageUrl: wiki("Carlo_Crivelli_007.jpg"),
        imageCredit:
          "Carlo Crivelli, Saint Thomas Aquinas, 1476. National Gallery, London. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "catherine",
    year: 1380,
    era: "High Middle Ages",
    title: "St. Catherine of Siena",
    artifacts: [
      a({
        id: "ch-catherine-saint",
        type: "saint",
        title: "St. Catherine of Siena",
        subtitle: "Doctor of the Church — d. 1380",
        year: 1380,
        sourceUrl: cathen("03447a"),
      }),
      a({
        id: "ch-catherine-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Catherine of Siena — 24 November 2010",
        year: 2010,
        sourceUrl: AUD(2010, "20101124"),
      }),
    ],
  },
  {
    id: "florence",
    year: 1439,
    era: "High Middle Ages",
    title: "Council of Florence",
    artifacts: [
      a({
        id: "ch-florence-event",
        type: "event",
        title: "Council of Florence",
        subtitle: "The procession of the Holy Spirit",
        year: 1439,
        location: place("Ferrara, then Florence, in northern Italy", "Ferrara and Florence, Italy"),
        sourceUrl: cathen("06111a"),
      }),
      a({
        id: "ch-florence-ccc",
        type: "catechism",
        title: "CCC 248",
        subtitle: "The Latin tradition and the Filioque",
        sourceUrl: cccUrl(248),
        year: 1439,
      }),
    ],
  },
  {
    id: "guadalupe",
    year: 1531,
    era: "Catholic Reformation",
    title: "Apparition and shrine of Guadalupe",
    artifacts: [
      a({
        id: "ch-guadalupe-event",
        type: "event",
        title: "Our Lady of Guadalupe",
        subtitle: "Apparition at Tepeyac and the shrine, 1531",
        year: 1531,
        location: place(
          "Tepeyac Hill, near Mexico City, in New Spain",
          "Tepeyac, Mexico City, Mexico",
        ),
        sourceUrl: cathen("07043a"),
      }),
      a({
        id: "ch-guadalupe-art",
        type: "artwork",
        title: "Our Lady of Guadalupe",
        subtitle: "Tilma of Juan Diego, 1531",
        year: 1531,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:1531_Nuestra_Señora_de_Guadalupe_anagoria.jpg",
        imageUrl: wiki("1531_Nuestra_Señora_de_Guadalupe_anagoria.jpg"),
        imageCredit:
          "The tilma of Juan Diego, Our Lady of Guadalupe, Tepeyac, 1531. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "trent",
    year: 1545,
    era: "Catholic Reformation",
    title: "Council of Trent",
    artifacts: [
      a({
        id: "ch-trent-event",
        type: "event",
        title: "Council of Trent",
        subtitle: "1545–1563",
        year: 1545,
        location: place(
          "Trent, in the Prince-Bishopric of Trent (Holy Roman Empire)",
          "Trento, in Trentino-Alto Adige, Italy",
        ),
        sourceUrl: cathen("15030c"),
      }),
      a({
        id: "ch-trent-ccc-82",
        type: "catechism",
        title: "CCC 82",
        subtitle: "Scripture and Tradition",
        sourceUrl: cccUrl(82),
        year: 1992,
      }),
      a({
        id: "ch-trent-dv",
        type: "papal",
        title: "Dei Verbum 9",
        subtitle: "Vatican II recalling Trent on Tradition",
        year: 1965,
        sourceUrl: DEI_VERBUM,
      }),
      a({
        id: "ch-trent-art",
        type: "artwork",
        title: "The Council of Trent",
        subtitle: "Pasquale Cati, c. 1588",
        year: 1588,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Pasquale_Cati_Da_Iesi_-_The_Council_of_Trent_-_WGA04574.jpg",
        imageUrl: wiki("Pasquale_Cati_Da_Iesi_-_The_Council_of_Trent_-_WGA04574.jpg"),
        imageCredit:
          "Pasquale Cati, The Council of Trent, c. 1588. Santa Maria in Trastevere, Rome. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "paul-iii",
    year: 1549,
    era: "Catholic Reformation",
    title: "Pope Paul III",
    artifacts: [
      a({
        id: "ch-paul-iii-pope",
        type: "pope",
        title: "Pope Paul III",
        subtitle: "Pope — d. 1549; opened the Council of Trent",
        year: 1549,
        sourceUrl: cathen("11579a"),
      }),
      a({
        id: "ch-paul-iii-art",
        type: "artwork",
        title: "Pope Paul III",
        subtitle: "Titian, 1543",
        year: 1543,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Portrait_of_Pope_Paul_III_Farnese_(by_Titian)_-_National_Museum_of_Capodimonte.jpg",
        imageUrl: wiki(
          "Portrait_of_Pope_Paul_III_Farnese_(by_Titian)_-_National_Museum_of_Capodimonte.jpg",
        ),
        imageCredit:
          "Titian, Portrait of Pope Paul III Farnese, 1543. Museo di Capodimonte, Naples. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "pius-v",
    year: 1572,
    era: "Catholic Reformation",
    title: "Pope St. Pius V",
    artifacts: [
      a({
        id: "ch-pius-v-pope",
        type: "pope",
        title: "Pope St. Pius V",
        subtitle: "Pope — d. 1572; implemented the Council of Trent",
        year: 1572,
        sourceUrl: cathen("12130a"),
      }),
      a({
        id: "ch-pius-v-art",
        type: "artwork",
        title: "Pope Pius V",
        subtitle: "Bartolomeo Passarotti, c. 1566",
        year: 1566,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Bartolomeo_Passarotti_-_Portrait_of_Pope_Pius_V_-_Walters_37453.jpg",
        imageUrl: wiki("Bartolomeo_Passarotti_-_Portrait_of_Pope_Pius_V_-_Walters_37453.jpg"),
        imageCredit:
          "Bartolomeo Passarotti, Portrait of Pope Pius V, c. 1566. Walters Art Museum. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "teresa",
    year: 1582,
    era: "Catholic Reformation",
    title: "St. Teresa of Ávila",
    artifacts: [
      a({
        id: "ch-teresa-saint",
        type: "saint",
        title: "St. Teresa of Jesus",
        subtitle: "Doctor of the Church — d. 1582",
        year: 1582,
        sourceUrl: cathen("14515b"),
      }),
      a({
        id: "ch-teresa-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Teresa of Avila — 2 February 2011",
        year: 2011,
        sourceUrl: AUD(2011, "20110202"),
      }),
      a({
        id: "ch-teresa-art",
        type: "artwork",
        title: "Saint Teresa of Ávila",
        subtitle: "Peter Paul Rubens, c. 1615",
        year: 1615,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Peter_Paul_Rubens_138.jpg",
        imageUrl: wiki("Peter_Paul_Rubens_138.jpg"),
        imageCredit:
          "Peter Paul Rubens, Saint Teresa of Ávila, c. 1615. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "john-cross",
    year: 1591,
    era: "Catholic Reformation",
    title: "St. John of the Cross",
    artifacts: [
      a({
        id: "ch-jcross-saint",
        type: "saint",
        title: "St. John of the Cross",
        subtitle: "Doctor of the Church — d. 1591",
        year: 1591,
        sourceUrl: cathen("08480a"),
      }),
      a({
        id: "ch-jcross-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. John of the Cross — 16 February 2011",
        year: 2011,
        sourceUrl: AUD(2011, "20110216"),
      }),
    ],
  },
  {
    id: "francis-de-sales",
    year: 1622,
    era: "Catholic Reformation",
    title: "St. Francis de Sales",
    artifacts: [
      a({
        id: "ch-fsales-saint",
        type: "saint",
        title: "St. Francis de Sales",
        subtitle: "Doctor of the Church — d. 1622",
        year: 1622,
        sourceUrl: cathen("06220a"),
      }),
      a({
        id: "ch-fsales-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Francis de Sales — 2 March 2011",
        year: 2011,
        sourceUrl: AUD(2011, "20110302"),
      }),
    ],
  },
  {
    id: "immaculate",
    year: 1854,
    era: "Modern era",
    title: "Definition of the Immaculate Conception",
    artifacts: [
      a({
        id: "ch-ic-event",
        type: "event",
        title: "Ineffabilis Deus",
        subtitle: "Pius IX, 8 December 1854",
        year: 1854,
        location: place(
          "St. Peter's Basilica, Rome, in the Papal States",
          "St. Peter's Basilica, Vatican City",
        ),
        sourceUrl: cathen("07674d"),
      }),
      a({
        id: "ch-ic-ccc",
        type: "catechism",
        title: "CCC 491",
        subtitle: "The Immaculate Conception",
        sourceUrl: cccUrl(491),
        year: 1854,
      }),
      a({
        id: "ch-ic-art",
        type: "artwork",
        title: "The Immaculate Conception of Los Venerables",
        subtitle: "Bartolomé Esteban Murillo, 1678",
        year: 1678,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Murillo_-_Inmaculada_Concepción_de_los_Venerables_o_de_Soult_(Museo_del_Prado,_1678).jpg",
        imageUrl: wiki(
          "Murillo_-_Inmaculada_Concepción_de_los_Venerables_o_de_Soult_(Museo_del_Prado,_1678).jpg",
        ),
        imageCredit:
          "Bartolomé Esteban Murillo, The Immaculate Conception of Los Venerables, 1678. Museo del Prado. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "vatican-i",
    year: 1870,
    era: "Modern era",
    title: "First Vatican Council",
    artifacts: [
      a({
        id: "ch-vi-event",
        type: "event",
        title: "First Vatican Council",
        subtitle: "Pastor Aeternus — 18 July 1870",
        year: 1870,
        location: place("St. Peter's Basilica, Rome", "St. Peter's Basilica, Vatican City"),
        sourceUrl: cathen("15303a"),
      }),
      a({
        id: "ch-vi-ccc",
        type: "catechism",
        title: "CCC 891",
        subtitle: "The Roman Pontiff and infallibility",
        sourceUrl: cccUrl(891),
        year: 1870,
      }),
    ],
  },
  {
    id: "pius-ix",
    year: 1878,
    era: "Modern era",
    title: "Pope Pius IX",
    artifacts: [
      a({
        id: "ch-pius-ix-pope",
        type: "pope",
        title: "Pope Pius IX",
        subtitle: "Pope — d. 1878; Immaculate Conception and Vatican I",
        year: 1878,
        sourceUrl: cathen("12134b"),
      }),
    ],
  },
  {
    id: "st-patricks-nyc",
    year: 1879,
    era: "Modern era",
    title: "Dedication of St. Patrick’s Cathedral",
    artifacts: [
      a({
        id: "ch-st-patricks-nyc-event",
        type: "event",
        title: "St. Patrick’s Cathedral",
        subtitle: "Dedication of the cathedral on Fifth Avenue, 1879",
        year: 1879,
        location: place("Fifth Avenue, New York, United States", "New York, United States"),
        sourceUrl: cathen("11020a"),
      }),
    ],
  },
  {
    id: "leo-xiii",
    year: 1891,
    era: "Modern era",
    title: "Pope Leo XIII — Rerum Novarum",
    artifacts: [
      a({
        id: "ch-leo13-pope",
        type: "pope",
        title: "Pope Leo XIII",
        subtitle: "1878–1903",
        year: 1878,
        sourceUrl: cathen("09169a"),
      }),
      a({
        id: "ch-leo13-rn",
        type: "papal",
        title: "Rerum Novarum",
        subtitle: "15 May 1891",
        year: 1891,
        sourceUrl: RERUM_NOVARUM,
      }),
      a({
        id: "ch-leo13-ap",
        type: "papal",
        title: "Aeterni Patris",
        subtitle: "4 August 1879",
        year: 1879,
        sourceUrl: AETERNI_PATRIS,
      }),
    ],
  },
  {
    id: "therese",
    year: 1897,
    era: "Modern era",
    title: "St. Thérèse of Lisieux",
    artifacts: [
      a({
        id: "ch-therese-saint",
        type: "saint",
        title: "St. Thérèse of the Child Jesus",
        subtitle: "Doctor of the Church — d. 1897",
        year: 1897,
        sourceUrl: cathen("17721a"),
      }),
      a({
        id: "ch-therese-papal",
        type: "papal",
        title: "Benedict XVI, General Audience",
        subtitle: "St. Thérèse of Lisieux — 6 April 2011",
        year: 2011,
        sourceUrl: AUD(2011, "20110406"),
      }),
    ],
  },
  {
    id: "pius-x",
    year: 1907,
    era: "Twentieth century",
    title: "Pope St. Pius X",
    artifacts: [
      a({
        id: "ch-piusx-pope",
        type: "pope",
        title: "Pope St. Pius X",
        subtitle: "1903–1914",
        year: 1903,
        sourceUrl: cathen("12137a"),
      }),
      a({
        id: "ch-piusx-pascendi",
        type: "papal",
        title: "Pascendi Dominici Gregis",
        subtitle: "8 September 1907",
        year: 1907,
        sourceUrl: PASCENDI,
      }),
    ],
  },
  {
    id: "quas-primas",
    year: 1925,
    era: "Twentieth century",
    title: "Pius XI — Quas Primas",
    artifacts: [
      a({
        id: "ch-piusxi-qp",
        type: "papal",
        title: "Quas Primas",
        subtitle: "The Kingship of Christ — 11 December 1925",
        year: 1925,
        sourceUrl: QUAS_PRIMAS,
      }),
    ],
  },
  {
    id: "mystici",
    year: 1943,
    era: "Twentieth century",
    title: "Mystici Corporis Christi",
    artifacts: [
      a({
        id: "ch-mystici-papal",
        type: "papal",
        title: "Mystici Corporis Christi",
        subtitle: "Pius XII, 29 June 1943",
        year: 1943,
        sourceUrl: MYSTICI_CORPORIS,
      }),
      a({
        id: "ch-mystici-ccc",
        type: "catechism",
        title: "CCC 779",
        subtitle: "The Church, Body of Christ",
        sourceUrl: cccUrl(779),
        year: 1992,
      }),
    ],
  },
  {
    id: "divino",
    year: 1943,
    era: "Twentieth century",
    title: "Divino Afflante Spiritu",
    artifacts: [
      a({
        id: "ch-das-papal",
        type: "papal",
        title: "Divino Afflante Spiritu",
        subtitle: "Pius XII, 30 September 1943",
        year: 1943,
        sourceUrl: DIVINO_AFFLANTE,
      }),
    ],
  },
  {
    id: "assumption",
    year: 1950,
    era: "Twentieth century",
    title: "Definition of the Assumption",
    artifacts: [
      a({
        id: "ch-assump-event",
        type: "event",
        title: "Munificentissimus Deus",
        subtitle: "Pius XII, 1 November 1950",
        year: 1950,
        location: place("St. Peter's Basilica, Vatican City", "St. Peter's Basilica, Vatican City"),
        sourceUrl: cathen("02006b"),
      }),
      a({
        id: "ch-assump-papal",
        type: "papal",
        title: "Munificentissimus Deus",
        subtitle: "Apostolic Constitution defining the Assumption",
        year: 1950,
        sourceUrl: MUNIFICENTISSIMUS,
      }),
      a({
        id: "ch-assump-ccc",
        type: "catechism",
        title: "CCC 966",
        subtitle: "The Assumption of the Blessed Virgin",
        sourceUrl: cccUrl(966),
        year: 1950,
      }),
      a({
        id: "ch-assump-art",
        type: "artwork",
        title: "Assumption of the Virgin",
        subtitle: "Titian, 1516–1518",
        year: 1518,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiziano,_l'assunta,_1516-18.JPG",
        imageUrl: wiki("Tiziano,_l'assunta,_1516-18.JPG"),
        imageCredit:
          "Titian, Assumption of the Virgin, 1516–1518. Santa Maria Gloriosa dei Frari, Venice. Public domain, via Wikimedia Commons.",
      }),
      a({
        id: "ch-coronation-art",
        type: "artwork",
        title: "The Coronation of the Virgin",
        subtitle: "Diego Velázquez, 1635–1636",
        year: 1636,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Diego_Velázquez_012.jpg",
        imageUrl: wiki("Diego_Velázquez_012.jpg"),
        imageCredit:
          "Diego Velázquez, The Coronation of the Virgin, 1635–1636. Museo del Prado. Public domain, via Wikimedia Commons.",
      }),
    ],
  },
  {
    id: "john-xxiii",
    year: 1963,
    era: "Twentieth century",
    title: "St. John XXIII — Pacem in Terris",
    artifacts: [
      a({
        id: "ch-jxxiii-pacem",
        type: "papal",
        title: "Pacem in Terris",
        subtitle: "11 April 1963",
        year: 1963,
        sourceUrl: PACEM_IN_TERRIS,
      }),
    ],
  },
  {
    id: "vatican-ii",
    year: 1965,
    era: "Twentieth century",
    title: "Second Vatican Council",
    artifacts: [
      a({
        id: "ch-vii-event",
        type: "event",
        title: "Second Vatican Council",
        subtitle: "1962–1965",
        year: 1962,
        location: place("St. Peter's Basilica, Vatican City", "St. Peter's Basilica, Vatican City"),
        sourceUrl: VATICAN_II,
      }),
      a({
        id: "ch-vii-dv",
        type: "papal",
        title: "Dei Verbum 11",
        subtitle: "Dogmatic Constitution on Divine Revelation",
        sourceUrl: DEI_VERBUM,
        year: 1965,
      }),
      a({
        id: "ch-vii-lg",
        type: "papal",
        title: "Lumen Gentium",
        subtitle: "Dogmatic Constitution on the Church",
        year: 1964,
        sourceUrl: LUMEN_GENTIUM,
      }),
      a({
        id: "ch-vii-gs",
        type: "papal",
        title: "Gaudium et Spes",
        subtitle: "Pastoral Constitution on the Church in the Modern World",
        year: 1965,
        sourceUrl: GAUDIUM_ET_SPES,
      }),
      a({
        id: "ch-vii-sc",
        type: "papal",
        title: "Sacrosanctum Concilium",
        subtitle: "Constitution on the Sacred Liturgy",
        year: 1963,
        sourceUrl: SACROSANCTUM,
      }),
    ],
  },
  {
    id: "humanae-vitae",
    year: 1968,
    era: "Twentieth century",
    title: "St. Paul VI — Humanae Vitae",
    artifacts: [
      a({
        id: "ch-pvi-hv",
        type: "papal",
        title: "Humanae Vitae",
        subtitle: "25 July 1968",
        year: 1968,
        sourceUrl: HUMANAE_VITAE,
      }),
      a({
        id: "ch-pvi-en",
        type: "papal",
        title: "Evangelii Nuntiandi",
        subtitle: "8 December 1975",
        year: 1975,
        sourceUrl: EVANGELII_NUNTIANDI,
      }),
    ],
  },
  {
    id: "jp2",
    year: 1978,
    era: "Contemporary",
    title: "St. John Paul II",
    artifacts: [
      a({
        id: "ch-jp2-rh",
        type: "papal",
        title: "Redemptor Hominis",
        subtitle: "4 March 1979",
        year: 1979,
        sourceUrl: REDEMPTOR_HOMINIS,
      }),
      a({
        id: "ch-jp2-dives",
        type: "papal",
        title: "Dives in Misericordia",
        subtitle: "30 November 1980",
        year: 1980,
        sourceUrl: DIVES,
      }),
      a({
        id: "ch-jp2-fr",
        type: "papal",
        title: "Fides et Ratio",
        subtitle: "14 September 1998",
        year: 1998,
        sourceUrl: FIDES_ET_RATIO,
      }),
      a({
        id: "ch-jp2-ev",
        type: "papal",
        title: "Evangelium Vitae",
        subtitle: "25 March 1995",
        year: 1995,
        sourceUrl: EVANGELIUM_VITAE,
      }),
      a({
        id: "ch-jp2-ee",
        type: "papal",
        title: "Ecclesia de Eucharistia",
        subtitle: "17 April 2003",
        year: 2003,
        sourceUrl: ECCLESIA_DE_EUCH,
      }),
      a({
        id: "ch-jp2-rosarium",
        type: "papal",
        title: "Rosarium Virginis Mariae",
        subtitle: "16 October 2002",
        year: 2002,
        sourceUrl: ROSARIUM,
      }),
    ],
  },
  {
    id: "bxvi",
    year: 2005,
    era: "Contemporary",
    title: "Benedict XVI",
    artifacts: [
      a({
        id: "ch-bxvi-dce",
        type: "papal",
        title: "Deus Caritas Est",
        subtitle: "25 December 2005",
        year: 2005,
        sourceUrl: DEUS_CARITAS,
      }),
      a({
        id: "ch-bxvi-ss",
        type: "papal",
        title: "Spe Salvi",
        subtitle: "30 November 2007",
        year: 2007,
        sourceUrl: SPE_SALVI,
      }),
      a({
        id: "ch-bxvi-vd",
        type: "papal",
        title: "Verbum Domini",
        subtitle: "30 September 2010",
        year: 2010,
        sourceUrl: VERBUM_DOMINI,
      }),
    ],
  },
  {
    id: "francis",
    year: 2013,
    era: "Contemporary",
    title: "Francis",
    artifacts: [
      a({
        id: "ch-francis-lf",
        type: "papal",
        title: "Lumen Fidei",
        subtitle: "29 June 2013",
        year: 2013,
        sourceUrl: LUMEN_FIDEI,
      }),
      a({
        id: "ch-francis-eg",
        type: "papal",
        title: "Evangelii Gaudium",
        subtitle: "24 November 2013",
        year: 2013,
        sourceUrl: EVANGELII_GAUDIUM,
      }),
      a({
        id: "ch-francis-ls",
        type: "papal",
        title: "Laudato Si’",
        subtitle: "24 May 2015",
        year: 2015,
        sourceUrl: LAUDATO_SI,
      }),
      a({
        id: "ch-francis-ft",
        type: "papal",
        title: "Fratelli Tutti",
        subtitle: "3 October 2020",
        year: 2020,
        sourceUrl: FRATELLI_TUTTI,
      }),
    ],
  },
];
