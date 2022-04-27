class flagObj
{
    flagObj(name, call, primaryprefix, secondaryprefix,  description) 
    {
        if (!(name && call && primaryprefix))
            throw new TypeError("Invalid args for flag creation!")

        this.name = name
        this.ppf = primaryprefix
        this.spf = secondaryprefix
        this.call = call
        this.des = description
    }
}

class commandObj
{
    commandObj(name, call, primaryname, secondaryname) {
        if (!(name && call && primaryname))
            throw new TypeError("Invalid args for command creation!")

        this.name = name
        this.call = call
        this.pname = primaryname
        this.sname = secondaryname

        this.flags = []
        this.prefixes = {}
    }

    prefixError(flag, flagtype) {
        console.warn("WARNING: Prefix collision in command \""+this.name+"\"\n"+
            "with prefix \""+flag[flagtype]+"\" with commands +\""+flag.name+"\" and \""+this.prefixes[flag[flagtype]].name+"\"")
    }

    addFlag(flag)
    {
        this.flags.push(flag)

        if (this.prefixes[flag.ppf])
            prefixError(flag, "ppf")

        if (this.prefixes[flag.spf])
            prefixError(flag, "spf")

        this.prefixes[flag.ppf] = flag
        this.prefixes[flag.spf] = flag
    }
}

class commandLineObj
{
    commandLineObj()
    {
        commands = []
        calls = {}
    }

    commandPrefixError(command, prefixtype)
    {
        console.warn("WARNING: Prefix collision in command \""+this.name+"\"\n"+
                "with prefix \""+command[prefixtype]+"\" with commands +\""+command.name
                +"\" and \""+this.calls[command[prefixtype]].name+"\"")
    }

    addCommand(command)
    {
        this.commands.push(command)

        if (this.calls[command.pname])
            commandPrefixError(command, "pname")

        if (this.calls[command.sname])
            commandPrefixError(command, "sname")

        this.calls[command.pname] = command
        this.calls[command.sname] = command

        return this
    }
}

function HandlerFlags(commandLine, str, yell)
{
    const args = str.split(" ")
    const command = args[0]
}