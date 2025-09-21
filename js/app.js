(function(){
  const hash = location.hash || "";
  if(hash.startsWith("#sample=")){
    const which = decodeURIComponent(hash.slice(8));
    // In this Lite build, we only show a hint. You can wire this into a viewer later.
    console.log("Sample requested:", which);
  }
})();