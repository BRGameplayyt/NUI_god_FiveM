$(document).ready(function() {

    components = [];
    currentTattoos = [];
    title = 'Roupas';
    usingCamera = false;

    window.addEventListener('message', (event) => {
        let data = event.data;

        switch(data.action) {
            case 'openMenu':
                currentTattoos = data.currentTattoos;
                components = data.elements.map(c => ({
                    label: c.label,
                    value: c.value,
                    list: c.list.map(l => ({
                        label: l.label,
                        price: l.price,
                        value: l.value,
                        enabled: currentTattoos.find(o => o.texture === l.value && o.collection === c.value)
                    }))
                }));
                title = data.title;
                renderMenu();
                break;
            case 'closeMenu':
                closeMenu();
                break;
            case 'disableEraseButton':
                currentTattoos = data.currentTattoos
                $(`.sell-${data.texture}`).prop("disabled", true);
                $(`.buy-${data.texture}`).prop("disabled", false);
                break;
            case 'disableBuyButton':
                currentTattoos = data.currentTattoos
                $(`.sell-${data.texture}`).prop("disabled", false);
                $(`.buy-${data.texture}`).prop("disabled", true);
                break;
            case 'backBuy':
                backBuy();
                break;
            default:
                console.log("Action not found!");
                break;
        }

    });

    $(document).on('click', '.close-skin', function(){
        $.post('http://tattoshop/close');
    });

    $(document).on('click', '.see-tattoo', function(){
        $.post('http://tattoshop/see', JSON.stringify({
            tattoo: $(this).attr('data-tattoo'),
            category: $(this).attr('data-category')
        }));
    });

    $(document).on('click', '.buy-tattoo', function(){
        $.post('http://tattoshop/buy', JSON.stringify({
            tattoo: $(this).attr('data-tattoo'),
            category: $(this).attr('data-category')
        }));
    });

    $(document).on('click', '.remove-tattoo', function(){
        $.post('http://tattoshop/remove', JSON.stringify({
            tattoo: $(this).attr('data-tattoo'),
            category: $(this).attr('data-category')
        }));
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

        components.forEach(c => {
            renderCategory(c);
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

    function renderCategory(data) {
        $('.categories').append(`
            <div id="accordion">
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse_${data.value}" aria-controls="collapse_${data.value}">
                                <i id="icon_${data.value}" class="fas collapse-icon mr-2"></i> ${data.label}
                            </button>
                        </h5>
                    </div>
                
                    <div id="collapse_${data.value}" class="collapse" aria-labelledby="${data.value}" data-parent="#accordion">
                        <div class="card-body">
                            <div class="items-${data.value}">
                                ${data.list.map(el => (`
                                    <div class="slot-w">
                                        <div class="slot-b text-left">
                                            <h5>${el.label}</h5>
                                            <span>R$ ${el.price}</span>
                                        </div>
                                        <div class="slot-f text-right">
                                            <button class='btn btn-vender remove-tattoo sell-${el.value} mr-2' data-tattoo='${el.value}' data-category='${data.value}' ${!el.enabled ? 'disabled' : ''}><i class="fas fa-eraser"></i></button>
                                            <button class='btn btn-vender see-tattoo mr-2' data-tattoo='${el.value}' data-category='${data.value}'><i class="far fa-eye"></i></button>
                                            <button class='btn btn-vender buy-tattoo buy-${el.value}' data-tattoo='${el.value}' data-category='${data.value}'  ${el.enabled ? 'disabled' : ''}><i class="fas fa-money-bill"></i></button>
                                        </div>
                                    </div>
                                `)).join('')}
                            </div>
                        </div>
                    </div>
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
            $.post('http://tattoshop/close');
        }
        /**
         * Free camera
         */
        // if (data.which == 67) {
        //     $('.info-open-camera').hide();
        //     $('.info-close-camera').show();
        //     $.post('http://tattoshop/camera');
        // }
    };
});