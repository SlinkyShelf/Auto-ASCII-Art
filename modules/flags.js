/*
    Flag Object
    {
        ["-s"]: {
            ["NextArg"]: false,
            ["funct"]: function()
            {
                //Do stuff
            }
        },
        ["lol]:{
            ["NextArg"]: true,
            ["funct"]: function(nextarg)
            {
                //Do other stuff
            }
        }
    }


*/

const consoletools = require("./consoletools")


exports.HandleFlags = function (str, flags) {
    if (typeof(str) == "string")
        str = str.split(" ")
    for (var i = 0; i < str.length; i++) {
        if (str[i].startsWith("-") && flags[str[i]]) {
            const flag = flags[str[i]]
            if (flag.NextArg) {
                if (i == str.length-1 || str[i+1].startsWith("-"))
                    return warn(str+" is not a standalone flag")
                if (flag.funct)
                    flag.funct(str[i+1])
                else
                    warn(str+" does not have a function connected to it")
                i++;
            }
        }
    }
}