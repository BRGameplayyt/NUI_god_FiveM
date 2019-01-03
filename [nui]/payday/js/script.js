window.addEventListener('message', function(event){
    // Variaveis
    var item = event.data;
    if(item.payday == true) {
        var sound = new Howl({
            src: ['http://brasilplayaction.com.br/cdn/music/payday_grasse.ogg'],
            volume: 10
        });
        sound.play();
    }
});