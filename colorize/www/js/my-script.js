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
