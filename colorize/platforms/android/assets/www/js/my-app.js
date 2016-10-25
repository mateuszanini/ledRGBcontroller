var myApp = new Framework7({
    modalTitle: 'Colorize',
    modalButtonOk: 'Ok',
    modalButtonCancel: 'Cancelar',
    modalPreloaderTitle: 'Carregando...',
    pushState: true,
    material: true,
    materialPageLoadDelay: 5,
    materialRipple: true,

    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

myApp.onPageInit('inde', function(page) {
  app.initialize();
});
