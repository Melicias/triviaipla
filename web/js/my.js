/* LINK
 * https://opentdb.com/api.php?amount=10&category=18&difficulty=easy
 * 
 * A dificuldade pode ser easy ou medium
 * categoria 21 - Desporto
 * categoria 15 - video jogos
 * categoria 18 - computadores/informatica
 * 
 */

$(document).ready(function(){
    //$("#contentor").load("inicio_menu.html");
    
    var dificuldade; //dificuldade facil(easy) / dificuldade media(medium)
    var sdificuldade;
    var categoria;
    var scategoria;
    var perguntas = new Array();
    var nrpergunta = -1;
    var nomeJogador;
    //no array respotas tera o valor 3 caso tenha acertado na respota e tera o valor 0;1;2 caso tenha errada na pergunta e o seu valor ira corresponder a sau posicao no array de incorretas
    var respostas = new Array();
    var favs = new Array();
    var topTen = new Array();
    
    
    if (typeof(Storage) !== "undefined") {
        var retrievedObject = localStorage.getItem('topTen');
        topTen = JSON.parse(retrievedObject);
    } else {
        alert("Your browser does not support Web Storage...");
    }
    
    
    //REMOVER O COMENTARIO PARA O CODIGO FUNCIONAR
    //Butao adicionar
    $("#contentor").html("<div id='div_butoes_inicio_menu'>\n\
                              <h2 style=text-align: -webkit-center; \n\
                              Escolha a dificuldade:</h2> \n\
                              <img src='imagens/trivia.png' alt='triviaimg' height='100px' width='200px'>\n\
                              <button id='butaoIniciarJogo' type='button' style='display: block; margin:15px; width:250px ; height: 125px; font-size: 35px;' class='btn btn-primari btn-lg' >Iniciar Jogo</button>\n\
                     </div>");
    });
    

    $(document).on("click","#butaoIniciarJogo",function(){
        $("#contentor").html("<div id='div_escolher_dificuldade'>\n\
                                <h2>Escolha a dificuldade:</h2>\n\
                                <button id='butaoDificuldadeFacil' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primari'>Fácil</button>\n\
                                <button id='butaoDificuldadeMedia' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primari'>Média</button>\n\
                            </div>");  
    });
    
    $("#btnTopTen").click(function(){
        var html = "<div id='divTopTen'>";
        for(var i = 0;i<topTen.length;i++){
            if(perguntas[nrpergunta].type == "boolean"){
                //codigo de html com os botoes verdadeiro e falso.
                var butoes = "<div id='div_true_false'>\n\
                                <h2>" + (nrpergunta+1) + " - " + perguntas[nrpergunta].question + "</h2>";
                    butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].correct_answer + "</button>";
                    butoes += "<button id='botaoRespostaIncorreta0' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].incorrect_answers; + "</button>";
                $("#contentor").html(butoes);
            }else{
                for(var i=1;i<=4;i++){
                    if(i == correto){
                        //adicionar a variavel butoes um botao com a respota correta
                        butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].correct_answer + "</button>";
                    }else{
                        //adicionar a variavel butoes um botao com a incorrectanswers
                        butoes += "<button id='botaoRespostaIncorreta" + ii + "' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].incorrect_answers[ii]; + "</button>";
                        ii++;
                    }
                }
            }
        }
        html+="</div>"
    });
    
    $(document).on("click","#butaoDificuldadeFacil",function(){
	sdificuldade = "Fácil";
        escolherDificuldade("easy");
    });
    
    $(document).on("click","#butaoDificuldadeMedia",function(){
	sdificuldade = "Média";
        escolherDificuldade("medium");
    });
    
    
    function escolherDificuldade(id){
        dificuldade = id;
        $("#contentor").html("<div id='div_escolher_categoria'>\n\
                                <h1>Escolha a categoria</h1>\n\
                                <button type='button' id='botaoinformatica' class='btn btn-primari butoesCategoria'>Informática</button>\n\
                                <button type='button' id='botaojogos' class='btn btn-primari butoesCategoria'>Video-Jogos</button>\n\
                                <button type='button' id='botaodesporto' class='btn btn-primari butoesCategoria'>Desporto</button>\n\
                                <button type='button' id='botaoRandom' class='btn btn-primari butoesCategoria'>Random</button>\n\
                              </div>"); 
    }
    
    $(document).on("click","#botaoinformatica",function(){
	scategoria = "Informática";
        escolherCategoria(18);
    });
    
    $(document).on("click","#botaojogos",function(){
	scategoria = "Video-Jogos";
        escolherCategoria(15);
    });
    
    $(document).on("click","#botaodesporto",function(){
	scategoria = "Desporto";
        escolherCategoria(21);
    });
    
    $(document).on("click","#botaoRandom",function(){
        escolherCategoria(-1);
    });
    
    
    function escolherCategoria(cat){
        categoria = cat;
        if(cat == -1){
            var random = Math.floor((Math.random() * 3) + 1);
            switch(random){
                case 1:
                    categoria = 18;
                    scategoria = "Informática";
                    break;
                case 2:
                    categoria = 15;
                    scategoria = "Video-Jogos";
                    break;
                case 3:
                    categoria = 21;
                    scategoria = "Desporto";
                    break;
                default:
                    categoria = 18;
                    scategoria = "Informática";
            }
        }
        iniciarJogo();
        //generarLinkAPI();
    }
	
    function iniciarJogo(){
        $("#contentor").html("<div id='div_iniciar_jogo'>\n\
                        <h1>Opções do jogo: </h1><br>\n\
                        <h2>Dificuldade: "+ sdificuldade +"</h2><br>\n\
                        <h2>Categoria: "+ scategoria +"</h2><br>\n\
                        <h2>Nome do jogador: <br><input type='text' id='username' name='username' style= color:black></h2><br>\n\
                        <button id='iniciarJogoUsername' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primari'>Iniciar</button>\n\
                    </div>"); 
    }

    $(document).on("click","#iniciarJogoUsername",function(){
            nomeJogador = $('#username').val();
            if(nomeJogador != "" && nomeJogador.length > 2){
                generarLinkAPI();
            }else{
                alert("O nome tem de ter pelo menos 3 carateres!");
            }
    });
    
    function generarLinkAPI(){
        var link = "https://opentdb.com/api.php?amount=10&category=" + categoria + "&difficulty="+ dificuldade;
        $.getJSON(link, function(data) {
            //data is the JSON string
            //criar array com isto, e assim que s saca a informacao do data
            perguntas = data.results;
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('perguntas', JSON.stringify(perguntas));
                localStorage.setItem('nomeJogador', nomeJogador);
                //get local storage
                //var retrievedObject = localStorage.getItem('perguntas');
                //perguntas = JSON.parse(retrievedObject);
                
                //Envio o 0 para comecar a contar desde o 0;
                comecarAsPerguntas(0);
            } else {
                alert("Your browser does not support Web Storage...");
            }
            
        });
    }
    
    function comecarAsPerguntas(id){
        nrpergunta = id;
        localStorage.setItem('nrpergunta', nrpergunta);
        if(perguntas[nrpergunta].type == "boolean"){
            //codigo de html com os botoes verdadeiro e falso.
            var butoes = "<div id='div_true_false'>\n\
                            <h2>" + (nrpergunta+1) + " - " + perguntas[nrpergunta].question + "</h2>";
                butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].correct_answer + "</button>";
                butoes += "<button id='botaoRespostaIncorreta0' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].incorrect_answers; + "</button>";
            $("#contentor").html(butoes);
        }else{
            //codigo para escolher um botao aleatoriamente para ser a opcao certa.
            //O primeiro numero do array vai ser o numero que tera a resposta correta
            var correto = Math.floor((Math.random() * 4) + 1);
            var butoes = "<div id='div_escolha_multipla'>\n\
                            <h2>" + (nrpergunta+1) + " - " + perguntas[nrpergunta].question + "</h2>";
            var ii = 0;	
            for(var i=1;i<=4;i++){
                if(i == correto){
                    //adicionar a variavel butoes um botao com a respota correta
                    butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].correct_answer + "</button>";
                }else{
                    //adicionar a variavel butoes um botao com a incorrectanswers
                    butoes += "<button id='botaoRespostaIncorreta" + ii + "' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primari'>" + perguntas[nrpergunta].incorrect_answers[ii]; + "</button>";
                    ii++;
                }
            }
            
            //butoes += "</div>";
            butoes += "     <button id='perguntafav' type='button' class='butaofav_empty'>\n\
                       </div>";
            
            //adicionar a variavel butoes butoes para adicionar aos favs. FALTA FAZER ISTO
            //codigo de html com 4 botoes para fazer os 4 opcoes de escolhas.
            $("#contentor").html(butoes);
        }
    }
    
    $(document).on("click","#perguntafav",function(){
        if($('#perguntafav').hasClass('butaofav_empty')){
            $('#perguntafav').removeClass('butaofav_empty');
            $('#perguntafav').addClass('butaofav_color');
            topTen.push(perguntas[nrpergunta]);
            localStorage.setItem('topTen', JSON.stringify(topTen));
        }else{
            $('#perguntafav').removeClass('butaofav_color');
            $('#perguntafav').addClass('butaofav_empty');
            topTen.pop();
            localStorage.setItem('topTen', JSON.stringify(topTen));
        }
    });
    
    
    $(document).on("click","#botaoRespostaCorreta",function(){
        respostas.push("3");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta0",function(){
        respostas.push("0");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta1",function(){
        respostas.push("1");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta2",function(){
        respostas.push("2");
        proximaPergunta();
    });
    
    function proximaPergunta(){
        localStorage.setItem('respostas', JSON.stringify(respostas));
        if((nrpergunta+1) == (perguntas.length)){
            //CODIGO PARA ACABAR AS PERGUNTAS - mostrar pontuacao
            mostrarPontuacao();
            //RESET DO JOGO //RESETAR VARIAVEIS GUARDADAS NO BROWSER
            //resetVariaveis();
            //VOLTAR A PAGINA INICIAL
        }else{
            comecarAsPerguntas((nrpergunta+1));
        }
    }
    
    function mostrarPontuacao(){
        var pont = 0;
        //fazer as contas apra a pontuacao
        for(var i = 0; i<= respostas.length; i++){
            if(respostas[i] == 3){
                pont++;
            }
        }
        //generar html com os resultados finais
        var html =  "<div id='pontuacao' style='overflow-y: scroll;height:100%;'>\n\
                        <h1 style='text-align: center' id='hpontuacao'> PONTUACAO FINAL: " + pont + "/" + perguntas.length + "</h1><br><br><br>";
        for(var i = 0; i < perguntas.length; i++){
            html +="<div id='divpontuacao" + i + "' class='divpontuacoes'>\n\
                        <h3>" + (i+1) + " - " + perguntas[i].question + "</h3>\n\
                        <button type='button' style='margin:30px; height: 50px; font-size: 20px;' class='btn btn-success'>" + perguntas[i].correct_answer + "</button>";
            
            if(respostas[i] != 3){
                html += "<button type='button' style='margin:30px; height: 50px; font-size: 20px;' class='btn btn-danger'>" + perguntas[i].incorrect_answers[respostas[i]]; + "</button>";
            }
            
            html += "</div>";
        }
        html += "</div>"
        $("#contentor").html(html); 
    }
    
    function resetVariaveis(){
        dificuldade = "";
        sdificuldade = "";
        categoria = "";
        scategoria = "";
        perguntas = new Array();
        nrpergunta = -1;
        nomeJogador = "";
        respostas = new Array();
        localStorage.removeItem("respostas");
        localStorage.removeItem("nrpergunta");
        localStorage.removeItem("perguntas");
        localStorage.removeItem("nomeJogador");
    }
    
    //https://www.w3schools.com/html/html5_webstorage.asp
    
