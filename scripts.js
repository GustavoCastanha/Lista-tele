var formContato = document.getElementById("formContato");
var listaContatos = document.getElementById("listaContatos");

// Adicionar um novo contato
// Adcionando um evento que vai escutar quando 
// submeter o formulário
formContato.addEventListener('submit', function(evento){
	evento.preventDefault();

	var nome = document.querySelector("#nome").value;
	var telefone = document.getElementById('telefone').value;
	var logradouro = document.getElementById('logradouro').value;
	var bairro = document.getElementById('bairro').value;
	var localidade = document.getElementById('localidade').value;
	var uf = document.getElementById('uf').value;
	var foto = document.getElementById('foto').files[0];
	
	if(foto){
		const reader = new FileReader();
		reader.onload = function (event){
			adicionarContato(nome, telefone, logradouro,
				bairro, localidade, uf, event.target.result);
			saveContacts();
			formContato.reset();
		}
		reader.readAsDataURL(foto);
	}else{
		if(nome && telefone){
			foto = null;
		// nós temos que adicionar na nossa lista
			adicionarContato(nome, telefone, logradouro,
				bairro, localidade, uf, foto);
			saveContacts();
			formContato.reset();
		}else{
			alert("Preencha todos os campos, por favor");
		}	
	}
});

// função para adicionar os contatos em nossa lista
function adicionarContato(nome, telefone, logradouro,
	bairro, localidade, uf, fotoDataURL){
	// criar o nosso elemento do contato
	const contatoli = document.createElement("li");

	if(fotoDataURL){
		const img = document.createElement("img");
		img.src = fotoDataURL;
		contatoli.appendChild(img);
	}

	const detailsDiv = document.createElement("div");
	detailsDiv.classList.add("details");
	detailsDiv.innerHTML = `
	<div class="name">${nome}</div>
	<div class="phone">${telefone}</div>
	<div class="address">
	${logradouro}, 
	${bairro},
	${localidade} - ${uf}
	</div>
	`;
	contatoli.appendChild(detailsDiv);

	const removeBtn = document.createElement("button");
	removeBtn.classList.add('remove');
	removeBtn.textContent = "Excluir";
	removeBtn.addEventListener("click", function(){
		listaContatos.removeChild(contatoli);
		// retirar o contato da lista e do localstorage
		saveContacts();
	})
	contatoli.appendChild(removeBtn);

	// Adicionar o contato à lista
	listaContatos.appendChild(contatoli);
}

document.getElementById('cep').addEventListener('blur', function(){
	var cep = this.value.replace(/\D/g, '');

	if(cep.length === 8){
		fetch(`https://viacep.com.br/ws/${cep}/json/`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('logradouro').value = data.logradouro ;
			document.getElementById('bairro').value = data.bairro ;
			document.getElementById('localidade').value = data.localidade ;
			document.getElementById('uf').value = data.uf ;
		})
		.catch(error => {
			alert("Erro na consulta do ViaCEP", error);
		})
	}
})



function saveContacts(){
	const contacts = [];
	listaContatos.querySelectorAll('li').forEach(
		contactLi => {
			var name = contactLi.querySelector(".name").textContent;
			var phone = contactLi.querySelector('.phone').textContent;
			var address = contactLi.querySelector('.address').textContent;
			var img = contactLi.querySelector('img');
			var imgSrc = img ? img.src : "";

			const contactObj = {
				name: name,
				phone: phone,
				address: address,
				imgSrc: imgSrc
			};

			contacts.push(contactObj);
		});
	localStorage.setItem('contacts', JSON.stringify(contacts))
}

function loadContacts(){
	const contatoNoStorage = JSON.parse(localStorage.getItem('contacts')) || [];
	listaContatos.innerHTML = '';

	contatoNoStorage.forEach(
		contacObj => {
			address = contacObj.address.split(",");
			cidadeEstado = address[2].split(" - ");
			console.log(address);
			adicionarContato(
				contacObj.name,
				contacObj.phone,
				address[0],
				address[1],
				cidadeEstado[0],
				cidadeEstado[1],
				contacObj.imgSrc
			);
		}
	);
}

document.addEventListener('DOMContentLoaded', function(){
	loadContacts();
})


