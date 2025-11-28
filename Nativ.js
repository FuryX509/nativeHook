function hookFunc(addr) {

    var dumpOffset = addr // _kDartIsolateSnapshotInstructions + code offset

    var argBufferSize = 500

    var address = Module.findBaseAddress('libapp.so') // libapp.so (Android) or App (IOS) 
    console.log('\n\nbaseAddress: ' + address.toString())

    var codeOffset = address.add(dumpOffset)
    console.log('codeOffset: ' + codeOffset.toString())
    console.log('')
    console.log('Wait..... ')

    Interceptor.attach(codeOffset, {
        onEnter: function(args) {

            console.log('')
            console.log('--------------------------------------------|')
            console.log('\n    Hook Function: ' + dumpOffset);
            console.log('')
            console.log('--------------------------------------------|')
            console.log('')

            for (var argStep = 0; argStep < 50; argStep++) {
                try {
                    dumpArgs(argStep, args[argStep], argBufferSize);
                } catch (e) {

                    break;
                }

            }

        },
        onLeave: function(retval) {
            console.log('RETURN : ' + retval)
            dumpArgs(0, retval, 150);
        }
    });

}

function dumpArgs(step, address, bufSize) {

    var buf = Memory.readByteArray(address, bufSize)

    console.log('Argument ' + step + ' address ' + address.toString() + ' ' + 'buffer: ' + bufSize.toString() + '\n\n Value:\n' +hexdump(buf, {
        offset: 0,
        length: bufSize,
        header: false,
        ansi: false
    }));

    console.log('')
    console.log('----------------------------------------------------')
    console.log('')
}

setImmediate(function() {
	Java.perform(function() {
		
	//hookFunc(Module.findBaseAddress('libapp.so') + 0x007b5f3c)
	hookFunc(0x0051dbb4 + 0x00001dd0)
	hookFunc(0x0051dbb4 + 0x00001dd0)
	/*hookFunc(0x0051dbb4 + 0x0007d948)
	hookFunc(0x0051dbb4 + 0x0008cca0)
	hookFunc(0x0051dbb4 + 0x00070c5c)
	hookFunc(0x0051dbb4 + 0x000707e8)*/
});
});