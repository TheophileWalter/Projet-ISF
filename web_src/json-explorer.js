function renderJSON(o, key) {
    // La clé de l'objet courant
    if (typeof key == "undefined") {
        key = "json-" + Math.random() + ".";
    }
    // Contient le code HTML généré
    var result = "";
    // Choisi le rendu à utiliser en fonction du type de variable
    if (typeof o == "object" && o !== null) {
        // On doit vérifier si l'objet est un tableau,
        // car un tableau est de type "object"
        if (Array.isArray(o)) {
            // Si c'est un tableau
            result += "<div class=\"json-pointer-collapsed\" onclick=\"javascript:toogleObject('"+key+"');\" id=\"" + key + "-button\">[</div><div class=\"json-array\" id=\"" + key + "-content\">";
            // Parcours les valeurs du tableau
            for (var i = 0; i < o.length; i++) {
                var newKey = key + '.' + i;
                // Ajoute le contenu
                result += "<div class=\"json-array-content\">" + renderJSON(o[i], newKey) + (i < o.length-1 ? ", " : "") + "</div>";
            }
            // Ajoute la partie réduite
            result += "</div><span class=\"json-collapsed\" onclick=\"javascript:toogleObject('"+key+"');\" id=\"" + key + "-collapsed\"></span>";
            result += "<div class=\"json-pointer\" onclick=\"javascript:toogleObject('"+key+"');\">]</div>";
        } else {
            // Si c'est un objet
            result += "<div class=\"json-pointer-collapsed\" onclick=\"javascript:toogleObject('"+key+"');\" id=\"" + key + "-button\">{</div><div class=\"json-object\" id=\"" + key + "-content\">";
            // Nombre d'attributs
            var size = objectLength(o), i = 0;
            // Parcours des clés
            for (var k in o) {
                i++;
                var newKey = key + '.' + k;
                // Ajoute le contenu
                result += "<div class=\"json-object-content\">" + escapeHtml(k) + " : " + renderJSON(o[k], newKey) + (i < size ? ", " : "") + "</div>";
            }
            // Ajoute la partie réduite
            result += "</div><span class=\"json-collapsed\" onclick=\"javascript:toogleObject('"+key+"');\" id=\"" + key + "-collapsed\"></span>";
            result += "<div class=\"json-pointer\" onclick=\"javascript:toogleObject('"+key+"');\">}</div>";
        }
    } else if (o === null) {
        // null est par défaut reconnu comme un objet, il faut donc le traiter à part
        result += "null";
    } else {
        // Si ce n'est pas un objet, alors c'est une valeur
        result += escapeHtml(o);
    }
    
    // Renvoie le code HTML
    return result;
}

// Affiche/cache un objet
function toogleObject(key) {
    var e = document.getElementById(key + "-content");
    var eCollapsed = document.getElementById(key + "-collapsed");
    var eButton = document.getElementById(key + "-button");
    if (eCollapsed.style.display == "none") {
        e.style.display = "none";
        eCollapsed.style.display = "inline";
        eButton.className = "json-pointer-collapsed";
    } else {
        e.style.display = "block";
        eCollapsed.style.display = "none";
        eButton.className = "json-pointer-expended";
    }
}

// Prépare un text pour être affiché
function escapeHtml(text) {
    if (typeof text != "string") {
        return text;
    }
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '\\&quot;',
        "'": '&#039;'
    };
    return '"' + text.replace(/[&<>"']/g, function(m) { return map[m]; }) + '"';
}

// Retourne le nombre d'attributs d'un objet
function objectLength(o) {
    i = 0;
    for (var k in o) i++;
    return i;
}