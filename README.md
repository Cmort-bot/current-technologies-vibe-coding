# RSU-Rechner (Vibe Coding)

Abgabe für **Current Technologies (CUT), WS 2026**, Aufgabe Vibe Coding

Autor: **Julian-Alexander Amort**

Eine kleine Web-App, die für Restricted Stock Units (RSUs) einer fiktiven Firma „XYZ“ den Vesting-Plan berechnet: wie viele Aktien schon gevestet sind, was noch offen ist, wann der nächste Termin kommt und was das beim eingegebenen Aktienkurs wert ist. Entstanden ist sie vollständig mit Vibe Coding, alle Prompts stehen wörtlich in [PROMPTS.md](PROMPTS.md).

## Starten

`index.html` im Browser öffnen, eine Installation ist nicht nötig.

Tests für die Rechenlogik (Node.js 20 oder neuer):

```bash
npm test
```

## Funktionen

- Eingabe von Firma, Anzahl RSUs, Zuteilungsdatum, Vesting-Dauer (1 bis 4 Jahre), Cliff (0, 6 oder 12 Monate), Intervall (monatlich bis jährlich), Aktienkurs, Währung und optional einem geschätzten Steuersatz
- Übersicht: gevestet, noch offen, nächster Termin mit Countdown, Fortschrittsbalken
- Verlaufsdiagramm als Treppenkurve mit Markierung für heute
- Tabelle mit allen Vesting-Terminen und ihrem Wert
- Die Eingaben bleiben im Browser gespeichert

## Projektstruktur

```
.
├── index.html            # Oberfläche
├── style.css
├── app.js                # liest das Formular, zeichnet Übersicht, Diagramm und Tabelle
├── vesting.js            # Rechenlogik (Vesting-Termine, Stand zu einem Datum)
├── test/vesting.test.js  # 10 Tests für die Rechenlogik
├── PROMPTS.md            # alle Prompts wörtlich, mit dem, was daraufhin passiert ist
└── package.json
```

## Erfahrungen mit Vibe Coding

**Ablauf.** Als Tool habe ich Claude Code verwendet (Desktop-App, Modell Claude Opus 5.5). Vorab habe ich Claude die Aufgabenstellung aus Sakai gegeben. Claude hat daraufhin vorgeschlagen, jeden Prompt wörtlich zu protokollieren und den Erfahrungsbericht am Ende aus dem Protokoll zu entwerfen. Danach kamen sechs Prompts von mir, zwei davon waren Antworten auf Auswahlfragen von Claude. Nur die ersten beiden betrafen die App selbst: ein sehr knapper erster Prompt („erstelle mir ein rsu programm von xyz …“) und meine Antworten auf zwei Rückfragen. Daraus ist Version 1 entstanden, ohne dass ich selbst eine Zeile Code geschrieben habe. Die übrigen vier Prompts betrafen nur die Abgabe. Die Git-Historie zeigt die Entwicklungsschritte der App: Version 1 und die Fehlerbehebung nach der Selbstprüfung.

### Was gut funktioniert hat

- **Geschwindigkeit:** Vom unklaren Einzeiler bis zur lauffähigen App mit Diagramm, Terminliste und Tests vergingen rund vier Minuten.
- **Rückfrage statt Raten:** Mein erster Prompt war mehrdeutig („RSU“, „xyz“). Claude hat mit zwei Auswahlfragen nachgefragt, statt einfach irgendetwas zu bauen.
- **Mitdenken:** Claude hat Dinge ergänzt, die ich nicht verlangt hatte, zum Beispiel das Speichern der Eingaben, das Verlaufsdiagramm und automatische Tests. Außerdem hat es mich darauf hingewiesen, dass für die Abgabe noch ein Erfahrungsbericht fehlt und dass der Prof ein privates Repo ohne Einladung gar nicht sehen könnte.

### Was nicht gut funktioniert hat

- **Fehler trotz grüner Tests:** Version 1 bestand alle 9 Tests, die Claude selbst geschrieben hatte, und enthielt trotzdem 6 Fehler. Zum Beispiel wurde bei kleinen Zuteilungen ein Termin mit „0 Aktien“ als nächstes Vesting angezeigt, der Countdown lag wegen der Zeitumstellung zeitweise einen Tag daneben, und es hieß „1 Aktien“. Gefunden wurden die Fehler erst durch eine zusätzliche Prüfung, bei der Claude weitere KI-Agenten gezielt nach Fehlern suchen ließ. Die eigenen Tests prüfen offenbar vor allem das, was die KI ohnehin für richtig hält.
- **Annahmen ohne Rückfrage:** Bei den fachlichen Details hat Claude selbst entschieden, etwa wie der Cliff funktioniert, dass nur ganze Aktien vergeben werden und dass USD die Standardwährung ist. Für einen echten RSU-Vertrag müsste man das mit den Vertragsbedingungen abgleichen.
- **Falsche Anweisungen werden nicht hinterfragt:** Aus Gewohnheit von den vorherigen Aufgaben habe ich verlangt, den Prof einzuladen. Claude hätte das gemacht, obwohl diese Aufgabe es gar nicht verlangt. Erst mein „stopp“ und ein zweiter Blick in die Aufgabenstellung haben das verhindert.
- **Auch der Bericht selbst war ungenau:** Den ersten Entwurf dieses Berichts hat Claude aus dem Protokoll geschrieben. Eine Prüfung gegen Protokoll und Git-Historie fand darin 16 Ungenauigkeiten, meist kleine Übertreibungen oder falsche Zahlen, zum Beispiel eine falsche Anzahl an Prompts und die Behauptung, alle Korrekturen seien in der App nachgeprüft worden.
- **Kleinigkeiten am Rand:** Beim Starten der Vorschau lief der lokale Server erst im dritten Anlauf (zuerst fehlende Rechte, dann ein Port-Konflikt).

### Identifizierte Probleme

- **Verständnis:** Weil ich keinen Code selbst geschrieben habe, kenne ich die App nur von außen. Um Fehler selbst zu finden oder den Code zu erklären, müsste ich ihn erst durchlesen.
- **Prüfen ist Pflicht:** Ohne zusätzliche Tests, Review und Ausprobieren wäre eine App abgegeben worden, die auf den ersten Blick fertig aussah, aber falsche Werte anzeigen konnte.
- **Verantwortung:** Die KI hinterfragt nicht jede Anweisung, die Einladung an den Prof hätte sie ohne Nachfrage umgesetzt. Und auch was sie über ihre eigene Arbeit schreibt, muss man nachprüfen. Die Verantwortung für das Ergebnis bleibt beim Menschen.

### Fazit

Vibe Coding eignet sich sehr gut, um schnell einen funktionierenden Prototyp zu bekommen, sogar mit einem ungenauen Prompt. Je weniger man vorgibt, desto mehr entscheidet die KI selbst, und genau diese Entscheidungen muss man prüfen. Für Software, bei der es um echtes Geld geht, reicht Vibe Coding allein nicht, dafür braucht es Tests, Review und Fachwissen.
