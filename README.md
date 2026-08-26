# Catholib — Sacred Timeline

A mobile-first Catholic web app for reading Scripture and the living Magisterium on one vertical timeline.

Two views:

- **Bible** — all 73 books of the Catholic canon, with Haydock, Catena Aurea, and Cornelius a Lapide commentary on confirmed chapters and richer Catechism, papal, and artwork notes on high-value chapters.
- **Church** — councils, popes, saints, and documents from Pentecost to the present, with saint, pope, and event cards sourced from the Catholic Encyclopedia.

Every textual artifact links to an original page on [vatican.va](https://www.vatican.va/), [newadvent.org/cathen](https://www.newadvent.org/cathen/), [bible.usccb.org](https://bible.usccb.org/), [haydockcommentary.com](https://haydockcommentary.com/), [ecatholic2000.com/catena](https://www.ecatholic2000.com/catena/), [lapide.org](https://lapide.org), or [missalemeum.com](https://www.missalemeum.com/en). This is a curated prototype: some chapters remain sparsely annotated until a verified source exists.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080).

```bash
npm run typecheck
npm run build
```

## Stack

React 19, TypeScript, Tailwind CSS, TanStack Start, Framer Motion, Zustand.

## Sources

1. The Holy See — Catechism, conciliar constitutions, encyclicals, audiences  
2. Catholic Encyclopedia (New Advent) — saint, pope, and event cards in Church view  
3. United States Conference of Catholic Bishops — NABRE chapter text  
4. Haydock’s Catholic Bible Commentary (1859) — public-domain Douay-Rheims commentary  
5. Catena Aurea — St. Thomas Aquinas, sourced from ecatholic2000.com  
6. Cornelius a Lapide — Commentaria in Scripturam Sacram, sourced from lapide.org  
7. Missale Meum — 1962 Roman Missal

Artwork is public-domain historical work, credited via Wikimedia Commons. This project is not an official publication of the Holy See or the USCCB.
