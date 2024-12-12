// buscar o campo de texto
const input = document.querySelector("#busca");

// buscar o div que vai ficar o retorno dos dados da API
const info = document.querySelector("#info");

// adicionar o listener no evento input
input.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const nomeOuHabilidade = event.target.value.trim().toLowerCase();
    
    // Verificar se é uma habilidade
    const respostaHabilidade = await fetch("https://pokeapi.co/api/v2/ability/" + nomeOuHabilidade);
    
    if (respostaHabilidade.ok) {
      const dadosHabilidade = await respostaHabilidade.json();
      
      // Pegar o primeiro Pokémon com essa habilidade
      const primeiroPokemon = dadosHabilidade.pokemon[0].pokemon.name;
      
      // Buscar os dados do Pokémon
      const resultado = await fetch("https://pokeapi.co/api/v2/pokemon/" + primeiroPokemon);
      
      if (resultado.ok) {
        const dados = await resultado.json();
        
        // Atualizar o HTML com os dados do Pokémon
        info.innerHTML = "<h1>" + dados.name + "</h1>";
        info.innerHTML += '<img src="' + dados.sprites.front_default + '">';
        info.innerHTML += "<p>Altura: " + parseInt(dados.height) / 10 + " metros</p>";
        info.innerHTML += "<p>Peso: " + parseInt(dados.weight) / 10 + " kg</p>";
        info.innerHTML += "<p>Tipos: " + dados.types.map((tipo) => tipo.type.name).join(", ") + "</p>";
        info.innerHTML += "<p>Habilidade: " + dados.abilities.map((abilidade) => abilidade.ability.name).join(", ") + "</p>";
        
        // Buscar as fraquezas do Pokémon com base em seus tipos
        const buscarFraquezas = async (tipos) => {
          let todasFraquezas = [];
          
          // Para cada tipo do pokémon, buscar suas fraquezas
          for (const tipo of tipos.split(", ")) {
            const resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
            const dadosTipo = await resposta.json();
            
            // Extrair as fraquezas (double_damage_from)
            const fraquezas = dadosTipo.damage_relations.double_damage_from
              .map(f => f.name);
              
            todasFraquezas = [...todasFraquezas, ...fraquezas];
          }
          
          // Remover duplicatas e juntar com vírgula
          return [...new Set(todasFraquezas)].join(", ");
        }
        
        // Buscar e exibir as fraquezas
        const fraquezas = await buscarFraquezas(dados.types.map((tipo) => tipo.type.name).join(", "));
        info.innerHTML += "<p>Fraquezas: " + fraquezas + "</p>";
        info.style.display = "block";
      }
    } else {
      // Se não for uma habilidade, buscar pelo nome do Pokémon
      const resultado = await fetch("https://pokeapi.co/api/v2/pokemon/" + nomeOuHabilidade);
      
      if (resultado.ok) {
        const dados = await resultado.json();
        
        // Atualizar o HTML com os dados do Pokémon
        info.innerHTML = "<h1>" + dados.name + "</h1>";
        info.innerHTML += '<img src="' + dados.sprites.front_default + '">';
        info.innerHTML += "<p>Altura: " + parseInt(dados.height) / 10 + " metros</p>";
        info.innerHTML += "<p>Peso: " + parseInt(dados.weight) / 10 + " kg</p>";
        info.innerHTML += "<p>Tipos: " + dados.types.map((tipo) => tipo.type.name).join(", ") + "</p>";
        info.innerHTML += "<p>Habilidade: " + dados.abilities.map((abilidade) => abilidade.ability.name).join(", ") + "</p>";
        
        // Buscar as fraquezas do Pokémon com base em seus tipos
        const buscarFraquezas = async (tipos) => {
          let todasFraquezas = [];
          
          // Para cada tipo do pokémon, buscar suas fraquezas
          for (const tipo of tipos.split(", ")) {
            const resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
            const dadosTipo = await resposta.json();
            
            // Extrair as fraquezas (double_damage_from)
            const fraquezas = dadosTipo.damage_relations.double_damage_from
              .map(f => f.name);
              
            todasFraquezas = [...todasFraquezas, ...fraquezas];
          }
          
          // Remover duplicatas e juntar com vírgula
          return [...new Set(todasFraquezas)].join(", ");
        }
        
        // Buscar e exibir as fraquezas
        const fraquezas = await buscarFraquezas(dados.types.map((tipo) => tipo.type.name).join(", "));
        info.innerHTML += "<p>Fraquezas: " + fraquezas + "</p>";
        info.style.display = "block";
      } else {
        info.innerHTML = "<p>Pokémon ou habilidade não encontrado. Verifique o nome digitado.</p>";
        info.style.display = "block";
      }
    }
  }
});
