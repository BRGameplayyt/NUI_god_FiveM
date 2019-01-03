$(document).ready(function() {
    window.addEventListener('message', function( event ) {
        var data = event.data;
        if(data.showPlayerMenu == true) {
            $("#erro").hide()
            $(".bpa-login").show();
        } else if (data.showPlayerMenu == false) {
            $(".bpa-login").hide();
        } else if (data.atingiuLimite == true) {
            $("#erro").show();
        }

        $("#comprarTicket").submit(function(e) {
            e.preventDefault();
            setTimeout(() => {
                $.post('http://vrp_loteria/buyTickets', JSON.stringify({
                    amount: $('#amount').val()
                }));
            }, 3000); // Fix
        });

        $("#fechar").click(function(){
            $.post('http://vrp_loteria/closeButton', JSON.stringify({}));
        });
    });
});