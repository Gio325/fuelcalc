# FuelCalc

FuelCalc è una piccola web app per stimare quanto hai speso in benzina o GPL. Ti bastano i chilometri percorsi e il consumo medio in km/l.

**[Apri FuelCalc](https://gio325.github.io/fuelcalc/)**

## Come si usa

1. Scegli **Benzina** o **GPL**.
2. Inserisci i chilometri percorsi e il consumo medio in **km/l**. Puoi usare la virgola o il punto per i decimali.
3. Usa il prezzo medio proposto oppure inserisci il prezzo al litro che hai pagato. Con **Usa la media** puoi tornare al prezzo automatico.

Il risultato si aggiorna mentre scrivi. Oltre al costo totale, vedi i litri consumati, il costo per 100 km e il costo per km.

**Esempio di calcolo.** Con 150 km, un consumo di 12,5 km/l e un prezzo di esempio di 0,80 €/l, consumi 12 litri e spendi **9,60 €**. Sono 6,40 € ogni 100 km, ossia 0,064 € al km.

`Costo totale = (km percorsi ÷ km/l) × prezzo al litro`

## Prezzi automatici e offline

Le medie nazionali di benzina e GPL provengono dal [Weekly Oil Bulletin della Commissione europea](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en) tramite l’[API di FuelWide](https://fuelwide.com/fuel-prices-api). All’apertura dell’app viene verificata la disponibilità dei dati. La data della rilevazione settimanale e l’ora dell’ultima verifica sono mostrate separatamente.

Il browser salva carburante, chilometri, consumo, prezzi manuali e ultime medie valide. Se la rete o l’API non sono disponibili, puoi usare la media già salvata oppure inserire il prezzo a mano.

## Uso locale

Scarica e apri [`index.html`](./index.html) nel browser. Il file contiene tutto il codice HTML, CSS e JavaScript. Per usare il calcolatore senza connessione, apri la copia locale. Il salvataggio delle preferenze da file locale dipende dal browser.
