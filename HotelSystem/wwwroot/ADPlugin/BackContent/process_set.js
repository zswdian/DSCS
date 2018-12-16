
function setPowerTree(_asyncUrl) {
    //初始配置
    var zTrees;

    var setting = {
        view: {
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom,
            dblClickExpand: true,
            showLine: true,
            selectedMulti: false

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        //edit: {
        //    enable: true,
        //    editNameSelectAll: true,
        //    showRemoveBtn: true,  
        //},
        async: {
            enable: true,
            url: _asyncUrl,
        },
        callback: {
            beforeClick: beforeClick,
            onClick: onClick
        }
    }


    function setTree() {
        var t = $("#power_tree");
        t = $.fn.zTree.init(t, setting);
        zTrees = $.fn.zTree.getZTreeObj("power_tree");

    }

    function beforeClick(treeId, treeNode) {
        var check = (treeNode && !treeNode.isParent);
        if (!check) alert("该选项不可选择！");
        return check;
    }

    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("power_tree"),
        nodes = zTree.getSelectedNodes(),
        v = "";
        id = "";
        nodes.sort(function compare(a, b) { return a.id - b.id; });
        for (var i = 0, l = nodes.length; i < l; i++) {
            v += nodes[i].name + ",";
            id += nodes[i].uid + ",";
        }
        if (v.length > 0)
            v = v.substring(0, v.length - 1);
        var cityObj = $("#citySel");
        if (id.length > 0)
            id = id.substring(0, id.length - 1);
        var aa = $("#aa");
        cityObj.attr("value", v);
        aa.attr("value", id);
    }
    setTree();
};