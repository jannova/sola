var tabela_ime_spremenljivka = {};
var tabela_spremenljivka_ime = [];

var stavki = [];

function dodaj_ime (ime) {
	var naslednja_spremenljivka = tabela_spremenljivka_ime.length;
	tabela_ime_spremenljivka[ime] = naslednja_spremenljivka;
	tabela_spremenljivka_ime.push(ime);
	
	return naslednja_spremenljivka;
}

function prevedi_sintakso () {
	var goli_stavki = document.getElementById("vnosno_polje_za_kodo").value.split('\n');
	
	for (var i = 0; i < goli_stavki.length; i++) {
		var sintakticni_elementi = /\s*([\*]?)\s*(\w+)\s*=\s*([\*]?)(&?)\s*(\w+)/.exec(goli_stavki[i]);
		
		if (!sintakticni_elementi || (sintakticni_elementi[3] && sintakticni_elementi[4]))
			throw new Error("sintakticna napaka na stavku" + (i + 1));

		var naslednja_spremenljivka = tabela_spremenljivka_ime.length;

		var x_ime = sintakticni_elementi[2];
		var y_ime = sintakticni_elementi[5];
		var x = tabela_ime_spremenljivka[x_ime];
		var y = tabela_ime_spremenljivka[y_ime;
		
		if (x === undefined)
			x = dodaj_ime (x_ime);
		if (y === undefined)
			y = dodaj_ime (y_ime)
		
		var leva_stopnja = (sintakticni_elementi[1])? sintakticni_elementi[1].length : 1;
		var desna_stopnja = (sintakticni_elementi[4])? 0 : ((sintakticni_elementi[3])? sintakticni_elementi[3].length : 1);

		stavki.push([leva_stopnja, x, desna_stopnja, y]);
	}
}
