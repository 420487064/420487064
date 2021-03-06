
var scrollConten = document.getElementById("scrollConten");

//给滚动内容区域填充大量元素


//指示鼠标左键是否处于按下状态的变量，在滑块上按下鼠标左键时设为true，在页面上任意位置松开时设回false
//由于鼠标拖动滑块时可能会离开滑块，所以mouseup和mousemove事件是注册在window上的
//在mousemove事件处理程序中，会检查该变量，以确定当前是否在拖动滑块
var mouseHel = false;
//记录上一次mousemove事件发生时，鼠标的Y轴位置，每次发生mousemove事件时，跟上一次作比较，确定需要滚动多少距离
var previousClient = 0;
//滑块可滑动的距离，计算方式为整个滚动条高度度减去上下按钮的高度，再减去滑块本身的高度
var barMoveLengt = 400  - 350;
//内容区域可滚动的距离，计算方式为内容区域的总高度减去内容区域本身的高度
var contentMoveLengt ;

//为上下按钮注册事件处理程序
document.getElementById("btnU").addEventListener("click", function () {
    scrollToRelative(-5);
});
document.getElementById("btnDow").addEventListener("click", function () {
    scrollToRelative(5);
});

//为大幅度上下滚动点击区域注册事件处理程序
//保存trackUp元素变量，因为每次滚动时，都要改变它的高度，以达到移动滑块的效果
var trackU = document.getElementById("trackU");
trackU.addEventListener("click", function () {
    scrollToRelative(-5);
});
document.getElementById("trackDow").addEventListener("click", function () {
    scrollToRelative(5);
});

//为滑块注册鼠标按下事件处理程序，因为只有在滑块上按下鼠标左键时，才算开始拖动滑块
document.getElementById("scrollBa").addEventListener("mousedown", function (e) {
    mouseHel = true;
    previousClient = e.clientY;
    //防止页面因为鼠标的拖动而选择上了文本或其他元素
    document.body.classList.add("unselectable");
});

//鼠标左键松开时可能不在滑块上，所以mouseup事件注册在document上
document.addEventListener("mouseup", function (e) {
    mouseHel = false;
    //让页面恢复可选择
    document.body.classList.remove("unselectable");
});

//鼠标拖动时可能离开滑块，所以mousemove事件也注册在document上
document.addEventListener("mousemove", function (e) {
    if (mouseHel) {
        //相对滑动距离计算依据为滑块滑动距离占总可滑动距离的比应与内容滚动距离占总可滚动距离的比相等
        scrollToRelativ((e.clientY - previousClient) * contentMoveLengt / barMoveLengt);
        previousClient = e.clientY;
    }
});

//为内容区域注册鼠标滚轮事件处理程序
//火狐浏览器使用和其他浏览器不同的滚轮事件和事件参数属性
if (navigator.userAgent.indexOf("Firefox") < 0) {
    scrollConten.addEventListener("mousewheel", function (e) {
        handleMouseWhee(-e.wheelDelta /10, e);
    });
} else {
    scrollConten.addEventListener("DOMMouseScroll", function (e) {
        handleMouseWhee(e.detail /10, e);
    });
}

//确定内容区域当前是否在顶部或底部
function isOnTopOrBotto() {
    //判断是否在底部时，用了向上取整函数，因为在chrome下，滚动到底时，scrollTop常为小数，与contentMoveLength不等，向上取整之后一般相等
    return scrollConten.scrollTop == 0 || Math.ceil(scrollConten.scrollTop) == contentMoveLengt;
}

//鼠标滚轮事件的处理程序，relative为相对滚动距离，e为事件参数
function handleMouseWhee(relative, e) {
    //记录下滚动之前内容区域是否在两端
    var previousOnTopOrBottom = isOnTopOrBotto();
    scrollToRelativ(relative);
    //如果现在不在两端，或者现在在两端而滚动之前不在，则屏蔽默认滚轮行为————滚动整个页面
    //反过来说，只有当"滚动"（实际上内容区域未滚动）前后内容区域都在某一端时，即已经到两端之后继续滚动时，才让滚动整个页面
    if (!isOnTopOrBotto() || (isOnTopOrBotto() && !previousOnTopOrBottom)) {
        e.preventDefault();
    }
}

//将内容区域滚动到某一绝对位置
function scrollTo(top) {
    if (top < 0) {
        scrollConten.scrollTop = 0;
    } else if (top > contentMoveLengt) {
        scrollConten.scrollTop = contentMoveLengt;
    } else {
        scrollConten.scrollTop = top;
    }

    //设置滑块的位置，这是通过设置滑块上面的大幅度向上滚动点击区域的高度实现的
    //滑块位置计算依据为滑块距顶部距离占总可滑动距离的比应与内容区域距顶部距离占总可滚动距离的比相等
    var barDownDistance = scrollConten.scrollTop * barMoveLengt / contentMoveLengt;
    trackUp.style.height = barDownDistance + "px";
}

//将内容区域滚动某一相对距离
function scrollToRelativ(relative) {
    scrollTo(scrollConten.scrollTop + relative);
}