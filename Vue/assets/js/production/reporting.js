var reportingDataTable = $("#reportingDataTable").DataTable({
    "ajax": {
        "url": "/allReporting", "dataSrc": ""
    },
    "columns": [
        { "data": "name" },
        { "data": "mcode" },
        { "data": "start" },
        { "data": "end" },
        { "data": "production" },
        { "data": "faute" },
        {
            'defaultContent': `\ 
                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                    <button type='button' class='btn px-2 px-2 rounded mx-1 btn-sm btn-warning btnUpdateReporting' data-toggle='modal' data-target='#modalUpdateReporting'><i class='fa fa-edit'></i></button>\
                    <button type='button' class='btn px2 btn-sm rounded btn-danger btnDeleteReporting'><i class='fa fa-trash'></i></button>\
                </div>\
            `
        }
    ]
})


$('#mcode').on("change", function () {
    //console.log("mcode");
    var mcode = $("#mcode").val();
    var user = {
        mcode1: mcode.trim()
    }

    $.ajax({
        url: "/getOneAgent",
        data: user,
        method: "post",
        success: function (res) {
            $("#name").val(res.usualName)
        }
    })
})

$('#saveReporting').on("click", function () {
    var mcode = $('#mcode').val();
    var name = $('#name').val();
    var production = $('#production').val();
    var faute = $('#faute').val();
    var start = $("#start").val();
    var end = $('#end').val();

    var dataReport = {
        mcode: mcode,
        name: name,
        production: production,
        faute: faute,
        start: start,
        end: end
    }



    $.ajax({
        url: "/addReporting",
        method: "post",
        data: dataReport,
        success: function (res) {
            console.log("res", res);
            if (res == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ce donnée est déjà enregistré ou vous devez compléter les champs'
                })
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Nouveau Reporting sauvegardé",
                    text: `Reporting de ${name} sauvegardé avec succès`,
                    //timer: 2000

                })
                $("#cancelReporting").click();
                //$('#')
                window.location = "/reporting"
            }
        }
    })

})


var mcodeA = ""
var nameA = "";
var productionA = "";
var fauteA = "";
var debutA = "";
var finA = "";

$(document).on('click', '.btnUpdateReporting', function () {
    //console.log("btnUpdateReporting");
    var getCol = $(this).closest('tr');
    mcodeA = getCol.find('td:eq(0)').text();
    nameA = getCol.find('td:eq(1)').text();
    productionA = getCol.find('td:eq(4)').text();
    fauteA = getCol.find('td:eq(5)').text();
    debutA = getCol.find('td:eq(2)').text();
    finA = getCol.find('td:eq(3)').text();

    debutA = debutA.split("/").reverse().join("-");
    finA = finA.split("/").reverse().join("-")
    //console.log("fin1", finA);
    $("#mcodeUpd").val(mcodeA);
    $("#nameUpdatReport").val(nameA);
    $("#productionUpdat").val(productionA);
    $("#fauteUpdat").val(fauteA);
    $("#debutUpdat").val(debutA);
    $("#finUpdat").val(finA)
})

$("#mcodeUpd").on('change', function () {

    var mcode = $("#mcodeUpd").val();
    //console.log("mcode", mcode);
    var user = {
        mcode1: mcode
    }

    $.ajax({
        url: '/getOneAgent',
        data: user,
        method: "post",
        success: function (res) {
            //console.log("res", resusualName);
            $("#nameUpdatReport").val(res.usualName)
        }
    })
})


$("#saveUpdateMat").on("click", function () {
    var nameUpdat = $("#nameUpdatReport").val();
    var mcodeUpdat = $("#mcodeUpd").val();
    var productionUpdat = $("#productionUpdat").val();
    var fauteUpdat = $("#fauteUpdat").val();
    var startUpdat = $('#debutUpdat').val();
    var endUpdat = $('#finUpdat').val();

    // console.log("startUpdat", startUpdat);
    // console.log("endUpdat", endUpdat);
    var dataReportUpdat = {
        name: nameUpdat,
        mcode: mcodeUpdat,
        production: productionUpdat,
        faute: fauteUpdat,
        start: startUpdat,
        end: endUpdat,

        mcodeA: mcodeA,
        productionA: productionA,
        fauteA: fauteA,
        debutA: debutA,
        finA: finA
    }

    $.ajax({
        url: "/updateReporting",
        data: dataReportUpdat,
        method: "post",
        success: function (resp) {
            //console.log("resp", resp);

            if (resp == "error") {
                Swal.fire(
                    'Error',
                    'Field is empty',
                    'info',
                    {
                        confirmButtonText: 'Ok'
                    }
                )
            } else {
                Swal.fire(
                    'Update',
                    'Update successfully!',
                    'success',
                    { confirmButtonText: 'Ok' }
                )
                $("#cancelUpdate").click()
                //reportingDataTable.ajax.reload(null, false)
                // reportingDataTable.ajax.reload(null, false)
                // reportingDataTable.ajax.reload(null, false)
                window.location = "/reporting"
            }
        }
    })
})

$(document).on("click", '.btnDeleteReporting', function () {
    Swal.fire({
        title: 'Delete Reporting',
        text: 'Avez vous sûre de supprimer ce reporting?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: "Oui, supprimer!"
    }).then((result) => {
        if (result.isConfirmed) {

            var getCol = $(this).closest('tr');
            var mcode = getCol.find('td:eq(0)').text();
            var name = getCol.find('td:eq(1)').text();
            var production = getCol.find('td:eq(4)').text();
            var faute = getCol.find('td:eq(5)').text();
            var debut = getCol.find('td:eq(2)').text();
            var fin = getCol.find('td:eq(3)').text();


            debut = debut.split("/").reverse().join("-");
            fin = fin.split("/").reverse().join("-")
            var deleteReport = {
                mcode: mcode,
                name: name,
                production: production,
                faute: faute,
                start: debut,
                end: fin
            }

            $.ajax({
                url: "/deleteReporting",
                data: deleteReport,
                method: "post",
                success: function (res) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Reporting supprimé avec succès',
                        showConfirmButton: true
                    })
                    $("#reportingDataTable").DataTable().ajax.reload(null, false)
                    $("#reportingDataTableMonth").DataTable().ajax.reload(null, false)
                    $("#reportingDataTableWeek").DataTable().ajax.reload(null, false)

                    //$("#").DataTable().ajax.reload(null, false)
                    //window.location = '/reporting'
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

// document.getElementById("reportingDataTable").style.display = "none";
// document.getElementById("reportingDataTableMonth").style.display = "block";
var reportingDataTableMonth = $("#reportingDataTableMonth").DataTable({
    "ajax": {
        "url": "/allReportingMois", "dataSrc": ""
    },
    "columns": [
        { "data": "name" },
        { "data": "mcode" },
        { "data": "end" },
        { "data": "production" },
        { "data": "faute" }
    ]
})

var reportingDataTableWeek = $("#reportingDataTableWeek").DataTable({
    "ajax": {
        "url": "/allReportingWeek", "dataSrc": ""
    },
    "columns": [
        { "data": "name" },
        { "data": "mcode" },
        { "data": "end" },
        { "data": "start" },
        { "data": "production" },
        { "data": "faute" },
    ]
})