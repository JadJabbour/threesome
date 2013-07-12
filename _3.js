/**********************************************************************************
threesomeJS ( _3 ):
-----------------------
	_3 (threesomeJS) is for experimental purposes. Using it, one can build web-apps 
	with un-conventional/experimental architectures. The source is not minified in
	order to allow anyone at any point to manipulate the way it behaves; And do
	share with me your changes and thoughts either via twitter or via GitHub.
	[links below]

	I hope someone finds this useful and/or playfull! :)

	Peer review is more than welcome, your thoughts and ideas about this
	(as harsh as they are) are very important to me.

AUTHOR:
-------
	Jad A. Jabbour
	Pink Floyd, Daft Punk, Tolkien, H. Miller, AC. Doyle, code & alcohol. Charly passes by a lot; 
	It's alright though. Rainbow writer/Code ninja.  ·  Beirut, Lebanon.

	Blog: medium.com/@JadChronicles
	GitHub: /JadJabbour
	Twitter: @JadChronicles

GNU/GPL LICENSE: 
----------------
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/gpl.html>.
*********************************************************************************/

/*
Notes:
1- file including ( css and javascript ) not working properly
2- post feature tuning
*/

//_3 namespace//
////////////////

var _3 = { };
////////////////
/*_3 namespace*/

//Page object constructor & prototype//
///////////////////////////////////////

//method: configurePage (configures PAGE object)
//params: _source (JSON object)
//return: _3.Page
_3.Page.prototype.configurePage = function(_source) {
	this.source = this.helper.IsNullOrEmpty(_source.source) ? this.log('error', 'SOURCE not specified') : _source.source;
	this.container = this.helper.IsNullOrEmpty(_source.container) ? this.log('error', 'CONTAINER not specified') : _source.container;
	this.dataRepo =  this.helper.IsNullOrEmpty(_source.dataRepo) ? this.createDateRepo() : _source.dataRepo;
	return this;
};

//method: loadFiles (loads the css & javscript files to be included[dependencies]) 
//params: doInject (boolean to flag whether the files should be loaded in the DOM)
//return: _3.Page
_3.Page.prototype.loadFiles = function (doInject){
	this.reqHandle.get(this, 'files', function (_parameters){ 
		if(_parameters.withpop){
			_parameters.page.pop();
		}
	}, doInject, null);
	return this;
};

//method: loadFront (loads the html) 
//params: reload_flag (whether the value of Page.html should reload or not)
//params: with_pop (should the changes be reflected on the screen)
//return: _3.Page
_3.Page.prototype.loadFront = function(reload_flag, with_pop) {
	if(this.helper.IsNullOrEmpty(this.html) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
		this.reqHandle.get(this, 'html', function (_parameters){ 
			if(_parameters.withpop){
				_parameters.page.pop();
			}
		}, with_pop, null);
	}
	else{
		if(with_pop){
			this.pop();
		}
	}
	return this;
};

//method: loadData (loads the data[JSON]) 
//params: reload_flag (whether the value of Page.json should reload or not)
//params: with_pop (should the changes be reflected on the screen)
//return: _3.Page
_3.Page.prototype.loadData = function (reload_flag, with_pop){
	if(this.helper.IsNullOrEmpty(this.json) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
		this.reqHandle.get(this, 'json', function (_parameters){ 
			if(_parameters.withpop){
				_parameters.page.pop();
			}
		}, with_pop, null);
	}
	else{
		if(with_pop){
			this.pop();
		}
	}
	return this;
};

//method: loadFunctionality (loads the page functionality[Javascript]) 
//params: reload_flag (whether the value of Page.javascript should reload or not)
//params: with_pop (should the changes be reflected on the screen)
//return: _3.Page
_3.Page.prototype.loadFunctionality = function (reload_flag, with_pop){
	if(this.helper.IsNullOrEmpty(this.javascript) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
		this.reqHandle.get(this, 'javascript', function (_parameters){ 
			if(_parameters.withpop){
				_parameters.page.pop();
			}
		}, with_pop, null);
	}
	else{
		if(with_pop){
			this.pop();
		}
	}
	return this;
};

//method: load (loads all 3 aspects + files) 
//params: reload_flag (whether the value of Page should reload or not)
//params: with_pop (should the changes be reflected on the screen)
//return: _3.Page
_3.Page.prototype.load = function (reload_flag, with_pop){
	this.loadFiles(with_pop);
	this.loadFront(reload_flag, with_pop);
	this.loadData(reload_flag, with_pop);
	this.loadFunctionality(reload_flag, with_pop);
	return this;
};

//method: load (loads all 3 aspects + files and automatically refreshes the values and pops them) 
//return: _3.Page
_3.Page.prototype.update = function (){
	this.loadFiles(true);
	this.loadFront(true, true);
	this.loadData(true, true);
	this.loadFunctionality(true, true);
	return this;
};

//method: serializePage (serializes the _3.Page object) 
//return: serialized string
_3.Page.prototype.serializePage = function (){
	return this.parser.serializeObject({ source : this.source, html : this.html, javascript : this.javascript, json : this.json, container : this.container });
};

//method: pop (renders the _3.Page in the specified container) 
//return: _3.Page
_3.Page.prototype.pop = function (){
	if(!this.helper.IsNullOrEmpty(this.html) && !this.helper.IsNullOrEmpty(this.javascript) && !this.helper.IsNullOrEmpty(this.json)){
		this.helper.el(this.container).innerHTML = this.parser.bindDataToScreen(this);
		this.parser.addHeadFiles(this);	
		this.parser.bindScript(this);
	}
	return this;
};

//method: post (posts data back to the api) 
//params: postData (data that is being sent to the server)
//params: responseFormat (expected response format['json' | 'javascript'])
//params: IsInPostResponseRepo (bool that flags whether the response should be stored or parsed)
//return: _3.Page
_3.Page.prototype.post = function (postData, responseFormat, IsInPostResponseRepo){
	var data = this.reqHandle.buildPostData(this, postData, responseFormat);
	var callback = null;
	if(!this.helper.IsNullOrEmpty(data)){
		if(responseFormat == 'json'){
			if(IsInPostResponseRepo){
				callback = function (_parameters){
					_parameters.page.injector.pushToRepo(this, _parameters.response.responseText);
				}
			}
			else{
				callback = function (_parameters){
					_parameters.page.injector.data(this, _parameters.response.responseText);
				}
			}
		}
		if(responseFormat == 'javascript'){
			callback = function (_parameters){
				_parameters.page.injector.script(_parameters.response.responseText);
			}
		}
		this.reqHandle.post(this, 'post', data, null, null, callback);
	}
	else{
		this.log('error', 'Object is empty.');
	}
	return this;
};

//method: getDataRepo (gets the responses stored in the dataRepo of _3.Page object) 
//return: stored data as JSON
_3.Page.prototype.getDataRepo = function(){
	return JSON.parse(this.helper.el(this.dataRepo).innerText);
};

//method: addToDataRepo (stores data in the dataRepo of _3.Page object) 
//params: data (data that is to be stored)
//return: name of the object (signed with timestamp) of the newly added json
_3.Page.prototype.addToDataRepo = function (data){
	var timesign = "data_" + new Date().getTime().toString();
	this.helper.el(this.dataRepo).innerText += "," + timesign + "={" + JSON.stringify(data) + "}";
	return timesign;
};

//method: createDateRepo (if _3.Page object has no assigned data repo, this will create it) 
//return: ID of newly created data repo
_3.Page.prototype.createDateRepo = function (){
	var element = document.createElement('input');
	element.type = 'hidden';
	element.id = this.container + "_dr_" + new Date().getTime().toString();
	document.getElementsByTagName('body')[0].appendChild(element);
	return element.id;
};

//method: log (logs event to the log silo object) 
//params: logType (['warning' | 'error' | 'inform'])
//return: name of the object (signed with timestamp) of the newly added log event
_3.Page.prototype.log = function (logType, message){
	var timesigned = new Date().getTime();
	_3.LogSilo.addLog({ mode : logType, message : message, timestamp : timesigned}, false);
	return timesigned;
};

//_3.Page object constructor
_3.Page = function (_source) {
		this.source = ''; 
		this.container = ''; 
		this.dataRepo = '';
		this.html = ''; 
		this.javascript = ''; 
		this.json = ''; 
		this.controls = []; 
		this.files = '';
		this.helper = new _3.Helper();
		this.reqHandle = new _3.RequestLoader();
		this.parser = new _3.Parser();
		this.injector = new _3.Inject();
		this.configurePage(_source);
		return this;
};
///////////////////////////////////////
/*Page object constructor & prototype*/

//Parser object constructor & prototype//
/////////////////////////////////////////

//method: serializeObject (URL serializes a json object) 
//params: object (json object to be serialized)
//return: serialized strings
_3.Parser.prototype.serializeObject = function (object){
	var current = !this.helper.IsNullOrEmpty(object) ? object : [];
	var serializedString = '';
	for (var key in current){
		if (current.hasOwnProperty(key)){
			if(this.helper.IsObject(current[key]) && !this.helper.IsNullOrEmpty(current[key])){
				serializedString += this.serializeObject(current[key]) + '&';
			}
			else if(!this.helper.IsFunction(key)){
		    	serializedString += key + '=' + encodeURIComponent(current[key]) + '&';
		    }
		}
	}
	return this.helper.removeLastChar(serializedString);
};

//method: bindDataToScreen (binds the page's HTML and JSON) 
//params: page (page object)
//return: html string
_3.Parser.prototype.bindDataToScreen = function (page){
	var data = JSON.parse(page.json);
	var template = page.html;
	this.popControls(page);
	for(var k in data){
		template = template.replace(new RegExp('{' + k + '}','g'), data[k]);
	}
	return template;
};

//method: bindScript (runs the javascript in page object) 
//params: page (page object)
//return: whatever and/or if the javascript -to be run- returns a value
_3.Parser.prototype.bindScript = function (page){
	return eval(page.javascript);
};

//method: popControls (populates the page's control in Page.controls) 
//params: page (page object)
//return: page object
_3.Parser.prototype.popControls = function (page){
	var regX = new RegExp("id=[\"'][A-Z a-z 0-9 _-]*[\"']",'g');
	page.controls.length = 0;
	while(1){
		match = regX.exec(page.html);
		if(match == null){
			break;
		} 
		page.controls.push(match[0].split('=')[1]);
	}
	return page;
};

//method: addHeadFiles (includes the files from Page.files[css/javascript] in the DOM) 
//params: page (page object)
//return: boolean(if files have been included)
_3.Parser.prototype.addHeadFiles = function(page){
	if(!this.helper.IsNullOrEmpty(page.files)){
		var files = JSON.parse(page.files);
		var css = files.css;
		var javascript = files.javascript;
		if(!this.helper.isStyleIncluded(css)){
			this.injector.registerStylesheet(css);
		}
		if(!this.helper.isScriptIncluded(javascript)){
			this.injector.registerJavascript(javascript);
		}
		return true;
	}
	else{
    	page.log('error', 'Page.files object is empty.');
    	return false;
	}
}

//_3.Parser object constructor
_3.Parser = function(){
	this.helper = new _3.Helper();
	this.injector = new _3.Inject();
	return this;
};
/////////////////////////////////////////
/*Parser object constructor & prototype*/

//Inject object constructor & prototype//
/////////////////////////////////////////

//method: pushToRepo (pushes data to _3.Page's repo) 
//params: page (page object)
//params: data (object to be pushed to repo)
_3.Inject.prototype.pushToRepo = function (page, data){
	return page.addToDataRepo(data);
};

//method: data (injects the data into _3.Page.data and then pops to screen) 
//params: page (data object)
//params: data (object to be injected)
_3.Inject.prototype.data = function (page, data){
	var original = JSON.parse(page.json);
	data = JSON.parse(data);
	for(var k in data){
		original[k] = data[k];
	}
	page.json = JSON.stringify(original);
	page.pop();
};

//method: script (injects/runs the script) 
//params: script 
//return: whatever and/or if the javascript -to be run- returns a value
_3.Inject.prototype.script = function (script){
	return eval(script);
};

//method: registerStylesheet (registers the stylesheet in the page) 
//params: cssUrl (url of css file)
_3.Inject.prototype.registerStylesheet = function (cssUrl){
	var link = document.createElement('link');
	var head = document.getElementsByTagName("head")[0];
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", cssUrl);
	head.appendChild(link);
};

//method: registerStylesheet (registers the stylesheet in the page) 
//params: cssUrl (url of css file)
_3.Inject.prototype.registerJavascript = function (jsUrl){
	var script = document.createElement('script');
	var head = document.getElementsByTagName("head")[0];
	script.setAttribute("type","text/javascript");
	script.setAttribute("src", jsUrl);
	head.appendChild(script);
};

//_3.Inject object constructor
_3.Inject = function(){
	return this;
};
/////////////////////////////////////////
/*Inject object constructor & prototype*/

//Helper object constructor & prototype//
/////////////////////////////////////////

//method: isScriptIncluded (checks if a certain javascript file is already included) 
//params: scriptURL (the file to look for)
//return: boolean whether the file is included or not
_3.Helper.prototype.isScriptIncluded = function (scriptURL){
	var allScripts = document.getElementsByTagName('script');
	for (var i = 0; i < allScripts.length; i++) {
		if(allScripts[i].src == scriptURL){
			return true;
		}
	}
	return false;
};

//method: isStyleIncluded (checks if a certain stylesheet file is already included) 
//params: styleURL (the file to look for)
//return: boolean whether the file is included or not
_3.Helper.prototype.isStyleIncluded = function (styleURL){
	var allStyles = document.getElementsByTagName('link');
	for (var i = 0; i < allStyles.length; i++) {
		if(allStyles[i].href == styleURL){
			return true;
		}
	}
	return false;
};

//method: el (gets an element by it's id) 
//params: id (id of element to retrieve)
//return: html element
_3.Helper.prototype.el = function (id){
	return document.getElementById(id);
};

//method: trimString (trims a string) 
//params: string (string to be trimmed)
//return: html element
_3.Helper.prototype.trimString = function (string){
	if(this.IsString(string)){
	    string = string.replace(/^\s+/, '');
	    for (var i = string.length - 1; i >= 0; i--){
	        if (/\S/.test(string.charAt(i))){
	            string = string.substring(0, i + 1);
	            break;
	        }
	    }
	    return string;
	}
	return ' ';
};

//method: removeLastChar (removes the last char of a string) 
//params: string (string who's last character is to be removed)
//return: string without last character
_3.Helper.prototype.removeLastChar = function (string){
	return string.slice(0, (string.length - 1));
};

//method: IsNullOrEmpty (checks if the input is null or empty) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsNullOrEmpty = function (input){
	if (typeof input == 'undefined'){
		return true;
	}
	else if(input == null){
		return true;
	}
	else if(typeof input == 'string' && this.trimString(input) == ''){
		return true;
	}
	return false;
};

//method: IsFunction (checks if the input is a function) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsFunction = function (input){
	return (typeof input == 'function');
};

//method: IsString (checks if the input is a string) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsString = function (input){
	return (typeof input == 'string');
};

//method: IsBoolean (checks if the input is a boolean) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsBoolean = function (input){
	return (typeof input == 'boolean');
};

//method: IsObject (checks if the input is an object) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsObject = function (input){
	return (typeof input == 'object');
};

//method: IsNumber (checks if the input is a number) 
//params: input (object to be tested)
//return: boolean
_3.Helper.prototype.IsNumber = function (input){
	return (typeof input == 'number');
};

//method: execCallback (executes callback functions in a controlled manner) 
//params: callback (the callback function to be called)
//params: paramaterObject (parameters to be passed)
//return: null | whatever and/or if the callback functions return
_3.Helper.prototype.execCallback = function (callback, paramaterObject){
	if(!this.IsNullOrEmpty(paramaterObject)){
		if(this.IsFunction(callback)){
			return callback(paramaterObject);
		}
		if(typeof callback == 'string'){
			return eval(callback + '(' + paramaterObject + ')');
		}
	}
	return null;
};

//_3.Helper object constructor
_3.Helper = function(){
	return this;
};
/////////////////////////////////////////
/*Helper object constructor & prototype*/

//Notifier object constructor & prototype//
///////////////////////////////////////////

//method: notify (launches the notifier with a specific message and mode) 
//params: mode (['error' | 'warning' | 'inform'])
//params: message (the message to be included in the notification)
_3.Helper.prototype.notify = function (mode, message){
	switch(mode){
		case 'error':
			this.err(message);
			break;
		case 'warning':
			this.warn(message);
			break;
		case 'inform':
			this.inform(message);
			break;
	}
};

//method: err (launches the notifier with a specific message in error mode) 
//params: message (the message to be included in the notification)
_3.Helper.prototype.err = function (message){
	alert('error : ' + message);
};

//method: err (launches the notifier with a specific message in warning mode) 
//params: message (the message to be included in the notification)
_3.Helper.prototype.warn = function (message){
	alert('warning : ' + message);
};

//method: inform (launches the notifier with a specific message in mode inform mode) 
//params: message (the message to be included in the notification)
_3.Helper.prototype.inform = function (message){
	alert(message);
};

//_3.Notifier object constructor
_3.Notifier = function(){
	this.notifyCallback = '';
	return this;
};
///////////////////////////////////////////
/*Notifier object constructor & prototype*/

//RequestLoader object constructor & prototype//
////////////////////////////////////////////////

//method: get (executes a get request against the API) 
//params: page (the page object making the request)
//params: aspect (aspect being retrieved from the API)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: onHandle (function to be called when the response is handled)
//return: response object
_3.RequestLoader.prototype.get = function (page, aspect, callback, parameters, onHandle){
	var currUrl = _3.urlObject();
	var callUrl = _3.urlObject(page.source + '/' + aspect + '/');
	if(!this.helper.IsNullOrEmpty(currUrl) && !this.helper.IsNullOrEmpty(callUrl)){
		return callUrl.host == currUrl.host ? new _3.XHR().get(page, callUrl.fullURL, callback, parameters, aspect, onHandle) : new _3.XDR().get(page, callUrl.fullURL, callback, parameters, aspect, onHandle);
	}
	else{
    	page.log('error', 'Current URL is not set.');
    	return null;
	}
};

//method: post (executes a post request against the API) 
//params: page (the page object making the request)
//params: aspect (aspect being retrieved from the API)
//params: postData (data to be sent with the post request)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: onHandle (function to be called when the response is handled)
//return: response object
_3.RequestLoader.prototype.post = function (page, aspect, postData, callback, parameters, onHandle){
	var currUrl = _3.urlObject();
	var callUrl = _3.urlObject(page.source + '/post/');
	if(!this.helper.IsNullOrEmpty(currUrl) && !this.helper.IsNullOrEmpty(callUrl)){
		return callUrl.host == currUrl.host ? new _3.XHR().post(page, callUrl.fullURL, postData, callback, parameters, aspect, onHandle) : new _3.XDR().post(page, callUrl.fullURL, postData, callback, parameters, aspect, onHandle);
	}
	else{
    	page.log('error', 'Current URL is not set.');
    	return null;
	}
};

//method: buildPostData (builds the post data to be sent with the post request) 
//params: page (the page object making the request)
//params: postData (data required by the post request initiator)
//params: responseFormat (expected respose format)
//return: serialized string for post request
_3.RequestLoader.prototype.buildPostData = function (page, data, responseFormat){
	return this.parser.serializeObject({
		data : data,
		format : responseFormat,
		page : page.serializePage()
	}).replace(new RegExp('%20', 'g'), '+');
};

//_3.RequestLoader object constructor
_3.RequestLoader = function(){
	this.helper = new _3.Helper();
	this.parser = new _3.Parser();
	return this;
};
////////////////////////////////////////////////
/*RequestLoader object constructor & prototype*/

//XHR object constructor & prototype//
//////////////////////////////////////

//method: get (executes get requests against a same-domain API) 
//params: page (the page object making the request) 
//params: _url (API URL)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: loadIn (where/how the response should be loaded)
//params: onHandle (function to be called when the response is handled)
//return: response object
_3.XHR.prototype.get = function (page, _url, callback, parameters, loadIn, onHandle){
	this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	this.xhr.onreadystatechange = function(){
		_3.HandleXHR(page, this, loadIn, onHandle);
		new _3.Helper().execCallback(callback, { 'page' : page, 'withpop' : parameters});
	};
	this.xhr.open('GET', _url, true);
	this.xhr.send();
	return this;
};

//method: post (executes post requests against a same-domain API) 
//params: page (the page object making the request)
//params: _url (API URL)
//params: postData (data to be sent with the post request)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: loadIn (where/how the response should be loaded)
//params: onHandle (function to be called when the response is handled)
//return: response object
_3.XHR.prototype.post = function (page, _url, postData, callback, parameters, loadIn, onHandle){
	this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	this.xhr.onreadystatechange = function(){
		_3.HandleXHR(page, this, loadIn, onHandle);
		new _3.Helper().execCallback(callback, { 'page' : page, 'parameters' : parameters});
	};
	this.xhr.open('POST', _url, true);
	this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	this.xhr.send(postData);
	return this;
};

//_3.XHR object constructor
_3.XHR = function(){
	this.helper = new _3.Helper();
	this.xhr = null;
	return this;
};
//////////////////////////////////////
/*XHR object constructor & prototype*/

//XDR object constructor & prototype//
//////////////////////////////////////

//method: get (executes get requests against a different-domain API) 
//params: page (the page object making the request) 
//params: _url (API URL)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: loadIn (where/how the response should be loaded)
//params: onHandle (function to be called when the response is handled)
//return: response object
this.get = function (page, _url, callback, parameters, loadIn, onHandle){
	this.xdr = new XDomainRequest();
	this.xdr.onreadystatechange = function(){
		_3.HandleXDR(page, this, loadIn, onHandle);
		new _3.Helper().execCallback(callback, { 'page' : page, 'withpop' : parameters});
	};
	this.xdr.open('GET', _url, true);
	this.xdr.send();
	return this;
};

//method: post (executes post requests against a different-domain API) 
//params: page (the page object making the request)
//params: _url (API URL)
//params: postData (data to be sent with the post request)
//params: callback (function to be called when the server responds)
//params: parameters (parameters for the callback function)
//params: loadIn (where/how the response should be loaded)
//params: onHandle (function to be called when the response is handled)
//return: response object
this.post = function (page, _url, postData, callback, parameters, loadIn, onHandle){
	this.xdr = new XDomainRequest();
	this.xdr.onreadystatechange = function(){
		_3.HandleXDR(page, this, loadIn, onHandle);
		new _3.Helper().execCallback(callback, { 'page' : page, 'parameters' : parameters});
	};
	this.xdr.open('POST', _url, true);
	this.xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	this.xdr.send(postData);
	return this;
};

//_3.XDR object constructor
_3.XDR = function(){
	this.helper = new _3.Helper();
	this.xdr = null;
	return this;
};
//////////////////////////////////////
/*XDR object constructor & prototype*/

//Namespace global functions//
//////////////////////////////

//method: HandleXHR (handles an XHR response) 
//params: page (the page object making the request)
//params: requestObject (XHR object)
//params: loadIn (where/how the response should be loaded)
//params: callback (function to be called when the response is handled)
_3.HandleXHR = function (page, requestObject, loadIn, callback){
	this.helper = new _3.Helper();
	if (requestObject.readyState == 4){
		if(requestObject.status == 200){
			if(loadIn != 'post'){
				page[loadIn] = requestObject.responseText;
			}
			this.helper.execCallback(callback, requestObject);
    	}
    	else{
    		page.log('error', 'HTTP request failed :: ' + requestObject.statusText);
    	}
	}
};

//method: HandleXDR (handles an XDR response) 
//params: page (the page object making the request)
//params: requestObject (XDR object)
//params: loadIn (where/how the response should be loaded)
//params: callback (function to be called when the response is handled)
_3.HandleXDR = function (page, requestObject, loadIn, callback){
	this.helper = new _3.Helper();
	if (requestObject.readyState == 4){
		if(requestObject.status == 200){
			if(loadIn != 'post'){
				page[loadIn] = requestObject.responseText;
			}
			this.helper.execCallback(callback, requestObject);
    	}
    	else{
    		page.log('error', 'x-HTTP request failed :: ' + requestObject.statusText);
		}
	}
};

//method: urlObject (creates a URL object) 
//params: _url (the URL as string to be broken down and stored in object)
//return: URL object
_3.urlObject = function(_url){
	this.helper = new _3.Helper();
	var a,key,value,pair,params,variables;
	a = document.createElement('a');
	a.href = this.helper.IsNullOrEmpty(_url) ? window.location.href : _url;
	url_query = a.search.substring(1);
	params = {};
	variables = url_query.split('&');
	if(variables[0].length > 1){
		for(var i = 0; i < variables.length; i++){
		    pair = variables[i].split('=');
		    key = unescape(pair[0]);
		    value = unescape(pair[1]);
	    	if(value.match(/^\d+$/)){
	    		value = parseInt(value);
	    	}
			else if(value.match(/^\d+\.\d+$/)){
	        	value = parseFloat(value);
	        }
	    	if(typeof params[key] === 'undefined'){
	       		params[key] = value;
	       	}
	    	else if(typeof params[key] === 'string'){
	       		params[key] = [params[key],value];
	       	}
	    	else{
	       		params[key].push(value);
	       	}
	  	}	
	}
	var urlObj = {
		fullURL : _url,
		protocol:a.protocol,
		hostname:a.hostname,
		host:a.host,
		port:a.port,
		hash:a.hash,
		pathname:a.pathname,
		search:a.search,
		parameters:params
	};
	return urlObj;
};
//////////////////////////////
/*Namespace global functions*/

//Namespace global logging & log silo//
///////////////////////////////////////

_3.LogSilo = {
	logCount : 0,
	log : [],
	debugMode : false,
	addLog : function (object, notify){
		helper = new _3.Helper();
		notifier = new _3.Notifier();
		if(!helper.IsNullOrEmpty(object)){
			this.log.push(errorObject);
			this.logCount++;
		}
		if(notify || this.debugMode){
			notifier.notify('error', object.message);
		}
	},
	clearLog : function(){
		this.log.length = 0;
		this.logCount = 0;
	},
	printLog : function (printCallback){
		helper = new _3.Helper();
		if(!helper.IsNullOrEmpty(printCallback)){
			for (var i = this.log.length - 1; i >= 0; i--){
				helper.execCallback(printCallback, this.log[i]);
			}
		}
		else{
			this.addLog({mode: 'error', message : 'Supplied print callback function is not valid.', timestamp : new Date().getTime()}, false);
		}
	},
	toggleDebug : function (state){
		helper = new _3.Helper();
		if(!helper.IsBoolean(state)){
			this.debugMode = state;
		}
		else{
			this.debugMode = !this.debugMode;
		}
	}
};
///////////////////////////////////////
/*Namespace global logging & log silo*/