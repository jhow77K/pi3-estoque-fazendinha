
function lerTextoSelecionado() {
  const texto = window.getSelection().toString();

  if (!texto) {
    alert("Selecione um texto primeiro.");
    return;
  }

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  speechSynthesis.speak(fala);
}

// BOTÃO
const botao = document.createElement("button");
botao.innerText = "🔊 Ler texto";
botao.style.position = "fixed";
botao.style.bottom = "20px";
botao.style.right = "20px";
botao.style.zIndex = "9999";

botao.onclick = lerTextoSelecionado;

document.body.appendChild(botao);

// ATALHO DE TECLADO (CTRL + SHIFT + L)
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
    lerTextoSelecionado();
  }
});