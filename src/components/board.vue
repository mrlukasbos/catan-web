<template>
  <div class="board">
    <div id="d3-board-holder" />
    <div id="d3-game-holder" />
    <div v-show="hint" class="hint">
      <div class="hint-text">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
import {T} from '../translations';


const Structure = {
  VILLAGE: "VILLAGE",
  CITY: "CITY",
  ROAD: "ROAD",
  NONE: "NONE"
}

export default {
  name: 'Connect',
  props: ['board', 'players', 'settings', 'actions'],

  data: function() {
    return {
      init: false,
      width: 1050,
      height: 900,
      radius: 75,
      tiles: [],
      edges: [],
      nodes: [],
      bandits: [],
      svg_board: null,
      svg_game: null,
      hint: "",

      d3_tiles: null,
      d3_nodes: null,
      d3_edges: null,
      d3_bandits: null,
      d3_types: null,
      d3_labels: null,
      d3_numbers: null,
    }
  },

  computed: {
    topology: function() {
      return this.hexTopology(this.radius, this.width, this.height);
    },
    projection: function() {
      return this.hexProjection(this.radius);
    },
    path: function() {
      return d3.geoPath().projection(this.projection);
    },
    dev_mode: function() {
      return this.settings.dev_mode;
    },
    lang: function() {
      return this.settings.lang;
    }
  },

  watch: {
    board: function() {
      let board = this.board;
      this.tiles = board.tiles;
      this.edges = board.edges;
      this.nodes = board.nodes;
      this.bandits = board.bandits;
      if (!this.init) {
        this.draw_board();
        this.init = true;
      }
    },
    actions: function(newActions, oldActions) {
      // when actions disappear the have to be un-selected
      oldActions.forEach(oldAction => {
        oldAction.object.conceptStructure = null;
      })

      // set selected of the present actions to true
      newActions.forEach(action => {
        console.log(action);

        switch (action.action) {
        case "buildRoad": action.object.conceptStructure = Structure.ROAD; break;
        case "buildVillage": action.object.conceptStructure = Structure.VILLAGE; break;
        case "buildCity":  action.object.conceptStructure = Structure.CITY; break;
        }
      })

      this.updateEdges();
      this.updateTiles();
      this.updateNodes();
    },
    lang: function() {
      this.updateTypes();
    },
    dev_mode: function() {
      this.updateLabels();
    },
    nodes: function() {
      this.updateNodes();
    },
    edges: function() {
      this.updateEdges();
    },
    bandits: function() {
      this.updateBandits();
    },
    tiles: function() {
      this.updateTiles();
      this.updateTypes();
      this.updateLabels();
      this.updateNumbers();
    }
  },

  mounted: function() {
    this.svg_game = d3.select("#d3-game-holder").append("svg").attr("width", this.width).attr("height", this.height);
    this.svg_board = d3.select("#d3-board-holder").append("svg").attr("width", this.width).attr("height", this.height);
  },

  methods: {    

    createTypes() {
      let self = this;
      this.d3_types = this.svg_board.append("g")
        .attr("class", "types")
        .selectAll("path")
        .data(self.topology.objects.hexagons.geometries)
        .enter().append("text")
        .attr("x", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[0];
        })
        .attr("y", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[1] + 15;
        })
        .attr("text-anchor", "middle");
    },
    
    updateTypes() {
      if (!this.d3_types) return;
      let self = this;
      this.d3_types.data(self.topology.objects.hexagons.geometries)
      this.d3_types.text(function (d) {
        let str = "";
        if (d.tile.attributes.resource_type === "SEA") {
          if (d.tile.attributes.harbour_type !== "HARBOUR_NONE") {
            str = d.tile.attributes.harbour_type;
          }
        } else {
          str = d.tile.attributes.resource_type;
        }
        return T(str);
      });
    },
    
    createLabels() {
      let self = this;
      this.d3_labels = this.svg_board.append("g")
        .attr("class", "labels")
        .selectAll("path")
        .data(self.topology.objects.hexagons.geometries)
        .enter().append("text")
        .attr("x", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[0];
        })
        .attr("y", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[1];
        })
        .attr("text-anchor", "middle");
    },

    updateLabels() {
      if (!this.d3_labels) return;

      let self = this;
      this.d3_labels.data(self.topology.objects.hexagons.geometries)
      this.d3_labels.attr("visibility", function() {
        return self.dev_mode ? "visible" : "hidden";
      })
        .text(function (d) {
          return d.tile.attributes.key;
        })
    },

    createNumbers() {
      let self = this;
      this.d3_numbers = this.svg_board.append("g")
        .attr("class", "numbers")
        .selectAll("path")
        .data(self.topology.objects.hexagons.geometries)
        .enter().append("text")
        .attr("x", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[0];
        })
        .attr("y", function (d) {
          return self.path.centroid(topojson.feature(self.topology, d))[1] - 20;
        })
        .attr("text-anchor", "middle");
    },

    updateNumbers() {
      if (!this.d3_numbers) return;

      let self = this;
      this.d3_numbers.data(self.topology.objects.hexagons.geometries)
      this.d3_numbers.text(function (d) {
        if (d.tile.attributes.number > 0) return d.tile.attributes.number;
        return "";
      })
    },

    createTiles() {
      let self = this;
      this.d3_tiles = this.svg_board.append("g")
        .attr("class", "hexagon")
        .selectAll("path")
        .data(self.topology.objects.hexagons.geometries)
        .enter().append("path")
        .attr("d", function (d) {
          return self.path(topojson.feature(self.topology, d));
        })
        .attr("class", function (d) {
          return "tile " + d.tile.attributes.resource_type;
        })
        .on("click", function(d) { self.click_tile(d.tile.attributes) })
        .on("mouseover", function() {
          self.hint = "Place bandit here"
        })
        .on("mouseout", function() {
          self.hint = ""
        });
    },

    createHarbours() {
      let self = this;
      this.svg_board.append("path")
        .attr("class", "harbour-edge")
        .attr("stroke", "#247aff")
        .call(self.redrawHarbour);
    },
    
    // When updating tiles the classname can change
    updateTiles() {
      if (!this.d3_tiles) return;
      let self = this;
      this.d3_tiles.data(self.topology.objects.hexagons.geometries);
      this.d3_tiles.attr("d", function (d) {
        return self.path(topojson.feature(self.topology, d));
      }).attr("class", function (d) {
        return "tile " + d.tile.attributes.resource_type;
      })
    },

    createBandits() {
      let self = this;
      this.d3_bandits = this.svg_game.append("g")
        .attr("class", "bandits")
        .selectAll("path")
        .data(self.bandits)
        .enter().append("path")
        .attr("transform", function (d) {
          let coordinate = self.path.centroid(topojson.feature(self.topology, self.getHexByKey(d.attributes.tile_key)));
          return "translate(" + coordinate[0] + "," + coordinate[1] + ")";
        })
        .attr("d", "M-10 35 m -5, 0 a 10,10 0 1,0 30,0 a 10,10 0 1,0 -30,0");
    },

    updateBandits() {
      if (!this.d3_bandits) return;
      let self = this;
      this.d3_bandits.data(self.bandits);
      this.d3_bandits.attr("transform", function (d) {
        let coordinate = self.path.centroid(topojson.feature(self.topology, self.getHexByKey(d.attributes.tile_key)));
        return "translate(" + coordinate[0] + "," + coordinate[1] + ")";
      });
    },

    createNodes() {
      let self = this;
      this.d3_nodes = this.svg_game.append("g")
        .attr("class", "nodes")
        .selectAll("path")
        .data(self.nodes.map(function(n) {
          return n.attributes;
        })).enter().append("path")
        // .attr("style", function(d) {
        //   transform: translate(194px,487px) scale(1.1);
        // })
        .attr("transform", function (d) {
          let coordinate = self.path.centroid(topojson.merge(self.topology, [
            self.getHexByKey(d.t_key), self.getHexByKey(d.l_key), self.getHexByKey(d.r_key)
          ]));
          return "translate(" + coordinate[0] + "," + coordinate[1] + ") scale(1.0)";
        })
        .on("click", function(d) { self.click_node(d) })
        .on("mouseover", function (d) {

          if (d.structure === Structure.VILLAGE && !d.conceptStructure || d.conceptStructure === Structure.VILLAGE) {
            self.hint = "Build city here";
          } else if (d.structure !== Structure.CITY) {
            self.hint = "Build village here";
          }

          d3.select(this)
            .transition()
            .duration(300)
            .attr("transform", function (d) {
              let coordinate = self.path.centroid(topojson.merge(self.topology, [
                self.getHexByKey(d.t_key), self.getHexByKey(d.l_key), self.getHexByKey(d.r_key)
              ]));
              return "translate(" + coordinate[0] + "," + coordinate[1] + ") scale(1.2)";
            })
        })
        .on("mouseout", function () {
          self.hint = "";

          d3.select(this)
            .transition()
            .duration(300)
            .attr("transform", function (d) {
              let coordinate = self.path.centroid(topojson.merge(self.topology, [
                self.getHexByKey(d.t_key), self.getHexByKey(d.l_key), self.getHexByKey(d.r_key)
              ]));
              return "translate(" + coordinate[0] + "," + coordinate[1] + ") scale(1.0)";
            })
        });
    },

    updateNodes() {
      if (!this.d3_nodes) return;

      let self = this;
      this.d3_nodes.data(self.nodes.map(function(n) {
        return n.attributes;
      }));

      this.d3_nodes.attr("d", function (d) {
        if ((d.structure === Structure.VILLAGE && !d.conceptStructure) || d.conceptStructure === Structure.VILLAGE) {
          return "M0 -10 L10 -2 L10 10 L-10 10 L-10 -2 L0 -10 Z"
        } else if (d.structure === Structure.CITY || d.conceptStructure === Structure.CITY) {
          return "M-12 -2 L1 -2 L1 -10 L6 -12 L11 -10 L11 12 L-12 12 L-12 -2 Z"
        } else {
          return "m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0"
        }
      }).attr('fill', function (d) {
        if (d.conceptStructure) {
          return "#ff0000";
        } 
        return d.player_color;
      }).attr("class", function(d) {
        if ((d.structure === Structure.VILLAGE && !d.conceptStructure) || d.conceptStructure === Structure.VILLAGE) {
          return "node node--village"
        } else if (d.structure === Structure.CITY || d.conceptStructure === Structure.CITY) {
          return "node node--city"
        }
        return "node node--empty"
      });
    },

    createEdges() {
      let self = this;
      this.d3_edges = this.svg_game.append("g")
        .attr("class", "borders")
        .selectAll("path")
        .data(self.edges)
        .enter().append("path")    
        .attr("d", function (d) {
          return self.path(topojson.mesh(self.topology, self.topology.objects.hexagons, function (a, b) {
            let edge1 = self.getEdge(a.tile.attributes.key, b.tile.attributes.key);
            let edge2 = self.getEdge(b.tile.attributes.key, a.tile.attributes.key);
            return (edge1 == d || edge2 == d);
          }))
        })
        .on("click", function(d) { self.click_edge(d.attributes) })
        .on("mouseover", function() { 
          self.hint = "Place road";
        })
        .on("mouseout", function() {
          self.hint = "";
        });
    },

    updateEdges() {
      if (!this.d3_edges) return;
      let self = this;
      this.d3_edges.data(self.edges);
      this.d3_edges.attr("stroke", function (d) {
        if (d.attributes.road) {
          return d.attributes.player_color;
        } else if (d.attributes.conceptStructure) {
          return "#ff0000";
        }
        return "#fff";
      })
        .attr("class", function (d) {
          if (d.attributes.road) {
            return "border border--road"
          } else if (d.attributes.conceptStructure) {
            return "border border--road"
          } else {
            return "border border--empty"
          }
        })
    },

    click_node: function(node) {
      if ((node.structure === Structure.VILLAGE && !node.conceptStructure) || node.conceptStructure == Structure.VILLAGE) {
        this.buildCity(node);
      } else if (node.conceptStructure === Structure.CITY) {
        this.removeAction(node);
      } else if  (node.structure !== Structure.VILLAGE || node.structure !== Structure.CITY) {
        this.buildVillage(node);
      }
    },

    // an object can have multiple actions (i.e. building both a village and a city)
    removeAction: function(obj) {
      obj.conceptStructure = null;
      let actionsToRemove = this.actions.filter(action => {
        return action.object.key === obj.key
      });

      actionsToRemove.forEach(action => {
        this.$emit("removeAction", action);
      });
    },

    buildVillage: function (node) {
      this.$emit("createAction", "buildVillage", node, [{type: "GRAIN", value: -1},{type: "WOOL", value: -1},{type: "WOOD", value: -1},{type: "STONE", value: -1}]);
    },

    buildCity: function (node) {
      this.$emit("createAction", "buildCity", node, [{type: "GRAIN", value: -2},{type: "ORE", value: -3}]);
    },

    click_tile: function(tile) {
      this.placeBandit(tile);
    },

    placeBandit: function (data) {
      this.$emit("createAction", "placeBandit", data, []);
    },

    click_edge: function(edge) {
      if (edge.conceptStructure) {
        this.removeAction(edge)
      } else {
        this.buildRoad(edge)
      }
    },

    buildRoad: function (edge) {
      this.$emit("createAction", "buildRoad", edge, [{type: "WOOD", value: -1},{type: "STONE", value: -1}]);
    },

    getTile: function(x, y) {
      let key = `[${x},${y}]`;
      return this.tiles.find((item) => {
        return item.attributes.key == key;
      });
    },

    getEdge: function(a, b) {
      let key = `(${a},${b})`;
      return this.getEdgeByKey(key);
    },

    getEdgeByKey: function(key) {
      return this.edges.find((item) => {
        return item.attributes.key == key;
      });
    },

    getHexByKey: function(key) {
      return this.topology.objects.hexagons.geometries.find((item) => {
        return item.tile.attributes.key == key;
      });
    },

    getNode: function(a, b, c) {
      let key = `(${a},${b},${c})`;
      return this.nodes.find((item) => {
        return item.attributes.key == key;
      });
    },

    redrawHarbour: function(harbourBorder) {
      let self = this;
      harbourBorder.attr("d", self.path(topojson.mesh(self.topology, self.topology.objects.hexagons, function (a, b) {
        let edge1 = self.getEdge(a.tile.attributes.key, b.tile.attributes.key);
        let edge2 = self.getEdge(b.tile.attributes.key, a.tile.attributes.key);
        return (edge1 && edge1.attributes.harbour) || (edge2 && edge2.attributes.harbour);
      })));
    },

    hexProjection: function(radius) {
      let dx = radius * 2 * Math.sin(Math.PI / 3),
          dy = radius * 1.5;

      return {
        stream: function (stream) {
          return {
            point: function (x, y) {
              stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2);
            },
            lineStart: function () {
              stream.lineStart();
            },
            lineEnd: function () {
              stream.lineEnd();
            },
            polygonStart: function () {
              stream.polygonStart();
            },
            polygonEnd: function () {
              stream.polygonEnd();
            }
          };
        }
      };
    },

    hexTopology: function(radius, width, height) {
      let dx = radius * 2 * Math.sin(Math.PI / 3),
          dy = radius * 1.5,
          m = Math.ceil((height + radius) / dy) + 1,
          n = Math.ceil(width / dx) + 1,
          geometries = [],
          arcs = [];

      for (let j = -1; j <= m; ++j) {
        for (let i = -1; i <= n; ++i) {
          let y = j * 2, x = (i + (j & 1) / 2) * 2;
          arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
        }
      }

      for (let j = 0, q = 3; j < m; ++j, q += 6) {
        for (let i = 0; i < n; ++i, q += 3) {
          if (this.getTile(i - 1, j - 2)) {
            geometries.push({
              type: "Polygon",
              arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
              tile: this.getTile(i - 1, j - 2)
            });
          }
        }
      }

      return {
        transform: {translate: [0, 0], scale: [1, 1]},
        objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
        arcs: arcs
      };
    },  

    draw_board: function() {
      if (this.svg_board) this.svg_board.remove();
      this.svg_board = d3.select("#d3-board-holder").append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      this.createTiles();
      this.createTypes();
      this.createLabels();
      this.createNumbers();
      this.createHarbours(); 
      this.createEdges();
      this.createNodes();
      this.createBandits();     
    }
  }
}

</script>

<style scoped>
.board {
  width: 100%;
}

#d3-board-holder, #d3-game-holder {
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
}

 #d3-game-holder {
   pointer-events: none;
 }
</style>
