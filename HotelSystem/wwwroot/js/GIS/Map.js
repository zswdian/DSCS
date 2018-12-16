var map = new AMap.Map('mapcenter', {
    center: [107.43, 28.56],
    resizeEnable: true, //是否监控地图容器尺寸变化
    zoom: 11,
    pitch: 10, // 地图俯仰角度，有效范围 0 度- 83 度
    viewMode: '3D', // 地图模式
    mapStyle: 'amap://styles/blue', //设置地图的显示样式

});