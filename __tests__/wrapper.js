
//should return error if inputs are incorrect
//should return typerror if no input is provided
//should return middleware error (legacy server) if input is not valid for provided callback
        //runtime should be a num
        //if no middleware error or typeerror, should send a req to Ekho and receive a response (status code 200)     
                //might wanna validate body as well  
        //returned result should be the same as eval result of callback (legacy module) passing in legacyInput