function wall(el) {
  var keys;

  function msgs2matrix (msgs){
    keys = msgs.map(function(d){return d.name;});
    var matrix = new Array(keys.length);

    for (var i = 0; i < keys.length; ++i) {
      matrix[i] = new Array(keys.length);
      for (var j = 0; j < keys.length; ++j) {
          matrix[i][j] = msgs[i].msgs[keys[j]] || 0;
      }
    }

    return matrix;
  };

  var width = 960,
      height = 500,
      innerRadius = Math.min(width, height) * 0.41,
      outerRadius = innerRadius * 1.1,
      circularPadding = Math.PI / 4;

  var chord = d3.layout.chord()
  .sortGroups(d3.descending);

  var fill = function() {
    function fill(i) {
      return scale(vanDerCorput(i));
    }

    var vdc_cache = [];
    function vanDerCorput (i) {
      if (undefined === vdc_cache[i]) {
        var str = i.toString(2).split("").reverse().join("");
        vdc_cache[i] = parseInt(str,2)/Math.pow(2,str.length);
      }
      return vdc_cache[i];
    }
    var colors = d3.scale.category20().range();

    var scale = d3.scale.linear()
    .domain(d3.range(0,1 + 1E-6,1 / (colors.length - 1)))
    .range(colors);        

    return fill;
  }();

  var svg, chordgroup, ringgroup, labelgroup; 

  svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  chordgroup = svg.append("g").attr("class", "chord");
  ringgroup = svg.append("g").attr("class", "ring");
  labelgroup = svg.append("g").attr("class", "label");

  io.connect('/stats').on('update', function(data) {
    updateGraph(msgs2matrix(data));
  });

  function updateGraph(matrix) {
    function drawChord(chord) {
      chord.attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index);})
        .style("stroke", function(d) { return fill(d.target.index);});
      return chord;
    }

    //chord graph
    chord.matrix(matrix)
      .padding(circularPadding / matrix.length); // reserve eight of circle for whitespaces

    var chords = chordgroup.selectAll("path").data(chord.chords, function(d) {return 100000 * d.target.index + d.source.index;});
    drawChord(chords.transition());
    drawChord(chords.enter().append("path").transition().delay(250).duration(0));
    chords.exit().remove();

    var segments = ringgroup.selectAll("path").data(chord.groups, function(d) {return d.index;});
    segments.transition().attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));
    segments.enter().append("path")
      .style("fill", function(d) { return fill(d.index); })
      .style("stroke", function(d) { return fill(d.index); })
      .attr("id", function(d) {return "segment-" + d.index;})
      .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

    var labels = labelgroup.selectAll("text").data(chord.groups, function(d) {return d.index;});
    labels.enter().append("text")
      .attr("x", 6)
        .attr("dy", 15)
      .append("svg:textPath")
      .attr("xlink:href", function(d) { return "#segment-" + d.index; })
      .text(function(d) { return keys[d.index]; });
  }

  function insert_msg() {
    ++matrix[Math.floor(Math.random() * matrix.length)][Math.floor(Math.random() * matrix.length)];
    updateGraph(matrix);
  }

  function insert_row() {
    var i;
    for(i = 0; i < matrix.length; ++i) {
      matrix[i].push(0);
    }
    var newRow = new Array(matrix.length + 1);
    for(i = 0; i < newRow.length; ++i) {
      newRow[i] = 0;
    }
    matrix.push(newRow); 
    updateGraph(matrix);
  }
}
