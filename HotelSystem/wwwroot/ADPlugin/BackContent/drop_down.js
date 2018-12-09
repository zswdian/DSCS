//加载树菜单  需要参数  data-param='{"tag":"标识","level":4,"self":true}'
function loadSelectTree(obj) {

    //初始配置
    var _self = $(obj); 
    var _href = _self.data("href"), _name = _self.attr("name");
    var _option = _self.data("param");
    //插件配置
    var settings = $.extend({
        "id":null, 
        "level": 4,//查询级别
        "self": false,//包含本身
    }, _option); 
    if (!_href) {
        _href = "/SystemApi/DataClassify/GetTree?";
    }
    console.log(_href);
    _href += "id=" + settings.id + "&level=" + settings.level + "&self=" + settings.self;
    var _copy_lab = $('<label class="layui-btn foreign_lab">选择</label>');
    var _treeId = "tree_" + _name  ;
    var _copyTree = $("<ul class='classify_ul ztree' id='" + _treeId + "'></ul>");
     
    _self.after(_copy_lab).before(_copyTree);

    _copy_lab.click(showControl);
    _self.click(showControl);
    function showControl() {
        if (_copyTree.is(':visible')) {
            _copyTree.slideUp();
        }
        else {
            _copyTree.slideDown();
        }
    }
    var setting = {
        view: { 
            dblClickExpand: true,
            showLine: true,
            selectedMulti: false

        }, data: {
            simpleData: {   enable: true  }
        },
        async: {
            enable: true,
            url: _href,
        },
        callback: {
            beforeClick: function (treeId, node) {
                if (!node.isParent) {
                    _self.val(node.name);
                    _copyTree.hide();
                } 
            }
        }
    };
   
    function setTree() {
        var t = $.fn.zTree.init(_copyTree, setting);
        zTrees = $.fn.zTree.getZTreeObj(_treeId);
    }
    
    AD.fn.loadScript("ztree").done(function () { 
        setTree(); 
    }); 
}
