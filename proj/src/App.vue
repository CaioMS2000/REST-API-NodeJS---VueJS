<template>
<div id="app">
  <aside>
    <div class="separador">ÁREA DE PESQUISA/REMOÇÃO</div>
        <input type="text" id="ghost" disabled style="border: rgba(250, 250, 250, 0); background-color: rgba(250, 250, 250, 0);">
        <input type="text" id="in" @keyup="filter()" v-model="input" placeholder="Digite aqui para filtrar ou deletar">
        <button @click="del">DELETAR</button>
        <p>O registro que será deletado será localizado pela informação na caixa de texto</p>
        <div class="separador">ÁREA DE EDIÇÃO/ADIÇÃO</div>
        <p>Tanto em caso de edição quanto adição de um novo registro, o campo de CNPJ é obrigatório</p>
        <input type="text" placeholder="CNPJ" v-model="reg.CNPJ">
        <input type="text" placeholder="Registro ANS" v-model="reg.registroANS">
        <input type="text" placeholder="Razão social" v-model="reg.razaoSocial">
        <input type="text" placeholder="Nome fantasia" v-model="reg.nomeFantasia">
        <input type="text" placeholder="Modalidade" v-model="reg.modalidade">
        <input type="text" placeholder="Logradouro" v-model="reg.logradouro">
        <input type="text" placeholder="Numero" v-model="reg.numero">
        <input type="text" placeholder="Complemento" v-model="reg.complemento">
        <input type="text" placeholder="Bairro" v-model="reg.bairro">
        <input type="text" placeholder="Cidade" v-model="reg.cidade">
        <input type="text" placeholder="UF" v-model="reg.UF">
        <input type="text" placeholder="CEP" v-model="reg.CEP">
        <input type="text" placeholder="DDD" v-model="reg.DDD">
        <input type="text" placeholder="Telefone" v-model="reg.telefone">
        <input type="text" placeholder="Fax" v-model="reg.Fax">
        <input type="text" placeholder="Email" v-model="reg.email">
        <input type="text" placeholder="Representante" v-model="reg.represetante">
        <input type="text" placeholder="Cargo do representante" v-model="reg.cargoRpresentante">
        <input type="text" placeholder="Data do registro ANS" v-model="reg.dataRegistroANS">
        <div>
          <button @click="edit">EDITAR</button>
          <button @click="add">ADICIONAR</button>
        </div>
    </aside>
    <section>
    <div id="container">
      <div class="temp"><p class="temporario">CARREGANDO...</p></div>
    <div class="box" v-for="it of itens" :key="it.CNPJ">
      <ul>
        <li>Registro ANS: {{it.registroANS}}</li>
        <li>CNPJ: {{it.CNPJ}}</li>
        <li>Razão social: {{it.razaoSocial}}</li>
        <li>Nome fantasia: {{it.nomeFantasia}}</li>
        <li>Modalidade: {{it.modalidade}}</li>
        <li>Logradouro: {{it.logradouro}}</li>
        <li>Numero: {{it.numero}}</li>
        <li>Complemento: {{it.complemento}}</li>
        <li>Bairro: {{it.bairro}}</li>
        <li>Cidade: {{it.cidade}}</li>
        <li>UF: {{it.UF}}</li>
        <li>CEP: {{it.CEP}}</li>
        <li>DDD: {{it.DDD}}</li>
        <li>Telefone: {{it.telefone}}</li>
        <li>Fax: {{it.Fax}}</li>
        <li>Email: {{it.email}}</li>
        <li>Representante: {{it.represetante}}</li>
        <li>Cargo do representante: {{it.cargoRpresentante}}</li>
        <li>Data do registro ANS: {{it.dataRegistroANS}}</li>
      </ul>
    </div>
  </div>
  </section>
</div>
</template>

<script>
import iten from './services/itens'

export default{

 data(){
   return { 
     itens:[],
     input : '',
     reg:{       
      registroANS:"",
      CNPJ:"",
      razaoSocial:"",
      nomeFantasia:"",
      modalidade:"",
      logradouro:"",
      numero:"",
      complemento:"",
      bairro:"",
      cidade:"",
      UF:"",
      CEP:"",
      DDD:"",
      telefone:"",
      Fax:"",
      email:"",
      represetante:"",
      cargoRpresentante:"",
      dataRegistroANS:""
    },
    deleted:{
      data:{CNPJ:""}
    }  
   }
 },

 mounted(){
    setTimeout(iten.listar().then(res => {
      this.itens = res.data.data
      console.log(res.data.data)
      document.querySelector('.temp').style.display = 'none'
    }), 1000)
  },

  methods:{
    clearAllInputs(){
      Object.keys(this.reg).forEach(e => {
        this.reg[e] = ''
      })

      this.input = ''
    },

    add(){
      iten.add(this.reg).then(() => { /*this.itens.push(this.reg)*/ })
      while(this.itens.length >0){ this.itens.pop() }
      iten.listar().then(res => { this.itens = res.data.data })
      //location.reload()
      this.filter()
      this.clearAllInputs()
    },

    filter(){   
      document.querySelectorAll('.box').forEach(el => {el.style.display = 'block'})

      let uls = document.querySelectorAll('ul')
      console.log(typeof(this.input))
      
      uls.forEach((e, k) => {
        let children = e.children
        let match = false

        children.forEach(el =>{
          if((`${el.textContent}`.toLowerCase()).includes(`${this.input}`.toLowerCase())){
            match = true            
          }
        })

        if(!match){
          uls[k].parentElement.style.display = 'none'
        }
      })
    },

    edit(){
      //iten.add(this.reg).then(res => {res;alert('Adicionado com sucesso')})
      iten.edit({CNPJ:this.reg.CNPJ, changes:this.reg})
      while(this.itens.length >0){ this.itens.pop() }
      iten.listar().then(res => { this.itens = res.data.data })
      //location.reload()
      this.filter()
      this.clearAllInputs()
    },

    del(){
      let boxes = Array.from(document.querySelectorAll('.box'))

      for (let index = 0; index < boxes.length; index++) {
        if(boxes[index].style.display != 'none'){          
          let delted = boxes[index].children[0].childNodes[1].innerText.split(' ')[1]

          this.deleted.data.CNPJ = delted
          iten.del(this.deleted)          
          index = boxes.length

          alert('REMOVIDO com sucesso')
        }        
      }

      //location.reload()
      while(this.itens.length >0){ this.itens.pop() }
      iten.listar().then(res => { this.itens = res.data.data })
      this.filter()
      this.clearAllInputs()
    }
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  width:100vw;
}

#app{
    display: flex;
    flex-direction: row;
    font-weight: 600;
    font-size: 15pt;
    padding: 0;
    justify-content: space-between;
}

h3{
  margin-bottom: 0;
}

p{
  font-size: 10pt;
  color: rgb(204, 204, 204);
  margin: 0px 0 10px 0;
}

.temporario{
  font-size: 30pt;
  color: rgb(0, 0, 0);
  margin-left: 5vw;
}

.temp{
  text-align: center;
  display: block;
  margin-top: 30vh;
}

.box{
    padding: 5px;
    background-color: rgb(189, 189, 189);
    margin: 10px;
    margin-left: 10vw;
    width: 50vw;
    border-radius: 10px;
}

#container{
  display: flex;
  flex-direction: column;
}

.separador{
    width: 100%;
    border-top: rgb(201, 201, 201) solid;
    margin-bottom: 0px;
    margin-top: 5px;
    text-align: center;
    padding-top: 5px;
}

input{
    margin-bottom: 20px;
    width: 25vw;
    height: 60px;
    margin-left: 1vw;
    border: 2px solid;
    border-radius: 10px;
}

#ghost{
  margin: 0;
}

button{
    margin-bottom: 0px;
    width: 5.5vw;
    margin-left: 1vw; 
}

aside{
    display: flex;
    flex-direction: column;
    padding-right: 0px;
    margin-right: 1px;
    border-right: black solid;
    width: 30vw;
    height: 99vh;
    overflow-y: scroll;
}

section{
  height: 99vh;
  overflow-y: scroll;
  width: 69.6vw;
}
</style>
