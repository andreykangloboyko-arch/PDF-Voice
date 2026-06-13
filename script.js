let anuncioVisto=false;
let detenido = false;
let pausado = false;

async function leerPDF(){
if(
!anuncioVisto
){

alert(
"Primero mira el anuncio"
);

return;

}
detenido = false;

const archivo =
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

const buffer =
await archivo.arrayBuffer();

const pdf =
await pdfjsLib
.getDocument({
data:buffer
})
.promise;

let paginaActual =
Number(
localStorage.getItem(
"pagina"
)
)
||
1;

for(
let i=paginaActual;
i<=pdf.numPages;
i++
){

if(
detenido
){

break;

}

localStorage.setItem(
"pagina",
i
);

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

const progreso =
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
"barra"
)
.value =
progreso;

document
.getElementById(
"porcentaje"
)
.innerText =
progreso
+
"%";

  const velocidad =
Number(
document
.getElementById(
"velocidad"
)
.value
);

const paginasRestantes =
pdf.numPages
-
i;

const minutos =
Math.ceil(
(
paginasRestantes
*
1.5
)
/
velocidad
);

const horas =
Math.floor(
minutos
/
60
);

const mins =
minutos
%
60;

document
.getElementById(
"tiempo"
)
.innerText =
horas>0
?
"⏳ Quedan ~"
+
horas
+
"h "
+
mins
+
" min"
:
"⏳ Quedan ~"
+
mins
+
" min";
  
const pagina =
await pdf.getPage(i);

const contenido =
await pagina
.getTextContent();

const texto =
contenido.items
.map(
x=>x.str
)
.join(" ");

if(
texto.length<20
){

continue;

}

await new Promise(
resolve=>{

const voz =
new SpeechSynthesisUtterance(
texto
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

speechSynthesis
.speak(
voz);

});

while(
speechSynthesis.paused
){

await new Promise(
r=>
setTimeout(
r,
300
)
);

}

}

document
.getElementById(
"estado"
)
.innerText=
detenido
?
"Parado ⏹"
:
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

const pagina =
localStorage.getItem(
"pagina"
);

const archivo =
document
.getElementById(
"pdf"
)
.files[0];

if(
archivo
){

document
.getElementById(
"estado"
)
.innerText=
"Página "
+
pagina
+
" de 150 🔊";

}else{

document
.getElementById(
"estado"
)
.innerText=
"Reanudado ▶️";

}

}

function parar(){

detenido = true;

speechSynthesis.cancel();

document
.getElementById(
"estado"
)
.innerText=
"Parado ⏹";

document
.getElementById(
"pdf"
).value="";

}

function reiniciar(){

localStorage.removeItem(
"pagina"
);

speechSynthesis.cancel();

document
.getElementById(
"pdf"
).value="";

document
.getElementById(
"barra"
).value=0;

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
"Progreso borrado 🗑";

}
function modoOscuro(){

document
.body
.classList
.toggle(
"oscuro"
);

const boton =
document
.getElementById(
"tema"
);

if(
document
.body
.classList
.contains(
"oscuro"
)
){

boton
.innerText=
"☀️ Modo claro";

}else{

boton
.innerText=
"🌙 Modo oscuro";

}

}
function verAnuncio(){

const contador =
document
.getElementById(
"contador"
);

contador.innerText =
"⏳ Cargando...";

setTimeout(
()=>{

anuncioVisto =
true;

contador.innerText =
"✅ Ya puedes leer";

},
5000
);

}
