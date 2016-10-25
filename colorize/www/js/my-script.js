$('#btnIpDefault').click(function() {
    $('#ipConexao').focus();
    $('#ipConexao').val('192.168.0.235');
});

$('#btnSalvarIp').click(function() {
    var ip = $('#ipConexao').val();
    myApp.showPreloader('Conectando a ' + ip);
    setTimeout(function() {
        myApp.hidePreloader();
        myApp.closeModal('.picker-config');
    }, 3000);
});

$('#tabDht').click(function(){
  app.humor.ativo = false;
  app.rgb.ativo = false;
  app.dht.ativo = true;

  $('#dhtTemperatura').html(app.dht.temperatura + ' °C');
  $('#dhtUmidade').html(app.dht.umidade + ' %');
});

var app = {
    initialize: function() {
        this.humor = {
            ativo: true
        };
        this.rgb = {
            ativo: false
        };
        this.dht = {
            ativo: false,
            temperatura: localStorage.temperatura,
            umidade: localStorage.umidade
        };
        console.log(app);
    }
};
