var tabela_ime_spremenljivka = {};
var tabela_spremenljivka_ime = [];

var stavki = [];

function prevedi_sintakso () {
	var goli_stavki = document.getElementById("vnosno_polje_za_kodo").value.split('\n');
	
	for (var i = 0; i < goli_stavki.length; i++) {
		var sintakticni_elementi = /\s*([\*]?)\s*(\w+)\s*=\s*([\*]?)(&?)\s*(\w+)/.exec(goli_stavki[i]);
	}
}
