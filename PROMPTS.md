# Prompt-Protokoll

Tool: **Claude Code** (Desktop-App, Modell Claude Opus 5.5)
Alle Prompts stehen hier wörtlich, inklusive Tippfehlern. Bei Auswahlfragen von Claude steht fett die Option, die ich angeklickt habe, dahinter in Klammern Claudes Beschreibung dieser Option. Unter jedem Prompt steht kurz, was daraufhin passiert ist.

---

## Vorab (22.10.2026, 11:20)

> nun das hier

(Dazu habe ich die Aufgabenstellung aus Sakai eingefügt.)

**Was passiert ist:** Claude hat erklärt, dass es meine Prompts und Erfahrungen nicht für mich erfinden kann, und vorgeschlagen, die Aufgabe echt mit Vibe Coding zu machen: Ich schreibe die Prompts, jeder Prompt kommt wörtlich in diese Datei, und am Ende entwirft Claude aus dem Protokoll den Erfahrungsbericht, den ich ergänze. Dazu kamen vier App-Ideen (Deadline-Board, Lern-Timer, Rezeptbuch, Browser-Spiel). Genommen habe ich keine davon, sondern eine eigene Idee (Prompt 1).

## Prompt 1 (22.10.2026, 11:22)

> erstelle mir ein rsu programm von xyz ich glaub das passt vllt nicht so schlecht

**Was passiert ist:** Claude hat nicht sofort losprogrammiert, sondern nachgefragt, weil „RSU“ und „xyz“ mehrdeutig sind (z. B. Restricted Stock Units einer Firma oder etwas ganz anderes).

## Prompt 2 (22.10.2026, 11:23): Antworten auf die Rückfrage

Claude hat zwei Auswahlfragen gestellt, ausgewählt habe ich:

> Was meinst du mit „RSU-Programm“? **Aktien-RSU-Rechner** (Restricted Stock Units einer Firma: Zuteilung, Vesting-Plan (z. B. 4 Jahre mit Cliff), wie viel schon gevestet ist und was es aktuell wert ist.)
>
> Ist „xyz“ eine echte Firma oder nur ein Platzhalter? **Platzhalter** (fiktive Firma „XYZ“, die Daten gibt man selbst ein)

**Was passiert ist:** Claude hat daraus ohne weitere Fragen eine erste Version gebaut und dabei selbst sinnvolle Standardwerte gewählt (1.200 RSUs, 4 Jahre Vesting, 12 Monate Cliff, quartalsweise, Kurs 85 USD). Die Version 1 ist eine Web-App ohne Installation (`index.html` im Browser öffnen) mit:

- Formular für Firma, Anzahl, Zuteilungsdatum, Dauer, Cliff, Intervall, Kurs, Währung und optionalem Steuersatz
- Übersicht: gevestet, noch offen, nächster Termin, Fortschrittsbalken
- Verlaufsdiagramm (Treppenkurve mit „heute“-Markierung) und Tabelle mit allen Vesting-Terminen
- Speichern der Eingaben im Browser (localStorage)
- 9 automatischen Tests für die Rechenlogik (`npm test`), z. B. Monatsende und Cliff länger als die Laufzeit

Dauer: rund 4 Minuten (erster Prompt 11:22, Commit von Version 1 um 11:26). Sichtbar hakte es beim Bauen nur an der Vorschau: Der lokale Server lief erst im dritten Anlauf (zuerst fehlten dem Python-Server Rechte, dann gab es einen Port-Konflikt). Dass auch die App selbst Fehler hatte, zeigte erst die Selbstprüfung weiter unten.

## Selbstprüfung durch Claude (ohne neuen Prompt, 22.10.2026, ca. 11:27 bis 11:36)

Claude hat die eigene Version 1 von zwei zusätzlichen Prüf-Agenten testen lassen: einer hat die Rechenlogik mit über 2 Mio. systematisch durchprobierten Kombinationen (Anzahl, Dauer, Cliff, Intervall, Zuteilungsdatum) geprüft, einer die Oberfläche. Jeder Fund wurde von einem weiteren Agenten nachgestellt. Obwohl die 9 eigenen Tests grün waren, wurden **6 echte Fehler** gefunden:

1. Bei kleinen Zuteilungen (z. B. 1 RSU) zeigte die App Termine mit „0 Aktien“ als „Nächstes Vesting“ an.
2. Lag bis zum nächsten Termin eine Zeitumstellung, war der Countdown „in X Tagen“ eine Stunde pro Tag lang (kurz vor oder nach Mitternacht) einen Tag daneben.
3. Immer Mehrzahl: „1 Aktien“, „in 1 Tagen“.
4. Ein leeres Kursfeld wurde als Kurs 0 gewertet, ohne Fehlermeldung.
5. Bei einer Fehlermeldung blieben die alten Zahlen stehen, als wären sie aktuell.
6. Bei einer Zuteilung am 29. Februar begann das Diagramm am 28. Februar.

Alle sechs wurden behoben. In der App nachgeprüft hat Claude die Fehler 1, 4, 5 und 6 sowie die Einzahl „1 Aktie“ aus Fehler 3 (mit 1 Aktie, leerem Kurs und einer Zuteilung am 29. Februar). Den Countdown (Fehler 2) und „morgen“ statt „in 1 Tagen“ hat Claude dort nicht nachgestellt. Für Fehler 1 gibt es einen neuen Test (jetzt 10 Tests).

## Prompt 3 (22.10.2026, 11:38)

> super dann push das auf github lade den prof ein u. dann passt das

**Was passiert ist:** Claude hat mit „Mach ich.“ zugestimmt und sich als Plan notiert, zu committen, zu pushen und den Prof einzuladen. Vorher wollte Claude aber noch den Erfahrungsbericht schreiben, weil der laut Aufgabe noch fehlt.

## Prompt 4 (22.10.2026, 11:38)

> stopp

**Was passiert ist:** Claude hat sofort aufgehört. Bis dahin war nur die Uhrzeit für dieses Protokoll abgefragt worden, gepusht oder eingeladen war noch nichts.

## Prompt 5 (22.10.2026, 11:39)

> der prof gehört nicht eingalden, schau nocheinmal

(Dazu habe ich die Aufgabenstellung aus Sakai eingefügt.)

**Was passiert ist:** Claude hat bestätigt, dass in dieser Aufgabe nichts vom Einladen steht, und darauf hingewiesen, dass der Prof ein privates Repo ohne Einladung gar nicht öffnen könnte. Danach hat Claude zwei Auswahlfragen gestellt.

## Prompt 6 (22.10.2026, 11:39): Antworten auf die Rückfrage

Ausgewählt habe ich:

> Wie soll der Prof an den Code kommen, ohne eingeladen zu werden? **Öffentliches Repo** (Jeder mit dem Link sieht den Code. Im Sakai-Text reicht der Link, eine Einladung ist nicht nötig.)
>
> Wie soll der Erfahrungsbericht entstehen? **Entwurf aus Protokoll** (Ich schreibe ihn nur aus dem, was wirklich passiert ist (Prompts, Rückfrage, 6 gefundene Fehler). Du liest drüber und ergänzt deinen Eindruck.)

**Was passiert ist:** Claude hat aus Protokoll, Git-Historie und Code einen Entwurf des Erfahrungsberichts in die README geschrieben und ihn vor dem Push von weiteren KI-Agenten gegen diese Quellen prüfen lassen. Die Prüfung hat in Protokoll und Bericht 16 Ungenauigkeiten gefunden, zum Beispiel eine falsche Anzahl an Prompts, eine falsche Uhrzeit, einen fehlenden ersten Eintrag und die Behauptung, alle Korrekturen seien in der App nachgeprüft worden. Claude hat alle 16 korrigiert. Eine weitere Rückfrage von Claude, ob vor dem Veröffentlichen die E-Mail-Adresse in den Commits ersetzt werden soll, habe ich abgebrochen.

## Prompt 7 (22.10.2026, 16:38): Antwort auf die Rückfrage

Claude hat noch einmal gefragt, mit welcher E-Mail-Adresse das öffentliche Repo gepusht werden soll, weil in den Commits meine private Adresse stand. Angeklickt habe ich:

> **Anonyme Adresse** (Ersetze die E-Mail durch die anonyme GitHub-Adresse von Cmort-bot und push dann öffentlich, ohne den Prof einzuladen.)

**Was passiert ist:** Claude hat in allen Commits die E-Mail-Adresse durch die anonyme GitHub-Adresse ersetzt (Name und Zeitstempel blieben gleich) und das Repo öffentlich auf GitHub gestellt, ohne jemanden einzuladen.
