// ⚠️  VAROITUS: ÄLÄ MUOKKAA TÄTÄ TIEDOSTOA!
// Tämä tiedosto sisältää vakaan datan joka on synkronoitu käyttöliittymän kanssa.
// Muutokset voivat aiheuttaa ristiriitoja generaattorissa.
// Keskustele käyttäjän kanssa ennen muokkauksia.

export const ammatit = {
  fantasia: {
    fyysinen: [
      { id: 'barbaari', nimi: 'Barbaari', kuvaus: 'Raaka voima, selviytyminen ja hurja taistelutyyli.' },
      { id: 'soturi', nimi: 'Soturi', kuvaus: 'Kurinalainen aseenkäyttäjä ja etulinjan taistelija.' },
      { id: 'munkki', nimi: 'Munkki', kuvaus: 'Kehon hallinta, kamppailutaito ja sisäinen kuri.' },
      { id: 'temppeliritari', nimi: 'Temppeliritari', kuvaus: 'Vannoutunut suojelija, joka yhdistää uskon ja miekan.' },
      { id: 'paladiini', nimi: 'Paladiini', kuvaus: 'Pyhä soturi, joka vannoo valan ja käyttää jumalallista voimaa.' },
      { id: 'samooja', nimi: 'Samooja', kuvaus: 'Eränkävijä, jäljittäjä ja luonnossa selviytyjä.' },
      { id: 'ryovari', nimi: 'Ryövari', kuvaus: 'Nopea, tarkka ja varjoissa toimiva ammattilainen.' },
      { id: 'soturimaagi', nimi: 'Soturimaagi', kuvaus: 'Yhdistää taistelutaidon ja taikuuden yhdeksi tyyliksi.' },
      { id: 'kasityolainen', nimi: 'Käsityöläinen', kuvaus: 'Taitava käden työn mestari, sepän, puusepän tai muun ammatin osaaja.' }
    ],
    henkinen: [
      { id: 'bardi', nimi: 'Bardi', kuvaus: 'Tarinankertoja, esiintyjä ja tunnelman luoja.' },
      { id: 'pappi', nimi: 'Pappi', kuvaus: 'Hengellinen opas, parantaja ja rituaalien tuntija.' },
      { id: 'magister', nimi: 'Magister', kuvaus: 'Oppinut asiantuntija, tutkija ja tiedon vartija.' },
      { id: 'nayttelija', nimi: 'Näyttelijä', kuvaus: 'Roolien mestari, joka osaa vakuuttaa ja harhauttaa.' },
      { id: 'kartturi', nimi: 'Kartturi', kuvaus: 'Reittien, maiden ja salapaikkojen tarkka tuntija.' },
      { id: 'aatelinen', nimi: 'Aatelinen', kuvaus: 'Suhteita, vaikutusvaltaa ja hovin pelisilmää.' },
      { id: 'huijari', nimi: 'Huijari', kuvaus: 'Neuvokas manipuloija, joka kääntää tilanteet edukseen.' },
      { id: 'insinoori', nimi: 'Insinööri', kuvaus: 'Höyrykoneiden, kellokoneistojen ja mekaanisten vempeleiden nerokas keksijä.' }
    ],
    mystinen: [
      { id: 'maagi', nimi: 'Maagi', kuvaus: 'Monipuolinen loitsija, joka hallitsee klassista magiaa.', voima: 'magia' },
      { id: 'muodonmuuttaja', nimi: 'Muodonmuuttaja', kuvaus: 'Kehon ja olemuksen muokkaaja eri tilanteisiin.', voima: 'muodonmuutos' },
      { id: 'mentalisti', nimi: 'Mentalisti', kuvaus: 'Mielen voimiin erikoistunut psyykkinen käyttäjä.', voima: 'mentalismi' },
      { id: 'elementalisti', nimi: 'Elementalisti', kuvaus: 'Elementtien, tulen, veden, maan tai ilman hallitsija.', voima: 'elementin hallinta' },
      { id: 'todellisuuden-mestari', nimi: 'Todellisuuden mestari', kuvaus: 'Manipuloi pehmeää kaaoksen todellisuutta hienovaraisesti.', voima: 'heijastuksen hallinta', jumalainenAmmatii: true },
      { id: 'kaaosmestari', nimi: 'Kaaosmestari', kuvaus: 'Skannaa pehmeää potentiaalia kaaossäikeillä, tuo ja vie asioita niillä.', voima: 'kaaossäikeet', jumalainenAmmatii: true },
      { id: 'tarot-mestari', nimi: 'Tarot mestari', kuvaus: 'Luo yhteys kuvan ja asian välillä, matkaa korttien avulla ja luo mahtiesineitä.', voima: 'tarot', jumalainenAmmatii: true },
      //{ id: 'spesialisti', nimi: 'Spesialisti', kuvaus: 'Taitoihin luottava expertti.', voima: 'magia' }
    ]
  },
  moderni: {
    fyysinen: [
      { id: 'sotilas', nimi: 'Sotilas', kuvaus: 'Koulutettu taistelija, aseiden ja taktiikan ammattilainen.' },
      { id: 'poliisi', nimi: 'Poliisi', kuvaus: 'Lain ylläpitäjä, tutkija ja yhteisön suojelija.' },
      { id: 'palomies', nimi: 'Palomies', kuvaus: 'Pelastaja, joka rientää sinne mistä muut pakenevat.' },
      { id: 'urheilija', nimi: 'Urheilija', kuvaus: 'Huippukuntoinen ammattilainen, kehon hallinnan mestari.' },
      { id: 'taistelulajiharrastaja', nimi: 'Taistelulajiharrastaja', kuvaus: 'Kamppailutaitojen ja itsekurin osaaja.' },
      { id: 'salamurhaaja', nimi: 'Salamurhaaja', kuvaus: 'Hiljainen tappaja, varjoissa toimiva ammattilainen.' },
      { id: 'henkivartija', nimi: 'Henkivartija', kuvaus: 'Suojelija, joka takaa kohteen turvallisuuden.' },
      { id: 'agentti', nimi: 'Agentti', kuvaus: 'Salainen toimija, vakooja ja erikoisoperaatioiden tekijä.' }
    ],
    henkinen: [
      { id: 'toimittaja', nimi: 'Toimittaja', kuvaus: 'Tiedonhakija, tarinankertoja ja totuuden etsijä.' },
      { id: 'lakari', nimi: 'Lääkäri', kuvaus: 'Parantaja, diagnostiikan ja lääketieteen ammattilainen.' },
      { id: 'tiedemies', nimi: 'Tiedemies', kuvaus: 'Tutkija, kokeilija ja luonnonlakien selittäjä.' },
      { id: 'hakkeri', nimi: 'Hakkeri', kuvaus: 'Digitaalisen maailman tunkeutuja ja tietoturva-asiantuntija.' },
      { id: 'psykologi', nimi: 'Psykologi', kuvaus: 'Mielen tutkija, terapeutti ja ihmisluonteen ymmärtäjä.' },
      { id: 'lakimies', nimi: 'Lakimies', kuvaus: 'Lain tulkitsija, neuvottelija ja oikeuden puolustaja.' },
      { id: 'liikemies', nimi: 'Liikemies', kuvaus: 'Sopimusten tekijä, vaikuttaja ja talouden ymmärtäjä.' },
      { id: 'taiteilija', nimi: 'Taiteilija', kuvaus: 'Luova ilmaisija, joka koskettaa ihmisten sieluja.' },
      { id: 'insinoori-moderni', nimi: 'Insinööri', kuvaus: 'Tekniikan, koneiden ja järjestelmien suunnittelija.' }
    ],
    mystinen: [
      { id: 'maagi', nimi: 'Maagi', kuvaus: 'Monipuolinen loitsija, joka hallitsee klassista magiaa.', voima: 'magia' },
      { id: 'muodonmuuttaja', nimi: 'Muodonmuuttaja', kuvaus: 'Kehon ja olemuksen muokkaaja eri tilanteisiin.', voima: 'muodonmuutos' },
      { id: 'mentalisti', nimi: 'Mentalisti', kuvaus: 'Mielen voimiin erikoistunut psyykkinen käyttäjä.', voima: 'mentalismi' },
      { id: 'elementalisti', nimi: 'Elementalisti', kuvaus: 'Elementtien, tulen, veden, maan tai ilman hallitsija.', voima: 'elementin hallinta' },
      { id: 'todellisuuden-mestari', nimi: 'Todellisuuden mestari', kuvaus: 'Manipuloi pehmeää kaaoksen todellisuutta hienovaraisesti.', voima: 'heijastuksen hallinta', jumalainenAmmatii: true },
      { id: 'kaaosmestari', nimi: 'Kaaosmestari', kuvaus: 'Skannaa pehmeää potentiaalia kaaossäikeillä, tuo ja vie asioita niillä.', voima: 'kaaossäikeet', jumalainenAmmatii: true },
      { id: 'tarot-mestari', nimi: 'Tarot mestari', kuvaus: 'Luo yhteys kuvan ja asian välillä, matkaa korttien avulla ja luo mahtiesineitä.', voima: 'tarot', jumalainenAmmatii: true }
    ]
  }
};