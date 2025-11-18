function changeValue(id, delta) {
    const input = document.getElementById(id);
    let value = parseInt(input.value) || 0;
    value = Math.max(0, value + delta);
    input.value = Math.min(99, value);

    if (id === 'startwert' && value !== 0) {
        document.getElementById('aktivieren').checked = false;
    }
}

function handleAktivierenChange() {
    const aktivieren = document.getElementById('aktivieren').checked;
    const startwertInput = document.getElementById('startwert');

    if (aktivieren) {
        startwertInput.value = 0;
    }
}

const kostenTabelle = {
    "A*": [5, 1, 1, 1, 2, 4, 5, 6, 8, 9, 11, 12, 14, 15, 17, 19, 20, 22, 24, 25, 27, 29, 31, 32, 34, 36, 38, 40, 42, 43, 45, 48, 666],
    "A": [5, 1, 2, 3, 4, 6, 7, 8, 10, 11, 13, 14, 16, 17, 19, 21, 22, 24, 26, 27, 29, 31, 33, 34, 36, 38, 40, 42, 44, 45, 47, 50, 725],
    "B": [10, 2, 4, 6, 8, 11, 14, 17, 19, 22, 25, 28, 32, 35, 38, 41, 45, 48, 51, 55, 58, 62, 65, 69, 73, 76, 80, 84, 87, 91, 95, 100, 1451],
    "C": [15, 2, 6, 9, 13, 17, 21, 25, 29, 34, 38, 43, 47, 51, 55, 60, 65, 70, 75, 80, 85, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 150, 2165],
    "D": [20, 3, 7, 12, 17, 22, 27, 33, 39, 45, 50, 55, 65, 70, 75, 85, 90, 95, 105, 110, 115, 125, 130, 140, 145, 150, 160, 165, 170, 180, 190, 200, 2895],
    "E": [25, 4, 9, 15, 21, 28, 34, 41, 48, 55, 65, 70, 80, 85, 95, 105, 110, 120, 130, 135, 145, 155, 165, 170, 180, 190, 200, 210, 220, 230, 240, 250, 3630],
    "F": [40, 6, 14, 22, 32, 41, 50, 60, 75, 85, 95, 105, 120, 130, 140, 155, 165, 180, 195, 210, 220, 230, 250, 260, 270, 290, 300, 310, 330, 340, 350, 375, 5445],
    "G": [50, 8, 18, 30, 42, 55, 70, 85, 95, 110, 125, 140, 160, 175, 190, 210, 220, 240, 260, 270, 290, 310, 330, 340, 360, 380, 400, 420, 440, 460, 480, 500, 7263],
    "H": [100, 16, 35, 60, 85, 110, 140, 165, 195, 220, 250, 280, 320, 350, 380, 410, 450, 480, 510, 550, 580, 620, 650, 690, 720, 760, 800, 830, 870, 910, 950, 1000, 14486],
};

function verschiebeSpalte(aktuelleSpalte, verschiebung) {
    const spaltenReihenfolge = ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const aktuellerIndex = spaltenReihenfolge.indexOf(aktuelleSpalte);
    const neuerIndex = Math.min(aktuellerIndex + verschiebung, 8);
    return spaltenReihenfolge[neuerIndex];
}

function berechneKosten(komplexitaet, startwert, zielwert, aktivieren) {
    let gesamtkosten = 0;
    let schritte = [];
    let letzteSpalte = komplexitaet;

    if (aktivieren) {
        const aktivierungskosten = kostenTabelle[komplexitaet][0];
        gesamtkosten += aktivierungskosten;
        schritte.push(`Aktivierung: ${aktivierungskosten} (${komplexitaet})`);
        startwert = 0;
    }

    for (let stufe = startwert + 1; stufe <= zielwert; stufe++) {
        let spalte = komplexitaet;
        if (stufe >= 16) {
            spalte = verschiebeSpalte(komplexitaet, 2);
        } else if (stufe >= 11) {
            spalte = verschiebeSpalte(komplexitaet, 1);
        }

        if (spalte !== letzteSpalte) {
            schritte.push(`<span class="komplexitaetswechsel">→ Komplexität wechselt zu ${spalte}</span>`);
            letzteSpalte = spalte;
        }

        const kosten = kostenTabelle[spalte][stufe];
        gesamtkosten += kosten;
        schritte.push(`Stufe ${stufe-1} → ${stufe}: ${kosten} (${spalte})`);
    }

    return { gesamtkosten, schritte };
}

function zeigeErgebnis() {
    const komplexitaet = document.getElementById('komplexitaet').value;
    const startwertInput = document.getElementById('startwert');
    const zielwert = parseInt(document.getElementById('zielwert').value);
    const aktivieren = document.getElementById('aktivieren').checked;

    let startwert = aktivieren ? 0 : parseInt(startwertInput.value);

    if (isNaN(startwert) || isNaN(zielwert) || startwert < 0 || zielwert < startwert) {
        alert('Bitte gültige Werte eingeben: Startwert muss kleiner als Zielwert sein und beide müssen ≥ 0.');
        return;
    }

    const ergebnis = berechneKosten(komplexitaet, startwert, zielwert, aktivieren);

    const ergebnisDiv = document.getElementById('ergebnis');
    ergebnisDiv.innerHTML = `
        <h3>Berechnungsschritte:</h3>
        <ul>
            ${ergebnis.schritte.map(schritt => `<li>${schritt}</li>`).join('')}
        </ul>
        <h3>Gesamtkosten: ${ergebnis.gesamtkosten}</h3>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('berechnen').addEventListener('click', zeigeErgebnis);
});
