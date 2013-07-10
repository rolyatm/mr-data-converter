// 
//  DataGridRenderer.js
//  Part of Mr-Data-Converter
//  
//  Created by Shan Carter on 2010-10-18.
// 


var DataGridRenderer = {
  
  //---------------------------------------
  // Attack JSON
  //---------------------------------------

  attacks: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = '{"districts": [' + newLine;
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var districtLookupIndex;
    var districtMapping = {};
    var numDistricts=0;
    
    //figures out where district name lives in the array
    for (var i=0; i < numColumns; i++) {
      if (headerNames[i] == "district") {districtLookupIndex = i;};
    };

    //begings rendering
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      var attackInfoParse = "{";
      var currentDistrict;

      //1. checks dictrict. if the district is seen for the first time, set up a new district in object
      if (!districtMapping[row[districtLookupIndex]]) {
        districtMapping[row[districtLookupIndex]] = '{"district":"' + row[districtLookupIndex] +'", "attacks": [' + newLine;
        numDistricts++;
      } else { //if district already exists, add a comma and line feed to prepare for new attack info
        districtMapping[row[districtLookupIndex]] += "," + newLine;
      };
      
      //2. iterates through all columns and structures text
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"' + ( row[j] || "" ) + '"';
        };
        if (j == districtLookupIndex) { 
          continue;
        } else {
          attackInfoParse += ('"'+headerNames[j] +'"' + ":" + rowOutput);
        };
        if (j < (numColumns-1)) {attackInfoParse+=","};
      };
      attackInfoParse+="}";
    //3. Adds attack line to appropriate district  
    districtMapping[row[districtLookupIndex]] += attackInfoParse;
            //outputText += "}";
    };

    //4. enumerating through js object that i'm using as a dictionary
    //object has no concept of length so used var numDistricts to track the number of districts
    //added and var count to track progress through enumeration. 
    //I have to do this because I have to append a comma to every element except the last
    var count=0;
    for (key in districtMapping) {
      count++;      
      outputText += districtMapping[key]; 
      if (count < numDistricts) {
        outputText += (newLine + "]}," + newLine);
      } else {
        outputText += (newLine + "]}" + newLine)
      };
    };

    outputText += "]}";
    return outputText;

  },

  //---------------------------------------
  // Actionscript
  //---------------------------------------
  
  as: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loops
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+( row[j] || "" )+'"';
        };      
        outputText += (headerNames[j] + ":" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";
    
    
    return outputText;
  },
  
  
  //---------------------------------------
  // ASP / VBScript
  //---------------------------------------
  
  asp: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "'";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+( row[j] || "" )+'"';
        };
      outputText += 'myArray('+j+','+i+') = '+rowOutput+newLine;        
      };
    };
    outputText = 'Dim myArray('+(j-1)+','+(i-1)+')'+newLine+outputText;
    
    return outputText;
  },
  
  
  //---------------------------------------
  // HTML Table
  //---------------------------------------
  
  html: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    outputText += "<table>"+newLine;
    outputText += indent+"<thead>"+newLine;
    outputText += indent+indent+"<tr>"+newLine;
    
    for (var j=0; j < numColumns; j++) {
      outputText += indent+indent+indent+'<th class="'+headerNames[j]+'-cell">';          
      outputText += headerNames[j];
      outputText += '</th>'+newLine;
    };
    outputText += indent+indent+"</tr>"+newLine;
    outputText += indent+"</thead>"+newLine;
    outputText += indent+"<tbody>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      var rowClassName = ""
      if (i === numRows-1) {
        rowClassName = ' class="lastRow"';
      } else if (i === 0){
        rowClassName = ' class="firstRow"';
      }
      outputText += indent+indent+"<tr"+rowClassName+">"+newLine;
      for (var j=0; j < numColumns; j++) {
        outputText += indent+indent+indent+'<td class="'+headerNames[j]+'-cell">';          
        outputText += row[j]
        outputText += '</td>'+newLine
      };
      outputText += indent+indent+"</tr>"+newLine;
    };
    outputText += indent+"</tbody>"+newLine;
    outputText += "</table>";
    
    return outputText;
  },
  
  
  //---------------------------------------
  // JSON properties
  //---------------------------------------
  
  json: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"' + ( row[j] || "" ) + '"';
        };
  
      outputText += ('"'+headerNames[j] +'"' + ":" + rowOutput );
  
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "]";
    
    return outputText;
  },
  
  //---------------------------------------
  // JSON Array of Columns
  //---------------------------------------
  jsonArrayCols: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    outputText += "{"+newLine;
    for (var i=0; i < numColumns; i++) {
      outputText += indent+'"'+headerNames[i]+'":[';
      for (var j=0; j < numRows; j++) {
        if ((headerTypes[i] == "int")||(headerTypes[i] == "float")) {
          outputText += dataGrid[j][i] || 0;
        } else {
          outputText += '"'+(dataGrid[j][i] || "")+'"' ;
        }
        if (j < (numRows-1)) {outputText+=","};
      };
      outputText += "]";
      if (i < (numColumns-1)) {outputText += ","+newLine};
    };
    outputText += newLine+"}";
    
    
    return outputText;
  },
  
  
  //---------------------------------------
  // JSON Array of Rows
  //---------------------------------------
  jsonArrayRows: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    outputText += "["+newLine;
    for (var i=0; i < numRows; i++) {
      outputText += indent+"[";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          outputText += dataGrid[i][j] || 0;
        } else {
          outputText += '"'+(dataGrid[i][j] || "")+'"' ;
        }
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "]";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += newLine+"]";
    
    
    return outputText;
  },
  
  
  //---------------------------------------
  // MYSQL
  //---------------------------------------
  mysql: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "/*";
    var commentLineEnd = "*/";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"
    
    //begin render loop
    outputText += 'CREATE TABLE '+tableName+' (' + newLine;
    outputText += indent+"id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,"+newLine;
    for (var j=0; j < numColumns; j++) {
      var dataType = "VARCHAR(255)";
      if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
        dataType = headerTypes[j].toUpperCase();
      };
      outputText += indent+""+headerNames[j]+" "+dataType;
      if (j < numColumns - 1) {outputText += ","};
      outputText += newLine;
    };
    outputText += ');' + newLine;
    outputText += "INSERT INTO "+tableName+" "+newLine+indent+"(";
    for (var j=0; j < numColumns; j++) {
      outputText += headerNames[j];
      if (j < numColumns - 1) {outputText += ","};
    };
    outputText += ") "+newLine+"VALUES "+newLine;
    for (var i=0; i < numRows; i++) {
      outputText += indent+"(";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float"))  {
          outputText += dataGrid[i][j] || "null";
        } else {
          outputText += "'"+( dataGrid[i][j] || "" )+"'";
        };
        
        if (j < numColumns - 1) {outputText += ","};
      };
      outputText += ")";
      if (i < numRows - 1) {outputText += ","+newLine;};
    };
    outputText += ";";
    
    return outputText;
  },
  
  
  //---------------------------------------
  // PHP
  //---------------------------------------
  php: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"
    
    //begin render loop
    outputText += "array(" + newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent + "array(";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float"))  {
          var rowOutput = row[j] || "null";
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };          
        outputText += ('"'+headerNames[j]+'"' + "=>" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += ")";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += newLine + ");";
    
    return outputText;
  },
  
  //---------------------------------------
  // Python dict
  //---------------------------------------
  
  python: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "//";
    var commentLineEnd = "";
    var outputText = "[";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "None";
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };
  
      outputText += ('"'+headerNames[j] +'"' + ":" + rowOutput );
  
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";
    
    return outputText;
  },
  
  
  //---------------------------------------
  // Ruby
  //---------------------------------------
  ruby: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "#";
    var commentLineEnd = "";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    var tableName = "MrDataConverter"
    
    //begin render loop
    outputText += "[";
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += "{";
      for (var j=0; j < numColumns; j++) {
        if ((headerTypes[j] == "int")||(headerTypes[j] == "float")) {
          var rowOutput = row[j] || "nil"
        } else {
          var rowOutput = '"'+(row[j] || "")+'"';
        };         
        outputText += ('"'+headerNames[j]+'"' + "=>" + rowOutput)
        if (j < (numColumns-1)) {outputText+=","};
      };
      outputText += "}";
      if (i < (numRows-1)) {outputText += ","+newLine};
    };
    outputText += "];";
    
    return outputText;
  },
  
  
  //---------------------------------------
  // XML Nodes
  //---------------------------------------
  xml: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += "<rows>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+"<row>"+newLine;
      for (var j=0; j < numColumns; j++) {
        outputText += indent+indent+'<'+headerNames[j]+'>';          
        outputText += row[j] || ""
        outputText += '</'+headerNames[j]+'>'+newLine
      };
      outputText += indent+"</row>"+newLine;
    };
    outputText += "</rows>";
    
    return outputText;
    
  },
  
  
  
  //---------------------------------------
  // XML properties
  //---------------------------------------
  xmlProperties: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
  
    //begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += "<rows>"+newLine;
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+"<row ";
      for (var j=0; j < numColumns; j++) {
        outputText += headerNames[j]+'=';          
        outputText += '"' + row[j] + '" ';
      };
      outputText += "></row>"+newLine;
    };
    outputText += "</rows>";
    
    return outputText;
    
  },
  
  //---------------------------------------
  // XML Illustrator
  //---------------------------------------
  xmlIllustrator: function (dataGrid, headerNames, headerTypes, indent, newLine) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;
    
    //begin render loop
    outputText = '<?xml version="1.0" encoding="utf-8"?>' + newLine;
    outputText += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20001102//EN"    "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd" [' + newLine;
    outputText += indent+'<!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">' + newLine;
    outputText += indent+'<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/">' + newLine;
    outputText += ']>' + newLine;
    outputText += '<svg>' + newLine;
    outputText += '<variableSets  xmlns="&ns_vars;">' + newLine;
    outputText += indent+'<variableSet  varSetName="binding1" locked="none">' + newLine;
    outputText += indent+indent+'<variables>' + newLine;
    for (var i=0; i < numColumns; i++) {
      outputText += indent+indent+indent+'<variable varName="'+headerNames[i]+'" trait="textcontent" category="&ns_flows;"></variable>' + newLine;
    };
    outputText += indent+indent+'</variables>' + newLine;
    outputText += indent+indent+'<v:sampleDataSets  xmlns:v="http://ns.adobe.com/Variables/1.0/" xmlns="http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    
    for (var i=0; i < numRows; i++) {
      var row = dataGrid[i];
      outputText += indent+indent+indent+'<v:sampleDataSet dataSetName="' + row[0] + '">'+newLine;
      for (var j=0; j < numColumns; j++) {
        outputText += indent+indent+indent+indent+'<'+headerNames[j]+'>'+newLine;          
        outputText += indent+indent+indent+indent+indent+'<p>' + row[j] + '</p>' +newLine;
        outputText += indent+indent+indent+indent+'</'+headerNames[j]+'>'+newLine
      };
      outputText += indent+indent+indent+'</v:sampleDataSet>'+newLine;
    };
    
    outputText += indent+indent+'</v:sampleDataSets>' + newLine;
    outputText += indent+'</variableSet>' + newLine;
    outputText += '</variableSets>' + newLine;
    outputText += '</svg>' + newLine;
    
    
    return outputText;
    
  },
  
}