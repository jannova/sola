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
				enako.push([x, y]);
			else
				levi_deref.push([x, y]);
		} else if (opY == '*')
			desni_deref.push([x, y])
		else if (opY == '&')
			naslov.push([x, y]);
		else
			enako.push([x, y]);
	}
}

function andersen () {
	preberi ();

	var kaze_na = new Array(spremenljivke.length);
	
	for (var i = 0; i < kaze_na.length; i++)
		kaze_na[i] = [];
	
	var sprememba = false;
	
	while (sprememba) {
		
	}
}
