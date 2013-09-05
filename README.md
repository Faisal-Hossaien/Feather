<pre>
Feather
=======

The feather is a JavaScript template engine designed to take advantage of full strength of JavaScript but with minimal intrusion expressing the intent. 
It sort of uses a razor (.net server side template engine) like syntax but not exactly is razor, but I certainly got my inspiration from it.
Because it uses full strength of JavaScript it can be used to express very complex template requirements with ease.
You have to include feather.js into your web page that creates a global function called createTempate.
To create a template you have to pass it a template string, it will return a template function. 
That function takes one argument that is the template data and returns a string, which is the output. Below I have explained how it works.
there are few simple rules to follow
1. Formattable string Expression, Anyting between '{' and '}' will be replaced with the value of matching property name of the template data passed as argument of the template function.
2. Supported JavaScript Statements for example if-else or looping constructs has a form of @<statement>{ <formattable string>}; all statements must follow this pattern.
   in these case the statement part would emit as javascript statement and things in the formattable string would emit as html.
3. The block statement that begins @{<statements>}, is used to emit arbitary javascript statemetnts, so what every you write between the curly braces is going 
   to be javascript. if you want to emit some html from with in block statemtnt you must call a special function called $emit, that takes a string arguments and emits it
   to the output. if the statement is just single line then you can write it as @<statement>;, note the ';' here is very important as it emits javascript starting
   from @ and upto ; and then starts treating things after that as a formattable string.

Simple place holders: 
to replace value from the template data to html string use { and }. Anything between a {} will be replaced with the matching field name of the template data.

Example:  
  var tpl=createTemplate('<div  class="{cls}"><span class="{txtCls}">{text}</span></div>');

  var output=tpl({cls:'divCls',txtCls:'spanCls',text:'this is data'});

 // outputs : <div  class="divCls"><span class="spanCls">this is data</span></div>


if-else or if-else if-else:
  var templatestr=[
     '<div class="PersonCls">',
	 '<label class"labelCls">First Name:<span>{firstName}</Span></br>',
	 '<label class"labelCls">Last Name:<span>{lastName}</Span></br>',
	 '<label class"labelCls">age group:<span>',
	 '@if(age<13){',
		'a Child  of age {age}',
	 '}',
	 '@else if(age>=13 && age<18){',
		' a Teenager 0f age {age}',
	 '}',
	 '@else{',
		'an Adult 0f age {age}',
	 '}',
	 '</Span>',
	 '</div'
   ];
   var tpl=createTemplate(templatestr.join(''));
   var output1=tpl({PersonCls:'personCls',firstName:'Faisal', lastName:'hossaien', age:35 });
   /*
    <div class="PersonCls">
	<label class"labelCls">First Name:<span>Faisal</Span></br>
	<label class"labelCls">Last Name:<span>hossaien</Span></br>
	<label class"labelCls">age group:<span>an Adult 0f age 35</Span>
	</div>
   */
   var output2=tpl({PersonCls:'personCls',firstName:'Nuzaira', lastName:'hossaien', age:3 });
   /*
   <div class="PersonCls">
   <label class"labelCls">First Name:<span>Nuzaira</Span></br>
   <label class"labelCls">Last Name:<span>hossaien</Span></br>
   <label class"labelCls">age group:<span>a Child  of age 3</Span>
   </div>
   */
   var output3=tpl({PersonCls:'personCls',firstName:'Faruk', lastName:'hossaien', age:15 });
   /*
    <div class="PersonCls">
	<label class"labelCls">First Name:<span>Faruk</Span></br>
	<label class"labelCls">Last Name:<span>hossaien</Span></br>
	<label class"labelCls">age group:<span> a Teenager 0f age 15</Span>
	</div>
   */
 for loop:
   var templatestr = ['<div class="{cls}" >{value}</div>',
						'<ul>',
						'@for(var i=0;i<items.length;i++){'
							'<li>{items[i]}</li>'
						'}',
						'</ul>',
					  '</div>'
					 ];
	var tpl=createTemplate(templatestr.join(''));
	var output=tpl({ cls: 'divCls', value: 'List', items: [1, 2, 3, 4] });
	/*
	<div class="divCls" >List</div>
	 <ul>
	  <li>1</li>
	  <li>2</li>
	  <li>3</li>
	  <li>4</li>
	 </ul>
	</div>
    */	
While loop:
	   var templatestr = ['<div class="{cls}" >{value}</div>',
						'<ul>',
						'@var i=0;',
						'@while(i<4){',
							'<li>{items[i]}</li>',
							'@i++;',
						'}',
						'</ul>',
					  '</div>'
					 ];
	var tpl=createTemplate(templatestr.join(''));
	var output=tpl({ cls: 'cls', value: 'List', items: [1, 2, 3, 4] });	
	/*
	<div class="divCls" >List</div>
	 <ul>
	  <li>1</li>
	  <li>2</li>
	  <li>3</li>
	  <li>4</li>
	 </ul>
	</div>
    */	
	
do-While loop:
	    var templatestr = ['<div class="{cls}" >{value}</div>',
							'<ul>',
								'@var i=0;',
									'@do{',
										'<li>{items[i]}</li>',
										'@i++;',
									'}',
									'@while(i<4)',
							'</ul>',
						  '</div>'
						 ];
	var tpl=createTemplate(templatestr.join(''));
	var output=tpl({ cls: 'cls', value: 'List', items: [1, 2, 3, 4] });	
	/*
	<div class="divCls" >List</div>
	 <ul>
	  <li>1</li>
	  <li>2</li>
	  <li>3</li>
	  <li>4</li>
	 </ul>
	</div>
    */	
	
  Switch-case	:
	
	var templatestr=[
     '<div class="PersonCls">',
	 '<label class"labelCls">Selected Option:</label><span>',
	 '@switch(option){',
	    '@case 1:{',
		  '<b>Option1 is selcted</b>',
		  '@break;',
	    '}',
		'@case 2:{',
		  '<b>Option2 is selcted</b>',
		  '@break;',
	    '}',
		'@default:{',
		  '<b>Invalid Selction</b>',
		  '@break;',
	    '}',
	 '}',
	 '</Span>',
	 '</div'
   ];
					
   var tpl=createTemplate(templatestr.join(''));
   var output1=tpl({PersonCls:'personCls',option:1 });					
   /*
 
     <div class="PersonCls">
	   <label class"labelCls">Selected Option:</label>
	     <span><b>Option1 is selcted</b></Span>
	</div>

   */

Arbitary Block  && single satatement:
   var templatestr = ['<div class="{cls}" >{value}</div>',
						'@{',
						 'var i=0,j=items.length;',
						  '$emit("number of items:"+j)',
						'}',
						'<ul>',
						'@while(i<j){',
							'<li>{items[i]}</li>',
							'@i++;',
						'}',
						'</ul>'
					  ];
	var tpl=createTemplate(templatestr.join(''));
	var output=tpl({ cls: 'cls', value: 'List', items: [1, 2, 3, 4] });	
	/*
	
		 <div class="cls" >List</div>number of items:4
		   <ul>
			 <li>1</li>
			 <li>2</li>
			 <li>3</li>
			 <li>4</li>
			</ul>
    */	
						
						
Passing custom function to the template:
 var templatestr = ['<div class="{cls}" >{value}</div>',
                        '<ul>',
						'@{',
						  'each(items,function(item){',
			    			  '$emit("<li>"+item+"</li>")',
                              '});',  
						'}',
						'</ul>',
					  '</div>'
					 ];
        var each = function(array, iterator) {
            for (var i = 0; i < array.length; i++) iterator(array[i]);
        };
        var tpl = createTemplate(templatestr.join(''));
        var output = tpl({ cls: 'cls', value: 'List', items: [1, 2, 3, 4],each:each });							
						
	/*
	
		 <div class="cls" >List</div>number of items:4
		   <ul>
			 <li>1</li>
			 <li>2</li>
			 <li>3</li>
			 <li>4</li>
			</ul>
    */	
			
						
						
						
						
						
						
						
						
						
						
</pre>