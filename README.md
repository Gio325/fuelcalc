# FuelCalc

Calcola quanto spendi in **benzina, GPL o diesel** e tieni traccia dei viaggi per mezzo.

**[Apri la web app](https://gio325.github.io/fuelcalc/)** · **[Release Android su GitHub](https://github.com/Gio325/fuelcalc/releases)** · **[Novità Android 1.4.9](./CHANGELOG.md#android-149)**

## Scegli la versione

| Versione | Come si usa |
| --- | --- |
| **Android 1.4.9** | App nativa in Kotlin e Jetpack Compose. Richiede Android 8.0 o successivo. |
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

Nella **1.4.9**, il pulsante in alto a destra mostra una macchinina con un orologio. Toccalo per aprire lo **Storico viaggi**, gestire i mezzi e consultare i totali mensili. Il passaggio tra calcolatore e storico usa una breve dissolvenza con scorrimento laterale.

I widget Android **Viaggio rapido** e **Storico viaggi** permettono di calcolare e salvare un viaggio dalla Home o rivedere quelli recenti.

## Come si calcola la spesa

Scegli il carburante, inserisci i chilometri percorsi e il consumo medio in **km/l**. Puoi usare la virgola o il punto per i decimali. Per tornare al prezzo automatico, seleziona **Usa la media**.

**Esempio.** Con 150 km, 12,5 km/l e 0,80 €/l, consumi 12 litri e spendi **9,60 €**: 6,40 € ogni 100 km e 0,064 € al km.

`Costo totale = (km percorsi ÷ km/l) × prezzo al litro`

## Prezzi, offline e dati

Le medie settimanali italiane provengono dal [Weekly Oil Bulletin della Commissione europea](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en) tramite [FuelWide](https://fuelwide.com/fuel-prices-api). L’app mostra separatamente la data della rilevazione e l’ora dell’ultima verifica. Offline puoi usare l’ultima media salvata o un prezzo manuale.

Lo storico è locale. Il browser conserva quello della web app, Android usa Room per i viaggi e i mezzi e DataStore per le preferenze. I due storici sono indipendenti.

## Sviluppo

- **Web:** apri [`index.html`](./index.html). HTML, CSS e JavaScript gestiscono il calcolatore. Il manifest e il service worker aggiungono l’installazione e l’offline per la PWA.
- **Android:** apri il progetto FuelCalc in Android Studio con JDK 17 e SDK 35. Esegui `./gradlew :app:assembleRelease :app:testReleaseUnitTest :app:lintRelease`. L’APK generato da Gradle va firmato per distribuirlo.

[Note sulle versioni](./CHANGELOG.md)
