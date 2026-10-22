# Prompt-Protokoll

Tool: **Claude Code** (Desktop-App, Modell Claude Opus 5.5)
Alle Prompts stehen hier wörtlich, inklusive Tippfehlern. Unter jedem Prompt steht kurz, was daraufhin passiert ist.

---

## Prompt 1 (22.10.2026, 11:22)

> erstelle mir ein rsu programm von xyz ich glaub das passt vllt nicht so schlecht

**Was passiert ist:** Claude hat nicht sofort losprogrammiert, sondern nachgefragt, weil „RSU“ und „xyz“ mehrdeutig sind (z. B. Restricted Stock Units einer Firma oder etwas ganz anderes).

## Prompt 2 (22.10.2026, 11:24): Antworten auf die Rückfrage

Claude hat zwei Auswahlfragen gestellt, ausgewählt habe ich:

> Was meinst du mit „RSU-Programm“? **Aktien-RSU-Rechner** (Restricted Stock Units einer Firma: Zuteilung, Vesting-Plan, wie viel schon gevestet ist und was es wert ist)
>
> Ist „xyz“ eine echte Firma oder nur ein Platzhalter? **Platzhalter** (fiktive Firma „XYZ“, die Daten gibt man selbst ein)

**Was passiert ist:** Claude hat daraus ohne weitere Fragen eine erste Version gebaut und dabei selbst sinnvolle Standardwerte gewählt (1.200 RSUs, 4 Jahre Vesting, 12 Monate Cliff, quartalsweise, Kurs 85 USD). Die Version 1 ist eine Web-App ohne Installation (`index.html` im Browser öffnen) mit:

- Formular für Firma, Anzahl, Zuteilungsdatum, Dauer, Cliff, Intervall, Kurs, Währung und optionalem Steuersatz
- Übersicht: gevestet, noch offen, nächster Termin, Fortschrittsbalken
- Verlaufsdiagramm (Treppenkurve mit „heute“-Markierung) und Tabelle mit allen Vesting-Terminen
- Speichern der Eingaben im Browser (localStorage)
- 9 automatischen Tests für die Rechenlogik (`npm test`), z. B. Monatsende und Cliff länger als die Laufzeit

Dauer: rund 5 Minuten. Ein Problem gab es nur beim Starten der Vorschau (Port-Konflikt des lokalen Servers), nicht in der App selbst.

## Selbstprüfung durch Claude (ohne neuen Prompt, 22.10.2026, ca. 11:30 bis 11:45)

Claude hat die eigene Version 1 von zwei zusätzlichen Prüf-Agenten testen lassen: einer hat die Rechenlogik mit über 2 Mio. zufälligen Kombinationen geprüft, einer die Oberfläche. Jeder Fund wurde von einem weiteren Agenten nachgestellt. Obwohl die 9 eigenen Tests grün waren, wurden **6 echte Fehler** gefunden:

1. Bei kleinen Zuteilungen (z. B. 1 RSU) zeigte die App Termine mit „0 Aktien“ als „Nächstes Vesting“ an.
2. Der Countdown „in X Tagen“ war rund um die Zeitumstellung einen Tag daneben.
3. Immer Mehrzahl: „1 Aktien“, „in 1 Tagen“.
4. Ein leeres Kursfeld wurde als Kurs 0 gewertet, ohne Fehlermeldung.
5. Bei einer Fehlermeldung blieben die alten Zahlen stehen, als wären sie aktuell.
6. Bei einer Zuteilung am 29. Februar begann das Diagramm am 28. Februar.

Alle sechs wurden behoben und in der App nachgeprüft, für Fehler 1 gibt es einen neuen Test (jetzt 10 Tests).
