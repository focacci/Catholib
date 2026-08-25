import { haydockUrl, HAYDOCK_SLUG } from "./haydock";
import type { BibleBook, PopulatedChapter, TimelineArtifact } from "./types";

const ENG = (id: string) => `https://www.vatican.va/archive/ENG0015/__${id}.HTM`;

const CCC_CREATOR = ENG("P19");
const CCC_MAN = ENG("P1B");
const CCC_FALL = ENG("P1C");
const CCC_KNOW_GOD = ENG("PA");
const CCC_REVELATION = ENG("PG");
const CCC_FULLNESS = ENG("PH");
const CCC_FAITH = ENG("PV");
const CCC_FATHER = ENG("P17");
const CCC_TRUE_GOD = ENG("P1J");
const CCC_VIRGIN = ENG("P1K");
const CCC_PASSION = ENG("P1M");
const CCC_RESURRECTION = ENG("P1S");
const CCC_ASCENSION = ENG("P1T");
const CCC_SPIRIT_PROMISE = ENG("P22");
const CCC_SPIRIT_FULLNESS = ENG("P23");
const CCC_SPIRIT_LAST = ENG("P24");
const CCC_CHURCH_PLAN = ENG("P27");
const CCC_HIERARCHY = ENG("P2A");
const CCC_BODY = ENG("P2G");
const CCC_NEW_EARTH = ENG("P2Q");
const CCC_EUCHARIST = ENG("P3W");
const CCC_BEATITUDES = ENG("P5I");
const CCC_VIRTUES = ENG("P64");
const CCC_NEW_LAW = ENG("P6W");
const CCC_JUSTIFICATION = ENG("P6Y");
const CCC_DECALOGUE = ENG("P78");
const CCC_LOVE_GOD = ENG("P7A");
const CCC_OT_PRAYER = ENG("P91");
const CCC_OUR_FATHER = ENG("P9V");
const CCC_MARKS = ENG("P29");
const CCC_PETITION = ENG("P97");
const CCC_PENANCE = ENG("P46");
const CCC_PRAISE = ENG("P9A");

const DEI_VERBUM =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html";
const LAUDATO_SI =
  "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html";
const REDEMPTORIS_MATER =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25031987_redemptoris-mater.html";
const SPE_SALVI =
  "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html";
const VERBUM_DOMINI =
  "https://www.vatican.va/content/benedict-xvi/en/apost_exhortations/documents/hf_ben-xvi_exh_20100930_verbum-domini.html";
const ECCLESIA_DE_EUCH =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_20030417_eccl-de-euch.html";
const DIVES_IN_MISERICORDIA =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_30111980_dives-in-misericordia.html";
const REDEMPTORIS_MISSIO =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_07121990_redemptoris-missio.html";
const DEUS_CARITAS =
  "https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html";
const SACRAMENTUM_CARITATIS =
  "https://www.vatican.va/content/benedict-xvi/en/apost_exhortations/documents/hf_ben-xvi_exh_20070222_sacramentum-caritatis.html";
const DOMINUM_ET_VIV =
  "https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_18051986_dominum-et-vivificantem.html";

function art(partial: TimelineArtifact): TimelineArtifact {
  return partial;
}

function wiki(file: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

function haydockArt(
  book: string,
  chapter: number,
  extra?: Partial<TimelineArtifact>,
): TimelineArtifact {
  const url = haydockUrl(book, chapter);
  if (!url) throw new Error(`No confirmed Haydock URL for ${book} ${chapter}`);
  return art({
    id: extra?.id ?? `hd-${book.replace(/\s+/g, "-").toLowerCase()}-${chapter}`,
    type: "haydock",
    title: extra?.title ?? `Haydock on ${book} ${chapter}`,
    subtitle: "Haydock’s Catholic Bible Commentary, 1859",
    sourceUrl: url,
    bibleRefs: extra?.bibleRefs,
    year: 1859,
    shortQuote: extra?.shortQuote,
  });
}

const genesis1: TimelineArtifact[] = [
  art({
    id: "gn1-ccc-289",
    type: "catechism",
    title: "CCC 289",
    subtitle: "The first three chapters of Genesis",
    shortQuote:
      "Among all the Scriptural texts about creation, the first three chapters of Genesis occupy a unique place.",
    sourceUrl: CCC_CREATOR,
    bibleRefs: ["Gn 1:1–2:4"],
    year: 1992,
  }),
  art({
    id: "gn1-ccc-290",
    type: "catechism",
    title: "CCC 290",
    subtitle: "“In the beginning God created”",
    shortQuote:
      "“In the beginning God created the heavens and the earth”: three things are affirmed in these first words of Scripture: the eternal God gave a beginning to all that exists outside of himself; he alone is Creator (the verb “create” — Hebrew bara — always has God for its subject).",
    sourceUrl: CCC_CREATOR,
    bibleRefs: ["Gn 1:1"],
    year: 1992,
  }),
  art({
    id: "gn1-laudato-65",
    type: "papal",
    title: "Laudato Si’ 65",
    subtitle: "Pope Francis, 24 May 2015",
    shortQuote:
      "The creation accounts in the book of Genesis contain, in their own symbolic and narrative language, profound teachings about human existence and its historical reality. They suggest that human life is grounded in three fundamental and closely intertwined relationships: with God, with our neighbour and with the earth itself.",
    sourceUrl: LAUDATO_SI,
    bibleRefs: ["Gn 1", "Gn 2"],
    year: 2015,
  }),
  art({
    id: "gn1-dv-3",
    type: "papal",
    title: "Dei Verbum 3",
    subtitle: "Second Vatican Council, 18 November 1965",
    shortQuote:
      "God, who through the Word creates all things (see John 1:3) and keeps them in existence, gives men an enduring witness to Himself in created realities (see Rom. 1:19-20).",
    sourceUrl: DEI_VERBUM,
    bibleRefs: ["Gn 1", "Jn 1:3"],
    year: 1965,
  }),
  haydockArt("Genesis", 1, {
    id: "gn1-haydock",
    title: "Haydock on Genesis 1:1",
    shortQuote:
      "Beginning. As St. Matthew begins his Gospel with the same title as this work, the Book of the Generation, or Genesis, so St. John adopts the first words of Moses, in the beginning; but he considers a much higher order of things, even the consubstantial Son of God.",
    bibleRefs: ["Gn 1:1"],
  }),
  art({
    id: "gn1-artwork",
    type: "artwork",
    title: "The Creation of Adam",
    subtitle: "Michelangelo Buonarroti, Sistine Chapel, c. 1511–1512",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_(cropped).jpg",
    imageUrl: wiki("Michelangelo_-_Creation_of_Adam_(cropped).jpg"),
    imageCredit:
      "Michelangelo Buonarroti, The Creation of Adam, Sistine Chapel ceiling, c. 1511–1512. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Gn 1:26–27"],
    year: 1512,
  }),
];

const genesis2: TimelineArtifact[] = [
  art({
    id: "gn2-ccc-369",
    type: "catechism",
    title: "CCC 369",
    subtitle: "Man and woman created",
    sourceUrl: CCC_MAN,
    bibleRefs: ["Gn 2:7", "Gn 2:21–24"],
    year: 1992,
  }),
  art({
    id: "gn2-ccc-375",
    type: "catechism",
    title: "CCC 375",
    subtitle: "Original holiness and justice",
    sourceUrl: CCC_MAN,
    bibleRefs: ["Gn 2"],
    year: 1992,
  }),
  art({
    id: "gn2-laudato",
    type: "papal",
    title: "Laudato Si’ 66",
    subtitle: "Pope Francis, 24 May 2015",
    sourceUrl: LAUDATO_SI,
    bibleRefs: ["Gn 2:15"],
    year: 2015,
  }),
];

const genesis3: TimelineArtifact[] = [
  art({
    id: "gn3-ccc-390",
    type: "catechism",
    title: "CCC 390",
    subtitle: "The account of the fall",
    shortQuote:
      "The account of the fall in Genesis 3 uses figurative language, but affirms a primeval event, a deed that took place at the beginning of the history of man. Revelation gives us the certainty of faith that the whole of human history is marked by the original fault freely committed by our first parents.",
    sourceUrl: CCC_FALL,
    bibleRefs: ["Gn 3"],
    year: 1992,
  }),
  art({
    id: "gn3-ccc-397",
    type: "catechism",
    title: "CCC 397",
    subtitle: "Man, tempted by the devil",
    shortQuote:
      "Man, tempted by the devil, let his trust in his Creator die in his heart and, abusing his freedom, disobeyed God’s command. This is what man’s first sin consisted of.",
    sourceUrl: CCC_FALL,
    bibleRefs: ["Gn 3:1–11"],
    year: 1992,
  }),
  art({
    id: "gn3-dv-3",
    type: "papal",
    title: "Dei Verbum 3",
    subtitle: "Second Vatican Council — the promise after the fall",
    shortQuote:
      "Then after their fall His promise of redemption aroused in them the hope of being saved (see Gen. 3:15) and from that time on He ceaselessly kept the human race in His care.",
    sourceUrl: DEI_VERBUM,
    bibleRefs: ["Gn 3:15"],
    year: 1965,
  }),
  haydockArt("Genesis", 3, {
    id: "gn3-haydock",
    title: "Haydock on Genesis 3:1",
    shortQuote:
      "Why hath God? Hebrew, “Indeed hath God, &c.” as if the serpent had overheard Eve arguing with herself, about God’s prohibition, with a sort of displeasure and presumption.",
    bibleRefs: ["Gn 3:1"],
  }),
  art({
    id: "gn3-artwork",
    type: "artwork",
    title: "The Expulsion from the Garden of Eden",
    subtitle: "Masaccio, Brancacci Chapel, c. 1425",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Masaccio-TheExpulsionOfAdamAndEveFromEden-Restoration.jpg",
    imageUrl: wiki("Masaccio-TheExpulsionOfAdamAndEveFromEden-Restoration.jpg"),
    imageCredit:
      "Masaccio, The Expulsion from the Garden of Eden (restored), Brancacci Chapel, Florence, c. 1425. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Gn 3:23–24"],
    year: 1425,
  }),
];

const genesis12: TimelineArtifact[] = [
  art({
    id: "gn12-ccc-59",
    type: "catechism",
    title: "CCC 59",
    subtitle: "God calls Abram",
    sourceUrl: CCC_REVELATION,
    bibleRefs: ["Gn 12:1–3"],
    year: 1992,
  }),
  art({
    id: "gn12-ccc-145",
    type: "catechism",
    title: "CCC 145",
    subtitle: "The faith of Abraham",
    sourceUrl: CCC_FAITH,
    bibleRefs: ["Gn 12:1–4", "Heb 11:8"],
    year: 1992,
  }),
];

const genesis15: TimelineArtifact[] = [
  art({
    id: "gn15-ccc-146",
    type: "catechism",
    title: "CCC 146",
    subtitle: "Abraham believed God",
    sourceUrl: CCC_FAITH,
    bibleRefs: ["Gn 15:6", "Rom 4:3"],
    year: 1992,
  }),
];

const genesis22: TimelineArtifact[] = [
  art({
    id: "gn22-ccc-2572",
    type: "catechism",
    title: "CCC 2572",
    subtitle: "Abraham’s trial of faith",
    sourceUrl: CCC_OT_PRAYER,
    bibleRefs: ["Gn 22:1–18"],
    year: 1992,
  }),
  art({
    id: "gn22-artwork",
    type: "artwork",
    title: "The Sacrifice of Isaac",
    subtitle: "Caravaggio, c. 1603",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sacrifice_of_Isaac-Caravaggio_(c._1603).jpg",
    imageUrl: wiki("Sacrifice_of_Isaac-Caravaggio_(c._1603).jpg"),
    imageCredit:
      "Caravaggio, The Sacrifice of Isaac, c. 1603. Uffizi Gallery. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Gn 22:9–13"],
    year: 1603,
  }),
];

const exodus3: TimelineArtifact[] = [
  art({
    id: "ex3-ccc-205",
    type: "catechism",
    title: "CCC 205",
    subtitle: "God reveals his name",
    sourceUrl: CCC_FATHER,
    bibleRefs: ["Ex 3:13–15"],
    year: 1992,
  }),
  art({
    id: "ex3-ccc-2575",
    type: "catechism",
    title: "CCC 2575",
    subtitle: "Prayer of Moses",
    sourceUrl: CCC_OT_PRAYER,
    bibleRefs: ["Ex 3:1–6"],
    year: 1992,
  }),
];

const exodus12: TimelineArtifact[] = [
  art({
    id: "ex12-ccc-1363",
    type: "catechism",
    title: "CCC 1363",
    subtitle: "The Passover memorial",
    sourceUrl: CCC_EUCHARIST,
    bibleRefs: ["Ex 12"],
    year: 1992,
  }),
  art({
    id: "ex12-ccc-1334",
    type: "catechism",
    title: "CCC 1334",
    subtitle: "The unleavened bread of the Exodus",
    sourceUrl: CCC_EUCHARIST,
    bibleRefs: ["Ex 12:1–14"],
    year: 1992,
  }),
];

const exodus20: TimelineArtifact[] = [
  art({
    id: "ex20-ccc-2056",
    type: "catechism",
    title: "CCC 2056",
    subtitle: "The Decalogue — “ten words”",
    sourceUrl: CCC_DECALOGUE,
    bibleRefs: ["Ex 20:1–17"],
    year: 1992,
  }),
  art({
    id: "ex20-ccc-2084",
    type: "catechism",
    title: "CCC 2084",
    subtitle: "The first commandment",
    sourceUrl: CCC_LOVE_GOD,
    bibleRefs: ["Ex 20:2–5"],
    year: 1992,
  }),
  art({
    id: "ex20-artwork",
    type: "artwork",
    title: "Moses with the Ten Commandments",
    subtitle: "Rembrandt, 1659",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg",
    imageUrl: wiki("Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg"),
    imageCredit:
      "Rembrandt, Moses with the Ten Commandments, 1659. Gemäldegalerie, Berlin. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Ex 20"],
    year: 1659,
  }),
];

const deut5: TimelineArtifact[] = [
  art({
    id: "dt5-ccc-2056",
    type: "catechism",
    title: "CCC 2056",
    subtitle: "The Decalogue given again",
    sourceUrl: CCC_DECALOGUE,
    bibleRefs: ["Dt 5:6–21"],
    year: 1992,
  }),
];

const deut6: TimelineArtifact[] = [
  art({
    id: "dt6-ccc-201",
    type: "catechism",
    title: "CCC 201",
    subtitle: "Hear, O Israel",
    sourceUrl: CCC_FATHER,
    bibleRefs: ["Dt 6:4–5"],
    year: 1992,
  }),
  art({
    id: "dt6-ccc-2083",
    type: "catechism",
    title: "CCC 2083",
    subtitle: "You shall love the Lord your God",
    sourceUrl: CCC_LOVE_GOD,
    bibleRefs: ["Dt 6:5"],
    year: 1992,
  }),
];

const psalm1: TimelineArtifact[] = [
  art({
    id: "ps1-ccc-2585",
    type: "catechism",
    title: "CCC 2585",
    subtitle: "The Psalms, school of prayer",
    sourceUrl: CCC_OT_PRAYER,
    bibleRefs: ["Ps 1"],
    year: 1992,
  }),
];

const psalm22: TimelineArtifact[] = [
  art({
    id: "ps22-ccc-603",
    type: "catechism",
    title: "CCC 603",
    subtitle: "“My God, my God, why have you forsaken me?”",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Ps 22:1", "Mk 15:34"],
    year: 1992,
  }),
];

const psalm23: TimelineArtifact[] = [
  art({
    id: "ps23-ccc-2579",
    type: "catechism",
    title: "CCC 2579",
    subtitle: "David the shepherd, man of prayer",
    sourceUrl: CCC_OT_PRAYER,
    bibleRefs: ["Ps 23"],
    year: 1992,
  }),
];

const psalm110: TimelineArtifact[] = [
  art({
    id: "ps110-ccc-447",
    type: "catechism",
    title: "CCC 447",
    subtitle: "Jesus and Psalm 110",
    sourceUrl: CCC_TRUE_GOD,
    bibleRefs: ["Ps 110:1"],
    year: 1992,
  }),
  art({
    id: "ps110-ccc-659",
    type: "catechism",
    title: "CCC 659",
    subtitle: "Seated at the right hand of the Father",
    sourceUrl: CCC_ASCENSION,
    bibleRefs: ["Ps 110:1"],
    year: 1992,
  }),
];

const isaiah7: TimelineArtifact[] = [
  art({
    id: "is7-ccc-497",
    type: "catechism",
    title: "CCC 497",
    subtitle: "The virginal conception and Isaiah 7:14",
    shortQuote:
      "The Gospel accounts understand the virginal conception of Jesus as a divine work that surpasses all human understanding and possibility. The Church sees here the fulfilment of the divine promise given through the prophet Isaiah: “Behold, a virgin shall conceive and bear a son.”",
    sourceUrl: CCC_VIRGIN,
    bibleRefs: ["Is 7:14", "Mt 1:23"],
    year: 1992,
  }),
  art({
    id: "is7-redemptoris",
    type: "papal",
    title: "Redemptoris Mater 2",
    subtitle: "St. John Paul II, 25 March 1987",
    shortQuote:
      "“Behold, a virgin shall conceive and bear a son, and his name shall be called Emmanuel” (Is. 7:14).",
    sourceUrl: REDEMPTORIS_MATER,
    bibleRefs: ["Is 7:14"],
    year: 1987,
  }),
  haydockArt("Isaiah", 7, {
    id: "is7-haydock",
    title: "Haydock on Isaiah 7",
    bibleRefs: ["Is 7:14"],
  }),
  art({
    id: "is7-artwork",
    type: "artwork",
    title: "The Prophet Isaiah",
    subtitle: "Michelangelo Buonarroti, Sistine Chapel, c. 1508–1512",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Michelangelo,_profeti,_Isaiah_01.jpg",
    imageUrl: wiki("Michelangelo,_profeti,_Isaiah_01.jpg"),
    imageCredit:
      "Michelangelo Buonarroti, The Prophet Isaiah, Sistine Chapel ceiling, c. 1508–1512. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Is 7"],
    year: 1511,
  }),
];

const isaiah9: TimelineArtifact[] = [
  art({
    id: "is9-ccc-712",
    type: "catechism",
    title: "CCC 712",
    subtitle: "The characteristics of the awaited Messiah",
    sourceUrl: CCC_SPIRIT_PROMISE,
    bibleRefs: ["Is 9:5–6"],
    year: 1992,
  }),
];

const isaiah53: TimelineArtifact[] = [
  art({
    id: "is53-ccc-601",
    type: "catechism",
    title: "CCC 601",
    subtitle: "The Servant who is put to death",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Is 53:11"],
    year: 1992,
  }),
  art({
    id: "is53-ccc-713",
    type: "catechism",
    title: "CCC 713",
    subtitle: "The Servant songs",
    sourceUrl: CCC_SPIRIT_PROMISE,
    bibleRefs: ["Is 53"],
    year: 1992,
  }),
];

const wisdom2: TimelineArtifact[] = [
  art({
    id: "wis2-ccc-601",
    type: "catechism",
    title: "CCC 601",
    subtitle: "The righteous one",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Wis 2:12–20"],
    year: 1992,
  }),
];

const matthew5: TimelineArtifact[] = [
  art({
    id: "mt5-ccc-1716",
    type: "catechism",
    title: "CCC 1716",
    subtitle: "The Beatitudes",
    shortQuote:
      "The Beatitudes are at the heart of Jesus’ preaching. They take up the promises made to the chosen people since Abraham. The Beatitudes fulfill the promises by ordering them no longer merely to the possession of a territory, but to the Kingdom of heaven.",
    sourceUrl: CCC_BEATITUDES,
    bibleRefs: ["Mt 5:3–12"],
    year: 1992,
  }),
  art({
    id: "mt5-ccc-1965",
    type: "catechism",
    title: "CCC 1965",
    subtitle: "The New Law and the Sermon on the Mount",
    shortQuote:
      "The New Law or the Law of the Gospel is the perfection here on earth of the divine law, natural and revealed. It is the work of Christ and is expressed particularly in the Sermon on the Mount.",
    sourceUrl: CCC_NEW_LAW,
    bibleRefs: ["Mt 5–7"],
    year: 1992,
  }),
  haydockArt("Matthew", 5, {
    id: "mt5-haydock",
    title: "Haydock on Matthew 5:2",
    shortQuote:
      "Opening his mouth. It is a Hebraism, to signify he began to speak. This is a common expression in Scripture, to signify something important is about to be spoken.",
    bibleRefs: ["Mt 5:2"],
  }),
  art({
    id: "mt5-artwork",
    type: "artwork",
    title: "The Sermon on the Mount",
    subtitle: "Carl Heinrich Bloch, 1877",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bloch-SermonOnTheMount.jpg",
    imageUrl: wiki("Bloch-SermonOnTheMount.jpg"),
    imageCredit:
      "Carl Heinrich Bloch, The Sermon on the Mount, 1877. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Mt 5:1–12"],
    year: 1877,
  }),
];

const matthew6: TimelineArtifact[] = [
  art({
    id: "mt6-ccc-2759",
    type: "catechism",
    title: "CCC 2759",
    subtitle: "The Lord’s Prayer",
    sourceUrl: CCC_OUR_FATHER,
    bibleRefs: ["Mt 6:9–13"],
    year: 1992,
  }),
];

const matthew16: TimelineArtifact[] = [
  art({
    id: "mt16-ccc-424",
    type: "catechism",
    title: "CCC 424",
    subtitle: "“You are the Christ”",
    sourceUrl: CCC_TRUE_GOD,
    bibleRefs: ["Mt 16:16"],
    year: 1992,
  }),
  art({
    id: "mt16-ccc-881",
    type: "catechism",
    title: "CCC 881",
    subtitle: "The office of Peter",
    sourceUrl: CCC_HIERARCHY,
    bibleRefs: ["Mt 16:18–19"],
    year: 1992,
  }),
  art({
    id: "mt16-artwork",
    type: "artwork",
    title: "Christ Handing the Keys to St. Peter",
    subtitle: "Pietro Perugino, 1481–1482",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Entrega_de_las_llaves_a_San_Pedro_(Perugino).jpg",
    imageUrl: wiki("Entrega_de_las_llaves_a_San_Pedro_(Perugino).jpg"),
    imageCredit:
      "Pietro Perugino, Christ Handing the Keys to St. Peter, Sistine Chapel, 1481–1482. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Mt 16:18–19"],
    year: 1482,
  }),
];

const matthew28: TimelineArtifact[] = [
  art({
    id: "mt28-ccc-849",
    type: "catechism",
    title: "CCC 849",
    subtitle: "The missionary mandate",
    sourceUrl: CCC_MARKS,
    bibleRefs: ["Mt 28:19–20"],
    year: 1992,
  }),
  art({
    id: "mt28-missio",
    type: "papal",
    title: "Redemptoris Missio",
    subtitle: "St. John Paul II, 7 December 1990",
    sourceUrl: REDEMPTORIS_MISSIO,
    bibleRefs: ["Mt 28:18–20"],
    year: 1990,
  }),
];

const luke1: TimelineArtifact[] = [
  art({
    id: "lk1-ccc-148",
    type: "catechism",
    title: "CCC 148",
    subtitle: "The Virgin Mary’s faith",
    sourceUrl: CCC_FAITH,
    bibleRefs: ["Lk 1:37–38"],
    year: 1992,
  }),
  art({
    id: "lk1-ccc-490",
    type: "catechism",
    title: "CCC 490",
    subtitle: "Full of grace",
    sourceUrl: CCC_VIRGIN,
    bibleRefs: ["Lk 1:28"],
    year: 1992,
  }),
  art({
    id: "lk1-redemptoris",
    type: "papal",
    title: "Redemptoris Mater",
    subtitle: "St. John Paul II, 25 March 1987",
    sourceUrl: REDEMPTORIS_MATER,
    bibleRefs: ["Lk 1:26–38"],
    year: 1987,
  }),
  art({
    id: "lk1-artwork",
    type: "artwork",
    title: "The Annunciation",
    subtitle: "Fra Angelico, c. 1433–1434",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fra_Angelico_069.jpg",
    imageUrl: wiki("Fra_Angelico_069.jpg"),
    imageCredit:
      "Fra Angelico, The Annunciation, c. 1433–1434. Museo del Prado. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Lk 1:26–38"],
    year: 1434,
  }),
];

const luke15: TimelineArtifact[] = [
  art({
    id: "lk15-ccc-1439",
    type: "catechism",
    title: "CCC 1439",
    subtitle: "The prodigal son",
    sourceUrl: CCC_PENANCE,
    bibleRefs: ["Lk 15:11–32"],
    year: 1992,
  }),
  art({
    id: "lk15-dives",
    type: "papal",
    title: "Dives in Misericordia",
    subtitle: "St. John Paul II, 30 November 1980",
    sourceUrl: DIVES_IN_MISERICORDIA,
    bibleRefs: ["Lk 15"],
    year: 1980,
  }),
  art({
    id: "lk15-artwork",
    type: "artwork",
    title: "The Return of the Prodigal Son",
    subtitle: "Rembrandt, c. 1668",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_Harmensz._van_Rijn_-_The_Return_of_the_Prodigal_Son.jpg",
    imageUrl: wiki("Rembrandt_Harmensz._van_Rijn_-_The_Return_of_the_Prodigal_Son.jpg"),
    imageCredit:
      "Rembrandt, The Return of the Prodigal Son, c. 1668. The Hermitage, St. Petersburg. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Lk 15:20–24"],
    year: 1668,
  }),
];

const luke22: TimelineArtifact[] = [
  art({
    id: "lk22-ccc-610",
    type: "catechism",
    title: "CCC 610",
    subtitle: "The Last Supper",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Lk 22:19–20"],
    year: 1992,
  }),
  art({
    id: "lk22-eucharist",
    type: "papal",
    title: "Ecclesia de Eucharistia",
    subtitle: "St. John Paul II, 17 April 2003",
    sourceUrl: ECCLESIA_DE_EUCH,
    bibleRefs: ["Lk 22:19"],
    year: 2003,
  }),
  art({
    id: "lk22-artwork",
    type: "artwork",
    title: "The Last Supper",
    subtitle: "Leonardo da Vinci, 1495–1498",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg",
    imageUrl: wiki("The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg"),
    imageCredit:
      "Leonardo da Vinci, The Last Supper, Santa Maria delle Grazie, Milan, 1495–1498. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Lk 22:14–20"],
    year: 1498,
  }),
];

const luke23: TimelineArtifact[] = [
  art({
    id: "lk23-ccc-616",
    type: "catechism",
    title: "CCC 616",
    subtitle: "The unique sacrifice of the Cross",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Lk 23:33–46"],
    year: 1992,
  }),
  art({
    id: "lk23-artwork",
    type: "artwork",
    title: "The Crucifixion",
    subtitle: "Matthias Grünewald, Isenheim Altarpiece, c. 1512–1516",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mathis_Gothart_Grünewald_016.jpg",
    imageUrl: wiki("Mathis_Gothart_Grünewald_016.jpg"),
    imageCredit:
      "Matthias Grünewald, Crucifixion, Isenheim Altarpiece, c. 1512–1516. Musée Unterlinden, Colmar. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Lk 23:33–46"],
    year: 1515,
  }),
];

const john1: TimelineArtifact[] = [
  art({
    id: "jn1-ccc-241",
    type: "catechism",
    title: "CCC 241",
    subtitle: "The Word",
    shortQuote:
      "For this reason the apostles confess Jesus to be the Word: “In the beginning was the Word, and the Word was with God, and the Word was God.”",
    sourceUrl: CCC_FATHER,
    bibleRefs: ["Jn 1:1"],
    year: 1992,
  }),
  art({
    id: "jn1-dv-4",
    type: "papal",
    title: "Dei Verbum 4",
    subtitle: "Second Vatican Council — the eternal Word",
    shortQuote:
      "For He sent His Son, the eternal Word, who enlightens all men, so that He might dwell among men and tell them of the innermost being of God (see John 1:1-18).",
    sourceUrl: DEI_VERBUM,
    bibleRefs: ["Jn 1:1–18"],
    year: 1965,
  }),
  art({
    id: "jn1-verbum-domini",
    type: "papal",
    title: "Verbum Domini",
    subtitle: "Pope Benedict XVI, 30 September 2010",
    sourceUrl: VERBUM_DOMINI,
    bibleRefs: ["Jn 1:1", "Jn 1:14"],
    year: 2010,
  }),
  haydockArt("John", 1, {
    id: "jn1-haydock",
    title: "Haydock on John 1:1",
    shortQuote:
      "In the beginning was the word: or rather, the word was in the beginning. The eternal word, the uncreated wisdom, the second Person of the blessed Trinity, the only begotten Son of the Father, of the same nature and substance, and the same God, with the Father and Holy Ghost.",
    bibleRefs: ["Jn 1:1"],
  }),
  art({
    id: "jn1-artwork",
    type: "artwork",
    title: "Incipit of the Gospel of John",
    subtitle: "The Book of Kells, c. 800",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:KellsFol292rIncipJohn.jpg",
    imageUrl: wiki("KellsFol292rIncipJohn.jpg"),
    imageCredit:
      "Book of Kells, folio 292r, incipit of the Gospel of John (“In principio erat verbum”). Trinity College Dublin. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Jn 1:1"],
    year: 800,
  }),
];

const john6: TimelineArtifact[] = [
  art({
    id: "jn6-ccc-1338",
    type: "catechism",
    title: "CCC 1338",
    subtitle: "The multiplication of the loaves",
    sourceUrl: CCC_EUCHARIST,
    bibleRefs: ["Jn 6:1–15"],
    year: 1992,
  }),
  art({
    id: "jn6-ccc-1374",
    type: "catechism",
    title: "CCC 1374",
    subtitle: "The Real Presence",
    sourceUrl: CCC_EUCHARIST,
    bibleRefs: ["Jn 6:51–58"],
    year: 1992,
  }),
  art({
    id: "jn6-sacramentum",
    type: "papal",
    title: "Sacramentum Caritatis",
    subtitle: "Pope Benedict XVI, 22 February 2007",
    sourceUrl: SACRAMENTUM_CARITATIS,
    bibleRefs: ["Jn 6"],
    year: 2007,
  }),
  art({
    id: "jn6-ecclesia",
    type: "papal",
    title: "Ecclesia de Eucharistia",
    subtitle: "St. John Paul II, 17 April 2003",
    sourceUrl: ECCLESIA_DE_EUCH,
    bibleRefs: ["Jn 6:53–56"],
    year: 2003,
  }),
];

const john19: TimelineArtifact[] = [
  art({
    id: "jn19-ccc-607",
    type: "catechism",
    title: "CCC 607",
    subtitle: "The desire of Jesus for the Cross",
    sourceUrl: CCC_PASSION,
    bibleRefs: ["Jn 19:17–30"],
    year: 1992,
  }),
  art({
    id: "jn19-ccc-726",
    type: "catechism",
    title: "CCC 726",
    subtitle: "“Woman, behold, your son”",
    sourceUrl: CCC_SPIRIT_FULLNESS,
    bibleRefs: ["Jn 19:25–27"],
    year: 1992,
  }),
];

const john20: TimelineArtifact[] = [
  art({
    id: "jn20-ccc-640",
    type: "catechism",
    title: "CCC 640",
    subtitle: "The empty tomb",
    sourceUrl: CCC_RESURRECTION,
    bibleRefs: ["Jn 20:1–10"],
    year: 1992,
  }),
  art({
    id: "jn20-ccc-448",
    type: "catechism",
    title: "CCC 448",
    subtitle: "“My Lord and my God!”",
    sourceUrl: CCC_TRUE_GOD,
    bibleRefs: ["Jn 20:28"],
    year: 1992,
  }),
];

const acts2: TimelineArtifact[] = [
  art({
    id: "acts2-ccc-731",
    type: "catechism",
    title: "CCC 731",
    subtitle: "On the day of Pentecost",
    sourceUrl: CCC_SPIRIT_LAST,
    bibleRefs: ["Acts 2:1–4"],
    year: 1992,
  }),
  art({
    id: "acts2-ccc-767",
    type: "catechism",
    title: "CCC 767",
    subtitle: "The Spirit sent on the day of Pentecost",
    sourceUrl: CCC_CHURCH_PLAN,
    bibleRefs: ["Acts 2"],
    year: 1992,
  }),
  art({
    id: "acts2-dominum",
    type: "papal",
    title: "Dominum et Vivificantem",
    subtitle: "St. John Paul II, 18 May 1986",
    sourceUrl: DOMINUM_ET_VIV,
    bibleRefs: ["Acts 2"],
    year: 1986,
  }),
  art({
    id: "acts2-artwork",
    type: "artwork",
    title: "Pentecost",
    subtitle: "El Greco, c. 1596–1600",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:El_Greco_006.jpg",
    imageUrl: wiki("El_Greco_006.jpg"),
    imageCredit:
      "El Greco, Pentecost, c. 1596–1600, Museo del Prado. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Acts 2:1–4"],
    year: 1596,
  }),
];

const romans1: TimelineArtifact[] = [
  art({
    id: "rom1-ccc-32",
    type: "catechism",
    title: "CCC 32",
    subtitle: "God known through created things",
    sourceUrl: CCC_KNOW_GOD,
    bibleRefs: ["Rom 1:19–20"],
    year: 1992,
  }),
];

const romans5: TimelineArtifact[] = [
  art({
    id: "rom5-ccc-402",
    type: "catechism",
    title: "CCC 402",
    subtitle: "All die in Adam",
    sourceUrl: CCC_FALL,
    bibleRefs: ["Rom 5:12–21"],
    year: 1992,
  }),
  art({
    id: "rom5-ccc-1992",
    type: "catechism",
    title: "CCC 1992",
    subtitle: "Justification",
    sourceUrl: CCC_JUSTIFICATION,
    bibleRefs: ["Rom 5:1–11"],
    year: 1992,
  }),
];

const romans8: TimelineArtifact[] = [
  art({
    id: "rom8-ccc-2630",
    type: "catechism",
    title: "CCC 2630",
    subtitle: "The Spirit helps us in our weakness",
    sourceUrl: CCC_PETITION,
    bibleRefs: ["Rom 8:26"],
    year: 1992,
  }),
];

const cor13: TimelineArtifact[] = [
  art({
    id: "1cor13-ccc-1826",
    type: "catechism",
    title: "CCC 1826",
    subtitle: "If I have not charity",
    sourceUrl: CCC_VIRTUES,
    bibleRefs: ["1 Cor 13:1–13"],
    year: 1992,
  }),
  art({
    id: "1cor13-dce",
    type: "papal",
    title: "Deus Caritas Est",
    subtitle: "Pope Benedict XVI, 25 December 2005",
    sourceUrl: DEUS_CARITAS,
    bibleRefs: ["1 Cor 13"],
    year: 2005,
  }),
];

const cor15: TimelineArtifact[] = [
  art({
    id: "1cor15-ccc-655",
    type: "catechism",
    title: "CCC 655",
    subtitle: "Christ’s Resurrection, source of ours",
    sourceUrl: CCC_RESURRECTION,
    bibleRefs: ["1 Cor 15:20–28"],
    year: 1992,
  }),
  art({
    id: "1cor15-ccc-988",
    type: "catechism",
    title: "CCC 988",
    subtitle: "The resurrection of the body",
    sourceUrl: CCC_BODY,
    bibleRefs: ["1 Cor 15"],
    year: 1992,
  }),
];

const heb1: TimelineArtifact[] = [
  art({
    id: "heb1-ccc-65",
    type: "catechism",
    title: "CCC 65",
    subtitle: "God has spoken by a Son",
    sourceUrl: CCC_FULLNESS,
    bibleRefs: ["Heb 1:1–2"],
    year: 1992,
  }),
];

const heb11: TimelineArtifact[] = [
  art({
    id: "heb11-ccc-147",
    type: "catechism",
    title: "CCC 147",
    subtitle: "The Old Testament is filled with witnesses of faith",
    sourceUrl: CCC_FAITH,
    bibleRefs: ["Heb 11"],
    year: 1992,
  }),
];

const rev1: TimelineArtifact[] = [
  art({
    id: "rv1-ccc-2642",
    type: "catechism",
    title: "CCC 2642",
    subtitle: "The songs of the heavenly liturgy",
    sourceUrl: CCC_PRAISE,
    bibleRefs: ["Rev 1"],
    year: 1992,
  }),
];

const revelation21: TimelineArtifact[] = [
  art({
    id: "rv21-ccc-1044",
    type: "catechism",
    title: "CCC 1044",
    subtitle: "The heavenly Jerusalem",
    shortQuote:
      "In this new universe, the heavenly Jerusalem, God will have his dwelling among men. “He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning nor crying nor pain any more, for the former things have passed away.”",
    sourceUrl: CCC_NEW_EARTH,
    bibleRefs: ["Rev 21:1–4"],
    year: 1992,
  }),
  art({
    id: "rv21-ccc-1042",
    type: "catechism",
    title: "CCC 1042",
    subtitle: "Hope of the new heaven and the new earth",
    shortQuote:
      "At the end of time, the Kingdom of God will come in its fullness. After the universal judgment, the righteous will reign for ever with Christ, glorified in body and soul. The universe itself will be renewed.",
    sourceUrl: CCC_NEW_EARTH,
    bibleRefs: ["Rev 21:1"],
    year: 1992,
  }),
  art({
    id: "rv21-spe-salvi",
    type: "papal",
    title: "Spe Salvi 12",
    subtitle: "Pope Benedict XVI, 30 November 2007",
    sourceUrl: SPE_SALVI,
    bibleRefs: ["Rev 21:2–4"],
    year: 2007,
  }),
  haydockArt("Revelation", 21, {
    id: "rv21-haydock",
    title: "Haydock on Apocalypse 21",
    bibleRefs: ["Rev 21"],
  }),
  art({
    id: "rv21-artwork",
    type: "artwork",
    title: "The Adoration of the Mystic Lamb",
    subtitle: "Jan van Eyck, Ghent Altarpiece, 1432",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lamgods_open.jpg",
    imageUrl: wiki("Lamgods_open.jpg"),
    imageCredit:
      "Hubert and Jan van Eyck, Ghent Altarpiece (open), Saint Bavo Cathedral, 1432. Public domain, via Wikimedia Commons.",
    bibleRefs: ["Rev 21", "Rev 5:6"],
    year: 1432,
  }),
];

const rev22: TimelineArtifact[] = [
  art({
    id: "rv22-ccc-1060",
    type: "catechism",
    title: "CCC 1060",
    subtitle: "“Come, Lord Jesus!”",
    sourceUrl: CCC_NEW_EARTH,
    bibleRefs: ["Rev 22:20"],
    year: 1992,
  }),
];

type BookSeed = [name: string, abbreviation: string, slug: string, chapters: number];

const OT: BookSeed[] = [
  ["Genesis", "Gn", "genesis", 50],
  ["Exodus", "Ex", "exodus", 40],
  ["Leviticus", "Lv", "leviticus", 27],
  ["Numbers", "Nm", "numbers", 36],
  ["Deuteronomy", "Dt", "deuteronomy", 34],
  ["Joshua", "Jos", "joshua", 24],
  ["Judges", "Jgs", "judges", 21],
  ["Ruth", "Ru", "ruth", 4],
  ["1 Samuel", "1 Sm", "1samuel", 31],
  ["2 Samuel", "2 Sm", "2samuel", 24],
  ["1 Kings", "1 Kgs", "1kings", 22],
  ["2 Kings", "2 Kgs", "2kings", 25],
  ["1 Chronicles", "1 Chr", "1chronicles", 29],
  ["2 Chronicles", "2 Chr", "2chronicles", 36],
  ["Ezra", "Ezr", "ezra", 10],
  ["Nehemiah", "Neh", "nehemiah", 13],
  ["Tobit", "Tb", "tobit", 14],
  ["Judith", "Jdt", "judith", 16],
  ["Esther", "Est", "esther", 10],
  ["1 Maccabees", "1 Mc", "1maccabees", 16],
  ["2 Maccabees", "2 Mc", "2maccabees", 15],
  ["Job", "Jb", "job", 42],
  ["Psalms", "Ps", "psalms", 150],
  ["Proverbs", "Prv", "proverbs", 31],
  ["Ecclesiastes", "Eccl", "ecclesiastes", 12],
  ["Song of Songs", "Sg", "songofsongs", 8],
  ["Wisdom", "Wis", "wisdom", 19],
  ["Sirach", "Sir", "sirach", 51],
  ["Isaiah", "Is", "isaiah", 66],
  ["Jeremiah", "Jer", "jeremiah", 52],
  ["Lamentations", "Lam", "lamentations", 5],
  ["Baruch", "Bar", "baruch", 6],
  ["Ezekiel", "Ez", "ezekiel", 48],
  ["Daniel", "Dn", "daniel", 14],
  ["Hosea", "Hos", "hosea", 14],
  ["Joel", "Jl", "joel", 4],
  ["Amos", "Am", "amos", 9],
  ["Obadiah", "Ob", "obadiah", 1],
  ["Jonah", "Jon", "jonah", 4],
  ["Micah", "Mi", "micah", 7],
  ["Nahum", "Na", "nahum", 3],
  ["Habakkuk", "Hb", "habakkuk", 3],
  ["Zephaniah", "Zep", "zephaniah", 3],
  ["Haggai", "Hg", "haggai", 2],
  ["Zechariah", "Zec", "zechariah", 14],
  ["Malachi", "Mal", "malachi", 3],
];

const NT: BookSeed[] = [
  ["Matthew", "Mt", "matthew", 28],
  ["Mark", "Mk", "mark", 16],
  ["Luke", "Lk", "luke", 24],
  ["John", "Jn", "john", 21],
  ["Acts of the Apostles", "Acts", "acts", 28],
  ["Romans", "Rom", "romans", 16],
  ["1 Corinthians", "1 Cor", "1corinthians", 16],
  ["2 Corinthians", "2 Cor", "2corinthians", 13],
  ["Galatians", "Gal", "galatians", 6],
  ["Ephesians", "Eph", "ephesians", 6],
  ["Philippians", "Phil", "philippians", 4],
  ["Colossians", "Col", "colossians", 4],
  ["1 Thessalonians", "1 Thes", "1thessalonians", 5],
  ["2 Thessalonians", "2 Thes", "2thessalonians", 3],
  ["1 Timothy", "1 Tm", "1timothy", 6],
  ["2 Timothy", "2 Tm", "2timothy", 4],
  ["Titus", "Ti", "titus", 3],
  ["Philemon", "Phlm", "philemon", 1],
  ["Hebrews", "Heb", "hebrews", 13],
  ["James", "Jas", "james", 5],
  ["1 Peter", "1 Pt", "1peter", 5],
  ["2 Peter", "2 Pt", "2peter", 3],
  ["1 John", "1 Jn", "1john", 5],
  ["2 John", "2 Jn", "2john", 1],
  ["3 John", "3 Jn", "3john", 1],
  ["Jude", "Jude", "jude", 1],
  ["Revelation", "Rev", "revelation", 22],
];

const RICH: Record<string, { chapter: number; heading: string; artifacts: TimelineArtifact[] }[]> = {
  Genesis: [
    { chapter: 1, heading: "The Story of Creation", artifacts: genesis1 },
    { chapter: 2, heading: "The Garden of Eden", artifacts: genesis2 },
    { chapter: 3, heading: "The Fall of Man", artifacts: genesis3 },
    { chapter: 12, heading: "The Call of Abram", artifacts: genesis12 },
    { chapter: 15, heading: "The Covenant with Abram", artifacts: genesis15 },
    { chapter: 22, heading: "The Testing of Abraham", artifacts: genesis22 },
  ],
  Exodus: [
    { chapter: 3, heading: "The Burning Bush", artifacts: exodus3 },
    { chapter: 12, heading: "The Passover", artifacts: exodus12 },
    { chapter: 20, heading: "The Ten Commandments", artifacts: exodus20 },
  ],
  Deuteronomy: [
    { chapter: 5, heading: "The Decalogue Repeated", artifacts: deut5 },
    { chapter: 6, heading: "The Great Commandment", artifacts: deut6 },
  ],
  Psalms: [
    { chapter: 1, heading: "The Two Ways", artifacts: psalm1 },
    { chapter: 22, heading: "My God, My God", artifacts: psalm22 },
    { chapter: 23, heading: "The Lord Is My Shepherd", artifacts: psalm23 },
    { chapter: 51, heading: "The Miserere", artifacts: [] },
    { chapter: 110, heading: "Sit at My Right Hand", artifacts: psalm110 },
  ],
  Isaiah: [
    { chapter: 7, heading: "The Sign of Emmanuel", artifacts: isaiah7 },
    { chapter: 9, heading: "A Child Is Born", artifacts: isaiah9 },
    { chapter: 53, heading: "The Suffering Servant", artifacts: isaiah53 },
  ],
  Wisdom: [{ chapter: 2, heading: "The Just One", artifacts: wisdom2 }],
  Matthew: [
    { chapter: 5, heading: "The Sermon on the Mount", artifacts: matthew5 },
    { chapter: 6, heading: "The Lord’s Prayer", artifacts: matthew6 },
    { chapter: 16, heading: "Peter’s Confession", artifacts: matthew16 },
    { chapter: 28, heading: "The Great Commission", artifacts: matthew28 },
  ],
  Luke: [
    { chapter: 1, heading: "The Annunciation", artifacts: luke1 },
    { chapter: 15, heading: "The Prodigal Son", artifacts: luke15 },
    { chapter: 22, heading: "The Last Supper", artifacts: luke22 },
    { chapter: 23, heading: "The Crucifixion", artifacts: luke23 },
  ],
  John: [
    { chapter: 1, heading: "The Word Became Flesh", artifacts: john1 },
    { chapter: 6, heading: "The Bread of Life", artifacts: john6 },
    { chapter: 19, heading: "The Passion according to John", artifacts: john19 },
    { chapter: 20, heading: "The Resurrection", artifacts: john20 },
  ],
  "Acts of the Apostles": [{ chapter: 2, heading: "Pentecost", artifacts: acts2 }],
  Romans: [
    { chapter: 1, heading: "The Gospel and the Nations", artifacts: romans1 },
    { chapter: 5, heading: "Adam and Christ", artifacts: romans5 },
    { chapter: 8, heading: "Life in the Spirit", artifacts: romans8 },
  ],
  "1 Corinthians": [
    { chapter: 13, heading: "The Way of Love", artifacts: cor13 },
    { chapter: 15, heading: "The Resurrection of the Dead", artifacts: cor15 },
  ],
  Hebrews: [
    { chapter: 1, heading: "God Has Spoken by a Son", artifacts: heb1 },
    { chapter: 11, heading: "The Cloud of Witnesses", artifacts: heb11 },
  ],
  Revelation: [
    { chapter: 1, heading: "The Revelation of Jesus Christ", artifacts: rev1 },
    { chapter: 21, heading: "The New Heaven and the New Earth", artifacts: revelation21 },
    { chapter: 22, heading: "Come, Lord Jesus", artifacts: rev22 },
  ],
};

function mergeChapters(
  name: string,
  abbreviation: string,
  totalChapters: number,
): PopulatedChapter[] {
  const richList = RICH[name] ?? [];
  const richBy = new Map(richList.map((c) => [c.chapter, c]));
  const spec = HAYDOCK_SLUG[name];
  const nums = new Set<number>(richList.map((c) => c.chapter));
  if (spec) {
    const max = Math.min(spec.max, totalChapters);
    for (let n = 1; n <= max; n++) nums.add(n);
  }
  return [...nums]
    .sort((a, b) => a - b)
    .map((n) => {
      const rich = richBy.get(n);
      const artifacts = [...(rich?.artifacts ?? [])];
      const hasHaydock = artifacts.some((a) => a.type === "haydock");
      if (spec && n <= spec.max && !hasHaydock) {
        artifacts.push(haydockArt(name, n, { bibleRefs: [`${abbreviation} ${n}`] }));
      }
      return { chapter: n, heading: rich?.heading, artifacts };
    })
    .filter((c) => c.artifacts.length > 0);
}

function toBook(seed: BookSeed, testament: "OT" | "NT"): BibleBook {
  const [name, abbreviation, , chapters] = seed;
  return {
    name,
    abbreviation,
    testament,
    chapters,
    populatedChapters: mergeChapters(name, abbreviation, chapters),
  };
}

export const BIBLE_BOOKS: BibleBook[] = [
  ...OT.map((s) => toBook(s, "OT")),
  ...NT.map((s) => toBook(s, "NT")),
];

export const USCCB_SLUG: Record<string, string> = Object.fromEntries(
  [...OT, ...NT].map(([name, , slug]) => [name, slug]),
);

export function usccbChapterUrl(bookName: string, chapter: number): string {
  const slug = USCCB_SLUG[bookName];
  return `https://bible.usccb.org/bible/${slug}/${chapter}`;
}

export const POPULATED_BOOK_NAMES = new Set(
  BIBLE_BOOKS.filter((b) => b.populatedChapters.length > 0).map((b) => b.name),
);
