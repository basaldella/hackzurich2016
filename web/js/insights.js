
var currentEmails = null;
var currentEmailIndex = -1;


$( document ).ready(function() {
	loadEmails();
});

var mod = function (n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

$( "#nextEmailButton" ).click(function() {
	if (currentEmailIndex >= 0) {
		currentEmailIndex = (currentEmailIndex + 1) % currentEmails.length;
		console.log(currentEmailIndex);
		loadCurrentEmail();
	}
});


$( "#prevEmailButton" ).click(function() {
	if (currentEmailIndex >= 0) {
		currentEmailIndex = mod((currentEmailIndex - 1),currentEmails.length);
		console.log(currentEmailIndex);
		loadCurrentEmail();
	}
});


function loadEmails () {
	
	var targetUrl = "https://pub.cl.uzh.ch/projects/nccr/polcon/enron?p=emails&custodian=blair-l&tfidf=true&date=21%20Aug%202001";
	
	$.ajax({
		type: "GET",
		url: targetUrl,
		error: function(xhr, status, error) {
			console.log(error);
		}
	}).then(function(data) {
		
		console.log("<p class=\"text-right\">Number of emails retrieved: " + data.length + "</p>");
		currentEmails = data;
		currentEmailIndex = 0;
		loadCurrentEmail();
		
	});
	
}

function loadCurrentEmail() {
	
	$("#emailSelectorLabel").html("<p>Email " + (currentEmailIndex+1) + " of " + currentEmails.length + "</p>");
	
	$("#emailText").html(currentEmails[currentEmailIndex].body.replace(/(?:\r\n|\r|\n)/g, '<br />'));
	$("#emailSubject").html("<b>Subject:</b> " + currentEmails[currentEmailIndex].subject);
	$("#emailFrom").html("<b>From:</b> " + currentEmails[currentEmailIndex].from);
	$("#emailTo").html("<b>To:</b> " + currentEmails[currentEmailIndex].to);
	$("#emailDate").html("<b>Date:</b> " + currentEmails[currentEmailIndex].date);
	
	
	
	$("#tfidfTable").html("");
	
	var tfterms = currentEmails[currentEmailIndex].words.split(" "),
    i;

	for (i = 0; i < tfterms.length; i++) {
		
		$("#tfidfTable").append("<tr><td>"+
		i + "</td><td>" +
		tfterms[i] +
		"</td><td>" +
		"<button type=\"button\" class=\"btn btn-outline btn-primary\""+
		">Add to Search</button>" + 
		"</td></tr>");
	}
	
	doLanguageAnalysis();
}

function doLanguageAnalysis () {
		
	
	var googleEndpoint = 'https://language.googleapis.com/v1beta1/documents:annotateText?key=AIzaSyDfjGr-ZKwnORiBVZOi0ycZ6N65vP3a8Fs';
	var emailText = $("#emailText").text().trim();
	var googleData = '{ "document": {  "type": "PLAIN_TEXT",  "content": "';
	
	googleData = googleData.concat(emailText.replace(/[\""]/g, '\\"'));
	googleData = googleData.concat('" },"features":{"extractSyntax": true ,"extractEntities": true,"extractDocumentSentiment": true,}}');
	
	console.log("Querying Google Language APIs...");
	
	$.ajax({
		type: "POST",
		url: googleEndpoint,
		headers: {
			'Accept': 'application/json',
			'Content-type':'application/json'
		},
		data : googleData,
		error: function(xhr, status, error) {
			console.log(error);
		}
	}).then(function(data) {
		
		$("#entitiesTable").html("");
		for (var entity in data.entities) {
			
			var link = data.entities[entity].metadata.wikipedia_url;
			if (link == undefined) {
				link = "";
			} else {
				link = "<a href=\"" + link + "\">Link</a>"
			}
			
			$("#entitiesTable").append("<tr><td>"+
			entity +
			"</td><td>" + data.entities[entity].name + 
			"</td><td>"+ link +"</td><td>" + 
			data.entities[entity].type + "</td><td>" +
			"<button type=\"button\" class=\"btn btn-outline btn-primary\""+
			">Add to Search</button>" + 
			"</td></tr>");
		}
		
		var polarity = data.documentSentiment.polarity;
		console.log(polarity);
		
		if (polarity < -0.3) {
			$("#sentimentIconContainer").html('<i class="fa fa-frown-o fa-5x"></i>');
			$("#sentimentTextContainer").html('Negative');
			$("#sentimentPanel").attr('class', 'panel panel-red');
		} else if (polarity < 0.3) {
			$("#sentimentIconContainer").html('<i class="fa fa-meh-o fa-5x"></i>');
			$("#sentimentTextContainer").html('Neutral');
			$("#sentimentPanel").attr('class', 'panel panel-yellow');
		} else {
			$("#sentimentIconContainer").html('<i class="fa fa-smile-o fa-5x"></i>');
			$("#sentimentTextContainer").html('Positive');
			$("#sentimentPanel").attr('class', 'panel panel-green');
		}
		
	});
}

function appendSearch(queryString) {
		console.log(queryString);
}
