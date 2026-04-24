# Iltasatu
Iltasatu roolipeli on suunniteltu toimimaan pienestä skaalasta jumalaiseen skaalaan, yksinkertaisilla helpoilla säännöillä jotka sallivat vapaasti kekseliäisyyden avulla monipuolisten kykyjen käyttöä luovasti.

Suomenkielisiä pelejä ei ole turhan paljon ja nekin tahtoo olla D&D käännöksiä.

Tämä peli on sekä Fate rpg että Wushu rpg yhteensopiva, mutta käyttää hieman nopeutettuja sääntöjä.

## Hahmo Generaattori

`/generaattori` hakemistossa on React-pohjainen web-sovellus hahmogeneroinnille. Generaattori auttaa luomaan Iltasatu RPG:hen sopivia hahmoja interaktiivisesti.

**Huom:** Generaattori toimii Iltasatu versio 3 säännöillä.

### Ominaisuudet

- **Arkkityyppi-pohjainen luonti**: Soturi, Bardi, Maagi ja muut arkkityypit määrittävät hahmon perusominaisuudet
- **Kolmiportainen ominaisuusjärjestelmä**: Keho, Mieli, Sielu - jokainen arkkityyppi priorisoi niitä eri tavoin
- **Mystinen voimajärjestelmä**: Magia, mentalismi, muodonmuutos, elementin hallinta
- **FATE-yhteensopiva**: Aspects, stunts ja fate ladder -järjestelmä
- **Helen Fisher persoonallisuustyypit**: Tieteeseen perustuvat neljä persoonallisuustyyppiä
- **Visuaalinen kehitysjärjestelmä**: Ympyräindikaattorit taitojen ja voimien kehitykselle
- **Suomenkielinen**: Täysin suomeksi lokalisoitu käyttöliittymä

### Teknologia

- React 18 + Vite
- ES6 modulit
- Responsiivinen CSS
- Local storage tallennukselle

### Käyttö

```bash
cd generaattori
npm install
npm run dev
```

Generaattori avautuu osoitteeseen `http://localhost:1974`
