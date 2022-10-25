var planningDataTable = $("#planningDataTable").DataTable({
    "ajax": { "url": "/allPlanning", "dataSrc": "" },
    "columns": [
        { "data": "shift" },
        { "data": "usualName" },
        { "data": "mcode" },
        { "data": "project" },
        {
            "data": "start", "render": function (start) {
                if (start == "") {
                    return ""
                } else {
                    return start
                }
            }
        },
        {
            "data": "end", "render": function (end) {
                if (end == "") {
                    return ""
                } else {
                    return end
                }
            }
        }, {
            "defaultContent": "\
                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                    <button type='button' class='btn px-2 btn-sm btn-warning btnUpdatePlanning' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdatePlanningModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                    <button type='button' class='btn px-2 btn-sm btn-danger btnDeletePlanning' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                </div>\
            "
        }
    ],
})


$(document).on("click", '#savePlanning', function () {
    //console.log("savePlanning");
    var shift = $("#shift").val()
    var mcode = $("#mcode-plan").val()
    var nom = $("#nom").val()
    var project = $("#projet").val()
    var start = $("#start").val()
    var end = $("#end").val()

    var addPlanning = {
        shift: shift,
        mcode: mcode,
        nom: nom,
        project: project,
        start: start,
        end: end
    }

    $.ajax({
        url: "/addPlanning",
        method: "post",
        data: addPlanning,
        success: function (res) {
            if (res == "success") {
                Swal.fire({
                    icon: 'success',
                    title: "New planning added",
                    text: `Planning ${nom} saved successfully`
                })
                clearForm()
                window.location = "/planning"
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "This user is already exist or you need to complete the field"
                })

            }
        }
    })
    //console.log("shift", addPlanning);
})

function clearForm() {
    $("#shift").val("");
    $('#mcode').val("");
    $("#nom").val("");
    $('#projet').val("");
    $('#start').val("")
    $('#end').val("")
}

var mcodeUpdat = ""
var prenomUpdat = ""
var project = ""
var start = ""
var end = ""
var shift = ""

$(document).on("click", '.btnUpdatePlanning', function () {
    //console.log("btnUpdatePlanning");
    var getCol = $(this).closest('tr')
    shift = getCol.find('td:eq(0)').text()
    prenomUpdat = getCol.find('td:eq(1)').text()
    mcodeUpdat = getCol.find('td:eq(2)').text()
    project = getCol.find('td:eq(3)').text()
    start = getCol.find('td:eq(4)').text()
    end = getCol.find('td:eq(5)').text()

    start = start.split("/").reverse().join("-")
    end = end.split("/").reverse().join("-")
    //console.log("start", start);
    $('#shiftUpdat').val(shift)
    $('#mcodeUpdate').val(mcodeUpdat);
    $('#nomUpdat').val(prenomUpdat);
    $('#projectUpdat').val(project);
    $('#startUpdat').val(start);
    $('#endUpdat').val(end);
})

$(document).on("click", "#saveUpdatPlanning", function () {
    var shiftUpd = $('#shiftUpdat').val();
    var mcodeUpd = $('#mcodeUpdate').val();
    var nomUpd = $('#nomUpdat').val();
    var projectUpd = $('#projectUpdat').val();
    var startUpd = $('#startUpdat').val();
    var endUpd = $('#endUpdat').val();

    var planningUpd = {
        shift: shiftUpd,
        mcodeAncien: mcodeUpdat,
        mcodeNouv: mcodeUpd,
        prenomUpdat: nomUpd,
        projet: projectUpd,
        start: startUpd,
        end: endUpd,

        shiftA: shift,
        prenomA: prenomUpdat,
        projetA: project,
        startA: start,
        endA: end
    }

    $.ajax({
        url: '/udpatePlanning',
        method: 'post',
        data: planningUpd,
        success: function (res) {
            if (res == "success") {
                Swal.fire(
                    'Update',
                    'Update successfully!',
                    'success',
                    { confirmButtonText: 'Ok' }
                )
                window.location = "/planning"
                viderUpdate()
                //$("#planningDataTable").DataTable().ajax.reload(null, false);

            } else {
                Swal.fire(
                    'Error',
                    "The field is empty!",
                    'info',
                    {
                        confirmButtonText: 'Ok',
                    });

            }
        }
    })
})

function viderUpdate() {
    $('#shiftUpdat').val("");
    $('#projectUpdat').val("");
    $('#startUpdat').val("");
    $('#endUpdat').val("");
    $('#cancelUpdatePlan').click()

}

$(document).on('click', '.btnDeletePlanning', function () {
    Swal.fire({
        title: 'Delete Planning',
        text: 'Are you sure to delete this planning?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var getCol = $(this).closest('tr');
            var codeDelete = getCol.find('td:eq(2)').text();
            deleteMaterial = {
                mcode: codeDelete
            }
            $.ajax({
                url: '/deletePlanning',
                method: 'post',
                data: deleteMaterial,
                success: function (res) {
                    responseTxt = 'Planning deleted successfully!';
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: responseTxt,
                        showConfirmButton: true
                    })
                    //$("#planningDataTable").DataTable().ajax.reload(null, false)
                    //planningView()
                    window.location = "/planning"
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

planningView()
function planningView() {
$.ajax({
    url: "/allPlannigView",
    method: 'get',
    success: function (resp) {
            google.load('visualization', '1', {
                packages: ['controls']
            });
            google.setOnLoadCallback(drawVisualization);

            function drawVisualization() {
                var dashboard = new google.visualization.Dashboard(
                document.getElementById('dashboard'));

                var control = new google.visualization.ControlWrapper({
                    'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                        // Filter by the date axis.
                        'filterColumnIndex': 2,
                            'ui': {
                            'chartType': 'LineChart',
                                'chartOptions': {
                                'width': 985,
                                    'height': 70,
                                    'chartArea': {
                                    width: '80%', // make sure this is the same for the chart and control so the axes align right
                                    height: '80%',
                                    
                                },
                                //     'hAxis': {
                                //     'baselineColor': 'none'
                                // }
                            },
                            // Display a single series that shows the closing value of the stock.
                            // Thus, this view has two columns: the date (axis) and the stock value (line series).
                            'chartView': {
                                'columns': [2, 3]
                            }
                        }
                    },
                    // Initial range: 2012-02-09 to 2012-03-20.
                    //'state': {'range': {'start': new Date(1380740460000), 'end': new Date(1380740480000)}}
                });


                //google.visualization.events.addListener(chart, 'error', function (err) { google.visualization.errors.removeError(err.id); }); 
                //After this Line 
                //var chart = new google.visualization.Dashboard(document.getElementById('dashboard')). bind([categoryPicker], [table,pie]);
                var chart = new google.visualization.ChartWrapper({
                    'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                        // 'width': 900,
                        // 'height': 600,

                        // 'width': 1650,
                        //'width': 1600,
                        'height': 350,

                        // 'chartArea': {
                        //     width: '80%', // make sure this is the same for the chart and control so the axes align right
                        //     height: '80%'
                        // },
                            'backgroundColor': '#ffd'
                    },
                        'view': {
                        'columns': [0, 1, 2, 3]
                    }

                });
                var options = {
                    title: "",
                    width: '100%',
                    height: '100%',
                    axisTitlesPosition: 'out',
                    'isStacked': true,
                    pieSliceText: 'percentage',
                    colors: ['#0598d8', '#f97263'],
                    chartArea: {
                        left: "25%",
                        top: "3%",
                        height: "80%",
                        width: "100%"
                    },
                    vAxis: {
                        title: ""
                    },
                    hAxis: {
                        title: "Total Results"
                    }
                };
                var data = new google.visualization.DataTable();
                data.addColumn({
                    type: 'string',
                    id: 'Shift'
                });
                data.addColumn({
                    type: 'string',
                    id: 'Nom'
                })

                data.addColumn({
                    type: 'date',
                    id: 'Start'
                });
                data.addColumn({
                    type: 'date',
                    id: 'End'
                });
                resp.forEach(el => {
                    data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])
                });
                dashboard.bind(control, chart);


                dashboard.draw(data);

                // draw(data,options);
            }

            $(window).resize(function () {
                drawVisualization()
            })
            // $(window).resize(function () {
            //     drawVisualization()
            // })
        
    }
})
    
}


$(document).on('change', '#filterProj', function () {
    var project = $('#filterProj').val();
    var shift = $('#filterShift').val();
    $('#filterProj').val(project);
    $('#filterShift').val(shift);
    if (project=="all" && shift=="all") {
        $.ajax({
            url: "/allPlannigView",
            method: "get",
            success: function (resp) {
                google.load('visualization', '1',{
                    packages: ['controls']
                })
                google.setOnLoadCallback(drawVisualization)

                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    )

                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }
                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 1100,
                            // 'height': 400,
                            // // 'width': 900,
                            // // 'height': 600,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string',
                        id: 'Shift'
                    })

                    data.addColumn({
                        type: 'string',
                        id: 'Nom'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }   
            }
        })
    } else if (project=='all' && shift !== 'all') {
        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 1100,
                                    'height': 400,
                                    // 'width': 985,
                                    // 'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 1100,
                            // 'height': 400,
                            // // 'width': 900,
                            // // 'height': 600,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.shift == shift) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])

                        }
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }
            }
        })
    } else if(project!=="all" && shift=="all"){

        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 900,
                            // 'height': 600,
                            // 'width': 1100,
                            // 'height': 400,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },


                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.project == project) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])

                        }
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }
            }
        })
        
    } else if (project!=="all" && shift!=="all"){
        
        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })




                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 900,
                            // 'height': 600,
                            // 'width': 1100,
                            // 'height': 400,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.shift == shift && el.project == project) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])

                        }
                    })

                    dashboard.bind(control, chart);

                    
                    dashboard.draw(data)
                }
            }
        })
    }
    else{
        console.log("else non data");
        $("#error").append("<h3>Error</h3>")
    }
})


$(document).on('change', '#filterShift', function () {
    var project = $('#filterProj').val();
    var shift = $('#filterShift').val();
    $('#filterProj').val(project);
    $('#filterShift').val(shift);
    if (project=="all" && shift=="all") {
        $.ajax({
            url: "/allPlannigView",
            method: "get",
            success: function (resp) {
                google.load('visualization', '1',{
                    packages: ['controls']
                })
                google.setOnLoadCallback(drawVisualization)

                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    )

                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {

                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }
                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {

                            // 'width': 1100,
                            // 'height': 400,

                            // // 'width': 900,
                            // // 'height': 600,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string',
                        id: 'Shift'
                    })

                    data.addColumn({
                        type: 'string',
                        id: 'Nom'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }   
            }
        })
    } else if (project=='all' && shift !== 'all') {
        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 900,
                            // 'height': 600,
                            // 'width': 1100,
                            // 'height': 400,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.shift == shift) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])

                        }
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }
            }
        })
    } else if(project!=="all" && shift=="all"){

        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 900,
                            // 'height': 600,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.project == project) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])

                        }
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data)
                }
            }
        })
        
    } else if (project!=="all" && shift!=="all"){
        
        $.ajax({
            url: '/allPlannigView',
            method: 'get',
            success: function (resp) {
                google.load('visualization', '1', {
                    'packages': ['controls']
                });
                google.setOnLoadCallback(drawVisualization);
                function drawVisualization() {
                    var dashboard = new google.visualization.Dashboard(
                        document.getElementById('dashboard')
                    );
                    var control = new google.visualization.ControlWrapper({
                        'controlType': 'ChartRangeFilter',
                        'containerId': 'control',
                        'options': {
                            'filterColumnIndex': 2,
                            'ui': {
                                'chartType': 'LineChart',
                                'chartOptions': {
                                    'width': 985,
                                    'height': 70,
                                    'chartArea':{
                                        width: '80%',
                                        height: '80%'
                                    },
                                    'hAxis': {
                                        'baselineColor': 'none'
                                    }
                                },
                                'chartView': {
                                    'columns': [2, 3]
                                }
                            }
                        }

                    })

                    var chart = new google.visualization.ChartWrapper({
                        'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                            // 'width': 900,
                            // 'height': 600,
                            // 'width': 1100,
                            // 'height': 400,
                            // 'chartArea': {
                            //     width: '80%',
                            //     height: '80%'
                            // },

                            'height': 350,
                            'backgroundColor': '#ffd'
                        },
                        'view': {
                            'columns': [0, 1, 2, 3]
                        }
                    });
                    var data = new google.visualization.DataTable();
                    data.addColumn({
                        type: 'string', 
                        id: 'Shift'
                    });

                    data.addColumn({
                        type: 'string', 
                        id: 'Nom'
                    });
                    

                    data.addColumn({
                        type: 'date',
                        id: 'Start'
                    })

                    data.addColumn({
                        type: 'date',
                        id: 'End'
                    })

                    resp.forEach(el =>{
                        if (el.shift == shift && el.project == project) {
                            data.addRows([[el.usualName + ' | ' + el.shift + ' | ' + el.project, el.mcode, new Date(el.start), new Date(el.end)]])
                        }
                    })

                    dashboard.bind(control, chart);
                    dashboard.draw(data, {
                        hAxis: {
                            format: 'd,M,Y'//Y,M,d'
                        }
                    })
                }
            }
        })
    }
    else{
        
        $("#error").append("<h3>Error</h3>")
    }
})
$(document).on('change', '#mcode-plan', function () {
    var mcode = $('#mcode-plan').val()
    var donner = {
        mcode1: mcode
    }
    $.ajax({
        url: '/getOneAgent',
        method: "post",
        data: donner,
        success: function (res) {
            $("#nom").val(res.name);
            $("#shift").val(res.shift);
            $("#projet").val(res.project);

        }
    })
})


$(document).on('change', '#mcodeUpdate', function () {
    var mcode = $('#mcodeUpdate').val()
    var donner = {
        mcode1: mcode
    }
    $.ajax({
        url: '/getOneAgent',
        method: "post",
        data: donner,
        success: function (res) {
            $("#nomUpdat").val(res.name);
            $("#shiftUpdat").val(res.shift);
            $("#projectUpdat").val(res.project);

        }
    })
})
var type =  $('#typeUtil').val()// document.getElementById("typeUtil")//$('#typeUtil').val();

if (type.trim() == "IT") {
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page IT");
} else if (type.trim() == "TL") {
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page TL");
} 