# FuelCalc

Calcola quanto spendi in **benzina, GPL o diesel** e tieni traccia dei viaggi per mezzo.

**[Apri la web app](https://gio325.github.io/fuelcalc/)** · **[Release Android su GitHub](https://github.com/Gio325/fuelcalc/releases)** · **[Novità 1.5.0](./CHANGELOG.md#150)**

## Scegli la versione

| Versione | Come si usa |
| --- | --- |
| **Android 1.5.0** | App nativa in Kotlin e Jetpack Compose. Richiede Android 8.0 o successivo. |
| **Web** | Funziona nel browser e si può aggiungere alla schermata Home su Android e iPhone. |

Su Android, apri l’APK e segui la richiesta di installazione del telefono. La release usa una firma dedicata. Un APK debug precedente con firma diversa blocca l’aggiornamento diretto. La disinstallazione elimina lo storico locale.

Per aggiungere la web app alla schermata Home, usa **⋮ → Aggiungi a schermata Home** in Chrome oppure **Condividi → Aggiungi alla schermata Home** in Safari. Aprila almeno una volta con Internet per preparare l’uso offline.

## Cosa puoi fare

- Calcolare costo totale, litri consumati, costo per 100 km e costo per km.
- Usare le medie nazionali di benzina, GPL e diesel oppure digitare il prezzo al litro.
- Salvare i viaggi per mezzo e vedere i totali mensili.
- Aggiungere, rinominare e archiviare un mezzo con viaggi associati.
- Eliminare singoli viaggi oppure azzerare lo storico con una doppia conferma.

## Novità dell’app Android

Nella **1.4.10**, data, ora, carburante, chilometri e litri sono più leggibili nello **Storico viaggi**. Tocca il cestino rosso per aprire la conferma di eliminazione. Usa il «+» per aggiungere un mezzo e la matita per rinominarlo.

I widget Android **Viaggio rapido** e **Storico viaggi** permettono di calcolare e salvare un viaggio dalla Home o rivedere quelli recenti.

## Come si calcola la spesa

Scegli il carburante, inserisci i chilometri percorsi e il consumo medio in **km/l**. Puoi usare la virgola o il punto per i decimali. Per tornare al prezzo automatico, seleziona **Usa la media**.

**Esempio.** Con 150 km, 12,5 km/l e 0,80 €/l, consumi 12 litri e spendi **9,60 €**: 6,40 € ogni 100 km e 0,064 € al km.

`Costo totale = (km percorsi ÷ km/l) × prezzo al litro`

## Correzione del consumo GPL

Seleziona **GPL → Correzione consumo GPL**. **Consumo GPL reale** usa direttamente il valore che hai misurato. Se usi **Computer di bordo**, seleziona il tuo mezzo e configura un profilo o un coefficiente specifico. Se manca un coefficiente valido, FuelCalc calcola la spesa dal dato inserito e segnala che è una stima senza correzione. Puoi anche usare il calcolatore senza associare la configurazione a un mezzo.

- **Alfa Romeo MiTo 1.4 T-Jet GPL 120 CV (2009).** Il profilo usa i valori del ciclo misto, 6,1 l/100 km a benzina e 8,1 l/100 km a GPL. FuelCalc moltiplica i km/l di bordo per `6,1 ÷ 8,1`. La stima presuppone che il dato del cruscotto sia confrontabile con un consumo a benzina. Il rapporto non dimostra come il computer di bordo calcoli i consumi reali. [Gazzetta Ufficiale del 21 giugno 2011, p. 21](https://www.gazzettaufficiale.it/do/atto/serie_generale/caricaPdf?art.codiceRedazionale=11A07396&art.dataPubblicazioneGazzetta=2011-06-21&art.num=1&art.tiposerie=SG&cdimg=11A0739600100010110002&dgu=2011-06-21)
- **Calibra consumo GPL.** Parti da un pieno e, al secondo pieno comparabile, inserisci chilometri percorsi, litri GPL effettivamente riforniti e media di bordo dello stesso intervallo. Il coefficiente è `(km ÷ litri riforniti) ÷ km/l di bordo`. Usa possibilmente lo stesso distributore e confronta più pieni. Il valore manuale, se inserito, ha precedenza sulla calibrazione e sul profilo. **Ripristina coefficiente del profilo** rimuove entrambi i valori personalizzati.
- **Esempio.** Con 14 km/l di bordo, il profilo MiTo stima **10,54 km/l**. Su 100 km a 0,70 €/l ottieni **9,48 l** e **6,64 €**. FuelCalc mantiene la precisione durante il calcolo e arrotonda solo i risultati mostrati. Il costo GPL esclude l’eventuale benzina usata per gli avviamenti.
- **Storico.** I nuovi viaggi GPL riportano la modalità e il consumo inserito. Quando viene applicata una conversione, riportano il consumo stimato e il coefficiente usato. Cambiare coefficiente non ricalcola i viaggi già salvati. Il widget **Viaggio rapido** usa il consumo che inserisci nel widget. Per applicare un profilo usa il calcolatore dell’app.

## Prezzi, offline e dati

Le medie settimanali italiane provengono dal [Weekly Oil Bulletin della Commissione europea](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en) tramite [FuelWide](https://fuelwide.com/fuel-prices-api). L’app mostra separatamente la data della rilevazione e l’ora dell’ultima verifica. Offline puoi usare l’ultima media salvata o un prezzo manuale.

Lo storico è locale. Il browser conserva quello della web app, Android usa Room per i viaggi e i mezzi e DataStore per le preferenze. I due storici sono indipendenti.

## Sviluppo

- **Web:** apri [`index.html`](./index.html). HTML, CSS e JavaScript gestiscono il calcolatore. Il manifest e il service worker aggiungono l’installazione e l’offline per la PWA.
- **Android:** apri il progetto FuelCalc in Android Studio con JDK 17 e SDK 35. Esegui `./gradlew :app:assembleRelease :app:testReleaseUnitTest :app:lintRelease`. L’APK generato da Gradle va firmato per distribuirlo.

I test della logica si eseguono con `node tests/gpl.dom.cjs` (richiede jsdom). Il service worker si verifica con `node --test tests/sw.test.cjs`.
Per eseguire il test web su Chromium, avvia `python3 -m http.server 8103` dalla radice. Con Playwright installato, esegui `node tests/gpl.browser.cjs`. Puoi impostare `CHROMIUM` con il percorso al browser.

[Note sulle versioni](./CHANGELOG.md)
