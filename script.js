let detenido=false;

async function leerPDF(){

detenido=false;

const archivo=
document
.getElementById("pdf")
.files[0];

if(!archivo){

alert(
"Sube un PDF"
);

return;

}

speechSynthesis.cancel();

const buffer=
await archivo.arrayBuffer();

const pdf=
await pdfjsLib
.getDocument({
data:buffer
})
.promise;

for(
let i=1;
i<=pdf.numPages;
i++
){

if(
detenido
){

break;

}

document
.getElementById(
"estado"
)
.innerText=
"Página "
+
i
+
" de "
+
pdf.numPages
+
" 🔊";

document
.getElementById(
"barra"
)
.value=
Math.round(
(
i
/
pdf.numPages
)
*
100
);

document
.getElementById(
"porcentaje"
)
.innerText=
Math.round(
(
i
/
pdf.numPages
)
*
100
)
+
"%";

const pagina=
await pdf.getPage(i);

const contenido=
await pagina.getTextContent();

const texto=
contenido.items
.map(
x=>x.str
)
.join(" ");

if(
texto.trim()
===""
){

continue;

}

await new Promise(
resolve=>{

const voz=
new SpeechSynthesisUtterance(
texto
.slice(
0,
3000
)
);

voz.lang=
document
.getElementById(
"voz"
)
.value;

voz.rate=
Number(
document
.getElementById(
"velocidad"
)
.value
);

voz.onend=
resolve;

voz.onerror=
resolve;

speechSynthesis.speak(
voz
);

});

}

document
.getElementById(
"estado"
)
.innerText=
"Terminado ✅";

}

function pausar(){

speechSynthesis.pause();

document
.getElementById(
"estado"
)
.innerText=
"Pausado ⏸";

}

function continuar(){

speechSynthesis.resume();

document
.getElementById(
"estado"
)
.innerText=
"Reanudado ▶️";

}

function parar(){

detenido=true;

speechSynthesis.cancel();

document
.getElementById(
"estado"
)
.innerText=
"Parado ⏹";

}

function reiniciar(){

speechSynthesis.cancel();

document
.getElementById(
"barra"
)
.value=0;

document
.getElementById(
"porcentaje"
)
.innerText=
"0%";

document
.getElementById(
"estado"
)
.innerText=
"Esperando PDF...";

}

function modoOscuro(){

document
.body
.classList
.toggle(
"oscuro"
);

const boton=
document
.getElementById(
"tema"
);

boton.innerText=
document.body.classList.contains(
"oscuro"
)
?
"☀️ Modo claro"
:
"🌙 Modo oscuro";

}
