$(document).ready(function(){
    // Recebe o evento da NUI
    window.addEventListener('message', function(event){
        // VARIAVEIS
        let data = event.data;

        let icon = "<i class='fas fa-microphone'></i>";

        if(data.update == true) {
            $('.bpa-mic').html(`${icon} ${data.control}`);
        } else if (data.menu) {
            if (data.paused) {
                $(".bpa-mic").hide();
            } else {
                $(".bpa-mic").show();
            }
        }
    });
});
