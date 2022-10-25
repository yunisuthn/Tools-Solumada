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
                    text: "This material is already exist or you need to complete the field"
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
$(document).on("click", '.btnUpdatePlanning', function () {
    //console.log("btnUpdatePlanning");
    var getCol = $(this).closest('tr')
    var shift = getCol.find('td:eq(0)').text()
    prenomUpdat = getCol.find('td:eq(1)').text()
    mcodeUpdat = getCol.find('td:eq(2)').text()
    var project = getCol.find('td:eq(3)').text()
    var start = getCol.find('td:eq(4)').text()
    var end = getCol.find('td:eq(5)').text()

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
        end: endUpd
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
                    $("#planningDataTable").DataTable().ajax.reload(null, false)
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
                                    height: '80%'
                                },
                                    'hAxis': {
                                    'baselineColor': 'none'
                                }
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

                var chart = new google.visualization.ChartWrapper({
                    'chartType': 'Timeline',
                        'containerId': 'chart',
                        'options': {
                        'width': 900,
                            'height': 600,
                            'chartArea': {
                            width: '80%', // make sure this is the same for the chart and control so the axes align right
                            height: '80%'
                        },
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
                // data.addRows([

                //     ['Baltimore Ravens', 'shift4',    new Date(2000, 8, 5), new Date(2001, 1, 5)],
                //     ['New England Patriots','shift2', new Date(2001, 8, 5), new Date(2002, 1, 5)],
                //     ['Tampa Bay Buccaneers','shift4',  new Date(2002, 8, 5), new Date(2003, 1, 5)],
                //     ['New England Patriots','shift1',  new Date(2003, 8, 5), new Date(2004, 1, 5)],
                //     ['New England Patriots', 'shift3', new Date(2004, 8, 5), new Date(2005, 1, 5)],
                //     ['Pittsburgh Steelers',  'shift2', new Date(2005, 8, 5), new Date(2006, 1, 5)],
                //     ['Indianapolis Colts',  'shift1',  new Date(2006, 8, 5), new Date(2007, 1, 5)],
                //     ['New York Giants',    'shift3',   new Date(2007, 8, 5), new Date(2008, 1, 5)],
                //     ['Pittsburgh Steelers', 'shift1',  new Date(2008, 8, 5), new Date(2009, 1, 5)],
                //     ['New Orleans Saints',  'shift4',  new Date(2009, 8, 5), new Date(2010, 1, 5)],
                //     ['Green Bay Packers',  'shift2',   new Date(2010, 8, 5), new Date(2011, 1, 5)],
                //     ['New York Giants',    'shift3',   new Date(2011, 8, 5), new Date(2012, 1, 5)],
                //     ['Baltimore Ravens',   'shift4',   new Date(2012, 8, 5), new Date(2013, 1, 5)],
                //     ['Seattle Seahawks',  'shift4',    new Date(2013, 8, 5), new Date(2014, 1, 5)],
                //     ]);

                dashboard.bind(control, chart);
                dashboard.draw(data);
            }
        
    }
})


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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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
                            'width': 900,
                            'height': 600,
                            'chartArea': {
                                width: '80%',
                                height: '80%'
                            },
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