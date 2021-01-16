const { selection } = require("scenegraph")

async function clear(selection, root) {
    if(root.pluginData === undefined) {
        root.pluginData = {usedIds: []}
    }
    root.pluginData = {usedIds: []}

    function clearIds(item) {
        const children = item.children;
        if(children) {
            children.forEach(function (item) {
                clearIds(item)
            })
        }

        if(item.name.startsWith('m_') || item.name.startsWith('s_') || item.name.startsWith('w_') || item.name.startsWith('p_')) {
            item.pluginData = {};
            const names = item.name.split('-');
            item.name = names[0]
        } 
    }

    selection.items.forEach(function (item) {
        clearIds(item);
    })
}

async function selectAllElements(selection, root) {
    if(root.pluginData === undefined) {
        root.pluginData = {usedIds: []}
        console.log("Initiating root pluginData");
    }

    console.log("Root pluginData:", root.pluginData);

    let counter = 0;
    let usedIds = root.pluginData.usedIds;

    function setNewIds(item) {
        const children = item.children;
        if(children) {
            children.forEach(function (item) {
                setNewIds(item)
            })
        }

        if(item.name.startsWith('m_') || item.name.startsWith('s_') || item.name.startsWith('w_') || item.name.startsWith('p_')) {
            const names = item.name.split('-');

            console.log(item.name, item.pluginData);

            if(item.pluginData?.count !== undefined) {
                console.log('Item has count pluginData', item.pluginData.count);
                item.name = names[0] + "-" + countToString(item.pluginData.count);
                if(usedIds.find(e => e === item.pluginData.count) === undefined) {
                    usedIds.push(item.pluginData.count);
                    console.log('Item count does not exits in root pluginData, adding now', usedIds);
                }
            } else {
                while(usedIds.find(e => e === counter) >= 0) {
                    console.log('Count does exist in root pluginData, count: ', counter);
                    counter++;
                }
                if(item.pluginData === undefined) {
                    item.pluginData = {};
                }
                const data = item.pluginData;
                data.count = counter;
                item.pluginData = data;
                usedIds.push(counter);
                item.name = names[0] + "-" + countToString(counter);
                console.log(item);
            }

            counter++;
            console.log(counter, item.name);
        } 
    }

    selection.items.forEach(function (item) {
        setNewIds(item);
    })

    // Save all used ids to root
    const data = root.pluginData;
    data.usedIds = usedIds;
    root.pluginData = data;

    console.log(root.pluginData);
}

function countToString(count) {
    let counterString = count.toString(10);
    while (counterString.length < 4) {
        counterString = '0' + counterString;
    }

    return counterString;
}

module.exports = {
	commands: {
        selectAllElements: selectAllElements,
        clear: clear
	}
};
