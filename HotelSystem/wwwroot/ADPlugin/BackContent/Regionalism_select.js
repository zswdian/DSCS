
function RegionalismOneTree(_asyncUrl) {
    var checkId = $("#RegionalismId"), zTree;
    //初始配置
    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "level"
        },
        view: {
            dblClickExpand: false,
            showLine: false,
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable: true,
            }
        },
        async: {
            enable: true,
            url: _asyncUrl
        },
        callback: {
            beforeCheck: function (treeId, treeNode) {  
                if (treeNode.isParent) {
                    return false;
                }
                checkId.val(treeNode.no);
                return true;
            },
            onAsyncSuccess: function () {
                var node = zTree.getNodes(); //可以获取所有的父节点
                var allNode = zTree.transformToArray(node); 
                var _val = checkId.val();
                console.log(_val);
                for (var i = 0; i < allNode.length; i++) {
                    if (allNode[i].isParent) {
                        allNode[i].nocheck = true;
                    }
                    if (allNode[i].no == _val) {
                        allNode[i].checked = true;
                    }
                }
                zTree.refresh();  
                $("#power_tree").show();
            }
        }
    };
    $("#btn_getdata").click(function () {
        changeNode();
    })
    function changeNode() {
        var changedNodes = zTree.getChangeCheckedNodes(); //获取改变的全部结点
        for (var i = 0 ; i < changedNodes.length ; i++) {
            var treeNode = changedNodes[i];
            if (treeNode.checked) {
              
                window.parent.GetOrganization(treeNode.no, getFilePath(treeNode));
                var _parent = window.parent == null ? window : window.parent;
                _parent.layer.close(_parent._openIndex);
            }
        }
       
    }
    function getFilePath(treeObj) {
        if (treeObj == null) return "";
        var filename = treeObj.name;
        var pNode = treeObj.getParentNode();
        if (pNode != null) {
            filename = getFilePath(pNode)  + filename;
        }
        return filename;
    }
    //配置树
    function setTree() {
        var t = $("#power_tree");
        t = $.fn.zTree.init(t, setting);  

        t.setting.check.radioType = "all";
        zTree = $.fn.zTree.getZTreeObj("power_tree");
    }
    setTree();
}


RegionalismOneTree("/SystemFunc/Regionalisms/Regionalis");