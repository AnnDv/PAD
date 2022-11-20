function circuitBreaker(maxErrorNumber, func, body) {
    let errorCount = 0;
    while(true) {
        console.log('sdfghjkljhgfds')
        result = func(body);
        if(result.statusCode == 200) {
            return result;
        }
        errorCount ++;
        
        if(errorCount == maxErrorNumber) {
            console.log('40404040')
            return "404"
        }
    }
}

exports.circuitBreaker = circuitBreaker;