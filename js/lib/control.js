GameControl = {
    log: function(text) {
        var date = new Date();
        time = date.toTimeString().substring(0,8);
        $('#logs tbody').prepend('<tr><td>'+text+'</td><td>'+time+'</td></tr>');
    },
    loadConfig: function() {
        this.log('load config');
    },
    saveConfig: function() {
        this.log('save config');
    },
    startSim: function() {
        this.log('start sim');
    },
    pauseSim: function() {
        this.log('pause sim');
    },
    stopSim: function() {
        this.log('stop sim');
    },
    removeLastWall: function() {
        Game.map.removeLastWall();
    },
    clearWalls: function() {
        Game.map.clearWalls();
    },
    removeSpawnZone: function() {
        Game.map.removeZone();
    },
    removeLastKeypoint: function() {
        Game.map.removeLastKeypoint();
    },
    clearKeypoints: function() {
        Game.map.clearKeypoints();
    },
    nextConfig: function(){
        $('.stage.current').removeClass('current').next('.stage').addClass('current');
        if ($('.stage.current').next('.stage').length == 0) $('#nextConf').attr('disabled','disabled');
        $('#prevConf').removeAttr('disabled');
        Game.uiState = $('.stage.current').attr('data-ui-state');
    },
    previousConfig: function(){
        $('.stage.current').removeClass('current').prev('.stage').addClass('current');
        if ($('.stage.current').prev('.stage').length == 0) $('#prevConf').attr('disabled','disabled');
        $('#nextConf').removeAttr('disabled');
        Game.uiState = $('.stage.current').attr('data-ui-state');
    }
};