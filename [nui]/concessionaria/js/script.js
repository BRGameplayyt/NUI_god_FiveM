$(document).ready(function(){
    // Constantes
    const website = "http://brasilplayaction.com.br/cdn/cars/"; // Não edite essa linha, é o CDN para as imagens.
    // const website = "http://spaceshipws.com/img/cdn/"; // Não edite essa linha, é o CDN para as imagens.
    const limite_imagem = 3;
    // const citems = 4;
    // Recebe os valores lá do lua
    window.addEventListener('message', function(event){
        // Variaveis
        var item = event.data;
        // Verifica se foi atualizado ou não
        if(item.atualizarConce == true){
            // Define o ID do jogador que está acessando
            id_jogador = parseInt(item.id_jogador);
            // Cria a constante carro ou reseta ela
            carros = [];
            // Total de carros na concessionaria
            total_carros = 0;
            // Recebe os valores e deixa eles prontos para serem lidos pelo JS
            var parsed = JSON.parse(item.veiculos_conce);
            for(i in parsed){
                carros.push(parsed[i]);
                total_carros++;
            }
            // Cria as outras constantes
            destaques = separarVeiculos(carros, 'destaques');
            novos = separarVeiculos(carros, 'novos');
            usados = separarVeiculos(carros, 'usados');
            // Verifica as listas
            if (destaques.length > 0) {
                $("#destaque-vazio").hide();
            }
            if (usados.length > 0) {
                $("#usados-vazio").hide();
            }
            // Prepara o carousel
            carregarSliders(destaques, 'destaques', '.destaques-container', '#destaques-carousel');
            carregarSliders(novos, 'novos', '.novos-container', '#novos-carousel');
            carregarSliders(usados, 'usados', '.usados-container', '#usados-carousel');
            // Carrega o carousel
            $('.owl-carousel').owlCarousel({dots:false, touchDrag:false, mouseDrag:true, responsiveClass: true, responsive:{
                    0:{ // Abaixo de 720p
                        items:1
                    },
                    1280:{ // 720p
                        items:2
                    },
                    1920:{ // 1080p
                        items:3
                    },
                    2560:{ // 1440p
                        items:4
                    },
                    4096:{ // 4K
                        items:6
                    }}});
        } else if(item.atualizarJogador == true){
            $('.botao-venda-wrapper').show();
            // Carros do jogador
            veiculos_jogador = [];
            //console.log(item.veiculos_jogador);
            // Prepara as informações
            var parsed_jogador = JSON.parse(item.veiculos_jogador);
            for(i in parsed_jogador){
                veiculos_jogador.push(parsed_jogador[i]);
            }
            // Monta o <select> de vendas
            carregarSelect(veiculos_jogador);
            // Ativa o botão de vendas
            $('.botao-venda-wrapper').show();
        } else if(item.abrirConce == true){
            $('.bpa-login-wrapper').show();
        } else if(item.fecharConce == true){
            $('.bpa-login-wrapper').hide();
            // Sempre que recebe uma mensagem atualiza a página
            document.location.reload(true);
        } else if(item.comprou == true){
            $('.retorno_texto').html('Compra efetuada com sucesso!');
            $('.aviso_sucesso').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        } else if(item.comprou == false){
            $('.retorno_texto').html('Você não tem dinheiro suficiente no banco!');
            $('.aviso_fail').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        } else if(item.vendeu == true){
            $('.retorno_texto').html('Venda efetuada com sucesso!');
            $('.aviso_sucesso').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        } else if(item.vendeu == false){
            $('.retorno_texto').html('A Concessionária não tem dinheiro suficiente!');
            $('.aviso_fail').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        } else if(item.anunciou == true){
            $('.retorno_texto').html('Anuncio postado com sucesso!');
            $('.aviso_sucesso').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        } else if(item.anunciou == false){
            $('.retorno_texto').html('Você não tem dinheiro suficiente!');
            $('.aviso_fail').show();
            $('.loading-wrapper').hide();
            $('.retorno-pagamento').show();
        }
    });

    // Funções

    function jaAnunciou(nome_gta){
        var retorno = false;
        var i = 0;
        if(typeof carros !== 'undefined'){
            // Javascript é bugado por isso eu fiz essa gambiarra cm o While
            while(i < total_carros){
                if(carros[i].nome_gta == nome_gta && parseInt(carros[i].id_dono) == id_jogador){
                    retorno = true;
                }
                i++;
            }
        }
        return retorno;
    }

    function carregarSelect(veiculos){
        // Preenche os selects
        for(i = 0; i < veiculos.length; i++){
            // Verifica se já tem anuncio do jogador
            if(jaAnunciou(veiculos[i].nome_gta) == false){
                $('.fivem-lixo').append("<input type='radio' id_carro='" + veiculos[i].id + "' id='j_" +  veiculos[i].id + "' value='" + veiculos[i].nome_gta + "'  name='v_jogador'><label for='j_" + veiculos[i].id + "'>" + veiculos[i].nome +" (" + veiculos[i].tipo + ")</label>");
                $('.fivem-lixo-2').append("<input type='radio' id_carro='" + veiculos[i].id + "' id='c_" + veiculos[i].id + "' value='" + veiculos[i].nome_gta + "' name='v_conce'><label for='c_" + veiculos[i].id + "'>" + veiculos[i].nome +" (" + veiculos[i].tipo + ")</label>");
            }
        }
    }

    function separarVeiculos(veiculos, parametro){
        var retorno = [];
        for(i = 0; i < veiculos.length; i++){
            switch(parametro){
                case 'destaques':
                    if(parseInt(veiculos[i].destaque) == 1){
                        retorno.push({
                            "id": veiculos[i].id,
                            "id_dono": veiculos[i].id_dono,
                            "nome": veiculos[i].nome,
                            "nome_gta": veiculos[i].nome_gta,
                            "anunciante": veiculos[i].anunciante,
                            "telefone": veiculos[i].telefone,
                            "tipo": veiculos[i].tipo,
                            "cor": veiculos[i].cor,
                            "categoria": veiculos[i].categoria,
                            "preco": veiculos[i].preco,
                            "limite": veiculos[i].limite
                        });
                    }
                    break;
                case 'novos':
                    if(veiculos[i].id_dono == null){
                        retorno.push({
                            "id": veiculos[i].id,
                            "id_dono": veiculos[i].id_dono,
                            "nome": veiculos[i].nome,
                            "nome_gta": veiculos[i].nome_gta,
                            "anunciante": veiculos[i].anunciante,
                            "telefone": veiculos[i].telefone,
                            "tipo": veiculos[i].tipo,
                            "cor": veiculos[i].cor,
                            "categoria": veiculos[i].categoria,
                            "preco": veiculos[i].preco,
                            "limite": veiculos[i].limite
                        });
                    }
                    break;
                case 'usados':
                    if(parseInt(veiculos[i].destaque) == 0 && veiculos[i].id_dono != null){
                        retorno.push({
                            "id": veiculos[i].id,
                            "id_dono": veiculos[i].id_dono,
                            "nome": veiculos[i].nome,
                            "nome_gta": veiculos[i].nome_gta,
                            "anunciante": veiculos[i].anunciante,
                            "telefone": veiculos[i].telefone,
                            "tipo": veiculos[i].tipo,
                            "cor": veiculos[i].cor,
                            "categoria": veiculos[i].categoria,
                            "preco": veiculos[i].preco,
                            "limite": veiculos[i].limite
                        });
                    }
                    break;
            }
        }
        return retorno;
    }
    function jacomprou(nome_gta, id_dono){
        var retorno = false;
        // Checa se o jogador já tem carro comprado com o mesmo nome
        if(typeof veiculos_jogador !== 'undefined'){
            for(i = 0; i < veiculos_jogador.length; i++){
                if(veiculos_jogador[i].nome_gta == nome_gta){
                    retorno = true;
                }
            }
        }
        // Checa se o jogador é dono do veículo anunciado
        if(typeof id_dono !== 'undefined'){
            if(id_dono == id_jogador){
                retorno = true;
            }
        }
        return retorno;
    }

    function perfilVeiculo(data){ // Aqui é criado a pagina individual do veículo
        // Zerar os sliders
        $('.carousel-inner').html("");
        // Mostrar imagens
        for(i = 1; i <= limite_imagem; i++){
            $('.carousel-inner').append("<div class='carousel-item'><img class='d-block w-100' src='" + website + data.nome_gta + "/" + i + ".jpg' alt=''></div>");
        }
        // Verifica se o telefone é nulo
        if(data.telefone == null){
            var telefone = ' -- ';
        } else {
            var telefone = data.telefone;
        }
        // Editar preço do veículo
        $('#preco_ind').html("R$ " + (data.preco.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
        // Editar nome do veículo
        $('#nome_ind').html(data.nome)
        // Litle fix
        // let tipo = data.tipo === 'car' ? 'carro' : 'moto';
        let estoque = data.limite < 99 ? data.limite : 'Ilimitado';
        // Editar informações do veículo
        $('#info_ind').html('<li><b>Anunciante: </b>' + data.anunciante + '</li><li><b>Telefone: </b>' + telefone + '</li><li><b>Tipo: </b>' + data.tipo + '</li><li><b>Categoria: </b>' + data.categoria + '</li><li><b>Cor: </b>' + data.cor + '</li><li><b>Estoque: </b>' + estoque + '</li>')
        // Adicionar botão de compra (Verifica se o jogador já possui o veiculo ou se o estque está esgotado)
        if(parseInt(data.limite) == 0 || jacomprou(data.nome_gta, parseInt(data.id_dono))){
            $('.veiculo-opt').html("<button class='btn btn-comprar comprar-carro' value='" + data.id + "' disabled><i class='fas fa-ban'></i> INDISPONÍVEL</button>");
        } else {
            $('.veiculo-opt').html("<button class='btn btn-comprar comprar-carro' value='" + data.id + "'><i class='fas fa-credit-card'></i> COMPRAR</button>");
        }
        // Mostra o container do veículo
        $('.ind-container').show();
        // Centraliza a coluna lateral
        $('.coluna-lateral').css({"display":"flex", "align-items":"center"});
        $('.carousel-item').first().addClass('active');
        $('#sliderconce').carousel();
    }

    function carregarSliders(data, tipo, container, carousel){
        // Zerar o carousel
        for(i = 0; i < data.length; i++){
            // Gambiarra
            var string = website + data[i].nome_gta + "/1.jpg";
            var background = 'url("' + string + '")';
            var style = "style='background-image:" + background + "'";
            // Adiciona os containers
            $(carousel).append("<div class='container-carro " + data[i].nome +" " + data[i].preco + "'><div class='carro-header text-center'><h5>" + data[i].nome + "</h5></div><div class='carro-body text-right'" + style + "></div><div class='carro-footer text-center'><button class='btn btn-comprar' id='abrir_info' value='" + i + "' tipo='" + tipo + "'>R$ " + (data[i].preco.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + "</button></div></div>");
        }
    }
    // MENU de opções
    $(document).on('click', '#abrir_venda', function(){
        // Esconde os containers
        $('.destaques-container').hide();
        $('.usados-container').hide();
        $('.novos-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Abrir seleção de venda
        $('.selecao-venda').show();
        // Remove todos os outros
        $('#destaques').removeClass('active');
        $('#usados').removeClass('active');
        $('#novos').removeClass('active');
        // Fecha formulario de vendas
        $('.formulario-jogador').hide();
        $('.formulario-concessionaria').hide();
    });

    $(document).on('click', '#vender_jogador', function(){
        // Esconde os containers
        $('.destaques-container').hide();
        $('.usados-container').hide();
        $('.novos-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Fecha seleção de venda
        $('.selecao-venda').hide();
        // Remove todos os outros
        $('#destaques').removeClass('active');
        $('#usados').removeClass('active');
        $('#novos').removeClass('active');
        // Abre formulario de venda para jogadores
        $('.formulario-jogador').show();
        // Fecha formulario de vendas
        $('.formulario-concessionaria').hide();
    });

    $(document).on('click', '#vender_concessionaria', function(){
        // Esconde os containers
        $('.destaques-container').hide();
        $('.usados-container').hide();
        $('.novos-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Abrir seleção de venda
        $('.selecao-venda').hide();
        // Remove todos os outros
        $('#destaques').removeClass('active');
        $('#usados').removeClass('active');
        $('#novos').removeClass('active');
        // Abre formulario de venda para jogadores
        $('.formulario-concessionaria').show();
        // Fecha formulario de vendas
        $('.formulario-jogador').hide();
    });

    $(document).on('click', '#destaques', function(){
        // Esconde os containers
        $('.usados-container').hide();
        $('.novos-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Mostra o container
        $('.destaques-container').show();
        // Muda o active no nav
        $('#destaques').addClass('active');
        // Remove todos os outros
        $('#usados').removeClass('active');
        $('#novos').removeClass('active');
        // Oculta opção de escolher tipo de venda
        $('.selecao-venda').hide();
        // Fecha formulario de vendas
        $('.formulario-jogador').hide();
        $('.formulario-concessionaria').hide();
    });

    $(document).on('click', '#novos', function(){
        // Esconde os containers
        $('.usados-container').hide();
        $('.destaques-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Mostra o container
        $('.novos-container').show();
        // Muda o active no nav
        $('#novos').addClass('active');
        // Remove todos os outros
        $('#usados').removeClass('active');
        $('#destaques').removeClass('active');
        // Oculta opção de escolher tipo de venda
        $('.selecao-venda').hide();
        // Fecha formulario de vendas
        $('.formulario-jogador').hide();
        $('.formulario-concessionaria').hide();
    });

    $(document).on('click', '#usados', function(){
        // Esconde os containers
        $('.novos-container').hide();
        $('.destaques-container').hide();
        $('.ind-container').hide();
        $('.coluna-lateral').hide();
        // Mostra o container
        $('.usados-container').show();
        // Muda o active no nav
        $('#usados').addClass('active');
        // Remove todos os outros
        $('#novos').removeClass('active');
        $('#destaques').removeClass('active');
        // Oculta opção de escolher tipo de venda
        $('.selecao-venda').hide();
        // Fecha formulario de vendas
        $('.formulario-jogador').hide();
        $('.formulario-concessionaria').hide();
    });

    $(document).on('click', '#abrir_info', function(){
        $('.destaques-container').hide();
        $('.usados-container').hide();
        $('.novos-container').hide();
        switch($(this).attr('tipo')){
            case 'destaques':
                perfilVeiculo(destaques[$(this).val()]);
                break;
            case 'novos':
                perfilVeiculo(novos[$(this).val()]);
                break;
            case 'usados':
                perfilVeiculo(usados[$(this).val()]);
                break;
        }
    });

    $(".fechar").click(function(){
        $.post('http://concessionaria/fechar', JSON.stringify({}));
    });

    // Select formulario de vendas
    $(document).on('change', 'input[name=v_conce]', function(){
        var nome_temp = $(this).val();
        var retorno = 0;
        var achou = false;
        for(i = 0; i < novos.length; i++){
            switch(novos[i].nome_gta){
                case nome_temp:
                    retorno = novos[i].preco;
                    achou = true;
                    break;
            }
            if(achou){
                break;
            }
        }
        var valor_total = parseInt(retorno);
        var subtracao = valor_total * 0.70;
        var valor_venda = valor_total - subtracao;

        $('#valor_total').html('R$ ' + (valor_total.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
        $('#subtracao').html('- R$ ' + (subtracao.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ' (70%)');
        $('#simulacao').html('R$ ' + (valor_venda.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
    });

    // Botão de compra
    $(document).on('click', '.comprar-carro', function(){
        // Oculta o container princpal
        $('.bpa-login-wrapper').hide();
        // Mostra o container de carregamento
        $('.loading-wrapper').show();
        // Envia um post request com as informações do veículo
        $.post('http://concessionaria/comprar', JSON.stringify({
            id: $(this).val()
        }));
    });
    // Botão de venda
    $(document).on('click', '#vender', function(){
        // Oculta o container princpal
        $('.bpa-login-wrapper').hide();
        // Mostra o container de carregamento
        $('.loading-wrapper').show();
        $.post('http://concessionaria/vender', JSON.stringify({
            id: $('input[name=v_conce]:checked').attr('id_carro')
        }));
    });
    // Botão de postar anuncio
    $(document).on('click', '#anuncio', function(){
        // Oculta o container princpal
        $('.bpa-login-wrapper').hide();
        // Mostra o container de carregamento
        $('.loading-wrapper').show();
        $.post('http://concessionaria/postarAnuncio', JSON.stringify({
            id: $('input[name=v_jogador]:checked').attr('id_carro'),
            preco: Math.abs($('#preco_venda').val().replace(/[^0-9]/g, "")),
            destaque: $('input[name=destacar]:checked').length > 0 ? 1 : 0
        }));
    });
    // On 'Esc' call close method
    document.onkeyup = function (data) {
        if (data.which == 27 ) {
            $.post('http://concessionaria/fechar');
        }
    };
});
