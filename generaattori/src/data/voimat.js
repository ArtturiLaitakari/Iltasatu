export const voimat = {
  magia: {
    peruskyvyt: [
      {
        nimi: 'Luo portaali',
        kuvaus: 'Magus voi avata yhteyden toiseen paikkaan tai henkimaailman tasolle josta hän voi kutsua elementtejä tai olentoja. Oma telesiirto on vaikeaa. Kesto hetken'
      },
      {
        nimi: 'Taivuta energiaa',
        kuvaus: 'Velho voi taivuttaa mitä tahansa energiaa mitä hän on opetellut eri tavoilla, sallien suojakilpi, näkymättömyys tai levitointi loitsuja. Kesto keskittyminen'
      },
      {
        nimi: 'Transformaatio',
        kuvaus: 'Druidi voi muuttaa kohteen toiseksi kohteeksi jonka hän on opetellut. Kesto Muodonmuutosvaurio'
      },
      {
        nimi: 'Animoi',
        kuvaus: 'Shamaani voi kutsua hengen esineeseen, kasviin tai yksinkertaiseen eläimeen tehden siitä uskollisen palvelijan. Kesto on pysyvä, ja olento itsenäistyy ajan myötä'
      },
      {
        nimi: 'Vaihda ominaisuus',
        kuvaus: 'Noita voi vaihtaa ominaisuuden, lähestymistavan, haavan tai muun määriteltävissä olevan ominaisuuden kohteelta. Kesto MMV.'
      }
    ],
    edistyneet: [
      {
        nimi: 'Alkemia',
        kuvaus: 'Maagi voi tehdä taikaesineitä Alkemia sääntöjen mukaan.'
      },
      {
        nimi: 'Riimutaikuus',
        kuvaus: 'Maagi voi tehdä taikaesineen Riimutaikuuden sääntöjen mukaan'
      },
      {
        nimi: 'Taikajuomat',
        kuvaus: 'Maagi voi tehdä taikajuoman Taikajuomasääntöjen mukaan'
      }
    ]
  },
  mentalismi: {
    peruskyvyt: [
      {
        nimi: 'Telekinesia',
        kuvaus: 'Liikuta esineitä etäältä (sieluvoima)'
      },
      {
        nimi: 'Telepatia',
        kuvaus: 'Luo mielten yhteyden jota voi käyttää henkiseen taistelun. Luo tai lue muistoja tai ajatuksia.'
      },
      {
        nimi: 'Empatia',
        kuvaus: 'Lue ja aiheuta tunteita (riski on tynneyhteys)'
      },
      {
        nimi: 'Ennustus',
        kuvaus: 'Näe enneunia vaaroista ja isoista asioista, näe epäonnistuneet tehtävät näin luoden tallennuspisteen.'
      },
      {
        nimi: 'Psykokinesia',
        kuvaus: 'Luonteen perusteella voit ampua yhtä elementtiä, sähköä, tulta tai henkistä vauriota tekevän iskun.'
      }
    ],
    edistyneet: [
      {
        nimi: 'Astraalikeho',
        kuvaus: 'Irrota astraalikeho ja liiku näkymättömästi ympäriinsä ja havannoi ympäristöä. Kehon valtaamalla voit käyttää voimiasi fyysiseen maailmaan'
      },
      {
        nimi: 'ESP',
        kuvaus: 'Aisti kaukaisia paikkoja kuin olisit siellä, tarvitsee yhteyden'
      },
      {
        nimi: 'Käsillä parannus',
        kuvaus: 'Laske vaurion tasoa yhdellä ja lisää "parantuva" sen alkuun.'
      }
    ]
  },
  muodonmuutos: {
    peruskyvyt: [
      {
        nimi: 'Ihmismuodot',
        kuvaus: 'Hallitse ihoa, kynsiä, lihaksia ja karvoja. Voit ottaa olennon muodon jonka verta tai lihaa olet maistanut. Hiukset ja kynnet käy myös mutta vaikeampi saada muoto siitä.',
        taso: 1
      },
      {
        nimi: 'Eläinmuodot',
        kuvaus: 'Muuta luita. Voit omata olennon muodon muuttamalla luita, lihaksia ja samat mitä edellisellä kyvällä. Voit muuttaa sisäelimiiäsi jos otat nisäkkään muodon.',
        taso: 2
      },
      {
        nimi: 'Hybridi muodot',
        kuvaus: 'Voit muuttaa osaa kehostasi, voit yhdistellä muotoja, voit muuttaa sisäelimiiäsi myös eri eläinten sisäelimiksi.',
        taso: 3
      },
      {
        nimi: 'Koon hallinta',
        kuvaus: 'Voit kutistaa itseäsi hylkäämällä massaasi, tai kasvattaa sitä imemällä orgaanista massaa, mieluiten syötävää.',
        taso: 4
      },
      {
        nimi: 'Kemialliset kyvyt',
        kuvaus: 'Voit matkia monimutkaisia kemiallisia kykyjä eläimeltä jota olet maistanut.',
        taso: 5
      }
    ],
    edistyneet: [
      {
        nimi: 'Sisäelinten hallinta',
        kuvaus: 'Muokkaa sisäelimiiäsi kuten haluat.'
      },
      {
        nimi: 'Mielen hallinta',
        kuvaus: 'Luo valepersoona joka hämää mentalisteja ja ihmisiä.'
      },
      {
        nimi: 'Verimagia',
        kuvaus: 'Muokkaa verestäsi olentoja, tai juota sitä ihmisille ja saa heille kykyjä ja saat otteen heistä henkisesti.'
      }
    ]
  },
  'elementin hallinta': {
    peruskyvyt: [
      {
        nimi: 'Luo elementtiä',
        kuvaus: 'Luo hallitsemaasi elementtiä. Tee iskuja, valleja, aluehyökkäyksiä tai paranna (keho-elementti).',
      },
      {
        nimi: 'Ohjaa elementtiä',
        kuvaus: 'Ohjaa elementtiäsi telekineesin tavoin. Käskytä elementaalisia tai liikuta esineitä.',
      },
      {
        nimi: 'Muuta elementtiä',
        kuvaus: 'Muuta elementtiäsi haluamallasi tavalla. Taiteelliset lahjasi ovat rajana. Keho-elementti parantaa.',
      },
      {
        nimi: 'Poista elementtiä',
        kuvaus: 'Poista elementtiä: sammuta tuli, pysäytä liike, poista sairaus. Vaurioita tai puhdista.',
      },
      {
        nimi: 'Elementimagia',
        kuvaus: 'Valitse Takomomestari, Riimumestari tai Juomamestari. Tee taikaesineitä omalla elementilläsi.',
        taso: 5
      },
    ],
    edistyneet: [
      {
        nimi: 'Boosteri +1',
        kuvaus: 'Tehosta voiman kestoaikaa tai aluetta ilmaiseksi.',
      },
      {
        nimi: 'Elementaalinen',
        kuvaus: 'Kutsu elementaalinen omasta elementistäsi. Anna sille nimi, luonne ja käskyt.',
      },
      {
        nimi: 'Merkittävä elementti',
        kuvaus: 'Laajenna hallintaasi 3 sisarelementtiin tai yläkategoriaan (esim. elementit, sää, elämä).',
      }
    ]
  }
};

export const aistit = {
  magia: {
    nimi: 'Aisti magiaa',
    kuvaus: 'Kun keskityt näet maagiset virtaukset, paljastaa maagiset esineet, loitsut, olennot.',
    lisakuvaus: 'magus aisti: todellisuuden paksuus, yhteydet, velho aisti: näe energiavirrat, druidi aisti: näe tosimuoto, shamaani aisti: näe henget, noita-aisti, näe olennon ominaisuudet ja heikkoudet'
  },
  mentalismi: {
    nimi: 'Aisti aikomus',
    kuvaus: 'Tunnet ympäröiviä aistimuksia kuin ilmanpaineen, agressio tuntuu kuumalta, intohimo lämpimältä, ja pelko kylmältä.',
    lisakuvaus: 'Telepaatti: kuule ihmisten ajatukset kuin puheena, Empaatti: näe tunteet väreinä, Ennustaja: näe pari sekunttia tulevaisuuteen aavekuvana.'
  },
  muodonmuutos: {
    nimi: 'Eläimen aisti',
    kuvaus: 'Valitse 1 eläimen aisti pysyväksi aistiksesi',
    lisakuvaus: 'Voit lisätä eläinominaisuuksia 1 per onnistumistaso (tavallinen = 1), bonus adjektiiveja 1 per voimataso kumuloituu. Adjektiivi on fyysinen tai henkinen'
  },
  'elementin hallinta': {
    nimi: 'Elementtiaisti',
    kuvaus: 'Saa elementtikohtaisen aistin: tuli=infrapuna, maa=näkö kiven läpi, ilma=kuuleminen kauas, vesi=näkö veden alla',
    lisakuvaus: 'Puhu elementin kieltä ja kyvyn puhua elementaalisille.'
  }
};
