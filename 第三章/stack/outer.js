function outer() {
  var x; 
  var y; 
  var z; 
  function inner1() { 
    use(y); 
  }
  function inner2() { 
    use(z);
  }
  function inner3() {  }
  return [inner1, inner2, inner3];
}

outer();