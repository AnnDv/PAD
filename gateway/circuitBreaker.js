function circuitBreaker(maxErrorNumber, func, body) {
    let errorCount = 0;

    while(true) {
        result = func(body);
        // if(isTimerDone == true){
        //     return "404"
        // }
        if(result.statusCode == 200) {
            return result;
        }
        errorCount ++;
        
        if(errorCount == maxErrorNumber) {
            return "404"
        }
    }
}

exports.circuitBreaker = circuitBreaker;