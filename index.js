$(function() {
	
	Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
	}
	
	Storage.prototype.getObj = function(key) {
		return JSON.parse(this.getItem(key))
	}
	
	if (localStorage.firstRun) {
	  for (var key in localStorage){
		if(key.includes("NOTE")){
			var data = localStorage.getObj(key, data);
			createNote(key, data);
		}
	  }
	} else {
	  localStorage.firstRun = 1;
	  var id = "NOTE"+String.fromCharCode(65+Math.floor(Math.random()*26))+Date.now()+String.fromCharCode(65+Math.floor(Math.random()*26));
	  var data = ["write your sticky notes here..", "40%", "40%", "13"]
	  createNote(id, data);
	}

	function createNote(id, data) {

	  $('#container').append('<div id='+id+' class="card">\
							  <div id="drag"><img src="assets\\drag.svg" style="width: 1em; height: 1em;"></div>\
							  <div id="delete"><img src="assets\\delete.svg" style="width: 1em; height: 1em;"></div>\
							  <p id="content" contenteditable="true">'+data[0]+'</p></div>');
							  
	  $('#'+id).css({"left": data[1], "top": data[2], "z-index": data[3]});
	  
	  localStorage.setObj(id, data);
	  
	  $('#'+id+' > #delete').hover(
		function(){$('#'+id).addClass("delete_highlight")},
		function(){$('#'+id).removeClass("delete_highlight")}
	  );

	  $('#'+id+' > #drag').hover(
		function(){$('#'+id).addClass("drag_highlight")},
		function(){$('#'+id).removeClass("drag_highlight")}
	  );

	  $('#'+id).draggable({containment: "#container", scroll: false,
						   handle: "#drag",  stack: ".card",
						   stop: function() {
						      var content = localStorage.getObj($(this).attr('id'));
							  content[1] = $(this).css("left");
							  content[2] = $(this).css("top");
							  content[3] = $(this).css("z-index");
							  localStorage.setObj($(this).attr('id'), content); 
						   }
	  });
	}
	
	$("#add").click(function(){
		localStorage.firstRun = 1;
		var id = "NOTE"+String.fromCharCode(65+Math.floor(Math.random()*26))+Date.now()+String.fromCharCode(65+Math.floor(Math.random()*26));
	    var data = ["write your sticky notes here...", "40%", "40%", "13"]
		createNote(id, data);
	});
	
	$("#clear").click(function(){
		$(".card").remove();
		localStorage.clear();
	});
	
	$("#info").hover(function(){
		$("#information").animate({width: "toggle"});
	}); 

	$( ".card" ).resizable({
	  handles: "se"
	});
	
	$('html, body').css({
    overflow: 'hidden',
    height: '100%'
});

	
	$("#container").on("click", "#delete", function(){
		localStorage.removeItem($(this).parent().attr('id'));
		$(this).parent()[0].remove();
	});
	
	$("#container").on("input", "#content", function(){
		var content = localStorage.getObj($(this).parent().attr('id'));
		content[0] = $(this).html().replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>").replace(/<br>/g, "").replace(/<p>/g, "<br>").replace(/<\/p>/g, "");
		localStorage.setObj($(this).parent().attr('id'), content);
	});

});