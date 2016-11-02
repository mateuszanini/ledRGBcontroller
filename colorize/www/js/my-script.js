var app = {
    initialize: function() {
        //está conectado ao WebSocket?
        this.conectado = false;
        //ip default para conexão com o WebSocket
        this.ip = "192.168.4.1";
        //porta default para conexão com o WebSocket
        this.porta = "81";

        $('#ipConexao').val(app.ip);

        //variáveis para armazenar os valores de R, G e B
        this.red = 15;
        this.green = 233;
        this.blue = 255;
        //variável para armazenar a cor em Hexadecimal;
        this.hexa = "0FE9FF";

        //pega os valores dos sliders e aplica o bg no card
        atualizaSlider();

        //variáveis para armazenar umidade e temperatura
        this.temperatura = 0.00;
        this.umidade = 0.00;

        $('#dhtTemperatura').html(app.temperatura + ' °C');
        $('#dhtUmidade').html(app.umidade + ' %');

        //JSon com as cores para montar a escala de temperatura
        this.cores = [{
            hexa: "6602E8",
            red: 102,
            green: 2,
            blue: 232
        }, {
            hexa: "008AFF",
            red: 0,
            green: 138,
            blue: 255
        }, {
            hexa: "12E9FF",
            red: 15,
            green: 233,
            blue: 255
        }, {
            hexa: "06FF8A",
            red: 6,
            green: 255,
            blue: 138
        }, {
            hexa: "00E808",
            red: 0,
            green: 232,
            blue: 0
        }, {
            hexa: "C0FF00",
            red: 192,
            green: 255,
            blue: 0
        }, {
            hexa: "FFF800",
            red: 255,
            green: 248,
            blue: 0
        }, {
            hexa: "FF9200",
            red: 255,
            green: 146,
            blue: 0
        }, {
            hexa: "E84200",
            red: 232,
            green: 66,
            blue: 255
        }, {
            hexa: "FF0000",
            red: 255,
            green: 0,
            blue: 0
        }];

        for (var i = 0; i < 10; i++) {
            var cor = app.cores[i].hexa;
            $('#escala-' + i).css("background-color", "#" + cor);
        }
    },

    connect: function() {
        //var ws = new WebSocket('ws://192.168.4.1:81');
        this.ws = new WebSocket('ws://' + app.ip + ':' + app.porta);

        this.ws.onopen = function(e) {
            app.conectado = true;
            myApp.hidePreloader();
            myApp.alert('Connected');
            console.log('Connected');
        };

        this.ws.onclose = function(e) {
            app.conectado = false;
            myApp.hidePreloader();
            myApp.alert('Disconnected');
            console.log('Disconnected');
        };

        this.ws.onerror = function(e) {
            app.conectado = false;
            myApp.hidePreloader();
            myApp.alert('Error');
            console.log('Error');
        };

        this.ws.onmessage = function(e) {
            app.trataDadosRecebidos(e);
        };
    },

    waitForSocketConnection: function(callback) {
        setTimeout(
            function() {
                if (app.ws.readyState === 1) {
                    if (callback !== undefined) {
                        callback();
                    }
                    return;
                } else {
                    waitForSocketConnection(callback);
                }
            }, 5);
    },

    send: function(msg) {
        app.waitForSocketConnection(function() {
            msg += '\n';
            app.ws.send(msg);
            console.log('Message sent: ' + msg);
        });
    },

    trataDadosRecebidos: function(e) {
        try {
            console.log(e);
            dados = JSON.parse(e.data.substring(0, e.data.length - 1));
            console.log(dados);
            app.temperatura = dados.t;
            app.umidade = dados.u;
            $('#dhtTemperatura').html(app.temperatura + ' °C');
            $('#dhtUmidade').html(app.umidade + ' %');
        } catch (err) {
            console.log(err);
            return;
        }
    }
}

app.initialize();

//ip default
$('#btnIpDefault').click(function() {
    $('#ipConexao').focus();
    $('#ipConexao').val(app.ip);
    $('#ipConexao').blur();
});

//salva o ip e conecta no WebSocket
$('#btnSalvarIp').click(function() {
    app.ip = $('#ipConexao').val();
    myApp.showPreloader('Tentando conectar-se a ' + app.ip);
    myApp.closeModal('.picker-config');
    app.connect();
    /*setTimeout(function() {
        myApp.hidePreloader();
        myApp.closeModal('.picker-config');
    }, 2000);*/
});

$('#btnFade').click(function() {
    if (app.conectado) {
        //myApp.alert("2 " + app.red + " " + app.green + " " + app.blue);
        app.send("3 " + app.red + " " + app.green + " " + app.blue);
    } else {
        myApp.alert("Não conectado a " + app.ip);
        myApp.pickerModal('.picker-config');
    }

});

$('#btnRgb').click(function() {
    if (app.conectado) {
        //myApp.alert("2 " + app.red + " " + app.green + " " + app.blue);
        app.send("2 " + app.red + " " + app.green + " " + app.blue);
    } else {
        myApp.alert("Não conectado a " + app.ip);
        myApp.pickerModal('.picker-config');
    }

});

$('#btnTemperatura').click(function() {
    if (app.conectado) {
        //myApp.alert("1 0 0 0");
        app.send("1 0 0 0");
    } else {
        myApp.alert("Não conectado a " + app.ip);
        myApp.pickerModal('.picker-config');
    }
});

//conversão para hexadecimal
function componentToHex(c) {
    var hexa = c.toString(16);
    return hexa.length == 1 ? "0" + hexa : hexa;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//pega os valores dos sliders, para R, G e B
function valoresSlider() {
    app.red = parseInt($('#inputRed').val());
    app.green = parseInt($('#inputGreen').val());
    app.blue = parseInt($('#inputBlue').val());
}

//executa uma função em um determinado intervalo de tempo
//window.setInterval('atualizaSlider()', 50);
$("#inputRed, #inputGreen, #inputBlue").on("input change", function() {
    atualizaSlider();
});

//atualiza os valores de R, G e B em tela e altera o card de preview
function atualizaSlider() {

    valoresSlider();

    $('#valueRed').html(app.red);
    $('#valueGreen').html(app.green);
    $('#valueBlue').html(app.blue);

    app.hexa = rgbToHex(app.red, app.green, app.blue)

    $('#previewCor').css("background-color", "#" + app.hexa);

    $('#corHex').html("#" + app.hexa);
    $('#corRgb').html("rgb(" + app.red + ", " + +app.green + ", " + app.blue + ")");
}


/*FADE*/
var fadeRed = 255;
var fadeGreen = 0;
var fadeBlue = 0;
var strobo = true;

var fadeTime = 15;
$("#inputDelay").on("input change", function() {
    fadeTime = $("#inputDelay").val();
    $('#delayShow').html(fadeTime + " ms");
});

function bgFadeStrobo() {
    var fadeRgb = "rgb(" + fadeRed + "," + fadeGreen + "," + fadeBlue + ")";
    $('#previewFade').css("background-color", fadeRgb);

    if(strobo){
      $('#previewStrobo').css("background-color", "rgb(" + app.red + ", " + +app.green + ", " + app.blue + ")");
      strobo = false;
    }else{
      $('#previewStrobo').css("background-color", "white");
      strobo = true;
    }

    window.clearInterval(fadePreview);
    fadePreview = window.setInterval('fadeStrobo()', fadeTime);
}

var fadePreview = window.setInterval('fadeStrobo()', fadeTime);

function fadeStrobo() {
    if (fadeBlue == 0) {
        if (fadeGreen < 255) {
            fadeGreen += 1;
        }
        if(fadeRed > 0){
          fadeRed -= 1;
        }
    }
    if (fadeRed == 0) {
        if (fadeBlue < 255) {
            fadeBlue += 1;
        }
        if(fadeGreen > 0){
          fadeGreen -= 1;
        }
    }
    if (fadeGreen == 0) {
        if (fadeRed < 255) {
            fadeRed += 1;
        }
        if(fadeBlue > 0){
          fadeBlue -= 1;
        }
    }
    bgFadeStrobo();
}
