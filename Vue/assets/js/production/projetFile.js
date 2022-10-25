
// $('#saveFileProjet').on('click', function () {
//     var myFile = $('#file').prop('files');
//     console.log("saveProjet", myFile);


//     $.ajax({
//         url: '/upload',
//         method: 'post',
//         data: { file: myFile },
//         success: function (resp) {
//             console.log("resp", resp);
//         }
//     })

// })



//console.log("$().val()", $("#nomProj").val());
var donneF = {
    name: $("#nomProj").val()
}
document.getElementById('uploadForm').onsubmit = function (event) {
    event.preventDefault() // prevent form from posting without JS
    var xhttp = new XMLHttpRequest(); // create new AJAX request

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // sucess from server
            //document.getElementById("status").innerHTML = ' sent ' + this.responseText + xhttp.status;
            Swal.fire({
                icon: 'success',
                title: 'Nouveau consigne sauvegardé',
                text: 'Consigne bien sauvegardé'
            })
            //console.log("donneF.name", donneF.name);
            window.location = "/projet/" + donneF.name
        } else { // errors occured
            document.getElementById("status").innerHTML = xhttp.status;
        }
    }

    xhttp.open("POST", "/upload")
    var formData = new FormData()
    formData.append('name', document.getElementById('nomProj').value)     // the text data
    formData.append('avatar', document.getElementById('avatar').files[0]) // since inputs allow multi files submission, therefore files are in array
    xhttp.send(formData)
    //console.log("form");
}

$.ajax({
    url: '/extract-text',
    method: 'post',
    data: donneF,
    success: function (resp) {
        //var dataFile = document.getElementById("dataFile")//${ resp }

        $("#dataFile").append(` <embed src="./../../../../uploads/${resp}" width="100%" height="700" type="application/pdf">`);

        ////console.log("resp", resp);
    }
})
//})