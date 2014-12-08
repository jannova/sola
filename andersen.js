var tabela_ime_spremenljivka;
var tabela_spremenljivka_ime;

var stavki;

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
	tabela_ime_spremenljivka = {};
	tabela_spremenljivka_ime = [];

	stavki = [];

	var koda = document.getElementById("vnosno_polje_za_kodo").value;
	
	if (!koda)
		return false;
	
	var goli_stavki = koda.split('\n');
	
	for (var i = 0; i < goli_stavki.length; i++) {
		var sintakticni_elementi = /\s*([\*]*)\s*(\w+)\s*=\s*([\*]*)(&?)\s*(\w+)/.exec(goli_stavki[i]);
		
		if (!sintakticni_elementi || (sintakticni_elementi[3] && sintakticni_elementi[4]))
			throw new Error("sintakticna napaka v stavku" + (i + 1));

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
	
	return true;
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
		if (stavki[s] && stavki[s].x_stopnja == 1 && stavki[s].y_stopnja == 0) {
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
	if (stopnja > 1)
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (kazalna_tabela[a][i])
				rekurzivna_unija (unija, i, stopnja - 1);
	else
		for (var i = 0; i < kazalna_tabela.length; i++)
			if (kazalna_tabela[a][i])
				unija[i] = true;
}

function rekurzivno_zdruzevanje (a, stopnja, unija) {
	var sprememba = false;
	
	if (stopnja > 1)
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

var height = 400;
var width = 400;

function narisi_graf () {
	var g = new Graph();
	var layouter = new Graph.Layout.Spring(g);
	var renderer = new Graph.Renderer.Raphael("graf", g, width, height);

	for (var i = 0; i < kazalna_tabela.length; i++)
		for (var j = 0; j < kazalna_tabela.length; j++)
			if (kazalna_tabela[i][j])
				g.addEdge(tabela_spremenljivka_ime[i], tabela_spremenljivka_ime[j], {directed: true});

	layouter.layout();
	renderer.draw();

	var div_graf = document.getElementById("graf");
	if (div_graf.childNodes.length == 2)
		div_graf.removeChild(div_graf.childNodes[1]);
};

function andersen () {
	if (prevedi_sintakso ()) {
		pripravi_kazalno_tabelo ();
	
		var sprememba = true;
	
		while (sprememba) {
			sprememba = false;
		
			for (var s = 0; s < stavki.length; s++)
				if (stavki[s]) {
					var unija = new Array(kazalna_tabela.length);
					
					for (var i = 0; i < unija.length; i++)
						unija[i] = false;
					
					console.log (stavki[s]);
					
					rekurzivna_unija (stavki[s].y, stavki[s].y_stopnja, unija);
					
					for (var i = 0; i < unija.length; i++)
						if (unija[i])
							console.log (tabela_spremenljivka_ime[i] + " ");
					
					sprememba = rekurzivno_zdruzevanje (stavki[s].x, stavki[s].x_stopnja, unija);
				}
		}
	} else
		kazalna_tabela = [];

	narisi_graf ();
}
