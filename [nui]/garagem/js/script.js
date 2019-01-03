$(document).ready(function(){
  const website = "http://brasilplayaction.com.br/cdn/cars/"; // Não edite essa linha, é o CDN para as imagens.
  // const website = "http://spaceshipws.com/img/cdn/"; // Não edite essa linha, é o CDN para as imagens.
  // Recebe o evento da NUI
  window.addEventListener('message', function(event){
    // VARIAVEIS
    var item = event.data;
    if(item.atualizarGaragem == true){
      // Fecha as telas caso estejam abertas
      $('.sucesso').hide();
      $('.fail').hide();
      $('.mensagem-padrao').hide();
      // Cria a constante ou reseta ela
      carros = JSON.parse(item.veiculos);
      // Adiciona as carros a div
      adicionarVeiculos(carros);
    } else if (item.fecharGaragem == true) {
      $('.menu-content').hide();
    } else if(item.abrirGaragem == true){
      $('.veiculo-indv').hide();
      $('.wrapper-scroll').show();
      $('.status').html(item.status);
      $('.menu-content').show();
    } else if (item.sucessoGaragem == true){
      $('.wrapper-scroll').hide();
      $('.veiculo-indv').hide();
      $('.fail').hide();
      $('.sucesso').show();
    } else if (item.sucessoGaragem == false){
      $('.wrapper-scroll').hide();
      $('.veiculo-indv').hide();
      $('.fail').show();
    }
  });
  // Funções
  function adicionarVeiculos(veiculos){
    $('.veiculos-jogador').html('<li><a href="javascript:void(0)" class="despawn"> <div class="row veiculo-wrapper" style="background-color:#f4f4f4"> <div class="col-3 text-center"> <div class="veiculo-inicial"> <p>G</p> </div> </div> <div class="col-9"> <div class="veiculo-info"> <h6>Guardar</h6> <p>Guardar veículo!</p> </div> </div> </div> </a> </li>');
    var retorno = [];
    // Itera pelos itens adicionando eles na array de retorno
    for(i = 0; i < veiculos.length; i++){
      retorno.push({
        'id':veiculos[i].id,
        'user_id':veiculos[i].user_id,
        'nome_gta':veiculos[i].nome_gta,
        'nome':veiculos[i].nome,
        'categoria':veiculos[i].categoria,
        'veh_type':veiculos[i].veh_type
      });
      var inicial = veiculos[i].nome_gta.substring(0, 1);
      $('.veiculos-jogador').append('<li><a href="javascript:void(0)" class="selecionar" carro="'+ i +'"><div class="row veiculo-wrapper"><div class="col-3 text-center"><div class="veiculo-inicial"><p>' + inicial + '</p></div></div><div class="col-9"><div class="veiculo-info"><h6>' + veiculos[i].nome + '</h6></div></div></div></a></li>');
    }
    // Atualiza o scroll
    $('.veiculos-jogador').slimScroll({
      height: '20rem',
      position: 'left',
      color: 'rgb(169, 69, 106)',
      alwaysVisible: true
    });
    // Retorna a array pra constante
    return retorno;
  }
  function perfilVeiculo(data){
    $('.veiculo-indv').html("<div class='text-left'><a class='voltargr' href='javascript:void(0)'><i class='fas fa-arrow-left'></i></a></div><div class='wrapper'><div class='veiculo-inicial text-center' style='background-image:url(" + website + data.nome_gta + "/1.jpg)'></div> </div> <div class='veiculo-indv-info'> <ul> <li><h4>" + data.nome + "</h4></li><li><p><b>Placa: </b>" + data.placa + "<p></li> </ul> </div> <div class='veiculo-indv-opt text-center'> <button class='btn btn-selecionar' carro='" + data.nome_gta + "'><i class='fas fa-check align-self-center'></i> SELECIONAR</button></div>");
  }
  // Botões
  $(document).on('click', '.selecionar', function(){
    perfilVeiculo(carros[$(this).attr('carro')]);
    $('.wrapper-scroll').hide();
    $('.veiculo-indv').show();
  });
  $(document).on('click', '.btn-selecionar', function(){
    setTimeout(() => {
      $.post('http://garagem/selecionar', JSON.stringify({
        carro: $(this).attr('carro')
      }));
    }, 300);
  });
  $(document).on('click', '.voltargr', function(){
    $('.wrapper-scroll').show();
    $('.veiculo-indv').hide();
  });
  $(document).on('click', '.despawn', function(){
    $.post('http://garagem/guardar', JSON.stringify({
      carro: $(this).attr('carro')
    }));
  });
  // On 'Esc' call close method
  document.onkeyup = function (data) {
    if (data.which == 27 ) {
      $.post('http://garagem/fechar', JSON.stringify({}));
    }
  };
});
