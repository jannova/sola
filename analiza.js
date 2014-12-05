var stavki;

var simbol_spremenljivka = {};
var spremenljivka_simbol = [];

var enako = [];
var levi_deref = [];
var desni_deref = [];
var naslov = [];

function dodaj_simbol (simbol) {
	var zadetek = simbol_spremenljivka[simbol]
	
	if (zadetek)
		return zadetek
	else {
		var naslednja = spremenljivka.length;
		simbol_spremenljivka[simbol] = naslednja;
		spremenljivka_simbol.push(simbol);
		return naslednja;
	}
}

function preberi () {
	var stavki__ = document.getElementByID("koda").value.split('\n');

	for (var i = 0; i < stavki__.length; i++) {
		var sintakticni_elementi = /([\*]?)(\w+)=([\*&]?)(\w+)/.exec(stavki__[i]);
		var x = sintakticni_elementi[2];
		var y = sintakticni_elementi[4];

		var opX = sintakticni_elementi[1];
		var opY = sintakticni_elementi[3];

		x = dodaj_simbol(x);
		y = dodaj_simbol(y);
		
		if (opX) {
			if (opY)
				enako.push({x: x, y: y});
			else
				levi_deref.push({x: x, y: y});
		} else if (opY == '*')
			desni_deref.push({x: x, y: y})
		else if (opY == '&')
			naslov.push({x: x, y: y});
		else
			enako.push({x: x, y: y});
	}
}

function andersen () {
	preberi ();

	var deref = new Array(spremenljivke.length);
	
	for (var i = 0; i < deref.length; i++)
		deref[i] = {};

	for (var i = 0; i < naslov.length; i++) {
		x = naslov[i].x;
		y = naslov[i].y;

		deref[x][y] = true;
	}

	var sprememba = false;
	
	while (sprememba) {
		for (var i = 0; i < enako.length; i++) {
			x = naslov[i].x;
			y = naslov[i].y;

			for ()
		}
		
		for (var i = 0; i < desni_deref.length; i++) {
			x = naslov[i].x;
			y = naslov[i].y;

		}
		
		for (var i = 0; i < levi_deref.length; i++) {
			x = naslov[i].x;
			y = naslov[i].y;

		}
	}
}
