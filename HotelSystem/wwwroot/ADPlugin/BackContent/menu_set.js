function RefreshTree(openId) {

}
$(function () {
    function setPowerTree() {
        var checkId = $("#select_id"), delId = $("#remove_id"), zTree, powerIframe = $("#power_iframe");
        var _id = $("#roleid").val();
        //初始配置
        var setting = {
            check: {
                enable: true,
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
                url: "PowerList",
            },
            callback: {
                beforeClick: function (treeId, treeNode) {
                    var selectId = treeNode.no;
                    alert(selectId);
                    powerIframe.attr("src", "/AZAdmin/PermissionManage/Details?id=" + selectId);
                    return true;
                }
            }
        };
        AD.cm.formSubmit = function () {
            changeNode();
        }
        //获取改变节点
        function changeNode() {
            var changedNodes = zTree.getChangeCheckedNodes(); //获取改变的全部结点
            var chkArry = new Array(), delArry = new Array();
            for (var i = 0 ; i < changedNodes.length ; i++) {
                var treeNode = changedNodes[i];
                if (treeNode.checked) {
                    chkArry.push(treeNode.no);
                }
                else {
                    delArry.push(treeNode.no);
                }
            }
            if (chkArry.length > 0) {
                checkId.val(chkArry.join(","));
            }
            if (delArry.length > 0) {
                delId.val(delArry.join(","));
            }
        }
        //配置树
        function setTree() {
            var t = $("#power_tree");
            t = $.fn.zTree.init(t, setting);
            type = { "Y": "ps", "N": "ps" };
            t.setting.check.chkboxType = type;
            zTree = $.fn.zTree.getZTreeObj("power_tree");
        }
        setTree();
    }
    setPowerTree();
})  