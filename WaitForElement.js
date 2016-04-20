function WaitForElement(elementSelector, execFunction, delay, tries) {
  delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true;
  setTimeout(function WaitForElementCycle() {
    if (tries) {keepRun = (cycle < tries);}
    if (keepRun) {
      // alert('cycle = ' + cycle);
      if ( document.querySelector(elementSelector) ) {
        return execFunction();
      } else {
        setTimeout(WaitForElementCycle, delay);
      }
      cycle += 1;
    }
  }, delay);
}
