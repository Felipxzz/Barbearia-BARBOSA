# Barbearia Barbosa Online

<!DOCTYPE html>

<html lang="pt-br">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Barbearia Barbosa</title>

<style>

*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif;}

body{background:#0f0f0f;color:white;}

.hero{

height:180px;

background:linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.8)),

url('https://images.unsplash.com/photo-1512690459411-b9245aed614b');

background-size:cover;background-position:center;

display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;}

.hero h1{color:#d4af37;font-size:28px;}

.hero p{opacity:0.8;}

.container{padding:20px;padding-bottom:160px;}

.section{margin-bottom:30px;}

.section h2{color:#d4af37;margin-bottom:15px;font-size:18px;}

input, textarea{width:100%;padding:14px;border-radius:10px;border:none;background:#1c1c1c;color:white;font-size:15px;}

textarea{resize:none;height:80px;}

.servicos, .barbeiros{display:flex;flex-direction:column;gap:10px;}

.servico-card, .barbeiro-card, .obs-card{background:#1a1a1a;padding:15px;border-radius:12px;border:1px solid rgba(212,175,55,0.2);cursor:pointer;transition:0.3s;display:flex;align-items:center;gap:10px;}

.servico-card:hover, .barbeiro-card:hover, .obs-card:hover{transform:scale(1.02);}

.servico-card.active, .barbeiro-card.active{background:#d4af37;color:black;font-weight:bold;}

.galeria{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;margin-top:10px;}

.galeria img{width:100%;height:140px;object-fit:cover;border-radius:12px;transition:0.3s;}

.galeria img:hover{transform:scale(1.05);}

.barbeiro-card img{width:50px;height:50px;border-radius:50%;object-fit:cover;}

.dias{display:flex;overflow-x:auto;gap:10px;margin-top:10px;margin-bottom:10px;}

.dias button{flex:0 0 auto;padding:12px 15px;border:none;border-radius:12px;background:#1c1c1c;color:white;cursor:pointer;transition:0.3s;}

.dias button.selected{background:#d4af37;color:black;font-weight:bold;}

.dias button.disabled{background:#444;opacity:0.5;cursor:not-allowed;}

.horarios{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px;}

.horarios button{padding:12px;border:none;border-radius:8px;background:#1c1c1c;color:white;cursor:pointer;transition:0.2s;}

.horarios button.selected{background:#d4af37;color:black;font-weight:bold;}

.horarios button.disabled{background:#444;opacity:0.5;cursor:not-allowed;}

.btn-agendar{position:fixed;bottom:0;left:0;width:100%;padding:25px;border:none;background:linear-gradient(90deg,#d4af37,#f5d76e);font-size:20px;font-weight:bold;letter-spacing:1px;cursor:pointer;box-shadow:0 -4px 20px rgba(212,175,55,0.4);transition:0.3s;}

.btn-agendar:active{transform:scale(0.97);}

</style>

</head>

<body>

<div class="hero">

<h1>💈 Barbearia Barbosa</h1>

<p>Seu estilo começa aqui</p>

</div>

<div class="container">

<!-- Galeria de cortes no topo -->

<div class="section">

<h2>Cortes Recentes</h2>

<div class="galeria">

<img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033" alt="Corte 1">

<img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a" alt="Corte 2">

<img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486" alt="Corte 3">

<img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70" alt="Corte 4">

</div>

</div>

<div class="section">

<h2>Seus Dados</h2>

<input type="text" id="nome" placeholder="Seu nome">

<input type="tel" id="telefoneCliente" placeholder="Seu telefone">

<div class="obs-card">

<textarea id="observacoes" placeholder="OBS: Informações adicionais"></textarea>

</div>

</div>

<div class="section">

<h2>Escolha o Serviço</h2>

<div class="servicos">

<div class="servico-card" onclick="selecionarServico(this,'Corte Avulso - R$30')">Corte Avulso – R$30</div>

<div class="servico-card" onclick="selecionarServico(this,'Plano Mensal - R$70')">Plano Mensal – R$70</div>

<div class="servico-card" onclick="selecionarServico(this,'Pezinho - R$10')">Pezinho – R$10</div>

<div class="servico-card" onclick="selecionarServico(this,'Barba - R$15')">Barba – R$15</div>

<div class="servico-card" onclick="selecionarServico(this,'Corte + Barba - R$40')">Corte + Barba – R$40</div>

</div>

</div>

<div class="section">

<h2>Escolha o Barbeiro</h2>

<div class="barbeiros">

<div class="barbeiro-card" onclick="selecionarBarbeiro(this,'Murilo')">

<img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e" alt="Murilo">

<span>Murilo</span>

</div>

<div class="barbeiro-card" onclick="selecionarBarbeiro(this,'Ryan')">

<img src="https://images.unsplash.com/photo-1614282706533-4b7b4d63ed1e" alt="Ryan">

<span>Ryan</span>

</div>

</div>

</div>

<div class="section">

<h2>Escolha o Dia</h2>

<div class="dias" id="dias"></div>

</div>

<div class="section">

<h2>Horários Disponíveis</h2>

<div class="horarios" id="horarios"></div>

</div>

</div>

<button class="btn-agendar" onclick="agendar()">Confirmar Agendamento</button>

<script>

let servicoSelecionado="";

let diaSelecionado="";

let horarioSelecionado="";

let barbeiroSelecionado="";

// Seleção de serviço

function selecionarServico(card, servico){

document.querySelectorAll(".servico-card").forEach(c=>c.classList.remove("active"));

card.classList.add("active");

servicoSelecionado = servico;

}

// Seleção de barbeiro

function selecionarBarbeiro(card, barbeiro){

document.querySelectorAll(".barbeiro-card").forEach(c=>c.classList.remove("active"));

card.classList.add("active");

barbeiroSelecionado = barbeiro;

}

// Dias: próximos 7 dias

function gerarDias(){

const container=document.getElementById("dias");

container.innerHTML="";

const hoje=new Date();

for(let i=0;i<7;i++){

let data=new Date();

data.setDate(hoje.getDate()+i);

let diaNome=data.toLocaleDateString("pt-BR",{weekday:'short',day:'numeric',month:'numeric'});

let dataStr=data.toISOString().split('T')[0];

let btn=document.createElement("button");

btn.textContent=diaNome;

btn.onclick=function(){

document.querySelectorAll(".dias button").forEach(b=>b.classList.remove("selected"));

btn.classList.add("selected");

diaSelecionado=dataStr;

gerarHorarios(dataStr);

}

container.appendChild(btn);

}

}

// Horários

function obterAgendamentos(){

return JSON.parse(localStorage.getItem("agendamentos")||"{}");

}

function gerarHorarios(data){

const container=document.getElementById("horarios");

container.innerHTML="";

horarioSelecionado="";

const dataObj=new Date(data);

const diaSemana=dataObj.getDay();

let inicio=(diaSemana===6)?8:14;

let fim=19;

const agendamentos=obterAgendamentos();

for(let i=inicio;i<=fim;i++){

let hora=(i<10?"0":"")+i+":00";

let btn=document.createElement("button");

btn.textContent=hora;

if(agendamentos[data] && agendamentos[data].includes(hora)){

btn.classList.add("disabled");

btn.disabled=true;

}

btn.onclick=function(){

document.querySelectorAll(".horarios button").forEach(b=>b.classList.remove("selected"));

btn.classList.add("selected");

horarioSelecionado=hora;

}

container.appendChild(btn);

}

}

// Salvar agendamento

function salvarAgendamento(data,hora){

let agendamentos=obterAgendamentos();

if(!agendamentos[data]) agendamentos[data]=[];

agendamentos[data].push(hora);

localStorage.setItem("agendamentos",JSON.stringify(agendamentos));

}

// Agendar

function agendar(){

const nome=document.getElementById("nome").value;

const telefone=document.getElementById("telefoneCliente").value;

const obs=document.getElementById("observacoes").value;

if(!nome||!telefone||!servicoSelecionado||!diaSelecionado||!horarioSelecionado||!barbeiroSelecionado){

alert("Preencha todas as informações!");

return;

}

salvarAgendamento(diaSelecionado,horarioSelecionado);

const telefoneBarbearia="15996858049";

const mensagem=`Olá, gostaria de agendar na Barbearia Barbosa.

Nome: ${nome}

Telefone: ${telefone}

Serviço: ${servicoSelecionado}

Barbeiro: ${barbeiroSelecionado}

Data: ${diaSelecionado}

Horário: ${horarioSelecionado}

OBS: ${obs}`;

window.open(`https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`,"_blank");

alert("Agendamento enviado para o WhatsApp!");

}

// Inicializar dias

gerarDias();

</script>

</body>

</html> Faça alguns ajustes e adicione essas fotos

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://barbearia-barbosa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/564f4546-d9c4-4eda-8799-15fc50dc83a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
