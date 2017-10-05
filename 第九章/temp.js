Blockly.Blocks['temperature'] = { 
  init: function() {                  
    this.appendDummyInput()         
        .appendField(Blockly.Msg.TEMP_SENSOR); 
    Blockly.Msg.TEMP_SENSOR，根据所选语言的不同，变量会赋予不同值。
    this.appendValueInput("ID")    
        .setCheck("Number")          
        .appendField("ID");           
    this.setInputsInline(true);      
    this.setOutput(true, "Number"); 
    this.setColour(260);              
    this.setTooltip('');              
    this.setHelpUrl('http://openfpgaduino.github.io/'); 
  }
};
Blockly.JavaScript['temperature'] = function(block) { 
  var id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC); 
  var code = "Bytes2Float32(ajax_post('/fpga/api/call/am2301_temperature', ["+ id+"]))" 
  return [code, Blockly.JavaScript.ORDER_NONE];
};
