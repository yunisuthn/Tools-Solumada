
$('#saveProjet').on("click", function () {
    Projet = {
        name: $('#nameProj').val()
    }

    $.ajax({
        url: '/newProjet',
        method: 'post',
        data: Projet,
        success: function (resp) {
            if (resp == 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ce projet est déjà existe'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Nouveau projet sauvegardé',
                    text: `Projet ${Projet.name} sauvegardé avec succès`
                })
                clearProjet()
                window.location = "/projet"
            }
        }
    })
})

function clearProjet() {
    $('#nameProj').val("")
    $('#cancelMat').click()
}

function clearProjetUpdat() {
    $('#nameUpdatProj').val("")
    $('#cancelUpdate').click()
}

var nameProj = ""
$('.updatProj').on('click', function () {
    nameProj = $(this).parent().find(".nameProjCard").text().trim()
    $('#nameUpdatProj').val(nameProj)
})

$('#saveUpdateMat').on('click', function () {
    UpdateProj = {
        nameOld: nameProj,
        nameNew: $('#nameUpdatProj').val()
    }

    $.ajax({
        url: '/updateProjet',
        method: 'post',
        data: UpdateProj,
        success: function (res) {
            if (res == 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ce projet est déjà exist ou projet vide'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Mis à jours réussi',
                    text: 'Votre mis à jours est bien réussi'
                })
                clearProjetUpdat()
                window.location = "/projet"
            }
        }
    })
})

$('.deleteProj').on('click', function () {
    Swal.fire({
        title: 'Supprimer',
        text: 'Etes-vous sur de vouloir supprimer ce projet?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Oui'

    }).then((res) => {
        if (res.isConfirmed) {
            var nameProjDelt = $(this).parent().find('.nameProjCard').text().trim()
            $.ajax({
                url: '/deleteProjet',
                method: 'post',
                data: { name: nameProjDelt },
                success: function (res) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `${nameProjDelt} supprimé avec succès! `

                    })
                    window.location = "/projet"
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
