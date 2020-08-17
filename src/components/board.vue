<template>
  <div class="board"> 
    <div id="d3-holder"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";

export default {
  name: 'connect',
  props: ['json'],

  watch: { 
    json: function() {
      this.draw_board();
    }
  },

  methods: {
        click_node: function(data) {
          console.log({"clicked-node":data});
          alert("Node clicked: " + JSON.stringify(data));
        },
        click_tile: function(data) {
          console.log({"clicked-tile":data});
          alert("Tile clicked: " + JSON.stringify(data));
        },
        click_edge: function(data) {
          console.log({"clicked-edge":data});
          alert("Edge clicked: " + JSON.stringify(data));
        },
        draw_board: function() {
          d3.select("svg").remove();
          var self = this;

          let json = this.json;

          var tiles = json.attributes.board.attributes.tiles,
              edges = json.attributes.board.attributes.edges,
              nodes = json.attributes.board.attributes.nodes,
              bandits = json.attributes.board.attributes.bandits;
          //   players = json.attributes.players;

      var width = 1050,
          height = 900,
          radius = 75;

      var topology = hexTopology(radius, width, height);

      var projection = hexProjection(radius);

      var path = d3.geoPath()
          .projection(projection);

      var svg = d3.select("#d3-holder").append("svg")
          .attr("width", width)
          .attr("height", height);

      svg.append("g")
          .attr("class", "hexagon")
          .selectAll("path")
          .data(topology.objects.hexagons.geometries)
          .enter().append("path")
          .attr("d", function (d) {
              return path(topojson.feature(topology, d));
          })
          .attr("class", function (d) {
              return "tile " + d.tile.attributes.resource_type;
          })
          .on("click", function(d) { self.click_tile(d.tile.attributes) });

      svg.append("g")
          .attr("class", "numbers")
          .selectAll("path")
          .data(topology.objects.hexagons.geometries)
          .enter().append("text")
          .attr("x", function (d) {
              return path.centroid(topojson.feature(topology, d))[0];
          })
          .attr("y", function (d) {
              return path.centroid(topojson.feature(topology, d))[1] - 20;
          })
          .text(function (d) {
              if (d.tile.attributes.number > 0) return d.tile.attributes.number;
              return "";
          })
          .attr("text-anchor", "middle");

      svg.append("g")
          .attr("class", "labels")
          .selectAll("path")
          .data(topology.objects.hexagons.geometries)
          .enter().append("text")
          .attr("x", function (d) {
              return path.centroid(topojson.feature(topology, d))[0];
          })
          .attr("y", function (d) {
              return path.centroid(topojson.feature(topology, d))[1];
          })
          .text(function (d) {
              return d.tile.attributes.key;
          })
          .attr("text-anchor", "middle");

      svg.append("g")
          .attr("class", "types")
          .selectAll("path")
          .data(topology.objects.hexagons.geometries)
          .enter().append("text")
          .attr("x", function (d) {
              return path.centroid(topojson.feature(topology, d))[0];
          })
          .attr("y", function (d) {
              return path.centroid(topojson.feature(topology, d))[1] + 15;
          })
          .text(function (d) {
              var str = "";
              if (d.tile.attributes.resource_type === "SEA") {
                  if (d.tile.attributes.harbour_type !== "HARBOUR_NONE") {
                      str = d.tile.attributes.harbour_type;
                  }
              } else {
                  str = d.tile.attributes.resource_type.toLowerCase();
              }
              return str;
          })
          .attr("text-anchor", "middle");

      svg.append("path")
          .datum(topojson.mesh(topology, topology.objects.hexagons))
          .attr("class", "mesh")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1)
          .attr("d", path);

      svg.append("path")
          .attr("class", "harbour-edge")
          .attr("stroke", "#247aff")
          .call(redrawHarbour);

      function redrawHarbour(harbourBorder) {
          harbourBorder.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function (a, b) {
              var edge1 = getEdge(a.tile.attributes.key, b.tile.attributes.key);
              var edge2 = getEdge(b.tile.attributes.key, a.tile.attributes.key);
              if (edge1) console.log(edge1);
              return (edge1 && edge1.attributes.harbour) || (edge2 && edge2.attributes.harbour);
          })));
      }

      svg.append("g")
          .attr("class", "borders")
          .selectAll("path")
          .data(edges)
          .enter().append("path")
          .attr("stroke", function (d) {
              if (d.attributes.road) {
                  return d.attributes.player_color;
              } else {
                  return "#fff";
              }
          })
          .attr("class", function (d) {
              if (d.attributes.road) {
                  return "border border--road"
              } else {
                  return "border border--empty"
              }
          })
          .attr("d", function (d) {
              return path(topojson.mesh(topology, topology.objects.hexagons, function (a, b) {
                  var edge1 = getEdge(a.tile.attributes.key, b.tile.attributes.key);
                  var edge2 = getEdge(b.tile.attributes.key, a.tile.attributes.key);

                  if (edge1 == d || edge2 == d) {
                      return true;
                  }
                  return false;
              }))
          })
          .on("click", function(d) { self.click_edge(d.attributes) });

      svg.append("g")
          .attr("class", "nodes")
          .selectAll("path")
          .data(nodes.map(function(n) {
              return n.attributes;
          }))
          .enter().append("path")
          .attr("transform", function (d) {
              var coordinate = path.centroid(topojson.merge(topology, [
                  getHexByKey(d.t_key),
                  getHexByKey(d.l_key),
                  getHexByKey(d.r_key)
              ]));
              return "translate(" + coordinate[0] + "," + coordinate[1] + ")";
          })
          .attr("d", function (d) {
              if (d.structure == "VILLAGE") {
                  return "M0 -10 L10 -2 L10 10 L-10 10 L-10 -2 L0 -10 Z"
              } else if (d.structure == "CITY") {
                  return "M-12 -2 L1 -2 L1 -10 L6 -12 L11 -10 L11 12 L-12 12 L-12 -2 Z"
              } else {
                  return "m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0"
              }
          }).attr('fill', function (d) {
              return d.player_color;
          }).attr("class", function(d) {
              if (d.structure == "VILLAGE") {
                  return "node node--village"
              } else if (d.structure == "CITY") {
                  return "node node--city"
              } else {
                  return "node node--empty"
              }
          })
          .on("click", function(d) { self.click_node(d) });

      svg.append("g")
          .attr("class", "bandits")
          .selectAll("path")
          .data(bandits)
          .enter().append("path")
          .attr("transform", function (d) {
              var coordinate = path.centroid(topojson.feature(topology, getHexByKey(d.attributes.tile_key)));
              return "translate(" + coordinate[0] + "," + coordinate[1] + ")";
          })
          .attr("d", "M-10 35 m -5, 0 a 10,10 0 1,0 30,0 a 10,10 0 1,0 -30,0");

      function hexTopology(radius, width, height) {
          var dx = radius * 2 * Math.sin(Math.PI / 3),
              dy = radius * 1.5,
              m = Math.ceil((height + radius) / dy) + 1,
              n = Math.ceil(width / dx) + 1,
              geometries = [],
              arcs = [];

          for (var j = -1; j <= m; ++j) {
              for (var i = -1; i <= n; ++i) {
                  var y = j * 2, x = (i + (j & 1) / 2) * 2;
                  arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
              }
          }

          var q;
          for (j = 0, q = 3; j < m; ++j, q += 6) {
              for (i = 0; i < n; ++i, q += 3) {
                  if (getTile(i - 1, j - 2)) {
                      geometries.push({
                          type: "Polygon",
                          arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
                          tile: getTile(i - 1, j - 2)
                      });
                  }
              }
          }

          return {
              transform: {translate: [0, 0], scale: [1, 1]},
              objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
              arcs: arcs
          };
        }

    function getTile(x, y) {
        var key = `[${x},${y}]`;
        return tiles.find(matchKey, key);
    }

    function getEdge(a, b) {
        var key = `(${a},${b})`;
        return edges.find(matchKey, key);
    }

    function matchKey(item) {
        return item.attributes.key == this;
    }

    function getHexByKey(key) {
        return topology.objects.hexagons.geometries.find(matchTile, key)
    }

    function matchTile(item) {
        return item.tile.attributes.key == this;
    }

    function hexProjection(radius) {
        var dx = radius * 2 * Math.sin(Math.PI / 3),
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
      }
    }
  }
}
</script>

<style scoped>

</style>
