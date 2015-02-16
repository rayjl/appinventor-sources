/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating JavaScript for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.JavaScript');

goog.require('Blockly.Generator'); 


/**
 * JavaScript code generator.
 * @type !Blockly.Generator
 */
Blockly.JavaScript = new Blockly.Generator('JavaScript');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.JavaScript.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    // https://developer.mozilla.org/en/JavaScript/Reference/Reserved_Words
    'break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,' +
    'class,enum,export,extends,import,super,implements,interface,let,package,private,protected,public,static,yield,' +
    'const,null,true,false,' +
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
    'Array,ArrayBuffer,Boolean,Date,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Error,eval,EvalError,Float32Array,Float64Array,Function,Infinity,Int16Array,Int32Array,Int8Array,isFinite,isNaN,Iterator,JSON,Math,NaN,Number,Object,parseFloat,parseInt,RangeError,ReferenceError,RegExp,StopIteration,String,SyntaxError,TypeError,Uint16Array,Uint32Array,Uint8Array,Uint8ClampedArray,undefined,uneval,URIError,' +
    // https://developer.mozilla.org/en/DOM/window
    'applicationCache,closed,Components,content,_content,controllers,crypto,defaultStatus,dialogArguments,directories,document,frameElement,frames,fullScreen,globalStorage,history,innerHeight,innerWidth,length,location,locationbar,localStorage,menubar,messageManager,mozAnimationStartTime,mozInnerScreenX,mozInnerScreenY,mozPaintCount,name,navigator,opener,outerHeight,outerWidth,pageXOffset,pageYOffset,parent,performance,personalbar,pkcs11,returnValue,screen,screenX,screenY,scrollbars,scrollMaxX,scrollMaxY,scrollX,scrollY,self,sessionStorage,sidebar,status,statusbar,toolbar,top,URL,window,' +
    'addEventListener,alert,atob,back,blur,btoa,captureEvents,clearImmediate,clearInterval,clearTimeout,close,confirm,disableExternalCapture,dispatchEvent,dump,enableExternalCapture,escape,find,focus,forward,GeckoActiveXObject,getAttention,getAttentionWithCycleCount,getComputedStyle,getSelection,home,matchMedia,maximize,minimize,moveBy,moveTo,mozRequestAnimationFrame,open,openDialog,postMessage,print,prompt,QueryInterface,releaseEvents,removeEventListener,resizeBy,resizeTo,restore,routeEvent,scroll,scrollBy,scrollByLines,scrollByPages,scrollTo,setCursor,setImmediate,setInterval,setResizable,setTimeout,showModalDialog,sizeToContent,stop,unescape,updateCommands,XPCNativeWrapper,XPCSafeJSObjectWrapper,' +
    'onabort,onbeforeunload,onblur,onchange,onclick,onclose,oncontextmenu,ondevicemotion,ondeviceorientation,ondragdrop,onerror,onfocus,onhashchange,onkeydown,onkeypress,onkeyup,onload,onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onmozbeforepaint,onpaint,onpopstate,onreset,onresize,onscroll,onselect,onsubmit,onunload,onpageshow,onpagehide,' +
    'Image,Option,Worker,' +
    // https://developer.mozilla.org/en/Gecko_DOM_Reference
    'Event,Range,File,FileReader,Blob,BlobBuilder,' +
    'Attr,CDATASection,CharacterData,Comment,console,DocumentFragment,DocumentType,DomConfiguration,DOMError,DOMErrorHandler,DOMException,DOMImplementation,DOMImplementationList,DOMImplementationRegistry,DOMImplementationSource,DOMLocator,DOMObject,DOMString,DOMStringList,DOMTimeStamp,DOMUserData,Entity,EntityReference,MediaQueryList,MediaQueryListListener,NameList,NamedNodeMap,Node,NodeFilter,NodeIterator,NodeList,Notation,Plugin,PluginArray,ProcessingInstruction,SharedWorker,Text,TimeRanges,Treewalker,TypeInfo,UserDataHandler,Worker,WorkerGlobalScope,' +
    'HTMLDocument,HTMLElement,HTMLAnchorElement,HTMLAppletElement,HTMLAudioElement,HTMLAreaElement,HTMLBaseElement,HTMLBaseFontElement,HTMLBodyElement,HTMLBRElement,HTMLButtonElement,HTMLCanvasElement,HTMLDirectoryElement,HTMLDivElement,HTMLDListElement,HTMLEmbedElement,HTMLFieldSetElement,HTMLFontElement,HTMLFormElement,HTMLFrameElement,HTMLFrameSetElement,HTMLHeadElement,HTMLHeadingElement,HTMLHtmlElement,HTMLHRElement,HTMLIFrameElement,HTMLImageElement,HTMLInputElement,HTMLKeygenElement,HTMLLabelElement,HTMLLIElement,HTMLLinkElement,HTMLMapElement,HTMLMenuElement,HTMLMetaElement,HTMLModElement,HTMLObjectElement,HTMLOListElement,HTMLOptGroupElement,HTMLOptionElement,HTMLOutputElement,HTMLParagraphElement,HTMLParamElement,HTMLPreElement,HTMLQuoteElement,HTMLScriptElement,HTMLSelectElement,HTMLSourceElement,HTMLSpanElement,HTMLStyleElement,HTMLTableElement,HTMLTableCaptionElement,HTMLTableCellElement,HTMLTableDataCellElement,HTMLTableHeaderCellElement,HTMLTableColElement,HTMLTableRowElement,HTMLTableSectionElement,HTMLTextAreaElement,HTMLTimeElement,HTMLTitleElement,HTMLTrackElement,HTMLUListElement,HTMLUnknownElement,HTMLVideoElement,' +
    'HTMLCanvasElement,CanvasRenderingContext2D,CanvasGradient,CanvasPattern,TextMetrics,ImageData,CanvasPixelArray,HTMLAudioElement,HTMLVideoElement,NotifyAudioAvailableEvent,HTMLCollection,HTMLAllCollection,HTMLFormControlsCollection,HTMLOptionsCollection,HTMLPropertiesCollection,DOMTokenList,DOMSettableTokenList,DOMStringMap,RadioNodeList,' +
    'SVGDocument,SVGElement,SVGAElement,SVGAltGlyphElement,SVGAltGlyphDefElement,SVGAltGlyphItemElement,SVGAnimationElement,SVGAnimateElement,SVGAnimateColorElement,SVGAnimateMotionElement,SVGAnimateTransformElement,SVGSetElement,SVGCircleElement,SVGClipPathElement,SVGColorProfileElement,SVGCursorElement,SVGDefsElement,SVGDescElement,SVGEllipseElement,SVGFilterElement,SVGFilterPrimitiveStandardAttributes,SVGFEBlendElement,SVGFEColorMatrixElement,SVGFEComponentTransferElement,SVGFECompositeElement,SVGFEConvolveMatrixElement,SVGFEDiffuseLightingElement,SVGFEDisplacementMapElement,SVGFEDistantLightElement,SVGFEFloodElement,SVGFEGaussianBlurElement,SVGFEImageElement,SVGFEMergeElement,SVGFEMergeNodeElement,SVGFEMorphologyElement,SVGFEOffsetElement,SVGFEPointLightElement,SVGFESpecularLightingElement,SVGFESpotLightElement,SVGFETileElement,SVGFETurbulenceElement,SVGComponentTransferFunctionElement,SVGFEFuncRElement,SVGFEFuncGElement,SVGFEFuncBElement,SVGFEFuncAElement,SVGFontElement,SVGFontFaceElement,SVGFontFaceFormatElement,SVGFontFaceNameElement,SVGFontFaceSrcElement,SVGFontFaceUriElement,SVGForeignObjectElement,SVGGElement,SVGGlyphElement,SVGGlyphRefElement,SVGGradientElement,SVGLinearGradientElement,SVGRadialGradientElement,SVGHKernElement,SVGImageElement,SVGLineElement,SVGMarkerElement,SVGMaskElement,SVGMetadataElement,SVGMissingGlyphElement,SVGMPathElement,SVGPathElement,SVGPatternElement,SVGPolylineElement,SVGPolygonElement,SVGRectElement,SVGScriptElement,SVGStopElement,SVGStyleElement,SVGSVGElement,SVGSwitchElement,SVGSymbolElement,SVGTextElement,SVGTextPathElement,SVGTitleElement,SVGTRefElement,SVGTSpanElement,SVGUseElement,SVGViewElement,SVGVKernElement,' +
    'SVGAngle,SVGColor,SVGICCColor,SVGElementInstance,SVGElementInstanceList,SVGLength,SVGLengthList,SVGMatrix,SVGNumber,SVGNumberList,SVGPaint,SVGPoint,SVGPointList,SVGPreserveAspectRatio,SVGRect,SVGStringList,SVGTransform,SVGTransformList,' +
    'SVGAnimatedAngle,SVGAnimatedBoolean,SVGAnimatedEnumeration,SVGAnimatedInteger,SVGAnimatedLength,SVGAnimatedLengthList,SVGAnimatedNumber,SVGAnimatedNumberList,SVGAnimatedPreserveAspectRatio,SVGAnimatedRect,SVGAnimatedString,SVGAnimatedTransformList,' +
    'SVGPathSegList,SVGPathSeg,SVGPathSegArcAbs,SVGPathSegArcRel,SVGPathSegClosePath,SVGPathSegCurvetoCubicAbs,SVGPathSegCurvetoCubicRel,SVGPathSegCurvetoCubicSmoothAbs,SVGPathSegCurvetoCubicSmoothRel,SVGPathSegCurvetoQuadraticAbs,SVGPathSegCurvetoQuadraticRel,SVGPathSegCurvetoQuadraticSmoothAbs,SVGPathSegCurvetoQuadraticSmoothRel,SVGPathSegLinetoAbs,SVGPathSegLinetoHorizontalAbs,SVGPathSegLinetoHorizontalRel,SVGPathSegLinetoRel,SVGPathSegLinetoVerticalAbs,SVGPathSegLinetoVerticalRel,SVGPathSegMovetoAbs,SVGPathSegMovetoRel,ElementTimeControl,TimeEvent,SVGAnimatedPathData,' +
    'SVGAnimatedPoints,SVGColorProfileRule,SVGCSSRule,SVGExternalResourcesRequired,SVGFitToViewBox,SVGLangSpace,SVGLocatable,SVGRenderingIntent,SVGStylable,SVGTests,SVGTextContentElement,SVGTextPositioningElement,SVGTransformable,SVGUnitTypes,SVGURIReference,SVGViewSpec,SVGZoomAndPan');

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
 */
Blockly.JavaScript.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.JavaScript.ORDER_MEMBER = 1;         // . []
Blockly.JavaScript.ORDER_NEW = 1;            // new
Blockly.JavaScript.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.JavaScript.ORDER_INCREMENT = 3;      // ++
Blockly.JavaScript.ORDER_DECREMENT = 3;      // --
Blockly.JavaScript.ORDER_LOGICAL_NOT = 4;    // !
Blockly.JavaScript.ORDER_BITWISE_NOT = 4;    // ~
Blockly.JavaScript.ORDER_UNARY_PLUS = 4;     // +
Blockly.JavaScript.ORDER_UNARY_NEGATION = 4; // -
Blockly.JavaScript.ORDER_TYPEOF = 4;         // typeof
Blockly.JavaScript.ORDER_VOID = 4;           // void
Blockly.JavaScript.ORDER_DELETE = 4;         // delete
Blockly.JavaScript.ORDER_MULTIPLICATION = 5; // *
Blockly.JavaScript.ORDER_DIVISION = 5;       // /
Blockly.JavaScript.ORDER_MODULUS = 5;        // %
Blockly.JavaScript.ORDER_ADDITION = 6;       // +
Blockly.JavaScript.ORDER_SUBTRACTION = 6;    // -
Blockly.JavaScript.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Blockly.JavaScript.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.JavaScript.ORDER_IN = 8;             // in
Blockly.JavaScript.ORDER_INSTANCEOF = 8;     // instanceof
Blockly.JavaScript.ORDER_EQUALITY = 9;       // == != === !==
Blockly.JavaScript.ORDER_BITWISE_AND = 10;   // &
Blockly.JavaScript.ORDER_BITWISE_XOR = 11;   // ^
Blockly.JavaScript.ORDER_BITWISE_OR = 12;    // |
Blockly.JavaScript.ORDER_LOGICAL_AND = 13;   // &&
Blockly.JavaScript.ORDER_LOGICAL_OR = 14;    // ||
Blockly.JavaScript.ORDER_CONDITIONAL = 15;   // ?:
Blockly.JavaScript.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
Blockly.JavaScript.ORDER_COMMA = 17;         // ,
Blockly.JavaScript.ORDER_NONE = 99;          // (...)

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.JavaScript.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.JavaScript.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.JavaScript.functionNames_ = Object.create(null);

  if (!Blockly.JavaScript.variableDB_) {
    Blockly.JavaScript.variableDB_ =
        new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_);
  } else {
    Blockly.JavaScript.variableDB_.reset();
  }

  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var x = 0; x < variables.length; x++) {
    defvars[x] = 'var ' +
        Blockly.JavaScript.variableDB_.getName(variables[x],
        Blockly.Variables.NAME_TYPE) + ';';
  }
  Blockly.JavaScript.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.JavaScript.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.JavaScript.definitions_) {
    definitions.push(Blockly.JavaScript.definitions_[name]);
  }
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.JavaScript.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
Blockly.JavaScript.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating JavaScript from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The JavaScript code created for this block.
 * @return {string} JavaScript code with comments and subsequent blocks added.
 * @private
 */
Blockly.JavaScript.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.JavaScript.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.JavaScript.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.JavaScript.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.JavaScript.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};


// --------------------------------------------------------------------------------------------------------------------------------------------


/**
 * Generate the JavaScript code for this blocks workspace, given its associated form specification.
 * 
 * @param {String} formJson JSON string describing the contents of the form. This is the JSON
 *    content from the ".scm" file for this form.
 * @param {String} packageName the name of the package (to put in the define-form call)
 * @param {Boolean} forRepl  true if the code is being generated for the REPL, false if for an apk
 * @returns {String} the generated code if there were no errors.
 */
Blockly.JavaScript.getFormJavaScript = function(formJson, packageName, forRepl) {
  // Parse the input formJson
  var jsonObject = JSON.parse(formJson); 
  // TODO: check for JSON parse error
  var componentNames = [];
  var formProperties; 
  var formName;
  var code = [];
  if (jsonObject.Properties) {
    formProperties = jsonObject.Properties;
    formName = formProperties.$Name;
  } else {
    throw "Cannot find form properties";
  }
  if (!formName) {
    throw "Unable to determine form name";
  }

  this.init();

  // if (!forRepl) {
  //   code.push(Blockly.JavaScript.getYailPrelude(packageName, formName));
  // }

  // Generate a map of the components
  var componentMap = Blockly.Component.buildComponentMap([], [], false, false);
  console.log(componentMap);
  
  for (var comp in componentMap.components)
    componentNames.push(comp);

  // Global blocks
  var globalBlocks = componentMap.globals;
  for (var i = 0, block; block = globalBlocks[i]; i++) {
    code.push(this.blockToCode(block));
  }

  // var code = this.workspaceToCode();

  return code;

  // If form properties exist execute this section
  if (formProperties) {
    // var sourceType = jsonObject.Source;
    // if (sourceType == "Form") {
    //   code = code.concat(Blockly.JavaScript.getComponentLines(formName, formProperties, null /*parent*/, 
    //     componentMap, false /*forRepl*/));
    // } else {
    //   throw "Source type " + sourceType + " is invalid.";
    // }
  
    // // componentNames seems to only be used for repl?
    // // Fetch all of the components in the form, this may result in duplicates
    // componentNames = Blockly.JavaScript.getDeepNames(formProperties, componentNames);
    // // Remove the duplicates
    // var uniqueNames = componentNames.filter(function(elem, pos) {
    //     return componentNames.indexOf(elem) == pos});
    // componentNames = uniqueNames;


    // Add runtime initializations
    // code.push(Blockly.JavaScript.YAIL_INIT_RUNTIME);
  
    // if (forRepl) {
    //   code = Blockly.JavaScript.wrapForRepl(formName, code, componentNames);
    // }

    // TODO?: get rid of empty property assignments? I'm not convinced this is necessary.
    // The original code in YABlockCompiler.java attempts to do this, but it matches on 
    // "set-property" rather than "set-and-coerce-property" so I'm not sure it is actually
    // doing anything. If we do need this, something like the call below might work.
    // 
    // finalCode = code.join('\n').replace(/\\(set-property.*\"\"\\)\\n*/mg, "");
  }
  
  // Finalizing code to be returned
  code = code.join('\n');  // Blank line between each section.
  code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};

// // Blockly.JavaScript.getDeepNames = function(componentJson, componentNames) {
// //   if (componentJson.$Components) {
// //     var children = componentJson.$Components;
// //     for (var i = 0, child; child = children[i]; i++) {
// //       componentNames.push(child.$Name);
// //       componentNames = Blockly.JavaScript.getDeepNames(child, componentNames);
// //     }
// //   }
// //   return componentNames;
// // }

// // /**
// //  * Generate the beginning Yail code for an APK compilation (i.e., not the REPL)
// //  * 
// //  * @param {String} packageName  the name of the package for the app
// //  *     (e.g. "appinventor.ai_somebody.myproject.Screen1")
// //  * @param {String} formName  (e.g., "Screen1")
// //  * @returns {String} Yail code
// //  * @private
// // */


// // Blockly.JavaScript.getYailPrelude = function(packageName, formName) {
// //  return "#|\n$Source $Yail\n|#\n\n"
// //      + Blockly.JavaScript.YAIL_DEFINE_FORM
// //      + packageName
// //      + Blockly.JavaScript.YAIL_SPACER
// //      + formName
// //      + Blockly.JavaScript.YAIL_CLOSE_BLOCK
// //      + "(require <com.google.youngandroid.runtime>)\n";
// // }

// /**
//  * Wraps Yail code for use in the REPL and returns the new code as an array of strings
//  * 
//  * @param {String} formName 
//  * @param {Array} code  code strings to be wrapped
//  * @param {Array} componentNames array of component names
//  * @returns {Array} wrapped code strings
//  * @private
//  */
// // Blockly.JavaScript.wrapForRepl = function(formName, code, componentNames) {
// //   var replCode = [];
// //   replCode.push(Blockly.JavaScript.YAIL_BEGIN);
// //   replCode.push(Blockly.JavaScript.YAIL_CLEAR_FORM);
// //   if (formName != "Screen1") {
// //     // If this form is not named Screen1, then the REPL won't be able to resolve any references
// //     // to it or to any properties on the form itself (such as Title, BackgroundColor, etc) unless
// //     // we tell it that "Screen1" has been renamed to formName.
// //     // By generating a call to rename-component here, the REPL will rename "Screen1" to formName
// //     // in the current environment. See rename-component in runtime.scm.
// //     replCode.push(Blockly.JavaScript.getComponentRenameString("Screen1", formName));
// //   }
// //   replCode = replCode.concat(code);
// //   replCode.push(Blockly.JavaScript.getComponentInitializationString(formName, componentNames));
// //   replCode.push(Blockly.JavaScript.YAIL_CLOSE_BLOCK);
// //   return replCode;
// // }

// /**
//  * Return code to initialize all components in componentMap.
//  * 
//  * @param {Array} componentNames array of names of components in the workspace
//  * @returns {Array} code strings
//  * @private
//  */
// // Blockly.JavaScript.getComponentInitializationString = function(formName, componentNames) {
// //   var code = Blockly.JavaScript.YAIL_INITIALIZE_COMPONENTS;
// //   code += " " + Blockly.JavaScript.YAIL_QUOTE + formName;
// //   for (var i = 0, cName; cName = componentNames[i]; i++) {  // TODO: will we get non-component fields this way?
// //     if (cName != formName)                                  // Avoid duplicate initialization of the form
// //       code = code + " " + Blockly.JavaScript.YAIL_QUOTE + cName;
// //   }
// //   code = code + ")";
// //   return code;
// // }

// /**
//  * Generate Yail code for the component described by componentJson, and all of its child
//  * components (if it has any). componentJson may describe a Form or a regular component. The
//  * generated code includes adding each component to the form, as well as generating code for
//  * the top-level blocks for that component.
//  *
//  * @param {String} formName
//  * @param {String} componentJson JSON string describing the component
//  * @param {String} parentName  the name of the component that contains this component (which may be
//  *    its Form, for top-level components).
//  * @param {Object} componentMap map from component names to the top-level blocks for that component
//  *    in the workspace. See the Blockly.Component.buildComponentMap description for the structure.
//  * @param {Boolean} forRepl true iff we're generating code for the REPL rather than an apk.
//  * @returns {Array} code strings
//  * @private
//  */
// Blockly.JavaScript.getComponentLines = function(formName, componentJson, parentName, componentMap, 
//   forRepl) {
//   var code = [];
//   var componentName = componentJson.$Name;
//   if (componentJson.$Type == 'Form') {
//     code = Blockly.JavaScript.getFormPropertiesLines(formName, componentJson, !forRepl);
//   } else {
//     code = Blockly.JavaScript.getComponentPropertiesLines(formName, componentJson, parentName, !forRepl);
//   }

//   // if (!forRepl) {
//   //   // Generate code for all top-level blocks related to this component
//   //   if (componentMap.components && componentMap.components[componentName]) {
//   //     var componentBlocks = componentMap.components[componentName];
//   //     for (var i = 0, block; block = componentBlocks[i]; i++) {
//   //       code.push(Blockly.JavaScript.blockToCode(block));
//   //     }
//   //   }
//   // }

//   // Generate code for child components of this component
//   if (componentJson.$Components) {
//     var children = componentJson.$Components;
//     for (var i = 0, child; child = children[i]; i++) {
//       code = code.concat(Blockly.JavaScript.getComponentLines(formName, child, componentName, 
//         componentMap, forRepl));
//     }
//   }
//   return code;  
// };

// /**
//  * Generate Yail to add the component described by componentJson to its parent, followed by
//  * the code that sets each property of the component (for all its properties listed in
//  * componentJson).
//  * 
//  * @param {String} formName
//  * @param {String} componentJson JSON string describing the component
//  * @param {String} parentName  the name of the component that contains this component (which may be
//  *    its Form, for top-level components).
//  * @param {Boolean} whether to include comments in the generated code
//  * @returns {Array} code strings
//  * @private
//  */
// Blockly.JavaScript.getComponentPropertiesLines = function(formName, componentJson, parentName, 
//   includeComments) {
//   var code = [];
//   var componentName = componentJson.$Name;
//   var componentType = componentJson.$Type;
//   // generate the yail code that adds the component to its parent, followed by the code that
//   // sets each property of the component


//   // if (includeComments) {
//   //   code.push(Blockly.JavaScript.YAIL_COMMENT_MAJOR + componentName + Blockly.JavaScript.YAIL_LINE_FEED);
//   // }

//   // (add-component parentName componentType componentName)
//   code.push()


//   code.push(
//     //Blockly.JavaScript.YAIL_ADD_COMPONENT + 
//     parentName 
//     + " " // Blockly.JavaScript.YAIL_SPACER 
//     + componentType 
//     + " " // Blockly.JavaScript.YAIL_SPACER 
//     + componentName 
//     + " " // Blockly.JavaScript.YAIL_SPACER);
//   code = code.concat(Blockly.JavaScript.getPropertySettersLines(componentJson, componentName));
  
//   //code.push(Blockly.JavaScript.YAIL_CLOSE_BLOCK);
  
//   return code;
// }

// /**
//  * Generate Yail to set the properties for the Form described by componentJson.
//  * 
//  * @param {String} formName
//  * @param {String} componentJson JSON string describing the component
//  * @param {Boolean} whether to include comments in the generated code
//  * @returns {Array} code strings
//  * @private
//  */
// Blockly.JavaScript.getFormPropertiesLines = function(formName, componentJson, includeComments) {
//   var code = [];

//   // if (includeComments) {
//   //   code.push(Blockly.JavaScript.YAIL_COMMENT_MAJOR + formName + Blockly.JavaScript.YAIL_LINE_FEED);
//   // }
  
//   var yailForComponentProperties = Blockly.JavaScript.getPropertySettersLines(componentJson, formName);
//   if (yailForComponentProperties.length > 0) {
//     // getPropertySettersLine returns an array of lines.  So we need to 
//     // concatenate them (using join) before pushing them onto the Yail expression.
//     // WARNING:  There may be other type errors of this sort in this file, which
//     // (hopefully) will be uncovered in testing. Please
//     // be alert for these errors and check carefully.
    
//     ///////////////////////////////////////////////////////////////////////////////////////////////////                   -------------- WE NEED TO MAKE CHANGES HERE -----------------------
//     code.push(Blockly.JavaScript.YAIL_DO_AFTER_FORM_CREATION + yailForComponentProperties.join(" ") + 
//       Blockly.JavaScript.YAIL_CLOSE_BLOCK);
//   }
//   return code;
// }

// /**
//  * Generate the code to set property values for the specifed component.
//  *
//  * @param {Object} componentJson JSON String describing the component
//  * @param {String} componentName the name of the component (also present in the $Name field in
//  *    componentJson)
//  * @returns {Array} code strings
//  * @private
//  */
// Blockly.JavaScript.getPropertySettersLines = function(componentJson, componentName) {
//   var code = [];
//   for (var prop in componentJson) {
//     if (prop.charAt(0) != "$" && prop != "Uuid") {
//       code.push(Blockly.JavaScript.getPropertySetterString(componentName, componentJson.$Type, prop, 
//         componentJson[prop]));
//     }
//   }
//   return code;
// }

// *
//  * Generate the code to set a single property value.
//  *
//  * @param {String} componentName
//  * @param {String} propertyName
//  * @param {String} propertyValue
//  * @returns code string
//  * @private
 
// Blockly.JavaScript.getPropertySetterString = function(componentName, componentType, propertyName, 
//   propertyValue) {

//   // this needs to be changed to JavaScript code
//   var code = Blockly.JavaScript.YAIL_SET_AND_COERCE_PROPERTY + Blockly.JavaScript.YAIL_QUOTE + 
//     componentName + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.YAIL_QUOTE + propertyName + 
//     Blockly.JavaScript.YAIL_SPACER;
//   var propType = Blockly.JavaScript.YAIL_QUOTE + 
//     Blockly.ComponentTypes[componentType].properties[propertyName].type;
//   var value = Blockly.JavaScript.getPropertyValueString(propertyValue, propType);
//   code = code.concat(value + Blockly.JavaScript.YAIL_SPACER + propType + Blockly.JavaScript.YAIL_CLOSE_BLOCK);
//   return code;
// }

// /**
//  * Generate the Yail code for a property value. Special case handling when propertyType is
//  * "'number", "'boolean", "'component", the empty string, or null. For all other property values
//  * it returns the value as converted by Blockly.JavaScript.quotifyForREPL().
//  *
//  * @param {String} propertyValue
//  * @param {String} propertyType
//  * @returns code string
//  * @private
//  */
// Blockly.JavaScript.getPropertyValueString = function(propertyValue, propertyType) {
//   if (propertyType == "'number") {
//     if (propertyValue.match(Blockly.JavaScript.INTEGER_REGEXP) 
//             || propertyValue.match(Blockly.JavaScript.FLONUM_REGEXP)) { // integer
//       return propertyValue;
//     } else if (propertyValue.match(Blockly.JavaScript.SIMPLE_HEX_PREFIX + "[0-9A-F]+")) { // hex
//       return Blockly.JavaScript.YAIL_HEX_PREFIX + 
//         propertyValue.substring(Blockly.JavaScript.SIMPLE_HEX_PREFIX.length);
//     }
//   } else if (propertyType == "'boolean") {
//     if (-1 != propertyValue.indexOf("False")) {
//       return "#f";
//     } else if (-1 != propertyValue.indexOf("True")) {
//       return "#t";
//     }
//   } else if (propertyType == "'component") {
//     if (propertyValue == "") {
//       return "\"\"";
//     } else {
//       return Blockly.JavaScript.YAIL_GET_COMPONENT + propertyValue + ")";
//     }
//   }

//   if (propertyValue == "" || propertyValue == "null") {  // empty string
//     return "\"\"";
//   }
//   return Blockly.JavaScript.quotifyForREPL(propertyValue);
// }

// // /**
// //  * Generate the code to rename a component
// //  *
// //  * @param {String} oldName
// //  * @param {String} newName
// //  * @returns {String} code
// //  * @private
// //  */
// // Blockly.JavaScript.getComponentRenameString = function(oldName, newName) {
// //   return Blockly.JavaScript.YAIL_RENAME_COMPONENT + Blockly.JavaScript.quotifyForREPL(oldName)
// //     + Blockly.JavaScript.YAIL_SPACER + Blockly.JavaScript.quotifyForREPL(newName)
// //     + Blockly.JavaScript.YAIL_CLOSE_BLOCK;
// // }

// // /**
// //  * Transform a string to the Kawa input representation of the string, for sending to
// //  * the REPL, by using backslash to escape quotes and backslashes. But do not escape a backslash
// //  * if it is part of \n. Then enclose the result in quotes.
// //  * TODO: Extend this to a complete transformation that deals with the full set of formatting
// //  * characters.
// //  *
// //  * @param {String} s string to be quotified
// //  * @returns {String}
// //  * @private
// //  */
// // Blockly.JavaScript.quotifyForREPL = function(s) {
// //   if (!s) {
// //     return null;
// //   } else {
// //     var sb = [];
// //     sb.push('"');
// //     var len = s.length;
// //     var lastIndex = len - 1;
// //     for (var i = 0; i < len; i++) {
// //       c = s.charAt(i);
// //       if (c == '\\') {
// //         // If this is \n don't slashify the backslash
// //         // TODO(user): Make this cleaner and more general
// //         if (!(i == lastIndex) && s.charAt(i + 1) == 'n') {
// //           sb.push(c);
// //           sb.push(s.charAt(i + 1));
// //           i = i + 1;
// //         } else {
// //           sb.push('\\');
// //           sb.push(c);
// //         }
// //       } else if (c == '"') {
// //         sb.push('\\');
// //         sb.push(c);
// //       } else {
// //         var u = s.charCodeAt(i);  // unicode of c
// //         if (u < ' '.charCodeAt(0) || u > '~'.charCodeAt(0)) {
// //           // Replace any special chars with \u1234 unicode
// //           var hex = "000" + u.toString(16);
// //           hex = hex.substring(hex.length - 4);
// //           sb.push("\\u" + hex);
// //         } else {
// //           sb.push(c);
// //         }
// //       }
// //     }
// //     sb.push('"');
// //     return sb.join("");
// //   }
// // }

// // /**
// //  * Encode a string as a properly escaped Yail string, complete with quotes.
// //  * @param {String} string Text to encode.
// //  * @return {String} Yail string.
// //  * @private
// //  */

// // Blockly.JavaScript.quote_ = function(string) {
// //   string = Blockly.JavaScript.quotifyForREPL(string);
// //   if (!string) {                // quotifyForREPL can return null for
// //     string = '""';              // empty string
// //   }
// //   return string;
// // };

// // /**
// //  * Naked values are top-level blocks with outputs that aren't plugged into
// //  * anything.  A trailing semicolon is needed to make this legal.
// //  * @param {string} line Line of generated code.
// //  * @return {string} Legal line of code.
// //  */
// // Blockly.JavaScript.scrubNakedValue = function(line) {
// //   return line;
// // };

// // /**
// //  * Handles comments for the specified block and any connected value blocks.
// //  * Calls any statements following this block.
// //  * @param {!Blockly.Block} block The current block.
// //  * @param {string} code The Yail code created for this block.
// //  * @param {thisOnly} if true, only return code for this block and not any following statements
// //  *   note that calls of scrub_ with no 3rd parameter are equivalent to thisOnly=false, which
// //  *   was the behavior before this parameter was added.
// //  * @return {string} Yail code with comments and subsequent blocks added.
// //  * @private
// //  */
// // Blockly.JavaScript.scrub_ = function(block, code, thisOnly) {
// //   if (code === null) {
// //     // Block has handled code generation itself.
// //     return '';
// //   }
// //   var commentCode = '';
// //   /* TODO: fix for Yail comments?
// //   // Only collect comments for blocks that aren't inline.
// //   if (!block.outputConnection || !block.outputConnection.targetConnection) {
// //     // Collect comment for this block.
// //     var comment = block.getCommentText();
// //     if (comment) {
// //       commentCode += Blockly.Generator.prefixLines(comment, '// ') + '\n';
// //     }
// //     // Collect comments for all value arguments.
// //     // Don't collect comments for nested statements.
// //     for (var x = 0; x < block.inputList.length; x++) {
// //       if (block.inputList[x].type == Blockly.INPUT_VALUE) {
// //         var childBlock = block.inputList[x].targetBlock();
// //         if (childBlock) {
// //           var comment = Blockly.Generator.allNestedComments(childBlock);
// //           if (comment) {
// //             commentCode += Blockly.Generator.prefixLines(comment, '// ');
// //           }
// //         }
// //       }
// //     }
// //   }*/
// //   var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
// //   var nextCode = thisOnly ? "" : this.blockToCode(nextBlock);
// //   return commentCode + code + nextCode;
// // };

// // Blockly.JavaScript.getDebuggingYail = function() {
// //   var code = [];
// //   var componentMap = Blockly.Component.buildComponentMap([], [], false, false);
  
// //   var globalBlocks = componentMap.globals;
// //   for (var i = 0, block; block = globalBlocks[i]; i++) {
// //     code.push(Blockly.JavaScript.blockToCode(block));
// //   }
  
// //   var blocks = Blockly.mainWorkspace.getTopBlocks(true);
// //   for (var x = 0, block; block = blocks[x]; x++) {
    
// //     // generate Yail for each top-level language block
// //     if (!block.category) {
// //       continue;
// //     }
// //     code.push(Blockly.JavaScript.blockToCode(block));
// //   }
// //   return code.join('\n\n');
// // };

// // /**
// //  * Generate code for the specified block but *not* attached blocks.
// //  * @param {Blockly.Block} block The block to generate code for.
// //  * @return {string|!Array} For statement blocks, the generated code.
// //  *     For value blocks, an array containing the generated code and an
// //  *     operator order value.  Returns '' if block is null.
// //  */
// // Blockly.JavaScript.blockToCode1 = function(block) {
// //   if (!block) {
// //     return '';
// //   }
// //   var func = this[block.type];
// //   if (!func) {
// //     throw 'Language "' + name + '" does not know how to generate code ' +
// //         'for block type "' + block.type + '".';
// //   }
// //   var code = func.call(block);
// //   if (code instanceof Array) {
// //     // Value blocks return tuples of code and operator order.
// //     if (block.disabled) {
// //       code[0] = '';
// //     }
// //     return [this.scrub_(block, code[0], true), code[1]];
// //   } else {
// //     if (block.disabled) {
// //       code = '';
// //     }
// //     return this.scrub_(block, code, true);
// //   }
// // };


