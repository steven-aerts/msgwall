msgwall
=======
Wat is dit?
-----------

Een zeer kleine naieve message wall applicatie die al een aantal jaar op de foute fuif gedraaid heeft.

De bedoeling is dat de mensen op de fuif naar een url kunnen surfen op een lokaal draadloos netwerkje.
Daar kunnen ze dan een alias aanmaken en berichtjes naar elkaar versturen.
Deze applicatie draait dan op laptopje ofzo dat ook aan dit netwerk hangt.

Dit netwerkje moet niet aan het internet hangen.

Hoe installeren
---------------

Zorg ervoor dat je op de laptop een redelijk recente versie van [node.js|http://nodejs.org/download/] installeert.
Om de dependencies te installeren run:

``` sh
npm install
```

Hiervoor heb je internet toegang nodig.

Hoe draaien
-----------
``` sh
npm start
```

hierbij opent de server poort 3003.
Om hem op een andere poort te laten draaien (bijvoorbeeld poort 80 als je dat echt zou willen en genoeg rechten hebt):

``` sh
PORT=80 npm start
```

Hoe gebruiken
-------------
Voor gebruikers: http://127.0.0.1:3003/ (127.0.0.1 moet natuurlijk het ip-adres van laptop zijn)
Enkel de wall zien (om te projecteren): http://127.0.0.1:3003/wall

Tips:
-----

* Met de hand van port mapping kan je poort 80 op 3003 mappen.  Zo moet de applicatie niet als Administrator/root draaien om toch makkelijk beschikbaar te zijn.
* Je kan bijna op alle wireless access points een hostnaam toekennen aan de laptop.  Zo kan je dus mensen naar bijvoorbeelt http://messageboard/ laten surfen ipv naar een ip-adres.
* ideaal is dat je je laptop .com of een .be naam kan geven op het access point.  Want als je met een recente browser naar `messageboard` surft dan gaat die zoeken in google ipv te kijken of de hostname bestaat.  Dit kan op sommige routers (met eigen dns server)
* Nog beter is alt je een wireless access points hebt dat toelaat om alle trafiek om te leiden naar een adres (als er geen internet is).  Je kan dit gebruiken om mensen echt heel makkelijk de wall te laten vinden.
* Zorg ervoor dat de projector straf genoeg is, dat was meestal het probleem.