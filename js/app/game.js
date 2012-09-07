Game = {
	width: 640,
	height: 480,
    mapDensity: 10,

	uiState: 'config decision',
    stage:  null,
    map: null,
	entities: new Kinetic.Layer(),
    mapObjects: new Kinetic.Layer(),

    antiterroristsCount: 5,
    terroristsCount: 5,
    timeLimit: 60,

	init: function() {
		var self = this;
		this.stage = new Kinetic.Stage({
			container: "container",
			width: this.width,
			height: this.height
		});

		this.stage.add(this.mapObjects);
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

// ************* STATES *********************
// ******************************************

    initMap: function(){
        // plane
        this.map = new Game.Map({});
        this.mapObjects.add(this.map);
    },
	startGame: function(){
        this._spawnTerrorists();
        this._spawnAntiterrorists();
        var terrorist     = new Game.Terrorist({x: 130, y:200, name: 'Roman'});
        var antiterrorist = new Game.Antiterrorist({x: 150, y:150, name: 'Stach'});
		this.entities.add(terrorist);
		this.entities.add(antiterrorist);
	},
	endGame: function(){

	},
    _spawnTerrorists: function(){

    },
    _spawnAntiterrorists:function(){

    }

};