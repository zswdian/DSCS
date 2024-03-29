﻿

function OrganizationTree(_asyncUrl) {
    var checkId = $("#departmentId"), zTree;
    //初始配置
    var setting = {
        check: {
            enable: true,
            chkStyle: "checkbox",
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
        var chkArry = new Array(), nameArry = new Array();
        for (var i = 0 ; i < changedNodes.length ; i++) {
            var treeNode = changedNodes[i];
            if (treeNode.checked) {
                chkArry.push(treeNode.no);
                nameArry.push(treeNode.name);
            }    
        }
        if (chkArry.length > 0) {
            checkId.val(chkArry.join(","));
            window.parent.GetOrganization(chkArry, nameArry);
            var _parent = window.parent == null ? window : window.parent;
            _parent.layer.close(_parent._openIndex);

        }    
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

OrganizationTree("/SystemMsg/Messagess/shows");