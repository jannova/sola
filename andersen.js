var tabela_ime_spremenljivka = {};
var tabela_spremenljivka_ime = [];

var stavki = [];

function Stavek (x_stopnja, x, y_stopnja, y) {
	this.x_stopnja = x_stopnja;
	this.x = x;
	this.y_stopnja = y_stopnja;
	this.y = y;
	
	return this;
}

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
		var y = tabela_ime_spremenljivka[y_ime];
		
		if (x === undefined)
			x = dodaj_ime (x_ime);
		if (y === undefined)
			y = dodaj_ime (y_ime)
		
		var x_stopnja = (sintakticni_elementi[1])? sintakticni_elementi[1].length : 1;
		var y_stopnja = (sintakticni_elementi[4])? 0 : ((sintakticni_elementi[3])? sintakticni_elementi[3].length : 1);

		stavki.push(new Stavek(x_stopnja, x, y_stopnja, y));
	}
}

var kazalna_tabela;

function zdruzi_s_stolpcem (x, y) {
	for (var i = 0; i < kazalna_tabela.length; i++)
		if (kazalna_tabela[y][i])
			kazalna_tabela[x][i] = true;
}

function pripravi_kazalno_tabelo () {
	kazalna_tabela = new Array(tabela_spremenljivka_ime.length);
	
	for (var i = 0; i < kazalna_tabela.length; i++) {
		kazalna_tabela[i] = new Array(kazalna_tabela.length);
		
		for (var j = 0; j < kazalna_tabela.length; j++)
			kazalna_tabela[i][j] = false;
	}
	
	for (var s = 0; s < stavki.length; s++) /* x = &y */
		if (stavki[s].x_stopnja == 1 && stavki[s].y_stopnja == 0) {
			kazalna_tabela[stavki[s].x][stavki[s].y] = true;
			stavki[s] = undefined;
		}
	
	for (var s = 0; s < stavki.length; s++) /* x = y */
		if (stavki[s] && stavki[s].x_stopnja == 1 && stavki[s].y_stopnja == 1) {
			zdruzi_s_stolpcem (stavki[s].x, stavki[s].y);
			stavki[s] = undefined;
		}
}

function rekurzivna_unija (unija, a, stopnja) {
	if (stopnja)
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (kazalna_tabela[a][i])
				rekurzivna_unija (unija, i, stopnja - 1);
	else
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (kazalna_tabela[a][i])
				unija[i] = true;
}

function unija (a, stopnja) {
	var unija = new Array(kazalna_tabela.length);
	
	for (var i = 0; i < unija.length; i++)
		unija[i] = false;
	
	rekurzivna_unija (unija, a, stopnja);
	return unija;
}

function rekurzivno_zdruzevanje (a, stopnja, unija) {
	var sprememba = false;
	
	if (stopnja)
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (kazalna_tabela[a][i])
				sprememba = sprememba || rekurzivno_zdruzevanje (i, stopnja - 1, unija);
	else
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (unija[i])
				if (!kazalna_tabela[a][i]) {
					kazalna_tabela[a][i] = true;
					sprememba = true;
				}
	return sprememba;
}

function andersen () {
	prevedi_sintakso ();
	pripravi_kazalno_tabelo ();
	
	var sprememba = true;
	
	while (sprememba) {
		sprememba = false;
		
		for (var s = 0; s < stavki.length; s++)
			if (stavki[s])
				sprememba = rekurzivno_zdruzevanje (stavki[s].x, stavki[s].x_stopnja, unija (stavki[s].y, stavki[s].y_stopnja))
	}
	
	narisi_graf ();
}

function narisi_graf () {
	var vozlisca = new Array(tabela_spremenljivka_ime.length);
	var povezave = [];
	
	for (var i = 0; i < tabela_spremenljivka_ime.length; i++)
		vozlisca[i] = {data: {id: i.toString(), name: tabela_spremenljivka_ime[i]}};
	
	for (var i = 0; i < kazalna_tabela.length; i++)
		for (var j = 0; j < kazalna_tabela.length; j++)
			if (kazalna_tabela[i][j])
				povezave.push({data: {source: i.toString(), target: j.toString()}});
	
	$('#cy').cytoscape ({elements:{nodes: vozlisca, edges: povezave}})
}
