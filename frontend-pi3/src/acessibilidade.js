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

// Estilização padronizada com o projeto
botao.style.backgroundColor = "#0d6efd"; // Azul vibrante no padrão do projeto
botao.style.color = "#ffffff";
botao.style.border = "none";
botao.style.borderRadius = "50px"; // Bordas arredondadas (estilo pílula)
botao.style.padding = "10px 20px"; // Espaçamento interno para não colar no texto
botao.style.fontWeight = "bold"; // Deixa a fonte mais forte
botao.style.fontFamily = "inherit"; // Herda a fonte (provavelmente Inter ou Roboto) do projeto
botao.style.cursor = "pointer"; // Muda o cursor para a mãozinha ao passar o mouse
botao.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // Leve sombra para destacar o botão flutuante

botao.onclick = lerTextoSelecionado;

document.body.appendChild(botao);

// ATALHO DE TECLADO (CTRL + SHIFT + L)
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
    lerTextoSelecionado();
  }
});