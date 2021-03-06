// inherits from
ModalReply.prototype = new EventDispatcher();
ModalReply.constructor = ModalReply;

function ModalReply( overlay ) 
{
	var element 		= $('#modal-reply-template');
	var overlay			= overlay;
	var img				= null;
	var rendered		= false;
	var state			= 'closed';
	var self			= this;
	                	
	this.tweet			= null;
	this.open 	 		= open;
	this.twitterProxy 	= null;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{
		if( tweet ) setContent( tweet );
		self.tweet = tweet;
		if( state == 'closed') 
		{
			$('#reply-box').empty();
			writeTweetBox( tweet );
			showActionScreen();
			element.css('z-index', overlay.z+1)
			element.fadeIn(250);
			overlay.open();
		}
		
		position();
		state = 'open';
	}
	
	
	function onClose()
	{
		element.fadeOut(250);
		overlay.close();
		state = 'closed';
	}
	
	function setContent( t )
	{
		Log('status id')
		element.find('.confirmation').html('Your reply to @'+t.screenName+'<br />was sent to twitter.')
	}
	
	function position( animate )
	{				
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;	
		var height = element.height() / 2;
		var width = element.width() / 2;
		var top = (docY - height < 0) ? 10 : docY - height;
		var left = docX - width;
		
		var propObject = {};
		propObject.left = left;
		propObject.top = (self.tweet.verizonModule) ? 100 : top;
		if(animate)
		{ 
			element.animate(propObject, 250);
		}else{
			element.css(propObject);
		}
	}

	function decorateBTNS()
	{
		
		var cBtn = element.find('.close-button');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var cancelBtn = element.find('.modal-cancel-button');
		cancelBtn.click(onClose);
		cancelBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var okBtn = element.find('.modal-confirm-button');
		okBtn.click(onClose);
		okBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
	}
	
	function showConfirmScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		es.hide();
		as.hide();
		cs.show();
	}
	
	
	function showActionScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		es.hide();	
		cs.hide();
		as.show();
	}
	
	
	function showErrorScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		es.show();
		as.hide();
		cs.hide();
	}
	
	
	function initCSS()
	{
		element.css('position', 'fixed');
	}
	
	
	function writeTweetBox( t )
	{
		
		var tObj =	{
 			    		height: 70,
 			    		width: 230,
 			    		defaultContent: '@'+t.screenName,
 						complete: complete,
 			    		label: "",
						onTweet : showConfirmScreen,
 						data:{ 'in_reply_to_status_id' : t.tweetID } 
 			  		};

		self.twitterProxy.getTweetBox('#reply-box', tObj);
	}
	
	function complete()
	{
		styleTweetBox();
	}
	
	function styleTweetBox()
	{
		var box = $("#reply-box iframe").contents().find("textarea");
		Log(' styling modal reply box css:'+box.css('font'));
		var button = $("#reply-box iframe").contents().find("button").parent();
		var formButton = $("#reply-box iframe").contents().find("button");
		label = $(".action-screen iframe").contents().find("label");
		counter = $(".action-screen iframe").contents().find("#counter");
		var fontSize = label.css('fontSize');	
		label.css('font-size', 12);
		label.css('color', "#fff");
		counter.css('position', 'absolute');
		counter.css('color', "#fff");
		counter.css('left', '260px');
		counter.css('top', '5px');
		counter.css('text-align', 'right');
		counter.css('width', 80);
		counter.css('font-size', 12);
		box.css('background', 'transparent');
		box.css('color', '#fff');
		button.css('background', '#D53D36');
		button.css('border', 'none');
		formButton.css('color', '#000');
		formButton.css('text-shadow', 'none');
		formButton.css('font-size', '12px');
		formButton.css('font-weight', 'bold');
		formButton.css('text-transform', 'uppercase');
	};
	
	return this;
};
