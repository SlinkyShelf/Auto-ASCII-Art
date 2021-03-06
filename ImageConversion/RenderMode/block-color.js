const blocktable = require("./../assets/color-table.js").table

const div = 255*3

const abs = Math.abs

exports.render = function(pixelget, settings, data, size, args)
{
    const colorthreshold = args.colorthreshold || settings.colorthreshold 

    function comparecolor(c1, c2)
    {
        return (abs(c1[0]-c2[0])+abs(c1[1]-c2[1])+abs(c1[2]-c2[2]))/div <= colorthreshold
    }

    function normalizegroup(grouparray, id)
    {
        for (var i = 0; i < grouparray.length; i++)
        {
            if (grouparray[i] == id)
            {
                return i
            }
        }
    
        grouparray[grouparray.length] = id
        return grouparray.length-1;
    }

    function groupColor(grouparray, color)
    {
        for (var i = 0; i < grouparray.length; i++)
        {
            if (comparecolor(grouparray[i], color))
            {
                return i
            }
        }
    
        grouparray[grouparray.length] = color
        return grouparray.length-1;
    }

    var str = ""

    owidth = size[0]
    oheight = size[1]
    width = size[2]
    height = size[3]

    const groups = []

    function getpixel(x, y)
    {
        const newpos = pixelget(x, y)
        x = newpos[0]
        y = newpos[1]

        return [data[(y*owidth+x)*4], data[(y*owidth+x)*4+1], data[(y*owidth+x)*4+2]]
    }

    const newdata = []

    for (var y = height; y > 0; y--)
    {
        for (var x = 0; x < width; x++)
        {
            newdata[y*owidth+x] = groupColor(groups, getpixel(x, y))
        }
    }

    for (var y = height-1; y > 0; y--)
    {
        for (var x = 0; x < width-1; x++)
        {
            const ng = [newdata[y*owidth+x]]
            str += blocktable[""+normalizegroup(ng, newdata[y*owidth+x+1])
                +normalizegroup(ng, newdata[(y-1)*owidth+x])+normalizegroup(ng, newdata[(y-1)*owidth+x+1])]
        }
        str += "\n"
    }

    return str
}