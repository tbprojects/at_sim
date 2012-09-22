Game = {
	width: 640,
	height: 480,
    mapDensity: 10,

	uiState: 'config decision',
    stage:  null,
    map: null,
	entities: null,
    configObjects: null,
    mapObjects: null,
    paused: false,

    antiterroristsCount: 5,
    terroristsCount: 5,
    timeLimit: 60,
    keypointIndex: 0,

	init: function() {
		var self            = this;
        this.mapObjects     = new Kinetic.Layer();
        this.configObjects  = new Kinetic.Layer();
        this.entities       = new Kinetic.Layer();
		this.stage          = new Kinetic.Stage({
			container: "container",
			width: this.width,
			height: this.height
		});

		this.stage.add(this.mapObjects);
        this.stage.add(this.configObjects);
        this.stage.add(this.entities);

 	    this.stage.onFrame(function(frame) {
          for(var layerIndex in self.stage.getChildren()) {
              var layer = self.stage.getChildren()[layerIndex];
              for (var objectIndex in layer.getChildren()) {
                  var object = layer.getChildren()[objectIndex];
                  if(object.update) object.update(frame);
              }
              layer.draw();
          }
		});
		this.stage.start();
		this.initMap();
	},

    getEntities: function(){
        return this.entities.getChildren();
    },
    getAliveTerrorists: function(){
        return $.map(Game.entities.get('.terrorist'), function(object, index){if (object.isAlive) return object})
    },
    getAliveAntiterrorists: function(){
        return $.map(Game.entities.get('.antiterrorist'), function(object, index){if (object.isAlive) return object})
    },
    checkAliveEntities: function(){
        var ter_count = Game.getAliveTerrorists().length;
        var ats_count = Game.getAliveAntiterrorists().length;
        if (ter_count == 0 && ats_count == 0) {
            this.setWinMessage('DRAW!');
        } else if (ter_count == 0) {
            this.setWinMessage('ANTITERRORISTS WON!');
        } else if (ats_count == 0) {
            this.setWinMessage('TERRORISTS WON!');
        }
    },
    getNodeByPosition: function(x, y){
        x = Math.round(x/Game.mapDensity);
        y = Math.round(y/Game.mapDensity);
        var node;
        try { node = Game.map.graph.nodes[x][y] } catch(e) { node = null}
        return node;
    },

// ************* STATES *********************
// ******************************************

    initMap: function(){
        // plane
        this.map = new Game.Map({});
        this.mapObjects.add(this.map);
    },
    togglePause: function(){
        Game.paused = !Game.paused;
    },
	startGame: function(){
        this._spawnTerrorists();
        this._spawnAntiterrorists();
        Game.createEntitiesList();
        Game.log('SIMULATION STARTED', 'blue');
        Game.paused = false;
	},
	endGame: function(){
        this.entities.removeChildren();
        Game.clearEntitiesList();
        Game.keypointIndex = 0;
        Game.paused = false;
	},
    _spawnTerrorists: function(){
        var iteration_limit = 10;
        var radius = this.map.zone.getRadius().x;
        for (var i=0; i < this.terroristsCount; i+=1) {
            var index  = Math.floor(Math.random() * this.map.keypoints.length);
            var center = this.map.keypoints[index].getVecPosition();
            var entity = new Game.Terrorist({groupIndex: i+1});
            var k = 0;
            do {
                entity.setRandomPositionInCircle(center, radius);
                k+=1;
            } while(entity.isInCollision() && k < iteration_limit);
            this.entities.add(entity);
        }
    },
    _spawnAntiterrorists:function(){
        var iteration_limit = 10;
        var center = this.map.zone.getVecPosition();
        var radius = this.map.zone.getRadius().x;
        for (var i=0; i < this.antiterroristsCount; i+=1) {
            var entity = new Game.Antiterrorist({groupIndex: i+1});
            var k = 0;
            do {
                entity.setRandomPositionInCircle(center, radius);
                k+=1;
            } while(entity.isInCollision() && k < iteration_limit);
            this.entities.add(entity);
        }
    }

};