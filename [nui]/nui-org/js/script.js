$(document).ready(function() {
    /**
     * Handles the window message event trow by FiveM.
     */
    window.addEventListener("message", function(event){
        let e = event.data;
        /**
         * Handles all events.
         */
        if(e.openMenu) {
            ['.loading-wrapper', '.invite-wrapper'].forEach(s => $(s).hide());
            /**
             * If it has some error, display it.
             */
            if (e.error) {
                $("#erro").show();
                $("#erro").html(`<b>Erro: </b>${e.error}`);
            } else {
                $("#erro").hide();
            }
            /**
             * Forms the members and info constants to be used later to display members and org infos.
             */
            members = JSON.parse(e.members);
            info = JSON.parse(e.info);
            roles = JSON.parse(e.roles);
            /**
             * Display the members of org.
             */
            displayMembers(members);
            /**
             * Display the roles
             */
            displayRoles(roles);
            /**
             * Disable the invite member option if the org has reach his limit.
             */
            if(members.length === parseInt(info.limit)) $("#inviteMember").hide();
            /**
             * Display the info.
             */
            $("#org-info-p").html(`<span>Menu:</span> ${info.org_name} / <span>Membros:</span> ${members.length}/${info.org_limit}`);
            /**
             * Show the menu.
             */
            [".bpa-login-wrapper", ".bpa-nui-wrapper"].forEach(s => $(s).show());
        } else if (e.closeMenu) {
            /**
             * Hide the menu.
             */
            $(".bpa-nui-wrapper").hide();
        }
    });
    /**
     * Sort the members order and display them in HTML.
     * @param {*} members - Members array of objects.
     */
    let displayMembers = (members) => {
        $("#membersTbody").html("");
        members
            .sort((a, b) => a.order - b.order)
            .forEach(member => $("#membersTbody").append(`<tr> <td class='text-center'>${member.role}</td> <td class='text-center'>ID: ${member.id} - ${member.name}</td> <td class='text-center'> <button type='button' value='${member.id}' class='btn btn-success btn-promove' ${member.order == '1' || member.order == '2' ? 'disabled': ''}><i class='fas fa-chevron-up'></i></button> <button type='button' value='${member.id}' class='btn btn-secondary btn-demote' ${member.order == '1' || member.order == '5' ? 'disabled' : ''}><i class='fas fa-chevron-down'></i></button> <button type='button' value='${member.id}' class='btn btn-danger btn-remove' ${member.order == '1' ? 'disabled' : ''}><i class='fas fa-minus-square'></i></button> </td> </tr>`));
    };
    /**
     * Sort the roles by order and display then in HTML
     * @param {*} roles - Array of roles.
     */
    let displayRoles = (roles) => {
        $(".fivem-lixo").html("");
        roles
            .sort((a, b) => a.order - b.order)
            .forEach(role => $(".fivem-lixo").append(`<input class="form-bpa" type="radio" name="role" value="${role.order}" id="r_${role.order}"><label class="label-fix" for="r_${role.order}">${role.name}</label>`));
    };
    /**
     * Handles the key command to see if "Esc" is pressed so it closes the org menu.
     * @param {*} key - Key that is pressed
     */
    document.onkeyup = (key) => key.which == 27 && $.post('http://nui-org/close');
    /**
     * Handles the close button
     */
    $(document).on('click', '.fechar', function() {
        $.post('http://nui-org/close');
    });
    /**
     * Handles the up action.
     */
    $(document).on('click', '.btn-promove', function() {
        $.post('http://nui-org/promove', JSON.stringify({
            id: $(this).val()
        }));
        $(".bpa-login-wrapper").hide();
        $(".loading-wrapper").show();
    });
    /**
     * Handles the down action.
     */
    $(document).on('click', '.btn-demote', function() {
        $.post('http://nui-org/demote', JSON.stringify({
            id: $(this).val()
        }));
        $(".bpa-login-wrapper").hide();
        $(".loading-wrapper").show();
    });
    /**
     * Handles the remove action.
     */
    $(document).on('click', '.btn-remove', function() {
        $.post('http://nui-org/remove', JSON.stringify({
            id: $(this).val()
        }));
        $(".bpa-login-wrapper").hide();
        $(".loading-wrapper").show();
    });
    /**
     * Open the invite form
     */
    $(document).on('click', '#InviteButton', function() {
        $(".bpa-login-wrapper").hide();
        $(".invite-wrapper").show();
    });
    /**
     * Handles the invite action.
     */
    $("#inviteForm").submit(function(e) {
        e.preventDefault();
        $.post('http://nui-org/invite', JSON.stringify({
            id: $('#user_id').val(),
            role: $("[name='role']:checked").val()
        }));
        $(".invite-wrapper").hide();
        $(".loading-wrapper").show();
    });
});