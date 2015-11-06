(function() {
	'use strict';
	
	angular.module('app.controllers')
	.filter('fromNow', fromNow)
	.filter('NowTime', NowTime)
	.filter('removeTag', removeTag);
	function NowTime(){
		return function(input,params){
			return moment.unix(input).format('ll');
		}
	}
	function fromNow(){
		return function(input,params){
			return moment.unix(input).fromNow();
		}
	}
	function removeTag(){
		return function(input,params){
			input = input.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            input = input.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            input = input.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            input =input.replace(/ /ig,'');
            return input;
		}
    }
});