// 2019-03-27

const VRender = require(__vrender);


const $ = VRender.$;
const Utils = VRender.Utils;

const SideMenu = VRender.UIView.extend(module, {
	id: "main-sidemenu",
	ref: "mainSideMenu",

	renderView () {
		SideMenu.super(this);
		this.renderMenus();
	},

	renderMenus () {
		let target = $(".menus").appendTo(this.$el);
		Utils.each(menus, (group) => {
			let menuGrp = $(".menu-grp").appendTo(target);
			$(".title").appendTo(menuGrp).text(group.name);
			let subMenus = $(".submenus").appendTo(menuGrp);
			Utils.each(group.children, (temp) => {
				let menu = $(".menu").appendTo(subMenus);
				menu.attr("name", temp.name);
				$("span.title").appendTo(menu).text(temp.title);
				$("span.subtitle").appendTo(menu).text(temp.subTitle);
			});
		});
	}
});

const menus = [{
	name: "基础", 
	children: [
		{name: "button", title: "Button", subTitle: "按钮"}
	]
}, {
	name: "表单",
	children: [
		{name: "checkbox", title: "Checkbox", subTitle: "多选框"},
		{name: "dateinput", title: "DateInput", subTitle: "日期输入框"},
		{name: "datepicker", title: "DatePicker", subTitle: "日期选择器"},
		{name: "daterange", title: "DateRange", subTitle: "起止日期输入框"},
		{name: "datetime", title: "DateTime", subTitle: "日期时间输入框"},
		{name: "form", title: "Form", subTitle: "表单视图"},
		{name: "input", title: "Input", subTitle: "文本输入框"},
		{name: "radiobox", title: "Radiobox", subTitle: "单选框"},
		{name: "select", title: "Select", subTitle: "下拉选择框"},
		{name: "timeinput", title: "TimeInput", subTitle: "时间输入框"},
		{name: "upload", title: "Upload", subTitle: "文件上传"}
	]
}, {
	name: "数据集",
	children: [
		{name: "list", title: "List", subTitle: "列表视图"},
		{name: "table", title: "Table", subTitle: "数据网络"},
		{name: "tree", title: "Tree", subTitle: "树形视图"},
		{name: "treeselect", title: "TreeSelect", subTitle: "树形下拉选择框"}
	]
}, {
	name: "容器",
	children: [
		{name: "chkgrp", title: "CheckGroup", subTitle: "多选组"},
		{name: "container", title: "Container", subTitle: "边框容器"},
		{name: "group", title: "Group", subTitle: "组视图"},
		{name: "panel", title: "Panel", subTitle: "面板"},
		{name: "radgrp", title: "RadioGroup", subTitle: "单选组"},
		{name: "scroll", title: "Scroll", subTitle: "滚动加载"}
	]
}, {
	name: "导航",
	children: [
		{name: "paginator", title: "Paginator", subTitle: "分页"},
		{name: "popupmenu", title: "PopupMenu", subTitle: "弹出菜单"},
		{name: "tabbar", title: "Tabbar", subTitle: "标签栏"}
	]
}, {
	name: "其他",
	children: [
		{name: "confirm", title: "Confirm", subTitle: "确认对话框"},
		{name: "dialog", title: "Dialog", subTitle: "对话框"},
		{name: "message", title: "Message", subTitle: "提示框"},
		{name: "notice", title: "Notice", subTitle: "通知"}
	]
}];