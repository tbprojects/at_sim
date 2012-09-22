GameControl = {

    storagePrefix: 'sss_map_',
    simStartTime: null,

    init: function(){
        var cfs = this.configs();
        for (var name in cfs) {
            $('#load_config_name').append('<option value="'+cfs[name]+'">'+name+'</option>');
        }
        Game.log = GameControl.log;
        Game.createEntitiesList = GameControl.createEntitiesList;
        Game.clearEntitiesList = GameControl.clearEntitiesList;
        Game.updateStat = GameControl.updateStat;
    },
    log: function(text) {
        var time = ((Date.now() - GameControl.simStartTime)/1000).toFixed(1);
        $('#logs tbody').prepend('<tr><td>'+text+'</td><td>'+time+'s</td></tr>');
    },
    configs: function() {
        result = {};
        for (var i in localStorage) {
            if (i.indexOf(this.storagePrefix) > -1) {
                var name = JSON.parse(localStorage[i]).name;
                result[name] = i;
            }
        }
        return result;
    },
    loadConfig: function() {
        var key = $('#load_config_name').val();
        if (key) {
            var config = JSON.parse(localStorage[key]);
            Game.map.importConfig(config);
            this.changeUiState('config numbers');
            $('#config_name').val(config.name);
        }
    },
    saveConfig: function() {
        var name  = $('#config_name').val();
        var value = JSON.stringify($.extend(Game.map.serializeConfig(),{name: name}));
        var key   = this.storagePrefix+name;
        localStorage.setItem(key, value);
        alert('Config successfully saved!');
    },
    removeConfig: function(){
        var key = $('#load_config_name').val();
        if (key) {
            if (confirm("Are you sure?")) {
                $('option[value="'+key+'"]').remove();
                localStorage.removeItem(key);
                alert('Config successfully removed!');
            }
        }
    },
    startSim: function() {
        this.simStartTime = Date.now();
        Game.startGame();
        $('.state_button').hide();
        $('#start_button').attr('disabled','disabled');
    },
    pauseSim: function() {
        Game.togglePause();
    },
    stopSim: function() {
        Game.endGame();
        $('#logs tbody').html('');
        $('.state_button').show();
        $('#start_button').removeAttr('disabled');
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
        this.changeUiState($('.stage.current').next('.stage').attr('data-ui-state'));
    },
    previousConfig: function(){
        this.changeUiState($('.stage.current').prev('.stage').attr('data-ui-state'));
    },
    changeUiState: function(uiState){
        this._updateNumberData();
        this._updateConfigStatus();
        $('.stage.current').removeClass('current');
        $('.stage[data-ui-state="'+uiState+'"]').addClass('current');
        if ($('.stage.current').next('.stage').length == 0) {
            $('#nextConf').attr('disabled','disabled')
        } else {
            $('#nextConf').removeAttr('disabled');
        }
        if ($('.stage.current').prev('.stage').length == 0) {
            $('#prevConf').attr('disabled','disabled');
        } else {
            $('#prevConf').removeAttr('disabled');
        }
        Game.uiState = uiState;
        this._updateCursor();
    },
    clearEntitiesList: function(){
        $('#at_list tbody').html('');
        $('#ter_list tbody').html('');
    },
    createEntitiesList: function(){
        var ats = Game.entities.get('.antiterrorist');
        var ters = Game.entities.get('.terrorist');
        var i;

        for (i=0; i<ats.length; i+=1) {
            $('#at_list tbody').append('<tr id="'+ats[i].getName()+ats[i].groupIndex+'"></tr>');
            this.updateStat(ats[i]);
        }
        for (i=0; i<ters.length; i+=1) {
            $('#ter_list tbody').append('<tr id="'+ters[i].getName()+ters[i].groupIndex+'"></tr>');
            this.updateStat(ters[i]);
        }
    },
    updateStat: function(entity){
        $('#'+entity.getName()+entity.groupIndex).html('<td class="name">'+entity.getName()+" #"+entity.groupIndex+'</td>'+
            '<td class="hp"><div><div style="width: '+Math.max((entity.healthPoints/entity.healthPointsMax)*100,0)+'%"></div></div></td>'+
            '<td class="kills">'+entity.kills+'</td>');
    },
    _updateCursor: function(){
        if (['draw zone', 'draw keypoints'].indexOf(Game.uiState) != -1) {
            $('#container').css('cursor', 'none');
        } else {
            $('#container').css('cursor', 'crosshair');
        }
    },
    _updateNumberData: function(){
        Game.antiterroristsCount = parseInt($('#antiterrorists_count').val());
        Game.terroristsCount = parseInt($('#terrorists_count').val());
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