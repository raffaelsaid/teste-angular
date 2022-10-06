const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const ruaInput = document.querySelector("#rua");
const cidadeInput = document.querySelector("#cidade");
const bairroInput = document.querySelector("#bairro");
const regiaoInput = document.querySelector("#regiao");
const formIpunts = document.querySelectorAll("[data-input]");
const fecharButton = document.querySelector("#fechar-mensagem")
const fadeElement = document.querySelector("#fade");

//Valida campo cep
cepInput.addEventListener("keypress", (e) => {
    const apenasNumeros = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    //permitir apenas números
    if (!apenasNumeros.test(key)) {
        e.preventDefault();
        return;
    }
});

//Pega o 8 digito do envento
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

//Monta API
const getAddress = async (cep) => {
    toggleLoader();
    cepInput.blur();
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const resposta = await fetch(apiUrl);
    const data = await resposta.json();

    //Apresenta erro e reseta o formulário 
    if (data.erro === "true") {
        if (!cidadeInput.hasAttribute("disabled")) {
            toggleDisabled();
        }

        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido,  tente novamente.")
        return;
    }

    if (cidadeInput.value === '') {
        toggleDisabled();
    }

    // preenche os campos do formulário
    ruaInput.value = data.logradouro;
    cidadeInput.value = data.localidade;
    bairroInput.value = data.bairro;
    regiaoInput.value = data.uf;
    //tira loader da tela
    toggleLoader();
};

//Adiciona e remove disabled atribute
const toggleDisabled = () => {
    if (regiaoInput.hasAttribute("disabled")) {
        formIpunts.forEach((input)=> {
            input.removeAttribute("disabled");
        });
    } else {
        formIpunts.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    }
};

// Mostrar ou esconder o loader
const toggleLoader = () => {    
    const loaderElement = document.querySelector("#loader");
    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
}

//Esconde ou exibe a mensagem
const toggleMessage = (msg) => {
    const mensagemElement = document.querySelector("#mensagem");
    const mensagemElementText = document.querySelector("#mensagem p");
    mensagemElementText.innerText = msg;
    fadeElement.classList.toggle("hide");
    mensagemElement.classList.toggle("hide");
}

// Fechar mensagem
fecharButton.addEventListener("click", () => toggleMessage());

//Salva dados
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //pega os dados do formulário e envia para a api
    const dadosFormulario = JSON.stringify(getDadosForm());
    enviaDadosParaAPI(dadosFormulario);

    //reloader salvando dados
    toggleLoader();
    setTimeout(() => {
        toggleLoader();
        addressForm.reset();
        toggleDisabled();
    }, 1500);
});

//Pega os valores do input
const getDadosForm = () => {
    
    const dadosFormulario = {
        cep: cepInput.value,
        rua: ruaInput.value,
        cidade: cidadeInput.value,
        bairro: bairroInput.value,
        uf: regiaoInput.value
    };
    return dadosFormulario;
} 

//envia dados Post para api
const enviaDadosParaAPI = async (dadosFormulario) => { 
    const resposta = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: dadosFormulario
    });
}