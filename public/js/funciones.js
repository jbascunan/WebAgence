jQuery(document).ready(function($) {

    $('.multiselect').multiselect();

    $('#btnRelatorio').click(function() {
        debugger;
        $("#contenedorRelatorio").html('');
        var container = document.querySelector("#contenedorRelatorio");

        var periodoInicio = $("#periodoInicio option:selected").val();
        var periodoFin = $("#periodoFin option:selected").val();
        var periodoAnioInicio = $("#periodoAnioInicio option:selected").val();
        var periodoAnioFin = $("#periodoAnioFin option:selected").val();

        $('#multiselect_to_1  > option').each(function() {
            var nombreConsultor = $(this).text();

            $.ajax({
                url: '/getRelatorio',
                method: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    co_usuario: $(this).val(),
                    anioInicio: periodoAnioInicio,
                    anioFin: periodoAnioFin,
                    mesInicio: periodoInicio,
                    mesFin: periodoFin
                }
            }).done(function(data) {
                let source = document.querySelector("#table-template").innerHTML;
                let template = Handlebars.compile(source);

                debugger;

                let totalLiquido = 0;
                let totalCostoFijo = 0;
                let totalComision = 0;
                let totalLucro = 0;

                $.each(data, function(key, value) {
                    totalLiquido += value.liquido;
                    totalCostoFijo += value.CostoFijo;
                    totalComision += value.comision;
                    totalLucro += value.lucro;
                });

                let datos = {
                    resultado: data,
                    totalLiquido: totalLiquido,
                    totalCostoFijo: totalCostoFijo,
                    totalComision: totalComision,
                    totalLucro: totalLucro,
                    nombreConsultor: nombreConsultor
                };

                container.innerHTML += template(datos);

            }).fail(function(error) {
                alert(JSON.stringify(error));
            });
        });

        if ($("#multiselect_to_1 > option").length == 0) {
            $("#contenedorRelatorio").html('sín datos');
        }

    });

    $('#btnGraficoPizza').click(function() {
        var usuarios = ''
        var datos = []
        var periodoInicio = $("#periodoInicio option:selected").val();
        var periodoFin = $("#periodoFin option:selected").val();
        var periodoAnioInicio = $("#periodoAnioInicio option:selected").val();
        var periodoAnioFin = $("#periodoAnioFin option:selected").val();

        $('#multiselect_to_1  > option').each(function() {
            usuarios += `'${$(this).val()}',`
        });

        usuarios = usuarios.substring(0, usuarios.length - 1);

        debugger;
        $.ajax({
            url: '/getDatosPizza',
            method: 'POST',
            dataType: 'json',
            async: false,
            data: {
                co_usuario: usuarios,
                anioInicio: periodoAnioInicio,
                anioFin: periodoAnioFin,
                mesInicio: periodoInicio,
                mesFin: periodoFin
            }
        }).done(function(data) {
            datos = data

        }).fail(function(error) {
            alert(JSON.stringify(error));
        });


        Highcharts.chart('contenedorRelatorio', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Gráfico Pizza'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Porcentaje',
                colorByPoint: true,
                data: datos
            }]
        });
    });

    $('#btnGraficoBarra').click(function() {
        var usuarios = ''
        var datos = []
        var series = []
        var periodoInicio = $("#periodoInicio option:selected").val();
        var periodoFin = $("#periodoFin option:selected").val();
        var periodoAnioFin = $("#periodoAnioFin option:selected").val();


        $('#multiselect_to_1  > option').each(function() {
            var nombreUsuario = $(this).text()
            $.ajax({
                url: '/getDatosBarra',
                method: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    co_usuario: $(this).val(),
                    anioFin: periodoAnioFin,
                    mesInicio: periodoInicio,
                    mesFin: periodoFin
                }
            }).done(function(data) {
                let name = ''
                    //inicializa array
                let categorias = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

                $.each(data, function(key, value) {
                    categorias[value.mes - 1] = value.y
                });

                let serie = {
                        name: nombreUsuario,
                        data: categorias
                    }
                    //agrega datos
                series.push(serie)


            }).fail(function(error) {
                alert(JSON.stringify(error));
            });
        });


        debugger;
        Highcharts.chart('contenedorRelatorio', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Gráfico Barras'
            },
            subtitle: {
                text: 'Agence'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Montos (Pesos)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: series
        });
    });
});