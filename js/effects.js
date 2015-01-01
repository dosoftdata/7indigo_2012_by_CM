// JavaScript Document
(function( $ ){
	var settings = {
		defaultScrollingColumn:"#rightContent",
		contentSet:null
	};
	var scrollTimer = 0;
	var animating = true;
	var shouldAnimate = true;
	
	var methods = {
		init:function(options){
			var pp = this;
			adjustColumnPos();
			return this.each(function(){				
				var $this = $(this), 
					data = $this.data("scollerCooder")
				
				$.extend(settings, options);
				$(pp).scroll(onWindowScroll);
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					$this.data("scollerCooder", {
						target : $this
					});
				}
				//$("#r_brand").bgSlider({speedY:+1});
			});
		}
	};
	
	adjustColumnPos = function()
	{
		$(settings.defaultScrollingColumn).css("bottom", 0);
	}
	
	onWindowScroll = function()
	{	
		$(settings.defaultScrollingColumn).css("bottom", - $(this).scrollTop());
	}
	
	$.fn.scollerCooder = function(method) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jquery.scollerCooder' );
		}
	};
})( jQuery );


xylem = {
	TransitionManager : function(cs,e,sectionReachedCB,sectionChangedCB){
		var scrollTimer = 0;
		var scrollColumn = e;
		var contentSet = cs;
		var sectionReached = sectionReachedCB;
		var sectionChanged = sectionChangedCB;
		var oldTarget;
		var oldSectionTarget;
		var animatingToSection = false;
		
		var tm = this;
		
		this.initialize = function(){
			scrollColumn = e;
			e.scollerCooder();
			e.scroll(onWindowScroll);
		}
		
		this.scrollToSection = function(s){
			var target = $(s);
			animatingToSection = true;
			
			$('html,body').stop();
			$('html,body').animate({scrollTop: target.offset().top}, 600, onScrollAnimationFinished);
		}
		
		var onScrollAnimationFinished = function(){
			animatingToSection = false;
		}
		
		this.onScrollFinished = function()
		{
			//find the closest element
			var target = getNearestSection();
		
			sectionChanged.apply(target,[(oldSectionTarget == undefined || target.attr('id') != oldSectionTarget.attr('id'))]);
			
			oldSectionTarget = target;
		}
		
		var onWindowScroll = function()
		{
			var target = getNearestSection();
			if(oldTarget == undefined || target.attr('id') != oldTarget.attr('id'))
			{
				oldTarget = target;
				sectionReached.apply(target);
			}
			clearTimeout(scrollTimer);
			if(!animatingToSection) scrollTimer = setTimeout( tm.onScrollFinished, 1000 );
		}
		
		var getNearestSection = function(){
			var targetOffset = 1000000000;
			var closestTarget;
			contentSet.each(function(){
				
				if(Math.abs($(scrollColumn).scrollTop()-$(this).offset().top)<=targetOffset)
				{
					closestTarget = $(this);
					targetOffset = Math.abs(scrollColumn.scrollTop()-$(this).offset().top);
				}
			});
			return closestTarget;
		}
	}	
}

function onAddressChange(e){
	var addressArr = e.value.split("/");
	var addressSecVal = addressArr[1];
	var addressSubSecVal = addressArr[2];
	
	pendingSection = addressSecVal;
	
	if(addressSecVal.length>0)tm.scrollToSection("#l_"+addressSecVal);
	if(addressSubSecVal && addressSubSecVal.length>0) pendingSubSection = addressSubSecVal;
}

function onSectionChange(){
	
	//alert($(this).attr("id"));
	//alert($('.must').last().attr("id"));
	if( $(this).attr("id") == 'r_banner')
	{
		$("#footer").animate({"bottom":0});
	}
	else if(parseInt($("#footer").css("bottom"),10)==0)
	{
		$("#footer").animate({"bottom":-$("#footer").outerHeight(true)});
	}
	if( $(this).attr("id") == $('.must').first().attr("id"))
	{
		$("#short-menu").animate({"top":-40});
	}
	else if(parseInt($("#short-menu").css("top"),10)==-40)
	{
		$("#short-menu").animate({"top":0});
	}
}

function onSectionChangeFinished(vDiffSection){
	var addressArr = $.address.value().split("/");
	var addressSecVal = addressArr[1];
	var addressSubSecVal = (pendingSubSection && pendingSubSection.length>0)? pendingSubSection:"";
	var $me = $(this);
	
	$.address.value($me.attr('id').substring(2)+"/"+addressSubSecVal);
	$.address.update();
	
	var resetFunction = $me.data('resetFunction');
	if(resetFunction && vDiffSection) resetFunction.apply();
	if(pendingSubSection && pendingSubSection.length>0) 
	{
		pendingSubSection="";
	}
}


function onContentButtonClick()
{
	var rootVal = $.address.value().split("/")[1];
	var gotoAddr = rootVal+"/"+$(this).attr("data-content");
	
	$.address.value(gotoAddr);
	$.address.update();
}

// what happens when the page is resized? THIS IS WHAT HAPPENS!
function resizeReposition()
{
	$(".content, .fullHeightListener").height($(window).height());
	if(addressInitialized)tm.onScrollFinished();
}

function onWindiwResize()
{
	resizeReposition();
}


var tm;
var tMenu;
var visibleArrow;
var addressInitialized = false;
var pendingSection;
var pendingSubSection;

$(document).ready(function(e) {
	
	$("#container").fadeIn();
	
	tm = new xylem.TransitionManager($('.must'),$(window),onSectionChange,onSectionChangeFinished);
	tm.initialize();
	
	resizeReposition();
	$(window).resize(onWindiwResize);
	//$(".contentButton").click(onContentButtonClick);
	
	$.address.init(function(e){
		addressInitialized = true;
		//initializes the page
		$(window).trigger('scroll');
	}).change(onAddressChange);	
	brand_height=$("#l_brand").height();
	var height_content=(brand_height/2)-100;
	if(brand_height>"700"){
		toDivide=brand_height-700;
	}
   	$("#l_brand .contentOuter").css('height',height_content+'px');
});
$(document).ready(function () {
    /*$("body").queryLoader2({
        barColor: "#fff",
        backgroundColor: "#000",
        percentage: true,
        barHeight: 1,
        completeAnimation: "fade",
        minimumTime: 100
    }); */  
    
    
	//TWITTER
	var username='vg_shoes'; // set user name
	var format='json'; // set format, you really don't have an option on this one
	var url='http://api.twitter.com/1/statuses/user_timeline/'+username+'.'+format+'?callback=?'; // make the url

	$.getJSON(url,function(tweet){ // get the tweets
		var d = new Date();
		var html='<img  src="wp-content/themes/valentinagallo/images/social/tweet.png"/><br/><div class="tweet">'+tweet[0].text+'</div><br/><br/><img  src="wp-content/themes/valentinagallo/images/social/tweet.png"/><br/><div class="tweet">'+tweet[1].text+'</div>';
		
		
		$("#tweet").html(html); // get the first tweet in the response and place it inside the div
	});
	
	
	//gallery hover 
	$('.image-hover').click(function(){
		$('#gallery_overlay #gallery_image').attr('src' , $(this).parent().find('.slidesControl img:visible').attr('src-big'));
		var parentHeight = $('#gallery_overlay').height();
		var childHeight = $('#gallery_image').height();
		
		numImg=$(this).parent().find('.slidesControl img:visible').attr('img-num');
		if(numImg=="1"){
			$('.name_shoes').html('ELISA');
			$('.description_shoes').html('Elisa by Valentina Gallo represents elegance and passion. It is a jewel desiring to be admired. The color red not only symbolizes Italyâ€™s well renowned fashion, but most importantly compliments every ladies beauty and will make her feel special. Elisaâ€™s heel measures 125mm, with a platform of 35mm. The shape is really comfortable, thanks to the soft material, 100% camoscio leather. The handcrafted decoration has more than 500 real swarovskys by Swarovsky Cristalized. Completely Made in Italy. ');
		}
		else if(numImg=="2"){
			$('.name_shoes').html('ELISA (black)');
			$('.description_shoes').html('Elisa by Valentina Gallo is representative of elegance and passion, much like a jewel that desires to be admired. Elisaâ€™s heel measures 125mm, with a platform of 35mm. The shape allows for extreme comfortability thanks to the soft material, 100% camoscio leather. The handcrafted decoration has more than 500 authentic swarvosky crystals by Swarovsky Cristalized. Completely designed and Manufactured in Italy.');
		}
		else if(numImg=="3"){
			$('.name_shoes').html('MARTA');
			$('.description_shoes').html('Marta by Valentina Gallo is the expression of the handcrafted Italian beauty. The pair represents elegance and preciousness, with a luxurious decoration and a light silhouette. Martaâ€™s heel measures 125mm, with a platform of 35mm. The shape is really comfortable, thanks to the soft material, 100% camoscio leather. Marta is enhanced with real swarovskys by Swarovsky Cristalized. Completely Made in Italy.');
		}
		else if(numImg=="4"){
			$('.name_shoes').html('DIANA (Floral)');
			$('.description_shoes').html('Diana by Valentina Gallo is a beautifully handcrafted shoes, the perfect way to wear Italian fashion, making every woman feel elegant but at the same time trendy. The wrap around pair has a really comfortable fit. Diana is been designed in black or colored floral, with a polished strap, 100% leather, completely Made in Italy. Dianaâ€™s heel measures 125mm, with a platform of 35mm.');
		}
		$('.gallery_overlay_content').css('margin-top', ((parentHeight - childHeight) / 2)-100);
		$('#gallery_overlay').fadeIn();
	})
});
function open_designer(){
	$('#designer_overlay').fadeIn();
}
function open_designer_right(){
	$('#designer_overlay').fadeIn();
}
function close_designer(){
		$('#r_designer .content').fadeOut('fast', function(){ 
 	    	text='<div class="position"><div class="designer_text_right"><div class="text">Valentina Gallo is an Italian designer with an eye for creativity, a love for design and a passion for handcrafted products.Growing up in The Marche Region in Italy, â€œThe land of the shoesâ€....<br/><br/><br/><span class="read_more"><a onclick="open_designer_right();">read more</a></span></div></div></div>';
  			$('#r_designer .content').css('background-image',"url('wp-content/themes/valentinagallo/images/designer/bg_designer_right.jpg')");
  			$('#r_designer .content').css('background-position','left bottom');
  			$('#r_designer .content').css('background-repeat','no-repeat');
  			$('#r_designer .content').css('background-size','cover');
  			$('#r_designer .content').html(text);	
  		});
  		
  		$('#l_designer .content').fadeOut('fast', function(){  
  			text='<div class="image_text"><img  src="wp-content/themes/valentinagallo/images/designer/designer.png"/><div class="description">Valentina Gallo is an Italian designer with an eye for creativity, a love for design and a passion for handcrafted products. Growing up in The Marche Region in Italy, "The land of the shoes"....<div class="read_more"> <a onclick="open_designer();">Read More</a></div></div></div>';
  			$('#l_designer .content').css('background-image',"url('wp-content/themes/valentinagallo/images/designer/bg_designer_left.jpg')");
  			$('#l_designer .content').css('background-position','right bottom');
  			$('#l_designer .content').css('background-color','#fff');
  			$('#l_designer .content').css('position','relative');
  			$('#l_designer .content').css('background-size','cover');
  			$('#l_designer .content').css('background-repeat','no-repeat');
  			$('#l_designer .content').css('display','table');
  			$('#l_designer .content').html(text);
  			$('#r_designer .content').fadeIn('fast');
  			$('#l_designer .content').fadeIn('fast');	
  		});
  	}
  	
 $(function() {
  $(".send").click(function() {
     var name = $("#name_form").val();
		if (name == "") {
      		$(".error_form").show();
      		$("#name_form").focus();
      		return false;
    	}
		var email = $("#email_form").val();
		if (email == "") {
      		$(".error_form").show();
      		$("#email_form").focus();
      		return false;
    	}
		
		var message = $("#message_form").val();
		if (message == "") {
      		$(".error_form").show();
      		$("#message_form").focus();
      		return false;
    	}
    	var phone = $("#phone_form").val();
    	
    	var dataString = 'name='+ name + '&email=' + email + '&message=' + message + '&phone='+ phone;
		$.ajax({
      		type: "POST",
      		url: "index.php",
      		data: dataString,
      		success: function() {
      			$('.error_form').fadeIn(1500).hide();
        		$('.complete_form').fadeIn(1500).show();
      		}     	
      	});
    return false;
	});
	$(".send_newsletter").click(function() {
    	var email = $("#email_form_newsletter").val();
		if (email == "") {
      		$(".error_form").show();
      		$("#email_form_newsletter").focus();
      		return false;
    	}
		
    	var dataString = 'email_newsletter=' + email;
		$.ajax({
      		type: "POST",
      		url: "index.php",
      		data: dataString,
      		success: function(data) {
      			$('.error_form').fadeIn(1500).hide();
        		$('.complete_form').fadeIn(1500).show();
      		}     	
      	});
    return false;
	});
});

$(document).ready(function(){
	$('#l_home .content, #r_home .content, #l_brand .content, #r_designer .content, #l_collection .content, #r_collection .content, #l_news .content, #l_social .content, #r_social .content').css({backgroundSize: "cover"});  
	 $(' #r_brand .content, #l_designer .content, #l_banner .content, #r_banner .content, #designer_overlay,#l_campaign .content, #r_campaign .content').css({backgroundSize: "cover"});
	 $('.designer_text_right').css({backgroundSize: "cover"});

	$('.menu_brand').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_designer').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_collection').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_news').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_blog').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_e-commerce').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_social').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_contact').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$(this).css('color', '#b90f1c').fadeIn(6000);
	});
	$('.menu_home').click(function() {
		$('#short-menu a').css('color', '#ffffff');
	});
	$('.logo a').click(function() {
		$('#short-menu a').css('color', '#ffffff');
	});
	$('.m_brand').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_brand').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_designer').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_designer').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_collection').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_collection').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_news').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_news').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_blog').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_blog').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_e-commerce').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_e-commerce').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_social').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_social').css('color', '#b90f1c').fadeIn(6000);
	});
	$('.m_contatti').click(function() {
		$('#short-menu a').css('color', '#ffffff');
		$('.menu_contact').css('color', '#b90f1c').fadeIn(6000);
	});
	numfoto='1';
	function fadeIn() {
		if(numfoto=='4'){
			numfoto='1';
		}
	 	$img='wp-content/themes/valentinagallo/images/campaign/photo_'+numfoto+'_right.jpg'
		$('#r_campaign .content').fadeTo('slow', 0.3, function(){
	    	$(this).css('background-image', 'url(' + $img + ')');
	    }).fadeTo('slow', 1);
	    $imgleft='wp-content/themes/valentinagallo/images/campaign/photo_'+numfoto+'_left.jpg'
		$('#l_campaign .content').fadeTo('slow', 0.3, function(){
	    	$(this).css('background-image', 'url(' + $imgleft + ')');
	    }).fadeTo('slow', 1);
	  numfoto++;
	  setTimeout(fadeIn,3500);
	}
	
	function startAnim() {
	  setTimeout(fadeIn,3000);
	}
	startAnim();
});