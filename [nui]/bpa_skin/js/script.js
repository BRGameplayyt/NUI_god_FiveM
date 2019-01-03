$(document).ready(function() {

    components = [];
    title = 'Roupas';
    usingCamera = false;

    window.addEventListener('message', (event) => {
        let data = event.data;

        switch(data.action) {
            case 'openMenu':
                components = data.elements
                title = data.title;
                renderMenu();
                break;
            case 'closeMenu':
                closeMenu();
                break;
            case 'updateMenu':
                components.forEach(e => {
                    e.max = data.elements[e.name].max;
                    updateRow(e);
                });
                break;
            case 'backBuy':
                backBuy();
                break;
            default:
                console.log("Action not found!");
                break;
        }

    });

    // Click events.
    $(document).on('click', '.foward-action', function(){
        let item = $(this).attr('data-item');
        let current = {};
        /**
         * Atualiza a array de elementos temporaria.
         */
        components.forEach(e => {
            if(e.name === item) {
                current = e;
                e.value++;
                /**
                 * Atualiza a visualização do item.
                 */
                updateRow(e);
                return;
            }
        });

        $.post('http://bpa_skin/foward-action', JSON.stringify({ current }));
    });

    $(document).on('click', '.previous-action', function(){
        let item = $(this).attr('data-item');
        let current = {};
        /**
         * Atualiza a array de elementos temporaria.
         */
        components.forEach(e => {
            if(e.name === item) {
                current = e;
                e.value--;
                /**
                 * Atualiza a visualização do item.
                 */
                updateRow(e);
                return;
            }
        });

        $.post('http://bpa_skin/previous-action', JSON.stringify({ current }));
    });

    $(document).on('click', '.close-skin', function(){
        $.post('http://bpa_skin/close');
    });

    $(document).on('click', '.buy-skin', function(){
        $.post('http://bpa_skin/buy');
    });

    // Button events.
    function updateRow(data) {
        $(`.${data.name}-w`).html(`
            <ul class="pagination">
                <li class="${parseInt(data.value) > parseInt(data.min) ? 'previous-action' : 'disabled'} page-item" data-item='${data.name}'>
                    <a class="page-link">
                        <i class="fas fa-chevron-left"></i> 
                    </a>
                </li>
                <li class="page-item">
                    <span class="page-link ${data.name}-value">${data.value}</span>
                </li>
                <li class="${parseInt(data.value) < parseInt(data.max) ? 'foward-action' : 'disabled'} page-item" data-item='${data.name}'>
                    <a class="page-link">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            </ul>
        `);
    }

    // Functions.
    function renderMenu() {

        $('.items-scroll').html('');
        $('.info-open-camera').show();
        $('.info-close-camera').hide();
        $('.bpa-skinshop').show();
        $('.page-title').html(title);

        components.forEach(e => {
            renderRow(e);
        });

        $('.items-scroll').slimScroll({
            height: '20rem',
            position: 'right',
            color: 'rgb(169, 69, 106)',
            alwaysVisible: true
        });
    }

    function closeMenu () {
        $('.bpa-skinshop').hide();
    }

    function renderRow(data) {
        $('.items-scroll').append(`
            <div class="slot-w">
                <div class="slot-h">
                    <img src="http://brasilplayaction.com.br/cdn/icons/${data.icon}.png">
                </div>
                <div class="slot-b">
                    <h5>${data.label}</h5>
                </div>
                <div class="slot-f">
                    <nav class='${data.name}-w'>
                        <ul class="pagination">
                            <li class="${parseInt(data.value) > parseInt(data.min) ? 'previous-action' : 'disabled'} page-item" data-item='${data.name}'>
                                <a class="page-link">
                                    <i class="fas fa-chevron-left"></i> 
                                </a>
                            </li>
                            <li class="page-item">
                                <span class="page-link ${data.name}-value">${data.value}</span>
                            </li>
                            <li class="${parseInt(data.value) < parseInt(data.max) ? 'foward-action' : 'disabled'} page-item" data-item='${data.name}'>
                                <a class="page-link">
                                    <i class="fas fa-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        `);
    }

    function backBuy() {
        $('.info-open-camera').show();
        $('.info-close-camera').hide();
        setTimeout(() => {
            usingCamera = false;
        }, 500);
    }

    // Key events.
    document.onkeyup = function (data) {
        /**
         * "Esc"
         */
        if (data.which == 27) {
            $.post('http://bpa_skin/close');
        }
        /**
         * Free camera
         */
        if (data.which == 67) {
            $('.info-open-camera').hide();
            $('.info-close-camera').show();
            $.post('http://bpa_skin/camera');
        }
    };
});