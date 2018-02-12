const Elements = require('./Elements');

module.exports = MonsterTypes = {
    FIRE_GOLEM:	    {   name: 'Fire Golem',	    element: Elements.FIRE,       attack: true,  magic: false   },
    DRAGON:		    {   name: 'Dragon',		    element: Elements.FIRE,       attack: false, magic: true    },
    CRAB:		    {   name: 'Crab',           element: Elements.WATER,      attack: true,  magic: false   },
    SNOW_QUEEN:	    {   name: 'Snow Queen',	    element: Elements.WATER,      attack: false, magic: true    },
    TREANT:		    {   name: 'Treant',		    element: Elements.EARTH,      attack: true,  magic: false   },
    WISP:		    {   name: 'Wisp',           element: Elements.EARTH,      attack: false, magic: true    },
    CYBORG:		    {   name: 'Cyborg',		    element: Elements.LIGHTNING,  attack: true,  magic: false   },
    WIZARD:		    {   name: 'Wizard',		    element: Elements.LIGHTNING,  attack: false, magic: true    },
}