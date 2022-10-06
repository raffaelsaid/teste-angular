const tbody = document.getElementById('tbody');

//pega retorno api
 async function consultaDados() {
    const retorno = await fetch('http://localhost:3000/imovel');
    const data = await retorno.json();

    this.inserirDados(data[0]);
   }
//inseri dados na tabela
function inserirDados(dados) {
   let tr = document.createElement('tr');
   console.log(dados.endereco)
   tr.innerHTML = `
      <td>${dados.nome}</td>
      <td>${dados.tipo}</td>
      <td>${dados.valor}</td>
      <td>${dados.endereco[0].rua}</td>
      <td>${dados.endereco[0].numero}</td>
      <td>${dados.endereco[0].bairro}</td>
      <td>${dados.endereco[0].cidade}</td>
      <td>${dados.endereco[0].uf}</td>
      <td>${dados.endereco[0].cep}</td>
   `
   tbody.appendChild(tr)
}
this.consultaDados();

   








