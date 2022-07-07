function init() {
    // Grab a reference to the dropdown select element
    ///Dropdown Menu 
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
    function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
  
      var array = data.metadata.filter(sampleobject => sampleobject.id == sample);  
      var meta = array[0];
      var freq = meta.wfreq
      //  5. Create a variable that holds the first sample in the array.
      var firstSample = filteredSamples[0];
      
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var ids = firstSample.otu_ids;
      var labels = firstSample.otu_labels;
      var values  = firstSample.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks =  firstSample.otu_ids[9];
      console.log(ids)
      
      // 8. Create the trace for the bar chart. 
      var barData = [ 
        {
          x:values.slice(0, 10).reverse(),
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          type:"bar",
          orientation: "h"
        }
      ];
      
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found in Subject",
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
   
      // Deliverable 2: Bar and Bubble Charts
      ///Create the Bubble Chart by using the 
      ///buildCharts function
      var bubbleData = [
        {
          x: ids, 
          y: values, 
          text: labels, 
          mode: "markers",
          marker: {
            color: ids,
            size: values 
          }
        }
      ];
  
      //Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacterial Cultures per Sample",
        xaxis: { title: 'OTU ID',
                  titlefont: {
                    family: 'Georgia, serif',
                    size: 18,
                    color: 'fuchsia'
                  }
                },
        hovermode: 'closest',
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100}
        // height: 600,
        // width: 1200
        
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Deliverable 3: Build Gauge
      var gaugeData = [ {
        domain: { x: [0, 1], y: [0, 1] },
        value: freq,
        title: {text: "<br> Belly Button Washing Frequency <br> Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "mistyrose" },
            { range: [1, 2], color: "lightpink" },
            { range: [2, 3], color: "hotpink" },
            { range: [3, 4], color: "violet" },
            { range: [4, 5], color: "plum" },
            { range: [5, 6], color: "mediumorchid" },
            { range: [6, 7], color: "purple" },
            { range: [7, 8], color: "mediumpurple" },
            { range: [8, 9], color: "slateblue" },
          ]
        }
      }
      ];
      
      //Create the layout for the gauge chart.
      var gaugeLayout = { width: 400, height: 400, margin: { t: 0, b: 0} };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  };