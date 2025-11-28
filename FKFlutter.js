function hook_ssl_verify_result(address)
{
  Interceptor.attach(address, {
    onEnter: function(args) {
      console.log("Disabling SSL validation")
    },
    onLeave: function(retval)
    {
      console.log("Retval: " + retval)
      retval.replace(0x1);
 
    }
  });
}
function disablePinning()
{
	var module = "libflutter.so"
	Process.enumerateModules().forEach(v => {
		// if the module matches with our library
		if(v['name'] == module) {
			// debugging purposes
			console.log("Base: ", v['base'], "| Size: ", v['size'], "\n")
			var pattern = "ff 43 02 d1 fe 6f 04 a9 fa 67 05 a9 f8 5f 06 a9 f6 57 07 a9 f4 4f 08 a9 f3 03 00 aa"
			var res = Memory.scan(v['base'], v['size'], pattern, {
				onMatch: function(address, size){
				  console.log('[+] ssl_verify_result found at: ' + address.toString());
			 
				  // Add 0x01 because it's a THUMB function
				  // Otherwise, we would get 'Error: unable to intercept function at 0x9906f8ac; please file a bug'
				  hook_ssl_verify_result(address.add(0x01));
				   
				}, 
				onError: function(reason){
					console.log('[!] There was an error scanning memory');
				},
				onComplete: function()
				{
				  console.log("All done")
				}
			});
		}
	});
	
}
setTimeout(disablePinning, 1000)