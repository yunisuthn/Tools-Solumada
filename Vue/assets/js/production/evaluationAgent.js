
//console.log("saveEvalAgent");

var agentEvalDataTable = $('#agentEvalDataTable').DataTable(
    {
        "ajax": { "url": "/allEvaluationAgent", "dataSrc": "" },
        "columns": [
            { 'data': "mcode" },
            {
                'data': 'usualName', 'render': function (usualName) {
                    if (usualName) {
                        return usualName
                    } else {
                        return ""
                    }
                }
            },
            { 'data': 'production' },
            { 'data': 'quality' },
            { 'data': "comportement" },
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


// $(document).on('click', '#saveEvalAgent', function () {
$("#saveEvalAgent").on('click', function () {
    //console.log("saveEvalAgent");
    addAgent = {
        name: $('#name').val(),
        mcode: $('#mcode').val(),
        production: $('#production').val(),
        quality: $('#quality').val(),
        comportement: $('#comportement').val()
    }
    //console.log("addAgent", addAgent);
    $.ajax({
        url: '/addEvaluationAgent',
        method: 'post',
        data: addAgent,
        success: function (response) {
            if (response == 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cet utilisateur existe déjà',
                    timer: 4000
                })
                // clearForm()
                // window.location = "/evaluationAgent"
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Nouveau agent sauvegarder',
                    text: `Agent ${addAgent.name} sauvegarder avec succès`,
                    timer: 2000
                })
                //clearForm()
                $('#cancelAgent').click()
                $('#agentEvalDataTable').DataTable().ajax.reload(null, false)
                window.location = "/evaluationAgent"

            }
        }
    })
})

$(document).on('click', '.add', function () {
    clearForm()
})
function clearForm() {
    $("#name").val('')
    $('#mcode').val('')
    $('#production').val('')
    $('#quality').val('')
    $('#comportement').val('')
}

$(document).on("click", "#cancelEvalAgent", function () {
    clearForm()

})

// get user to update
var mcode = ""
var nameA = ""
var productionA = ""
var qualityA = ""
var comportementA = ""
$(document).on('click', '.btnUpdateAgent', function () {
    //console.log("btnUpdateAgent");
    var getCol = $(this).closest('tr')
    mcode = getCol.find('td:eq(0)').text()
    nameA = getCol.find('td:eq(1)').text()
    productionA = getCol.find('td:eq(2)').text()
    qualityA = getCol.find('td:eq(3)').text()
    comportementA = getCol.find('td:eq(4)').text()

    const addname = document.getElementById("text-center")

    $("#mcodeUdpat").val(mcode)
    $("#nameUpdat").val(nameA)
    $("#productionUdp").val(productionA)
    $("#qualityUpdat").val(qualityA)
    $("#comportementUpdat").val(comportementA)
})

//save update user
$(document).on('click', '#saveUpdatUser', function () {
    var productionUdp = $('#productionUdp').val();
    var qualityUpdat = $('#qualityUpdat').val();
    var comportementUpdat = $('#comportementUpdat').val();
    var mcodeN = $('#mcodeUdpat').val();
    var nameUpdat = $('#nameUpdat').val();

    console.log("mcodeN ", mcodeN, " ", nameUpdat);
    var userUpdate = {
        mcodeOld: mcode,
        production: productionUdp,
        quality: qualityUpdat,
        comportement: comportementUpdat,


        mcodeN: mcodeN,
        productionA: productionA,
        nameA: nameA,
        name: nameUpdat,
        qualityA: qualityA,
        comportementA: comportementA
    }

    //console.log("userUpdate", userUpdate);

    $.ajax({
        url: '/updateEvalAgent',
        method: "post",
        data: userUpdate,
        success: function (res) {
            console.log("res", res);
            if (res == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'You should complete the field'
                })
                // clearForm()
                // window.location = "/evaluationAgent"

            } else {
                Swal.fire(
                    'Update',
                    'Mis à jours avec succès ! ',
                    'sucess',
                    {
                        confirmButtonText: 'OK'
                    }
                )
                // $('#nameUpdat').val("");
                // $('#mcodeUpdate').val("");
                // $('#numberUpdatTL').val("");
                // $('#cancelUpdatAgent').click()
                window.location = '/evaluationAgent'

            }

        }
    })
})

$(document).on('click', '.btnDeleteAgent', function () {
    Swal.fire({
        title: 'Delete User',
        text: 'Etes-vous sûr de vouloir supprimer cet utilisateur?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Oui'
    }).then((result) => {
        if (result.isConfirmed) {
            var getCol = $(this).closest('tr');
            var codeDelete = getCol.find('td:eq(0)').text();
            deleteMaterial = {
                mcode: codeDelete
            }
            $.ajax({
                url: '/deleteEvalAgent',
                method: 'post',
                data: deleteMaterial,
                success: function (res) {
                    responseTxt = 'Utilisateur supprimer avec succès!';
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: responseTxt,
                        showConfirmButton: true
                    })
                    $("#agentEvalDataTable").DataTable().ajax.reload(null, false)
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

$('#mcode').on('change', function () {
    var mcode = $('#mcode').val();
    var user = {
        mcode1: mcode.trim()
    }
    $.ajax({
        url: "/getOneAgent",
        data: user,
        method: "post",
        success: function (res) {
            //console.log("res ", res);
            $("#name").val(res.usualName)
        }
    })
})


$('#mcodeUdpat').on('change', function () {
    var mcode = $('#mcodeUdpat').val();
    var user = {
        mcode1: mcode.trim()
    }
    $.ajax({
        url: "/getOneAgent",
        data: user,
        method: "post",
        success: function (res) {
            //console.log("res ", res);
            $("#nameUpdat").val(res.usualName)
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