var myApp = new Framework7({
    modalTitle: 'Colorize',
    modalButtonOk: 'Ok',
    modalButtonCancel: 'Cancelar',
    modalPreloaderTitle: 'Carregando...',
    pushState: true,
    material: true,
    materialPageLoadDelay: 5,
    materialRipple: true,
    tapHold: true,
    tapHoldDelay: 750,

    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

myApp.onPageInit('index', function(page) {
  app.initialize();
});

/*$('#logo').on('taphold', function () {
  myApp.popup('.popup-modos');
});*/
