function hookFunc(addr) {

    var dumpOffset = addr // _kDartIsolateSnapshotInstructions + code offset

    var argBufferSize = 150

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
		
	hookFunc(0x0051dbb4 + 0x007b5f3c)
	hookFunc(0x0051dbb4 + 0x007b5f04)
	/*hookFunc(0x0051dbb4 + 0x007b5dc8)
	hookFunc(0x0051dbb4 + 0x007a893c)
	hookFunc(0x0051dbb4 + 0x0069a744)
	hookFunc(0x0051dbb4 + 0x006c1d90)
	hookFunc(0x0051dbb4 + 0x007a88dc)*/
	var threads = [];
	Interceptor.attach((0x0051dbb4 + 0x007b5f3c), {
                   onEnter: function(args) {
                        var tid = Process.getCurrentThreadId();
						if (threads[tid] == STALKED)
							return;
						Stalker.follow(tid, {
							events: {
								call: true, // CALL instructions: yes please
								ret: false, // RET instructions: no thanks
								exec: false // all instructions: no thanks
							},
							onCallSummary: function (summary) {
								var log = []
								for (i in summary) {
									var addr = idaAddress(base, '0x0', i);
									if (addr.compare(ptr(STARTING_ADDRESS)) >= 0 && addr.compare(ptr(ENDING_ADDRESS)) <= 0)
										log.push(addr);
								}
								console.log(JSON.stringify(log));
							}
						});
						threads[tid] = STALKED;
                   }
});
});