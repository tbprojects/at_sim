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
        this._updateNumberData();
        this._updateConfigStatus();
        $('.stage.current').removeClass('current').next('.stage').addClass('current');
        if ($('.stage.current').next('.stage').length == 0) $('#nextConf').attr('disabled','disabled');
        $('#prevConf').removeAttr('disabled');
        Game.uiState = $('.stage.current').attr('data-ui-state');
    },
    previousConfig: function(){
        this._updateNumberData();
        this._updateConfigStatus();
        $('.stage.current').removeClass('current').prev('.stage').addClass('current');
        if ($('.stage.current').prev('.stage').length == 0) $('#prevConf').attr('disabled','disabled');
        $('#nextConf').removeAttr('disabled');
        Game.uiState = $('.stage.current').attr('data-ui-state');
    },
    _updateNumberData: function(){
        Game.antiterroristsCount = parseInt($('#antiterrorists_count').val());
        Game.terroristsCount = parseInt($('#terrorists_count').val());
        Game.timeLimit = parseInt($('#time_limit').val());
    },
    _updateConfigStatus: function(){
        var errorMessages = [];
        if (!Game.map.zone)
            errorMessages.push('Plan must contain spawn zone for antiterrorists');
        if (Game.map.keypoints.length == 0)
            errorMessages.push('Plan must contain one keypoint at least');
        if (isNaN(Game.antiterroristsCount) || Game.antiterroristsCount < 1)
            errorMessages.push('Number of antiterrorists must be greater number then 0');
        if (isNaN(Game.terroristsCount) || Game.terroristsCount < 1)
            errorMessages.push('Number of terrorists must be greater number then 0');
        if (isNaN(Game.timeLimit) || Game.timeLimit < 1)
            errorMessages.push('Time limit must be greater number then 0');

        $('#error_page ul').html('');
        for (var i in errorMessages) {
            $('#error_page ul').append('<li>'+errorMessages[i]+'</li>');
        }

        if (errorMessages.length == 0) {
            $('#error_page').addClass('hidden');
            $('#control_page').removeClass('hidden');
        } else {
            $('#error_page').removeClass('hidden');
            $('#control_page').addClass('hidden');
        }
    }
};