# 百度ife 阶段1任务10 Flexbox布局练习

## 基本内容

###flex container 和 flex items
这两项内容分管flex容器和flex容器内项目的样式表达

+ flex-container : 可以进行设置的属性有
	1. flex-direction
		row | row-reverse| column | column-reverse
		行列分管垂直和水平的flex布局,可以反向设置
	2. flex-wrap
		nowrap | wrap | wrap-reverse
		flex-wrap 设置的是当flex items 宽度不够时的处理，可以不换行、换行、或者反向换行
	3. flex-flow
		flex-direction || flex-wrap
		前两项的简写形式
	4. justify-content
		flex-start | flex-end | center | space-between | space-around
		用来标记容器中item的水平对齐方式，分别是 起点对齐、终点对齐、居中放置、分散顶格对齐、分散对齐
	5. align-content
		flex-start | flex-end | center | space-between | space-around
		类型同上，区别是标记的是辅轴的对齐方式。在wrap生效后有明显的作用
	6. align-items
		flex-start　| flex-end | center | baseline | stretch
		设置items的垂直对齐方式
+ flex-items : 可以进行设置的属性有
	1. order 调整位置
		<interger>
		属性值为一个无单位的整数，用来调整flex-item 在flex容器中的位置 默认为0 ，数值越小越靠起点，支持负值，切默认情况下，-1能够将元素在容器中置顶渲染
	2. flex-basis 基础宽度
		<width>
		属性值可以是任意的宽度值。用来设置默认的item宽度/高度
	3. flex-grow 分配多余空间
		<number>
		属性值为一个数字，且以该数字为比例基础分配容器剩下的主轴空间，初始值为0，即不分配空间。换句话说，不设置该项的话，item是不具备所谓的弹性的
	4. flex-shrink 分配减少空间
		<number>
		布局思想同上，区别在于前者是分配剩余量，该属性分配减少量，即可以控制在窗口尺寸减少的时候item的响应减少量，做到差量缩小，增加页面自适应的协调能力
	5. flex
		flex-grow || flex-shrink || flex-basis
		上三项的简写形式
	6. align-self
		auto | flex-start | flex-end | center | baseline | stretch
		设置单个item的辅轴对齐方式

##### Flexbox 有主轴、辅轴、容器、元素 几个概念，清晰的表达了布局所需要的各种样式。容器相关的设置，集中于行内元素的放置方法(`justify-content`,`align-content`)。而元素相关的设置，集中于对元素的尺寸及弹性进行规定(`flex`)，以及个元素之间的相对位置的规定(`align-items`,`order`,`align-self`)

### Flexbox 作为一种自适应方案是非常有用的，同样可以进行自适应的常用方案是使用 @media screen

两者方向相似但实现功能不同：
+ Flexbox 的适应能力很强，但往往不够精准，它能够应对大量不同的窗口尺寸进行自适应，但正应为是自动计算，导致在某些时候得不到我们想要的结果。
+ @media screen 则不同，所有的自适应效果都是我们手动设置的，精准性很好，而且在一定规模下是非常方便维护的，但是在多尺寸适应的时候往往需要大量的手动设置，效率低下且直接影响了维护的难度。

所以基于此，进行页面自适应的时候，需要综合两种方案各自的特点进行选择和取舍。
