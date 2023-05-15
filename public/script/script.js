 const alertButton= document.getElementById('alert');

 function alert(){
     alertButton.style.display='inline-block';
 }
if(alertButton.outerText=='Password or Email  is wrong'||'Oops! This Email Account is aready registered'){
alert();
}
 
