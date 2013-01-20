WTF?
======================
	(WHY the fork? - what did you think it would be?)
## Reasons
	Try to fix couple shortcomings
		Allow multiple similar chained elements
		Extra events, hooks added to enhance customization

## Compatibility
	Implemented the original flow as the default, no need to break existing code
	
## What Are Changed
	Options were being passed as an argument but they were not used within chained.remote.js file (maybe in .chained file but I did not check)
	
	I extended options with some defaults and implemented few functionalities that depend upon these options.
	
	Added attribute "chained_query_key" that overrides "id" attribute if it exists and not unless the option is set to false.
		This method allows multiple elements to query the same url from the same page.
		This defines what will be used as the query parameter -> ids can be used only once a page, so previously you could not query the same parameter without server side tricks

	Added "query_lambda" attribute that can define data parameter to be submitted to the url, hence allowing more complex queries to be sent.
	
	Added "json_converter" lambda attribute, if it does not evaluate to false, it will parse json and return a new one.
	
	Added event "chained_remote_response_received"
		This event is fired after json is received parsed and change is triggered on the select
	
	Added event "chained_remote_response_processed"
		This event is fired after everything is processed and is about to quit the $.getJSON response scope.

## Default options

	var default_options = {
		invalid_data : ['', '0', '--'],
		query_key : 'chained_query_key',
		query_lambda : false,
		json_converter : false,
		response_received : 'chained_remote_response_received',	//set to false if you don't want it to trigger
		response_processed : 'chained_remote_response_processed'	//set to false if you don't want it to trigger
	};

## Usage

	$(function() {
	  $("#remote_test_1_b").remoteChained("#mark-remote", "json.php");//classic example using id
	  $("#remote_test_1_c").remoteChained("#remote_test_1_b, #mark-remote", "json.php", { 
			query_lambda : function( $this ){
				var data = { "unused_field" : "multiple paramaters are possible" }, 
				id = $this.attr('chained_query_key');
				if( ! id ){ id = $this.attr('id'); }
				console.log($this);
				data[id] = $this.val();
				return data;
			} 
		} );

## New Events Usage
	$(document).bind('chained_remote_response_received', function(event, url, data, json){
		console.log(event);
		console.log(url);
		console.log(data);
		console.log(json);
	});

	$(document).bind('chained_remote_response_processed', function(event, id, json){
		console.log(event);
		console.log(id);
		console.log(json);
	});

