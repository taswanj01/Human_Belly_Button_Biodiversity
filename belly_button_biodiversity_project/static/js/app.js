function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = "/metadata/" + sample;
  d3.json(url).then(function (sample) {

    // Use `.html("") to clear any existing metadata
    var sample_metadata = d3.select("#sample_metadata");
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

    })
  })
};
// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Build a Bubble Chart using the sample data

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  var url = `/samples/${sample}`;
  d3.json(url).then(function (response) {

    var xValues = response.otu_ids;
    var yValues = response.sample_values;
    var tValues = response.otu_labels;
    var mSize = response.sample_values;
    var mClrs = response.otu_ids;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      }
    };

    var data = [trace_bubble];

    var layout = {
      xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot('bubble', data, layout);


    d3.json(url).then(function (response) {
      var pieValue = response.sample_values.slice(0, 10);
      var pielabel = response.otu_ids.slice(0, 10);
      var pieHover = response.otu_labels.slice(0, 10);

      var data = [{
        values: pieValue,
        labels: pielabel,
        hovertext: pieHover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var dropdownSelector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      dropdownSelector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
