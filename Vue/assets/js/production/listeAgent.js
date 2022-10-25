var agentDataTable = $('#agentDataTable').DataTable(
    {
        "ajax": { "url": "/allAgent", "dataSrc": "" },
        "columns": [
            { 'data': 'name' },
            { 'data': "usualName" },
            { 'data': 'mcode' },
            { 'data': 'number' },
            { 'data': "shift" },
            { 'data': 'project' },
            { 'data': 'site' },
            { 'data': "quartier" },
            { 'data': 'tel' },
            {
                'defaultContent': `\
                    <div class= 'btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                        <button type='button' class='btn px-2 px-2 rounded mx-1 btn-sm btn-warning btnUpdateAgent' data-toggle='modal' data-target='#modalUpdateAgent' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                        <button type='button' class='btn px2 btn-sm rounded btn-danger btnDeleteAgent'><i class='fa fa-trash'></i></button>\
                    <div>\
                `
            }
        ]
    }
)



$("#saveAgent").on('click', function () {
    addAgent = {
        name: $('#name').val(),
        usualName: $('#usual-name').val(),
        mcode: $('#m-code').val(),
        number: $('#number').val(),
        shift: $('#shift').val(),
        project: $('#project').val(),
        site: $('#site').val(),
        quartier: $('#quartier').val(),
        phon: $('#phon').val(),
    }
    console.log("addAgent", addAgent);
    $.ajax({
        url: '/addAgent',
        method: 'post',
        data: addAgent,
        success: function (response) {
            if (response == 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cet utilisateur existe déjà ou nom est absent'
                })
                //clearForm()
                //window.location = "/agent"
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Nouveau utilisateur sauvegarder',
                    text: `Agent ${addAgent.usualName} sauvegarder avec succès`,
                    timer: 2000
                })
                clearForm()
                $('#agentDataTable').DataTable().ajax.reload(null, false)
                window.location = "/agent"

            }
        }
    })
})

function clearForm() {
    $("#name").val('')
    $('#usual-name').val('')
    $('#m-code').val('')
    $('#number').val('')
    $("#shift").val('')
    $('#project').val('')
    $("#site").val('')
    $('#quartier').val('')
    $('#phon').val('')
    $('#cancelAgent').click()
}

$(document).on('click', '#cancelAgent', function () {
    $("#name").val('')
    $('#usual-name').val('')
    $('#m-code').val('')
    $('#number').val('')
    $("#shift").val('')
    $('#project').val('')
    $("#site").val('')
    $('#quartier').val('')
    $('#phon').val('')

})
// get user to update
var mcode = ""
var nameA = ""
var usualName = ""
var number = ""
var shift = ""
var project = ""
var site = ""
var quartier = ""
var phon = ""

$(document).on('click', '.btnUpdateAgent', function () {
    //console.log("btnUpdateAgent");
    var getCol = $(this).closest('tr')
    mcode = getCol.find('td:eq(2)').text()
    nameA = getCol.find('td:eq(0)').text()
    usualName = getCol.find('td:eq(1)').text()
    number = getCol.find('td:eq(3)').text()
    shift = getCol.find('td:eq(4)').text()
    project = getCol.find('td:eq(5)').text()
    site = getCol.find('td:eq(6)').text()
    quartier = getCol.find('td:eq(7)').text()
    phon = getCol.find('td:eq(8)').text()

    $("#nameUpdat").val(nameA)
    $("#usualNameUpdat").val(usualName)
    $("#numberUpdat").val(number)
    $("#shiftUpdat").val(shift)
    $("#projectUpdat").val(project)
    $("#siteUpdat").val(site)
    $("#quartierUpdat").val(quartier)
    $("#telUpdat").val(phon)
    $("#mcodeUpdat").val(mcode)
    // console.log("mcode", mcode);
    // UserUpdat = {
    //     name: $()
    // }
})

//save update user
$(document).on('click', '#saveUpdatUser', function () {
    var nameUpd = $('#nameUpdat').val();
    var usualNameUpdat = $('#usualNameUpdat').val();
    var numberUpd = $('#numberUpdat').val();
    var shiftUpdat = $('#shiftUpdat').val();
    var projectUpdat = $('#projectUpdat').val();
    var siteUpdat = $('#siteUpdat').val();
    var quartierUpdat = $('#quartierUpdat').val();
    var telUpdat = $('#telUpdat').val();
    var mcodeNew = $('#mcodeUpdat').val();

    var userUpdate = {
        mcodeOld: mcode,
        mcodeNew: mcodeNew,
        name: nameUpd,
        usualName: usualNameUpdat,
        number: numberUpd,
        shift: shiftUpdat,
        project: projectUpdat,
        site: siteUpdat,
        quartier: quartierUpdat,
        tel: telUpdat,

        nameA: nameA,
        usualNameA: usualName,
        numberA: number,
        shiftA: shift,
        projectA: project,
        siteA: site,
        quartierA: quartier,
        telA: phon,
    }

    //console.log("userUpdate", userUpdate.tel);

    $.ajax({
        url: '/updateAgent',
        method: "post",
        data: userUpdate,
        success: function (res) {
            console.log("res", res);
            if (res == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cet utilisateur existe déjà'
                })
                clearForm()
                window.location = "/agent"

            } else {
                Swal.fire(
                    'Mis à jour',
                    'Mis à jour avec succès ! ',
                    'sucess',
                    {
                        confirmButtonText: 'OK'
                    }
                )
                $('#nameUpdat').val("");
                $('#usualNameUpdat').val("");
                $('#numberUpdat').val("");
                $('#shiftUpdat').val("");
                $('#projectUpdat').val("");
                $('#siteUpdat').val("");
                $('#quartierUpdat').val("");
                $('#telUpdat').val("");
                $('#cancelUpdatAgent').click()
                window.location = '/agent'

            }

        }
    })
})

$(document).on('click', '.btnDeleteAgent', function () {
    Swal.fire({
        title: 'Supprimer User',
        text: 'Etes-vous sûr de vouloir supprimer cet utilisateur?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Oui'
    }).then((result) => {
        if (result.isConfirmed) {
            var getCol = $(this).closest('tr');
            var codeDelete = getCol.find('td:eq(2)').text();
            deleteMaterial = {
                mcode: codeDelete
            }
            $.ajax({
                url: '/deleteAgent',
                method: 'post',
                data: deleteMaterial,
                success: function (res) {
                    responseTxt = 'Utilisateur supprimé avec succès!';
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: responseTxt,
                        showConfirmButton: true
                    })
                    $("#agentDataTable").DataTable().ajax.reload(null, false)
                },
                error: function (resp) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: resp,
                        showConfirmButton: false,
                        timer: 1700
                    })
                }
            })
        }
    })
})


var type = $('#typeUtil').val()// document.getElementById("typeUtil")//$('#typeUtil').val();

if (type.trim() == "IT") {
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page IT");
} else if (type.trim() == "TL") {
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page TL");
} 