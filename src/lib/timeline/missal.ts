import type { MissalSection, TimelineArtifact } from "./types";
import {
  missalCalendarUrl,
  missalDayUrl,
  missalMassUrl,
  missalOrdoUrl,
  missalVotiveIndexUrl,
  missalVotiveUrl,
} from "./missal-urls.ts";
import { todayRosaryArtifact } from "./rosary.ts";

function art(partial: TimelineArtifact): TimelineArtifact {
  return partial;
}

function keep(artifacts: (TimelineArtifact | null)[]): TimelineArtifact[] {
  return artifacts.filter((a): a is TimelineArtifact => a !== null);
}

function massArt(
  id: string,
  partial: Omit<TimelineArtifact, "type" | "sourceUrl">,
): TimelineArtifact | null {
  const sourceUrl = missalMassUrl(id);
  if (!sourceUrl) return null;
  return art({
    ...partial,
    type: "proper",
    sourceUrl,
  });
}

function votiveArt(
  slug: string,
  partial: Omit<TimelineArtifact, "type" | "sourceUrl">,
): TimelineArtifact | null {
  const sourceUrl = missalVotiveUrl(slug);
  if (!sourceUrl) return null;
  return art({
    ...partial,
    type: "votive",
    sourceUrl,
  });
}

function section(
  id: MissalSection["id"],
  kind: MissalSection["kind"],
  title: string,
  artifacts: (TimelineArtifact | null)[],
  subtitle?: string,
): MissalSection {
  return { id, kind, title, subtitle, artifacts: keep(artifacts) };
}

/** Dynamic “Today” card: civil date only. Missale Meum supplies the proper. */
export function todayArtifact(now = new Date()): TimelineArtifact {
  const sourceUrl = missalDayUrl(now);
  if (!sourceUrl) {
    throw new Error("No confirmed Missale Meum calendar URL for this date");
  }
  const subtitle = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return art({
    id: "missal-today",
    type: "proper",
    title: "Today's proper",
    subtitle,
    sourceUrl,
    year: now.getFullYear(),
  });
}

function todaySection(now = new Date()): MissalSection {
  return section(
    "today",
    "today",
    "Today",
    [
      todayArtifact(now),
      todayRosaryArtifact(now),
      art({
        id: "missal-calendar",
        type: "proper",
        title: "Liturgical calendar",
        subtitle: "Browse the calendar",
        sourceUrl: missalCalendarUrl(),
      }),
    ],
    "1962 Roman Missal",
  );
}

const ORDO_SECTION = section(
  "ordo",
  "ordo",
  "Ordo Missae",
  [
    art({
      id: "missal-ordo",
      type: "ordo",
      title: "Order of Mass",
      subtitle: "Ordo Missae",
      shortQuote: "Introíbo ad altáre Dei.",
      sourceUrl: missalOrdoUrl(),
    }),
  ],
  "Order of Mass",
);

const ADVENT_SECTION = section("advent", "temporale", "Advent", [
  massArt("tempora:Adv1-0:1:v", {
    id: "missal-adv-1",
    title: "I Sunday of Advent",
    shortQuote:
      "Ad te levávi ánimam meam: Deus meus, in te confído, non erubéscam.",
  }),
  massArt("tempora:Adv3-0:1:pv", {
    id: "missal-adv-3",
    title: "III Sunday of Advent",
    shortQuote: "Gaudéte in Dómino semper: íterum dico, gaudéte.",
  }),
  massArt("tempora:Adv4-0:1:v", {
    id: "missal-adv-4",
    title: "IV Sunday of Advent",
    shortQuote: "Roráte, cœli, désuper, et nubes pluant justum.",
  }),
]);

const CHRISTMAS_SECTION = section("christmas", "temporale", "Christmas", [
  massArt("sancti:12-24:1:v", {
    id: "missal-nat-vigil",
    title: "Vigil of Christmas",
    subtitle: "24 December",
    shortQuote:
      "Hódie sciétis, quia véniet Dóminus et salvábit nos: et mane vidébitis glóriam ejus.",
  }),
  massArt("sancti:12-25m1:1:w", {
    id: "missal-nat-m1",
    title: "The Nativity of Our Lord",
    subtitle: "25 December",
    shortQuote: "Dóminus dixit ad me: Fílius meus es tu, ego hódie génui te.",
  }),
  massArt("sancti:12-25m3:1:w", {
    id: "missal-nat-m3",
    title: "The Nativity of Our Lord – Day Mass",
    subtitle: "25 December",
    shortQuote:
      "Puer natus est nobis, et fílius datus est nobis: cujus impérium super húmerum ejus.",
  }),
  massArt("sancti:01-01:1:w", {
    id: "missal-nat-octave",
    title: "Octave Day of Christmas",
    subtitle: "1 January",
    shortQuote: "Puer natus est nobis, et fílius datus est nobis.",
  }),
  massArt("sancti:01-06:1:w", {
    id: "missal-epiphany",
    title: "Epiphany of the Lord",
    subtitle: "6 January",
    shortQuote:
      "Ecce, advénit dominátor Dóminus: et regnum in manu ejus et potéstas et impérium.",
  }),
  massArt("tempora:Epi1-0:2:w", {
    id: "missal-holy-family",
    title: "The Holy Family: Jesus, Mary & Joseph",
    shortQuote:
      "Exsúltet gáudio pater Justi, gáudeat Pater tuus et Mater tua, et exsúltet quæ génuit te.",
  }),
]);

const LENT_SECTION = section("lent", "temporale", "Lent", [
  massArt("tempora:Quadp3-3:1:v", {
    id: "missal-ash-wednesday",
    title: "Ash Wednesday",
    shortQuote: "Miseréris ómnium, Dómine, et nihil odísti eórum quæ fecísti.",
  }),
  massArt("tempora:Quad1-0:1:v", {
    id: "missal-lent-1",
    title: "I Sunday of Lent",
    shortQuote: "Invocábit me, et ego exáudiam eum: erípiam eum, et glorificábo eum.",
  }),
  massArt("tempora:Quad5-0:1:v", {
    id: "missal-passion-sunday",
    title: "Passion Sunday",
    shortQuote: "Júdica me, Deus, et discérne causam meam de gente non sancta.",
  }),
  massArt("tempora:Quad6-0r:1:rv", {
    id: "missal-palm-sunday",
    title: "Palm Sunday",
    shortQuote: "Dómine, ne longe fácias auxílium tuum a me, ad defensiónem meam áspice.",
  }),
  massArt("tempora:Quad6-4r:1:w", {
    id: "missal-holy-thursday",
    title: "Holy Thursday",
    shortQuote:
      "Nos autem gloriári opórtet in Cruce Dómini nostri Jesu Christi.",
  }),
  massArt("tempora:Quad6-5r:1:bv", {
    id: "missal-good-friday",
    title: "Good Friday",
  }),
  massArt("tempora:Quad6-6r:1:vw", {
    id: "missal-holy-saturday",
    title: "Holy Saturday",
  }),
]);

const EASTER_SECTION = section("easter", "temporale", "Easter", [
  massArt("tempora:Pasc0-0:1:w", {
    id: "missal-easter",
    title: "Easter Sunday",
    shortQuote: "Resurréxi, et adhuc tecum sum, allelúja.",
  }),
  massArt("tempora:Pasc5-4:1:w", {
    id: "missal-ascension",
    title: "Ascension of the Lord",
    shortQuote: "Viri Galilǽi, quid admirámini aspiciéntes in cœlum? allelúja:",
  }),
  massArt("tempora:Pasc7-0:1:r", {
    id: "missal-pentecost",
    title: "Pentecost Sunday",
    shortQuote: "Spíritus Dómini replévit orbem terrárum, allelúja.",
  }),
]);

const AFTER_PENTECOST_SECTION = section(
  "after-pentecost",
  "temporale",
  "After Pentecost",
  [
    massArt("tempora:Pent01-0r:1:w", {
      id: "missal-trinity",
      title: "Trinity Sunday",
      shortQuote:
        "Benedícta sit sancta Trínitas atque indivísa Unitas: confitébimur ei, quia fecit nobíscum misericórdiam suam.",
    }),
    massArt("tempora:Pent01-4:1:w", {
      id: "missal-corpus-christi",
      title: "Corpus Christi",
      shortQuote: "Cibávit eos ex ádipe fruménti, allelúja.",
    }),
    massArt("tempora:Pent02-5:1:w", {
      id: "missal-sacred-heart",
      title: "Sacred Heart of Jesus",
      shortQuote: "Cogitatiónes Cordis ejus in generatióne et generatiónem.",
    }),
    massArt("sancti:10-DU:1:w", {
      id: "missal-christ-the-king",
      title: "Christ the King",
      shortQuote:
        "Dignus est Agnus, qui occísus est, accípere virtútem, et divinitátem.",
    }),
  ],
);

const SANCTORALE_SECTION = section("sanctorale", "sanctorale", "Sanctorale", [
  massArt("sancti:02-02:2:w", {
    id: "missal-purification",
    title: "Purification of the Blessed Virgin Mary",
    subtitle: "2 February",
    shortQuote:
      "Suscépimus, Deus, misericórdiam tuam in médio templi tui.",
  }),
  massArt("sancti:02-22:2:w", {
    id: "missal-chair-peter",
    title: "Chair of St. Peter",
    subtitle: "22 February",
    shortQuote: "Státuit ei Dóminus testaméntum pacis, et príncipem fecit eum.",
  }),
  massArt("sancti:03-19:1:w", {
    id: "missal-joseph",
    title: "St. Joseph, Spouse of the Bl. Virgin Mary",
    subtitle: "19 March",
    shortQuote: "Justus ut palma florébit: sicut cedrus Líbani multiplicábitur.",
  }),
  massArt("sancti:03-25:1:w", {
    id: "missal-annunciation",
    title: "Annunciation of the Blessed Virgin Mary",
    subtitle: "25 March",
    shortQuote: "Vultum tuum deprecabúntur omnes dívites plebis.",
  }),
  massArt("sancti:06-24:1:w", {
    id: "missal-john-baptist",
    title: "Nativity of St. John the Baptist",
    subtitle: "24 June",
    shortQuote: "De ventre matris meæ vocávit me Dóminus in nómine meo.",
  }),
  massArt("sancti:06-29:1:r", {
    id: "missal-peter-paul",
    title: "Sts. Peter & Paul",
    subtitle: "29 June",
    shortQuote: "Nunc scio vere, quia misit Dóminus Angelum suum.",
  }),
  massArt("sancti:08-15:1:w", {
    id: "missal-assumption",
    title: "Assumption of the Blessed Virgin Mary",
    subtitle: "15 August",
    shortQuote: "Signum magnum appáruit in cœlo: múlier amicta sole.",
  }),
  massArt("sancti:09-14:2:r", {
    id: "missal-holy-cross",
    title: "Exaltation of the Holy Cross",
    subtitle: "14 September",
    shortQuote:
      "Nos autem gloriári opórtet in Cruce Dómini nostri Jesu Christi.",
  }),
  massArt("sancti:09-29:1:w", {
    id: "missal-michael",
    title: "Dedication of St. Michael the Archangel",
    subtitle: "29 September",
    shortQuote: "Benedícite Dóminum, omnes Angeli ejus: poténtes virtúte.",
  }),
  massArt("sancti:11-01:1:w", {
    id: "missal-all-saints",
    title: "All Saints",
    subtitle: "1 November",
    shortQuote: "Gaudeámus omnes in Dómino, diem festum celebrántes sub honóre Sanctórum ómnium.",
  }),
  massArt("sancti:11-02m1:1:b", {
    id: "missal-all-souls",
    title: "Commemoration of All Souls",
    subtitle: "2 November",
    shortQuote: "Réquiem ætérnam dona eis, Dómine: et lux perpétua lúceat eis.",
  }),
  massArt("sancti:12-08:1:w", {
    id: "missal-immaculate-conception",
    title: "Immaculate Conception of the Blessed Virgin Mary",
    subtitle: "8 December",
    shortQuote: "Gaudens gaudébo in Dómino, et exsultábit ánima mea in Deo meo.",
  }),
]);

const COMMONS_SECTION = section("commons", "common", "Commons", [
  massArt("commune:C4b:0:w", {
    id: "missal-common-popes",
    title: "Mass of One or More Popes – Si Diligis",
    shortQuote: "Si díligis me, Simon Petre, pasce agnos meos, pasce oves meas.",
  }),
  massArt("commune:C2:0:r", {
    id: "missal-common-martyr-bishop",
    title: "I Mass of a Martyr Bishop – Statuit",
    shortQuote: "Státuit ei Dóminus testaméntum pacis, et príncipem fecit eum.",
  }),
  massArt("commune:C3:0:r", {
    id: "missal-common-martyrs",
    title: "I Mass of Several Martyrs – Intret",
    shortQuote: "Intret in conspéctu tuo, Dómine, gémitus compeditórum.",
  }),
  massArt("commune:C4:0:w", {
    id: "missal-common-confessor-bishop",
    title: "I Mass of a Confessor Bishop – Statuit",
    shortQuote: "Státuit ei Dóminus testaméntum pacis, et príncipem fecit eum.",
  }),
  massArt("commune:C5:0:w", {
    id: "missal-common-confessor",
    title: "I Mass of a Confessor not a Bishop – Os Iusti",
    shortQuote: "Os justi meditábitur sapiéntiam, et lingua ejus loquétur judícium.",
  }),
  massArt("commune:C6a:0:w", {
    id: "missal-common-virgin",
    title: "I Mass of a Virgin – Dilexisti",
    shortQuote: "Dilexísti justítiam, et odísti iniquitátem.",
  }),
  massArt("commune:C7a:0:w", {
    id: "missal-common-woman",
    title: "Mass of a Woman – Cognovi",
    shortQuote: "Cognóvi, Dómine, quia ǽquitas judícia tua.",
  }),
]);

const VOTIVE_SECTION = section("votives", "votive", "Votive Masses", [
  art({
    id: "missal-votive-index",
    type: "votive",
    title: "Votive Masses",
    subtitle: "Index",
    sourceUrl: missalVotiveIndexUrl(),
  }),
  votiveArt("rorate", {
    id: "missal-votive-rorate",
    title: "I Mass of the B. V. M. – Rorate",
    subtitle: "Advent",
    shortQuote:
      "Roráte, coeli, désuper, et nubes pluant justum: aperiátur terra, et gérminet Salvatórem",
  }),
  votiveArt("vultum-tuum", {
    id: "missal-votive-vultum-tuum",
    title: "II Mass of the B. V. M. – Vultum Tuum",
    subtitle: "From Nativity until Purification",
    shortQuote: "Vultum tuum deprecabúntur omnes dívites plebis",
  }),
  votiveArt("salve-sancta-parens-3", {
    id: "missal-votive-salve-3",
    title: "III Mass of the B. V. M. – Salve, Sancta Parens",
    subtitle: "From Feb 3 until Holy Wednesday",
    shortQuote:
      "Salve, sancta parens, eníxa puérpera Regem: qui cælum terrámque regit in sǽcula sæculórum.",
  }),
  votiveArt("salve-sancta-parens-4", {
    id: "missal-votive-salve-4",
    title: "IV Mass of the B. V. M. – Salve, Sancta Parens",
    subtitle: "Eastertide",
    shortQuote:
      "Salve, sancta parens, eníxa puérpera Regem: qui cælum terrámque regit in sǽcula sæculórum.",
  }),
  votiveArt("salve-sancta-parens-5", {
    id: "missal-votive-salve-5",
    title: "V Mass of the B. V. M. – Salve, Sancta Parens",
    subtitle: "From Trinity Sunday until Advent",
    shortQuote:
      "Salve, sancta parens, eníxa puérpera Regem: qui cælum terrámque regit in sǽcula sæculórum.",
  }),
  votiveArt("trinitas", {
    id: "missal-votive-trinitas",
    title: "Most Holy Trinity",
    subtitle: "Votive, Monday",
    shortQuote:
      "Benedícta sit sancta Trínitas atque indivísa Unitas: confitébimur ei, quia fecit nobíscum misericórdiam suam.",
  }),
  votiveArt("angelis", {
    id: "missal-votive-angelis",
    title: "Holy Angels",
    subtitle: "Votive, Tuesday",
    shortQuote: "Benedícite Dóminum, omnes Ángeli ejus: poténtes virtúte.",
  }),
  votiveArt("joseph", {
    id: "missal-votive-joseph",
    title: "St. Joseph",
    subtitle: "Votive, Wednesday",
    shortQuote: "Adjútor, et protéctor noster est Dóminus",
  }),
  votiveArt("aeterno-sacerdote", {
    id: "missal-votive-aeterno-sacerdote",
    title: "Our Lord Jesus Christ, Supreme and Eternal Priest",
    subtitle: "Votive, Thursday",
    shortQuote:
      "Jurávit Dóminus, et non pœnitébit eum: Tu es sacérdos in ætérnum secúndum órdinem Melchísedech.",
  }),
  votiveArt("cordis-jesu", {
    id: "missal-votive-cordis-jesu",
    title: "Sacred Heart of Jesus",
    subtitle: "Votive, Friday",
    shortQuote: "Cogitatiónes Cordis ejus in generatióne et generatiónem",
  }),
  votiveArt("cordis-mariae", {
    id: "missal-votive-cordis-mariae",
    title: "Immaculate Heart of Mary",
    subtitle: "Votive, First Saturday",
    shortQuote: "Adeámus cum fidúcia ad thronum grátiæ, ut misericórdiam consequámur.",
  }),
  votiveArt("ad-vocationes", {
    id: "missal-votive-ad-vocationes",
    title: "Ad Vocationes",
    subtitle: "For vocations",
    shortQuote:
      "Dominus secus mare Galilǽæ vidit duos fratres, Petrum et Andream, et vocávit eos.",
  }),
  votiveArt("tempore-mortalitatis", {
    id: "missal-votive-tempore-mortalitatis",
    title: "Tempore Mortalitatis",
    subtitle: "For the deliverance from death in time of pestilence",
    shortQuote: "Recordáre, Dómine, testaménti tui, et dic Ángelo percutiénti:",
  }),
]);

export function missalSections(now = new Date()): MissalSection[] {
  return [
    todaySection(now),
    ORDO_SECTION,
    ADVENT_SECTION,
    CHRISTMAS_SECTION,
    LENT_SECTION,
    EASTER_SECTION,
    AFTER_PENTECOST_SECTION,
    SANCTORALE_SECTION,
    COMMONS_SECTION,
    VOTIVE_SECTION,
  ];
}

export function missalJumpItems(now = new Date()): { id: string; label: string }[] {
  return missalSections(now).map((section) => ({
    id: section.id,
    label: section.title,
  }));
}

/** Catalog snapshot; Today is rebuilt on each `missalSections()` call. */
export const MISSAL_SECTIONS: MissalSection[] = missalSections();
