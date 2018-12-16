function RefreshTree(nodeJson) {

}
function AddNewTree(obj) {

}
var mayClickParent = true;
/**
 * 权限设置
 * @param {any} _asyncUrl 异步地址
 * @param {any} iframeUrl iframe框架地址
 * @param {any} _isCreate 是否添加
 */
function setPowerTree(_asyncUrl, iframeUrl,_isCreate) {
    //初始配置
    var powerIframe, selectId = "", zTrees, isCreate = isNull(_isCreate) ? true : false;//是否添加模式
     
    var setting = { 
        view: {
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom,
            dblClickExpand: true,
            showLine: true,
            selectedMulti: false,
            fontCss: function (treeId, treeNode) {
                return (!!treeNode.highlight) ? { color: "#A60000", "font-weight": "bold" } : {
                    color: "#000", "font-weight": "normal"
                };
            } 
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
            //beforeRemove: beforeRemove,
            //beforeRename: beforeRename,
            beforeClick: function (treeId, treeNode) {
                if (!mayClickParent) {
                    if (treeNode.isParent) {
                        return false;
                    } 
                }
                selectId = treeNode.no;
                selectNodes(treeNode.level);
                return true; 
            },
            onAsyncSuccess: function () {
                refreshZtree();
            }
        }
    };
    function selectNodes(level)
    {
        if (isNull(selectId)) {
            return;
        }  
        powerIframe.attr("src", iframeUrl + "?id=" + selectId + "&&level=" + level);
       
    }
    function refreshZtree() {

    }
    function setTree(nodeJson) {
        var t = $("#power_tree");
        t = $.fn.zTree.init(t, setting);
        powerIframe = $("#power_iframe");
        zTrees = $.fn.zTree.getZTreeObj("power_tree");
        if (nodeJson) {
             refreshZtree = function () {
                 var _node = zTrees.getNodeByParam("id", nodeJson.id); 
                 var _extNode = zTrees.getNodeByParam("id", nodeJson.pId); 
                 zTrees.selectNode(_node, nodeJson.id);
                 zTrees.expandNode(_extNode, true, false, false);
             } 
        }
    }
    RefreshTree = function (nodeJson) {
        setTree(nodeJson);
    };
    AddNewTree = function (data) { 
        
    }
    RefreshTree();
    
}