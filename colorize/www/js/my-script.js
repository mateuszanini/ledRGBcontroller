$('#btnIpDefault').click(function() {
    $('#ipConexao').focus();
    $('#ipConexao').val('192.168.0.101');
    $('#ipConexao').blur();
});

$('#btnSalvarIp').click(function() {
    var ip = $('#ipConexao').val();
    myApp.showPreloader('Conectando a ' + ip);
    setTimeout(function() {
        myApp.hidePreloader();
        myApp.closeModal('.picker-config');
    }, 2000);
});

$('#tabHumor').click(function() {
    app.humor.tabAtivo = true;
    app.rgb.tabAtivo = false;
    app.dht.tabAtivo = false;
});

$('#tabRgb').click(function() {
    app.humor.tabAtivo = false;
    app.rgb.tabAtivo = true;
    app.dht.tabAtivo = false;
});

$('#tabDht').click(function() {
    app.humor.tabAtivo = false;
    app.rgb.tabAtivo = false;
    app.dht.tabAtivo = true;

    $('#dhtTemperatura').html(app.dht.temperatura + ' °C');
    $('#dhtUmidade').html(app.dht.umidade + ' %');

    for (var i = 0; i < 10; i++) {
        var cor = app.dht.cores[i].hexa;
        $('#escala-' + i).css("background-color", "#" + cor);
    }

});

var storage = window.localStorage;
storage.temperatura = 21;
storage.umidade = 67;

var app = {
    initialize: function() {
        this.humor = {
            tabAtivo: false,
            operando: false,
        };
        this.rgb = {
            tabAtivo: false,
            operando: false,
        };
        this.dht = {
            tabAtivo: false,
            operando: false,
            temperatura: storage.temperatura,
            umidade: storage.umidade,
            cores: [{
                escala: 0,
                hexa: "6602E8",
                red: 102,
                green: 2,
                blue: 232
            }, {
                escala: 1,
                hexa: "008AFF",
                red: 0,
                green: 138,
                blue: 255
            }, {
                escala: 2,
                hexa: "12E9FF",
                red: 15,
                green: 233,
                blue: 255
            }, {
                escala: 3,
                hexa: "06FF8A",
                red: 6,
                green: 255,
                blue: 138
            }, {
                escala: 4,
                hexa: "00E808",
                red: 0,
                green: 232,
                blue: 0
            }, {
                escala: 5,
                hexa: "C0FF00",
                red: 192,
                green: 255,
                blue: 0
            }, {
                escala: 6,
                hexa: "FFF800",
                red: 255,
                green: 248,
                blue: 0
            }, {
                escala: 7,
                hexa: "FF9200",
                red: 255,
                green: 146,
                blue: 0
            }, {
                escala: 8,
                hexa: "E84200",
                red: 232,
                green: 66,
                blue: 255
            }, {
                escala: 9,
                hexa: "FF0000",
                red: 255,
                green: 0,
                blue: 0
            }]
        };
        console.log(app);
    }
};
