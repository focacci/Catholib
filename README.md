# Catholib

A mobile-first Catholic web app for reading Scripture, the living Magisterium, and the 1962 Roman Missal on one vertical timeline.

Three views:

- **Bible** — all 73 books of the Catholic canon, with Haydock, Catena Aurea, and Cornelius a Lapide commentary on confirmed chapters and richer Catechism, papal, and artwork notes on high-value chapters.
- **Church** — councils, popes, saints, and documents from Pentecost to the present, with saint, pope, and event cards sourced from the Catholic Encyclopedia when those articles exist. Later events, including the Second Vatican Council, are sourced from the Holy See.
- **Missal** — a static catalog of the 1962 Roman Missal. Cards open confirmed pages on Missale Meum. Today also includes the day's scripturally based rosary from the Rosary Center.

Every textual artifact links to an original page on [vatican.va](https://www.vatican.va/), [newadvent.org/cathen](https://www.newadvent.org/cathen/), [bible.usccb.org](https://bible.usccb.org/), [ewtn.com/bible](https://www.ewtn.com/bible), [thedouayrheims.com](https://thedouayrheims.com/drc/genesis/1), [haydockcommentary.com](https://haydockcommentary.com/), [ecatholic2000.com/catena](https://www.ecatholic2000.com/catena/), [lapide.org](https://lapide.org), [missalemeum.com](https://www.missalemeum.com/en), or [rosarycenter.org](https://www.rosarycenter.org/). If a working source URL cannot be confirmed, the artifact is omitted.

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
2. Catholic Encyclopedia (New Advent) — saint, pope, and historical event cards in Church view  
3. United States Conference of Catholic Bishops — NABRE chapter text  
4. EWTN — RSV-CE chapter text  
5. The Douay-Rheims Bible (thedouayrheims.com) — Challoner revision, chapter text  
6. Haydock’s Catholic Bible Commentary (1859) — public-domain Douay-Rheims commentary  
7. Catena Aurea — St. Thomas Aquinas, sourced from ecatholic2000.com  
8. Cornelius a Lapide — Commentaria in Scripturam Sacram, sourced from lapide.org  
9. Missale Meum — 1962 Roman Missal  
10. Rosary Center & Confraternity — scripturally based rosary, including the Luminous Mysteries

Artwork is public-domain historical work, credited via Wikimedia Commons. This project is not an official publication of the Holy See or the USCCB.
