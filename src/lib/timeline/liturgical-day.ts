import { missalDayUrl } from "./missal-urls.ts";
import {
  ROSARY_MYSTERY_LABEL,
  rosaryMysteryForDate,
} from "./rosary.ts";

export type LiturgicalColor =
  | "white"
  | "red"
  | "green"
  | "violet"
  | "rose"
  | "black"
  | "gold";

export type LiturgicalRank = 1 | 2 | 3 | 4;

export interface LiturgicalOffice {
  title: string;
  color: LiturgicalColor;
  rank: LiturgicalRank;
}

export interface LiturgicalDay {
  date: Date;
  weekday: string;
  dateLabel: string;
  compactDate: string;
  season: string;
  seasonWeek?: string;
  title: string;
  color: LiturgicalColor;
  colorLabel: string;
  rank: LiturgicalRank;
  rankLabel: string;
  rosary: string;
  notes: string[];
  missalUrl: string;
}

export const COLOR_LABEL: Record<LiturgicalColor, string> = {
  white: "White",
  red: "Red",
  green: "Green",
  violet: "Violet",
  rose: "Rose",
  black: "Black",
  gold: "Gold",
};

const RANK_LABEL: Record<LiturgicalRank, string> = {
  1: "I class",
  2: "II class",
  3: "III class",
  4: "Feria",
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function office(
  title: string,
  color: LiturgicalColor,
  rank: LiturgicalRank,
): LiturgicalOffice {
  return { title, color, rank };
}

function atLocal(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000,
  );
}

function ymdKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}

function isoKey(date: Date): string {
  const y = date.getFullYear();
  return `${y}-${ymdKey(date)}`;
}

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** Gregorian Easter (Anonymous / Meeus–Jones–Butcher). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return atLocal(year, month, day);
}

/** First Sunday of Advent: four Sundays before Christmas. */
export function adventSunday(year: number): Date {
  const christmas = atLocal(year, 12, 25);
  const dow = christmas.getDay();
  const advent4 = dow === 0 ? addDays(christmas, -7) : addDays(christmas, -dow);
  return addDays(advent4, -21);
}

function lastSundayOfOctober(year: number): Date {
  const last = atLocal(year, 10, 31);
  return addDays(last, -last.getDay());
}

/**
 * 1962 Roman Missal sanctoral — I–III class feasts commonly shown in a
 * daily ordo. Feriae fill any date not listed.
 */
const SANCTORAL: Record<string, LiturgicalOffice> = {
  "01-01": office("Octave of the Nativity", "white", 2),
  "01-05": office("Vigil of the Epiphany", "white", 2),
  "01-06": office("Epiphany of Our Lord", "white", 1),
  "01-13": office("Baptism of Our Lord", "white", 2),
  "01-17": office("St. Anthony, Abbot", "white", 3),
  "01-21": office("St. Agnes, Virgin and Martyr", "red", 3),
  "01-25": office("Conversion of St. Paul", "white", 3),
  "01-26": office("St. Polycarp, Bishop and Martyr", "red", 3),
  "01-31": office("St. John Bosco, Confessor", "white", 3),
  "02-02": office("Purification of the Blessed Virgin Mary", "white", 2),
  "02-03": office("St. Blaise, Bishop and Martyr", "red", 3),
  "02-05": office("St. Agatha, Virgin and Martyr", "red", 3),
  "02-11": office("Our Lady of Lourdes", "white", 3),
  "02-14": office("St. Valentine, Priest and Martyr", "red", 3),
  "02-22": office("Chair of St. Peter", "white", 2),
  "02-24": office("St. Matthias, Apostle", "red", 2),
  "03-07": office("St. Thomas Aquinas, Confessor and Doctor", "white", 3),
  "03-12": office("St. Gregory the Great, Pope and Doctor", "white", 3),
  "03-17": office("St. Patrick, Bishop and Confessor", "white", 3),
  "03-19": office("St. Joseph, Spouse of the Blessed Virgin Mary", "white", 1),
  "03-21": office("St. Benedict, Abbot", "white", 3),
  "03-25": office("Annunciation of the Blessed Virgin Mary", "white", 1),
  "04-11": office("St. Leo the Great, Pope and Doctor", "white", 3),
  "04-23": office("St. George, Martyr", "red", 3),
  "04-25": office("St. Mark, Evangelist", "red", 2),
  "04-30": office("St. Catherine of Siena, Virgin", "white", 3),
  "05-01": office("St. Joseph the Worker", "white", 1),
  "05-02": office("St. Athanasius, Bishop and Doctor", "white", 3),
  "05-03": office("Finding of the Holy Cross", "red", 2),
  "05-11": office("Ss. Philip and James, Apostles", "red", 2),
  "05-24": office("Our Lady Help of Christians", "white", 3),
  "05-26": office("St. Philip Neri, Confessor", "white", 3),
  "05-27": office("St. Bede the Venerable, Confessor and Doctor", "white", 3),
  "05-31": office("Queenship of the Blessed Virgin Mary", "white", 2),
  "06-13": office("St. Anthony of Padua, Confessor and Doctor", "white", 3),
  "06-21": office("St. Aloysius Gonzaga, Confessor", "white", 3),
  "06-24": office("Nativity of St. John the Baptist", "white", 1),
  "06-29": office("Ss. Peter and Paul, Apostles", "red", 1),
  "06-30": office("Commemoration of St. Paul, Apostle", "red", 3),
  "07-01": office("The Most Precious Blood of Our Lord", "red", 1),
  "07-02": office("Visitation of the Blessed Virgin Mary", "white", 2),
  "07-16": office("Our Lady of Mount Carmel", "white", 3),
  "07-22": office("St. Mary Magdalene, Penitent", "white", 3),
  "07-25": office("St. James, Apostle", "red", 2),
  "07-26": office("St. Anne, Mother of the Blessed Virgin Mary", "white", 2),
  "07-29": office("St. Martha, Virgin", "white", 3),
  "07-31": office("St. Ignatius of Loyola, Confessor", "white", 3),
  "08-04": office("St. Dominic, Confessor", "white", 3),
  "08-05": office("Dedication of Our Lady of the Snows", "white", 3),
  "08-06": office("Transfiguration of Our Lord", "white", 2),
  "08-08": office("St. John Vianney, Confessor", "white", 3),
  "08-10": office("St. Lawrence, Deacon and Martyr", "red", 2),
  "08-12": office("St. Clare, Virgin", "white", 3),
  "08-15": office("Assumption of the Blessed Virgin Mary", "white", 1),
  "08-16": office("St. Joachim, Father of the Blessed Virgin Mary", "white", 2),
  "08-20": office("St. Bernard, Abbot and Doctor", "white", 3),
  "08-22": office("Immaculate Heart of the Blessed Virgin Mary", "white", 2),
  "08-24": office("St. Bartholomew, Apostle", "red", 2),
  "08-25": office("St. Louis, King and Confessor", "white", 3),
  "08-28": office("St. Augustine, Bishop, Confessor, and Doctor", "white", 3),
  "08-29": office("Beheading of St. John the Baptist", "red", 3),
  "09-03": office("St. Pius X, Pope and Confessor", "white", 3),
  "09-08": office("Nativity of the Blessed Virgin Mary", "white", 2),
  "09-12": office("The Most Holy Name of Mary", "white", 3),
  "09-14": office("Exaltation of the Holy Cross", "red", 2),
  "09-15": office("Seven Sorrows of the Blessed Virgin Mary", "white", 2),
  "09-21": office("St. Matthew, Apostle and Evangelist", "red", 2),
  "09-29": office("Dedication of St. Michael the Archangel", "white", 1),
  "09-30": office("St. Jerome, Priest, Confessor, and Doctor", "white", 3),
  "10-02": office("The Holy Guardian Angels", "white", 3),
  "10-03": office("St. Thérèse of the Child Jesus, Virgin", "white", 3),
  "10-04": office("St. Francis of Assisi, Confessor", "white", 3),
  "10-07": office("Our Lady of the Rosary", "white", 2),
  "10-11": office("Maternity of the Blessed Virgin Mary", "white", 2),
  "10-15": office("St. Teresa of Jesus, Virgin and Doctor", "white", 3),
  "10-18": office("St. Luke, Evangelist", "red", 2),
  "10-24": office("St. Raphael the Archangel", "white", 3),
  "10-28": office("Ss. Simon and Jude, Apostles", "red", 2),
  "11-01": office("All Saints", "white", 1),
  "11-02": office("All Souls", "black", 1),
  "11-09": office("Dedication of the Archbasilica of Our Saviour", "white", 2),
  "11-11": office("St. Martin of Tours, Bishop and Confessor", "white", 3),
  "11-13": office("St. Didacus, Confessor", "white", 3),
  "11-21": office("Presentation of the Blessed Virgin Mary", "white", 3),
  "11-22": office("St. Cecilia, Virgin and Martyr", "red", 3),
  "11-23": office("St. Clement I, Pope and Martyr", "red", 3),
  "11-24": office("St. John of the Cross, Confessor and Doctor", "white", 3),
  "11-30": office("St. Andrew, Apostle", "red", 2),
  "12-03": office("St. Francis Xavier, Confessor", "white", 3),
  "12-06": office("St. Nicholas, Bishop and Confessor", "white", 3),
  "12-07": office("St. Ambrose, Bishop, Confessor, and Doctor", "white", 3),
  "12-08": office("Immaculate Conception of the Blessed Virgin Mary", "white", 1),
  "12-13": office("St. Lucy, Virgin and Martyr", "red", 3),
  "12-21": office("St. Thomas, Apostle", "red", 2),
  "12-24": office("Vigil of the Nativity", "violet", 1),
  "12-25": office("The Nativity of Our Lord", "white", 1),
  "12-26": office("St. Stephen, Protomartyr", "red", 2),
  "12-27": office("St. John, Apostle and Evangelist", "white", 2),
  "12-28": office("The Holy Innocents, Martyrs", "red", 2),
  "12-29": office("St. Thomas of Canterbury, Bishop and Martyr", "red", 3),
  "12-31": office("St. Sylvester I, Pope and Confessor", "white", 3),
};

function takesPrecedence(next: LiturgicalOffice, current: LiturgicalOffice): boolean {
  return next.rank < current.rank;
}

function sundayAfterPentecostTitle(n: number): string {
  if (n === 1) return "Trinity Sunday";
  return `${ordinal(n)} Sunday after Pentecost`;
}

function temporalFeria(
  date: Date,
  season: string,
  color: LiturgicalColor,
): LiturgicalOffice {
  const weekday = WEEKDAYS[date.getDay()] ?? "Feria";
  if (date.getDay() === 0) {
    return office(season, color, 2);
  }
  return office(`${weekday} of ${season}`, color, 4);
}

interface SeasonInfo {
  name: string;
  week?: string;
  color: LiturgicalColor;
  sundayRank: LiturgicalRank;
  sundayTitle?: string;
}

function seasonInfo(date: Date): SeasonInfo {
  const year = date.getFullYear();
  const easter = easterSunday(year);
  const advent = adventSunday(year);
  const nextAdvent = adventSunday(year + 1);
  const septuagesima = addDays(easter, -63);
  const ashWednesday = addDays(easter, -46);
  const passionSunday = addDays(easter, -14);
  const palmSunday = addDays(easter, -7);
  const pentecost = addDays(easter, 49);
  const epiphany = atLocal(year, 1, 6);
  const christmas = atLocal(year, 12, 25);

  if (diffDays(date, christmas) >= 0 || (date.getMonth() === 0 && date.getDate() <= 5)) {
    if (date.getMonth() === 11 && date.getDate() >= 25) {
      return { name: "Christmastide", week: "Octave of Christmas", color: "white", sundayRank: 2 };
    }
    if (date.getMonth() === 0 && date.getDate() === 1) {
      return { name: "Christmastide", week: "Octave of Christmas", color: "white", sundayRank: 2 };
    }
    if (date.getMonth() === 0 && date.getDate() < 6) {
      return { name: "Christmastide", color: "white", sundayRank: 2 };
    }
  }

  if (diffDays(date, nextAdvent) >= 0) {
    return seasonInfo(addDays(nextAdvent, 0));
  }

  if (diffDays(date, advent) >= 0 && diffDays(date, christmas) < 0) {
    const week = Math.floor(diffDays(date, advent) / 7) + 1;
    const gaudete = week === 3 && date.getDay() === 0;
    return {
      name: "Advent",
      week: `Week ${week}`,
      color: gaudete ? "rose" : "violet",
      sundayRank: week === 1 ? 1 : 2,
      sundayTitle: gaudete ? "Gaudete Sunday" : `${ordinal(week)} Sunday of Advent`,
    };
  }

  if (diffDays(date, pentecost) >= 0 && diffDays(date, advent) < 0) {
    const week = Math.floor(diffDays(date, pentecost) / 7);
    return {
      name: "Time after Pentecost",
      week: week === 0 ? "Pentecost" : `Week ${week}`,
      color: "green",
      sundayRank: 2,
      sundayTitle:
        week === 0
          ? "Pentecost Sunday"
          : sundayAfterPentecostTitle(week),
    };
  }

  if (diffDays(date, easter) >= 0 && diffDays(date, pentecost) < 0) {
    const week = Math.floor(diffDays(date, easter) / 7);
    const inOctave = week === 0;
    return {
      name: "Eastertide",
      week: inOctave ? "Octave of Easter" : `Week ${week}`,
      color: "white",
      sundayRank: 1,
      sundayTitle: week === 0 ? "Easter Sunday" : `${ordinal(week)} Sunday after Easter`,
    };
  }

  if (diffDays(date, palmSunday) >= 0 && diffDays(date, easter) < 0) {
    return {
      name: "Holy Week",
      color: date.getDay() === 4 ? "white" : date.getDay() === 5 ? "black" : "violet",
      sundayRank: 1,
      sundayTitle: "Palm Sunday",
    };
  }

  if (diffDays(date, passionSunday) >= 0 && diffDays(date, palmSunday) < 0) {
    return {
      name: "Passiontide",
      week: "Passion Week",
      color: "violet",
      sundayRank: 1,
      sundayTitle: "Passion Sunday",
    };
  }

  if (diffDays(date, ashWednesday) >= 0 && diffDays(date, passionSunday) < 0) {
    const lentWeek = Math.max(
      1,
      Math.floor(diffDays(date, addDays(easter, -42)) / 7) + 1,
    );
    const laetare = date.getDay() === 0 && lentWeek === 4;
    return {
      name: "Lent",
      week: `Week ${lentWeek}`,
      color: laetare ? "rose" : "violet",
      sundayRank: 1,
      sundayTitle: laetare ? "Laetare Sunday" : `${ordinal(lentWeek)} Sunday of Lent`,
    };
  }

  if (diffDays(date, septuagesima) >= 0 && diffDays(date, ashWednesday) < 0) {
    const week = Math.floor(diffDays(date, septuagesima) / 7);
    const titles = ["Septuagesima Sunday", "Sexagesima Sunday", "Quinquagesima Sunday"];
    return {
      name: "Septuagesima",
      week: week === 0 ? "Septuagesima" : week === 1 ? "Sexagesima" : "Quinquagesima",
      color: "violet",
      sundayRank: 2,
      sundayTitle: titles[week] ?? "Septuagesima",
    };
  }

  if (diffDays(date, epiphany) >= 0 && diffDays(date, septuagesima) < 0) {
    const holyFamily = (() => {
      const d = addDays(epiphany, 1);
      while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
      return d;
    })();
    const week = Math.max(1, Math.floor(diffDays(date, holyFamily) / 7) + 1);
    return {
      name: "Time after Epiphany",
      week: `Week ${week}`,
      color: "green",
      sundayRank: 2,
      sundayTitle:
        diffDays(date, holyFamily) === 0
          ? "The Holy Family"
          : `${ordinal(week)} Sunday after Epiphany`,
    };
  }

  if (date.getMonth() === 11 && date.getDate() >= 25) {
    return { name: "Christmastide", week: "Octave of Christmas", color: "white", sundayRank: 2 };
  }

  return {
    name: "Time after Epiphany",
    color: "green",
    sundayRank: 2,
  };
}

function holyWeekOffice(date: Date, easter: Date): LiturgicalOffice | null {
  const delta = diffDays(date, easter);
  switch (delta) {
    case -7:
      return office("Palm Sunday", "red", 1);
    case -6:
      return office("Monday of Holy Week", "violet", 1);
    case -5:
      return office("Tuesday of Holy Week", "violet", 1);
    case -4:
      return office("Wednesday of Holy Week", "violet", 1);
    case -3:
      return office("Holy Thursday", "white", 1);
    case -2:
      return office("Good Friday", "black", 1);
    case -1:
      return office("Holy Saturday", "violet", 1);
    case 0:
      return office("Easter Sunday", "white", 1);
    default:
      return null;
  }
}

function movableMap(year: number): Map<string, LiturgicalOffice> {
  const map = new Map<string, LiturgicalOffice>();
  const put = (date: Date, off: LiturgicalOffice) => {
    map.set(isoKey(date), off);
  };
  const easter = easterSunday(year);
  const ash = addDays(easter, -46);
  put(ash, office("Ash Wednesday", "violet", 1));
  for (let d = -7; d <= 7; d++) {
    const day = addDays(easter, d);
    const holy = holyWeekOffice(day, easter);
    if (holy) put(day, holy);
    else if (d > 0 && d <= 6) {
      put(day, office(`${WEEKDAYS[day.getDay()]} of Easter Week`, "white", 1));
    }
  }
  put(addDays(easter, 7), office("Low Sunday", "white", 1));
  put(addDays(easter, 39), office("Ascension of Our Lord", "white", 1));
  const pentecost = addDays(easter, 49);
  put(pentecost, office("Pentecost Sunday", "red", 1));
  for (let d = 1; d <= 6; d++) {
    const day = addDays(pentecost, d);
    put(day, office(`${WEEKDAYS[day.getDay()]} of the Octave of Pentecost`, "red", 1));
  }
  put(addDays(easter, 56), office("Trinity Sunday", "white", 1));
  put(addDays(easter, 60), office("Corpus Christi", "white", 1));
  put(addDays(easter, 68), office("The Most Sacred Heart of Jesus", "white", 1));
  put(lastSundayOfOctober(year), office("Our Lord Jesus Christ the King", "white", 1));

  const advent = adventSunday(year);
  put(advent, office("First Sunday of Advent", "violet", 1));
  put(addDays(advent, 14), office("Gaudete Sunday", "rose", 1));

  const epiphany = atLocal(year, 1, 6);
  if (epiphany.getDay() !== 0) {
    const holyFamily = addDays(epiphany, (7 - epiphany.getDay()) % 7);
    if (holyFamily.getMonth() === 0) {
      put(holyFamily, office("The Holy Family", "white", 2));
    }
  }

  return map;
}

function fridayAbstinence(date: Date, officeTitle: string): boolean {
  if (date.getDay() !== 5) return false;
  if (/Good Friday/i.test(officeTitle)) return false;
  return true;
}

export function liturgicalDay(now = new Date()): LiturgicalDay {
  const date = startOfDay(now);
  const year = date.getFullYear();
  const season = seasonInfo(date);
  const weekday = WEEKDAYS[date.getDay()] ?? "";
  const dateLabel = `${weekday}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${year}`;
  const compactDate = `${weekday.slice(0, 3)} ${MONTHS[date.getMonth()]?.slice(0, 3)} ${date.getDate()}`;

  let current = temporalFeria(date, season.name, season.color);
  if (date.getDay() === 0 && season.sundayTitle) {
    current = office(season.sundayTitle, season.color, season.sundayRank);
  }

  const movable = movableMap(year).get(isoKey(date));
  if (movable && takesPrecedence(movable, current)) {
    current = movable;
  }

  const saint = SANCTORAL[ymdKey(date)];
  const notes: string[] = [];
  if (saint) {
    if (takesPrecedence(saint, current)) {
      current = saint;
    } else if (saint.rank >= current.rank && current.rank <= 2 && saint.rank >= 3) {
      notes.push(`Commemoration of ${saint.title}`);
    } else if (saint.rank === current.rank && current.rank >= 3) {
      current = saint;
    }
  }

  if (date.getDay() === 3 && /Ash Wednesday/i.test(current.title)) {
    notes.push("Fast and abstinence");
  } else if (/Good Friday/i.test(current.title)) {
    notes.push("Fast and abstinence");
  } else if (fridayAbstinence(date, current.title)) {
    notes.push("Friday abstinence");
  }

  const mystery = rosaryMysteryForDate(date);
  const rosary = mystery ? ROSARY_MYSTERY_LABEL[mystery] : "Rosary";
  const url = missalDayUrl(date) ?? "https://www.missalemeum.com/en/calendar";

  return {
    date,
    weekday,
    dateLabel,
    compactDate,
    season: season.name,
    seasonWeek: season.week,
    title: current.title,
    color: current.color,
    colorLabel: COLOR_LABEL[current.color],
    rank: current.rank,
    rankLabel: RANK_LABEL[current.rank],
    rosary,
    notes,
    missalUrl: url,
  };
}
