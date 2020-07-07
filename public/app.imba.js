
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
let root;
let resets = '*,::before,::after {	box-sizing: border-box;	border-width: 0;	border-style: solid;	border-color: currentColor;}';

function setup(){
	
	if (!(root)) {
		
		if (root = document.documentElement) {
			
			return register(resets);
		}	}}
function register(styles,id){
	
	setup();
	var el = document.createElement('style');
	el.textContent = styles;
	document.head.appendChild(el);
	return;
}

class Flags {
	
	
	constructor(dom){
		
		this.dom = dom;
		this.string = "";
	}
	
	contains(ref){
		
		return this.dom.classList.contains(ref);
	}
	
	add(ref){
		
		if (this.contains(ref)) { return this }		this.string += (this.string ? ' ' : '') + ref;
		this.dom.classList.add(ref);
		// sync!
		return this;
	}
	
	remove(ref){
		
		if (!(this.contains(ref))) { return this }		var regex = new RegExp('(^|\\s)*' + ref + '(\\s|$)*','g');
		this.string = this.string.replace(regex,'');
		this.dom.classList.remove(ref);
		// sync!
		return this;
	}
	
	toggle(ref,bool){
		
		if (bool === undefined) { bool = !(this.contains(ref)); }		return bool ? this.add(ref) : this.remove(ref);
	}
	
	valueOf(){
		
		return this.string;
	}
	
	toString(){
		
		return this.string;
	}
	
	sync(){
		
		return this.dom.flagSync$();
	}
}

function iter$(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }var raf = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : (function(blk) { return setTimeout(blk,1000 / 60); });


// Scheduler
class Scheduler {
	
	constructor(){
		var self = this;
		
		this.queue = [];
		this.stage = -1;
		this.batch = 0;
		this.scheduled = false;
		this.listeners = {};
		this.$promise = null;
		this.$resolve = null;
		this.$ticker = function(e) {
			
			self.scheduled = false;
			return self.tick(e);
		};
	}
	
	add(item,force){
		
		if (force || this.queue.indexOf(item) == -1) {
			
			this.queue.push(item);
		}		
		if (!(this.scheduled)) { return this.schedule() }	}
	
	listen(ns,item){
		var $listeners;
		
		($listeners = this.listeners)[ns] || ($listeners[ns] = new Set);
		return this.listeners[ns].add(item);
	}
	
	unlisten(ns,item){
		
		return this.listeners[ns] && this.listeners[ns].delete(item);
	}
	
	get promise(){
		var self = this;
		
		return this.$promise || (this.$promise = new Promise(function(resolve) {
			
			return self.$resolve = resolve;
		}));
	}
	
	tick(timestamp){
		var self = this;
		
		var items = this.queue;
		if (!(this.ts)) { this.ts = timestamp; }		this.dt = timestamp - this.ts;
		this.ts = timestamp;
		this.queue = [];
		this.stage = 1;
		this.batch++;
		
		if (items.length) {
			
			for (let i = 0, $items = iter$(items), $len = $items.length; i < $len; i++) {
				let item = $items[i];
				
				if (typeof item === 'string' && this.listeners[item]) {
					
					this.listeners[item].forEach(function(item) {
						
						if (item.tick instanceof Function) {
							
							return item.tick(self);
						} else if (item instanceof Function) {
							
							return item(self);
						}					});
				} else if (item instanceof Function) {
					
					item(this.dt,this);
				} else if (item.tick) {
					
					item.tick(this.dt,this);
				}			}		}		this.stage = 2;
		this.stage = this.scheduled ? 0 : -1;
		if (this.$promise) {
			
			this.$resolve(this);
			this.$promise = this.$resolve = null;
		}		return this;
	}
	
	schedule(){
		
		if (!(this.scheduled)) {
			
			this.scheduled = true;
			if (this.stage == -1) {
				
				this.stage = 0;
			}			raf(this.$ticker);
		}		return this;
	}
}

var {Document: Document,Node: Node$1,Text: Text$1,Comment: Comment$1,Element: Element$1,SVGElement: SVGElement,HTMLElement: HTMLElement,DocumentFragment: DocumentFragment,ShadowRoot: ShadowRoot$1,Event: Event,CustomEvent: CustomEvent$1,MouseEvent: MouseEvent,document: document$1} = window;

function iter$$1(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }
const keyCodes = {
	esc: [27],
	tab: [9],
	enter: [13],
	space: [32],
	up: [38],
	down: [40],
	left: [37],
	right: [39],
	del: [8,46]
};

Event.log$mod = function (...params){
	
	console.log(...params);
	return true;
};

// Skip unless matching selector
Event.sel$mod = function (expr){
	
	return !(!(this.event.target.matches(String(expr))));
	
};
Event.if$mod = function (expr){
	
	return !(!(expr));
	
};
Event.wait$mod = function (num = 250){
	
	return new Promise(function(_0) { return setTimeout(_0,num); });
	
};
Event.throttle$mod = function (ms = 250){
	var self = this;
	
	if (this.handler.throttled) { return false }	this.handler.throttled = true;
	
	let cl = this.element.flags.add('_cooldown_');
	
	this.handler.once('idle',function() {
		
		return setTimeout(function() {
			
			self.element.flags.remove('_cooldown_');
			return self.handler.throttled = false;
		},ms);
	});
	return true;
	
};
Event.flag$mod = function (name,sel){
	var self = this;
	
	// console.warn 'event flag',self,arguments,id,step
	let el = (sel instanceof globalThis.Element) ? sel : ((sel ? this.element.closest(sel) : this.element));
	if (!(el)) { return true }	let step = this.step;
	this.handler[step] = this.id;
	
	el.flags.add(name);
	let ts = Date.now();
	this.handler.once('idle',function() {
		
		let elapsed = Date.now() - ts;
		let delay = Math.max(250 - elapsed,0);
		return setTimeout(function() {
			
			// console.warn 'event flag after',self,handler[step],id,step
			if (self.handler[step] == self.id) { return el.flags.remove(name) }		},delay);
	});
	
	return true;
	
};
Event.busy$mod = function (sel){
	
	return Event.flag$mod.call(this,'busy',250,sel);
};

// could cache similar event handlers with the same parts
class EventHandler {
	
	constructor(params,closure){
		
		this.params = params;
		this.closure = closure;
	}
	
	getHandlerForMethod(el,name){
		
		if (!(el)) { return null }		return el[name] ? el : this.getHandlerForMethod(el.parentNode,name);
	}
	
	emit(name,...params){
		return imba.emit(this,name,params);
	}
	on(name,...params){
		return imba.listen(this,name,...params);
	}
	once(name,...params){
		return imba.once(this,name,...params);
	}
	un(name,...params){
		return imba.unlisten(this,name,...params);
	}
	
	async handleEvent(event){
		
		var target = event.target;
		var element = event.currentTarget;
		var mods = this.params;
		let commit = true;// self.params.length == 0
		
		this.count || (this.count = 0);
		
		let state = {
			element: element,
			event: event,
			modifiers: mods,
			handler: this,
			id: ++this.count,
			step: -1
		};
		
		if (event.handle$mod) {
			
			if (event.handle$mod.call(state,mods.options) == false) {
				
				return;
			}		}		
		let guard = Event[event.type + '$handle'];
		
		if (guard && guard.call(state,mods.options) == false) {
			
			return;
		}		
		this.currentEvents || (this.currentEvents = new Set);
		this.currentEvents.add(event);
		
		for (let $i = 0, $keys = Object.keys(mods), $l = $keys.length, handler, val; $i < $l; $i++){
			handler = $keys[$i];val = mods[handler];
			state.step++;
			
			if (handler[0] == '_') {
				
				continue;
			}			
			if (handler.indexOf('~') > 0) {
				
				handler = handler.split('~')[0];
			}			
			let modargs = null;
			let args = [event,this];
			let res = undefined;
			let context = null;
			let m;
			
			if (handler[0] == '$' && handler[1] == '_' && (val[0] instanceof Function)) {
				
				handler = val[0];
				args = [event,state].concat(val.slice(1));
				context = element;
			} else if (val instanceof Array) {
				
				args = val.slice();
				modargs = args;
				
				for (let i = 0, $items = iter$$1(args), $len = $items.length; i < $len; i++) {
					let par = $items[i];
					
					// what about fully nested arrays and objects?
					// ought to redirect this
					if (typeof par == 'string' && par[0] == '~' && par[1] == '$') {
						
						let name = par.slice(2);
						let chain = name.split('.');
						let value = state[chain.shift()] || event;
						
						for (let i = 0, $ary = iter$$1(chain), $len = $ary.length; i < $len; i++) {
							let part = $ary[i];
							
							value = value ? value[part] : undefined;
						}						
						args[i] = value;
					}				}			}			
			if (typeof handler == 'string' && (m = handler.match(/^(emit|flag)-(.+)$/))) {
				
				if (!(modargs)) { modargs = args = []; }				args.unshift(m[2]);
				handler = m[1];
			}			
			// console.log "handle part",i,handler,event.currentTarget
			// check if it is an array?
			if (handler == 'stop') {
				
				event.stopImmediatePropagation();
			} else if (handler == 'prevent') {
				
				event.preventDefault();
			} else if (handler == 'commit') {
				
				commit = true;
			} else if (handler == 'silence' || handler == 'silent') {
				
				commit = false;
			} else if (handler == 'ctrl') {
				
				if (!(event.ctrlKey)) { break; }			} else if (handler == 'alt') {
				
				if (!(event.altKey)) { break; }			} else if (handler == 'shift') {
				
				if (!(event.shiftKey)) { break; }			} else if (handler == 'meta') {
				
				if (!(event.metaKey)) { break; }			} else if (handler == 'self') {
				
				if (target != element) { break; }			} else if (handler == 'once') {
				
				// clean up bound data as well
				element.removeEventListener(event.type,this);
			} else if (handler == 'options') {
				
				continue;
			} else if (keyCodes[handler]) {
				
				if (keyCodes[handler].indexOf(event.keyCode) < 0) {
					
					break;
				}			} else if (handler == 'emit') {
				
				let name = args[0];
				let detail = args[1];// is custom event if not?
				let e = new CustomEvent(name,{bubbles: true,detail: detail});// : new Event(name)
				e.originalEvent = event;
				let customRes = element.dispatchEvent(e);
			} else if (typeof handler == 'string') {
				
				let fn = Event[handler + '$mod'] || Event[event.type + '$' + handler];
				
				if (fn instanceof Function) {
					
					handler = fn;
					context = state;
					args = modargs || [];
				} else if (handler[0] == '_') {
					
					handler = handler.slice(1);
					context = this.closure;
				} else {
					
					context = this.getHandlerForMethod(element,handler);
				}			}			
			if (handler instanceof Function) {
				
				res = handler.apply(context || element,args);
			} else if (context) {
				
				res = context[handler].apply(context,args);
			}			
			if (res && (res.then instanceof Function) && res != imba.scheduler.$promise) {
				
				if (commit) imba.$commit();
				// TODO what if await fails?
				res = await res;
			}			
			if (res === false) {
				
				break;
			}			
			state.value = res;
		}		
		if (commit) imba.$commit();
		this.currentEvents.delete(event);
		if (this.currentEvents.size == 0) {
			
			this.emit('idle');
		}		// what if the result is a promise
		return;
	}
}

class Touch {
	
	constructor(e){
		
		this.id = e.pointerId;
		this.t0 = Date.now();
		this.x0 = this.x = e.x;
		this.y0 = this.y = e.y;
		this.mx = this.my = 0;
		e.touch = this;
	}
	
	update(e){
		
		this.mx = e.x - this.x;
		this.my = e.y - this.x;
		this.x = e.x;
		this.y = e.y;
		return e.touch = this;
	}
	
	get dx(){
		
		return this.x - this.x0;
	}
	
	get dy(){
		
		return this.y - this.y0;
		
	}
	get dt(){
		
		return Date.now() - this.t0;
	}
}
Event.pointerdown$handle = function (){
	
	let e = this.event;
	let el = this.element;
	let handler = this.handler;
	if (handler.type != 'touch') { return true }	
	e.dx = e.dy = 0;
	handler.x0 = e.x;
	handler.y0 = e.y;
	handler.pointerId = e.pointerId;
	
	handler.touch = new Touch(e);
	
	let canceller = function() { return false; };
	let selstart = document.onselectstart;
	el.setPointerCapture(e.pointerId);
	
	el.addEventListener('pointermove',handler);
	el.addEventListener('pointerup',handler);
	document.onselectstart = canceller;
	
	el.flags.add('_touch_');
	
	el.addEventListener('pointerup',function(e) {
		
		el.releasePointerCapture(e.pointerId);
		el.removeEventListener('pointermove',handler);
		el.removeEventListener('pointerup',handler);
		handler.pointerId = null;
		if (handler.pointerFlag) {
			
			el.flags.remove(handler.pointerFlag);
		}		el.flags.remove('_touch_');
		return document.onselectstart = selstart;
	},{once: true});
	return true;
};

Event.pointermove$handle = function (){
	
	let h = this.handler;
	let e = this.event;
	let id = h.pointerId;
	if (id && e.pointerId != id) { return false }	if (h.touch) { h.touch.update(e); }	if (typeof h.x0 == 'number') {
		
		e.dx = e.x - h.x0;
		e.dy = e.y - h.y0;
	}	return true;
};


Event.pointerup$handle = function (){
	
	let h = this.handler;
	let e = this.event;
	let id = h.pointerId;
	if (id && e.pointerId != id) { return false }	if (h.touch) { h.touch.update(e); }	if (typeof h.x0 == 'number') {
		
		e.dx = e.x - h.x0;
		e.dy = e.y - h.y0;
	}	return true;
};

function iter$$2(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }function extend$(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}
extend$(DocumentFragment,{
	
	
	get $parent(){
		
		return this.up$ || this.$$parent;
	},
	
	// Called to make a documentFragment become a live fragment
	setup$(flags,options){
		
		this.$start = imba.document.createComment('start');
		this.$end = imba.document.createComment('end');
		
		this.$end.replaceWith$ = function(other) {
			
			this.parentNode.insertBefore(other,this);
			return other;
		};
		
		this.appendChild(this.$start);
		return this.appendChild(this.$end);
	},
	
	// when we for sure know that the only content should be
	// a single text node
	text$(item){
		
		if (!(this.$text)) {
			
			this.$text = this.insert$(item);
		} else {
			
			this.$text.textContent = item;
		}		return;
	},
	
	insert$(item,options,toReplace){
		
		if (this.$$parent) {
			
			// if the fragment is attached to a parent
			// we can just proxy the call through
			return this.$$parent.insert$(item,options,toReplace || this.$end);
		} else {
			
			return Element$1.prototype.insert$.call(this,item,options,toReplace || this.$end);
		}	},
	
	insertInto$(parent,before){
		
		if (!(this.$$parent)) {
			
			this.$$parent = parent;
			// console.log 'insertFrgment into',parent,Array.from(self.childNodes)
			parent.appendChild$(this);
		}		return this;
	},
	
	replaceWith$(other,parent){
		
		this.$start.insertBeforeBegin$(other);
		var el = this.$start;
		while (el){
			
			let next = el.nextSibling;
			this.appendChild(el);
			if (el == this.$end) { break; }			el = next;
			
		}		return other;
	},
	
	appendChild$(child){
		
		this.$end ? this.$end.insertBeforeBegin$(child) : this.appendChild(child);
		return child;
	},
	
	removeChild$(child){
		
		child.parentNode && child.parentNode.removeChild(child);
		return this;
	},
	
	isEmpty$(){
		
		let el = this.$start;
		let end = this.$end;
		
		while (el = el.nextSibling){
			
			if (el == end) { break; }			if ((el instanceof Element$1) || (el instanceof Text$1)) { return false }		}		return true;
	},
});


extend$(ShadowRoot$1,{
	
	get $parent(){
		
		return this.host;
	},
});

class TagCollection {
	
	constructor(f,parent){
		
		this.__F = f;
		this.$parent = parent;
		
		if (!((f & 128)) && (this instanceof KeyedTagFragment)) {
			
			this.$start = document$1.createComment('start');
			if (parent) { parent.appendChild$(this.$start); }		}		
		if (!(f & 256)) {
			
			this.$end = document$1.createComment('end');
			if (parent) { parent.appendChild$(this.$end); }		}		
		this.setup();
	}
	
	appendChild$(item,index){
		
		// we know that these items are dom elements
		if (this.$end && this.$parent) {
			
			this.$end.insertBeforeBegin$(item);
		} else if (this.$parent) {
			
			this.$parent.appendChild$(item);
		}		return;
	}
	
	replaceWith$(other){
		
		this.detachNodes();
		this.$end.insertBeforeBegin$(other);
		this.$parent.removeChild$(this.$end);
		this.$parent = null;
		return;
	}
	
	joinBefore$(before){
		
		return this.insertInto$(before.parentNode,before);
	}
	
	insertInto$(parent,before){
		
		if (!(this.$parent)) {
			
			this.$parent = parent;
			before ? before.insertBeforeBegin$(this.$end) : parent.appendChild$(this.$end);
			this.attachNodes();
		}		return this;
	}
	
	replace$(other){
		
		if (!(this.$parent)) {
			
			this.$parent = other.parentNode;
		}		other.replaceWith$(this.$end);
		this.attachNodes();
		return this;
		
	}
	setup(){
		
		return this;
	}
}
class KeyedTagFragment extends TagCollection {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	setup(){
		
		this.array = [];
		this.changes = new Map;
		this.dirty = false;
		return this.$ = {};
	}
	
	push(item,idx){
		
		// on first iteration we can merely run through
		if (!(this.__F & 1)) {
			
			this.array.push(item);
			this.appendChild$(item);
			return;
		}		
		let toReplace = this.array[idx];
		
		if (toReplace === item) ; else {
			
			this.dirty = true;
			// if this is a new item
			let prevIndex = this.array.indexOf(item);
			let changed = this.changes.get(item);
			
			if (prevIndex === -1) {
				
				// should we mark the one currently in slot as removed?
				this.array.splice(idx,0,item);
				this.insertChild(item,idx);
			} else if (prevIndex === idx + 1) {
				
				if (toReplace) {
					
					this.changes.set(toReplace,-1);
				}				this.array.splice(idx,1);
			} else {
				
				if (prevIndex >= 0) { this.array.splice(prevIndex,1); }				this.array.splice(idx,0,item);
				this.insertChild(item,idx);
			}			
			if (changed == -1) {
				
				this.changes.delete(item);
			}		}		return;
	}
	
	insertChild(item,index){
		
		if (index > 0) {
			
			let other = this.array[index - 1];
			// will fail with text nodes
			other.insertAfterEnd$(item);
		} else if (this.$start) {
			
			this.$start.insertAfterEnd$(item);
		} else {
			
			this.$parent.insertAfterBegin$(item);
		}		return;
	}
	
	removeChild(item,index){
		
		// self.map.delete(item)
		// what if this is a fragment or virtual node?
		if (item.parentNode == this.$parent) {
			
			this.$parent.removeChild(item);
		}		return;
	}
	
	attachNodes(){
		
		for (let i = 0, $items = iter$$2(this.array), $len = $items.length; i < $len; i++) {
			let item = $items[i];
			
			this.$end.insertBeforeBegin$(item);
		}		return;
	}
	
	detachNodes(){
		
		for (let $i = 0, $items = iter$$2(this.array), $len = $items.length; $i < $len; $i++) {
			let item = $items[$i];
			
			this.$parent.removeChild(item);
		}		return;
	}
	
	end$(index){
		var self = this;
		
		if (!(this.__F & 1)) {
			
			this.__F |= 1;
			return;
		}		
		if (this.dirty) {
			
			this.changes.forEach(function(pos,item) {
				
				if (pos == -1) {
					
					return self.removeChild(item);
				}			});
			this.changes.clear();
			this.dirty = false;
		}		
		// there are some items we should remove now
		if (this.array.length > index) {
			
			
			// remove the children below
			while (this.array.length > index){
				
				let item = this.array.pop();
				this.removeChild(item);
			}			// self.array.length = index
		}		return;
	}
} KeyedTagFragment.init$();
class IndexedTagFragment extends TagCollection {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	
	setup(){
		
		this.$ = [];
		return this.length = 0;
	}
	
	end$(len){
		
		let from = this.length;
		if (from == len || !(this.$parent)) { return }		let array = this.$;
		let par = this.$parent;
		
		if (from > len) {
			
			while (from > len){
				
				par.removeChild$(array[--from]);
			}		} else if (len > from) {
			
			while (len > from){
				
				this.appendChild$(array[from++]);
			}		}		this.length = len;
		return;
	}
	
	attachNodes(){
		
		for (let i = 0, $items = iter$$2(this.$), $len = $items.length; i < $len; i++) {
			let item = $items[i];
			
			if (i == this.length) { break; }			this.$end.insertBeforeBegin$(item);
		}		return;
	}
	
	detachNodes(){
		
		let i = 0;
		while (i < this.length){
			
			let item = this.$[i++];
			this.$parent.removeChild$(item);
		}		return;
	}
} IndexedTagFragment.init$();
function createLiveFragment(bitflags,options,par){
	
	var el = document$1.createDocumentFragment();
	el.setup$(bitflags,options);
	if (par) { el.up$ = par; }	return el;
}
function createIndexedFragment(bitflags,parent){
	
	return new IndexedTagFragment(bitflags,parent);
}
function createKeyedFragment(bitflags,parent){
	
	return new KeyedTagFragment(bitflags,parent);
}

class ImbaElement extends HTMLElement {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	constructor(){
		
		super();
		this.setup$();
		this.build();
	}
	
	setup$(){
		
		this.__slots = {};
		return this.__F = 0;
	}
	
	init$(){
		
		this.__F |= (1 | 2);
		return this;
		
	}
	flag$(str){
		
		this.className = this.flags$ext = str;
		return;
	}
	
	// returns the named slot - for context
	slot$(name,ctx){
		var $__slots;
		
		if (name == '__' && !(this.render)) {
			
			return this;
		}		
		return ($__slots = this.__slots)[name] || ($__slots[name] = imba.createLiveFragment(0,null,this));
	}
	
	// called immediately after construction 
	build(){
		
		return this;
	}
	
	// called before the first mount
	awaken(){
		
		return this;
	}
	
	// called when element is attached to document
	mount(){
		
		return this;
	}
	
	unmount(){
		
		return this;
	}
	
	// called after render
	rendered(){
		
		return this;
	}
	
	// called before element is stringified on server (SSR)
	dehydrate(){
		
		return this;
	}
	
	// called before awaken if element was not initially created via imba - on the client
	hydrate(){
		
		// should only autoschedule if we are not awakening inside a parent context that
		this.autoschedule = true;
		return this;
	}
	
	tick(){
		
		return this.commit();
	}
	
	// called when component is (re-)rendered from its parent
	visit(){
		
		return this.commit();
	}
	
	// Wrapper for rendering. Default implementation
	commit(){
		
		if (!(this.isRender())) { return this }		this.__F |= 256;
		this.render && this.render();
		this.rendered();
		return this.__F = (this.__F | 512) & ~256;
	}
	
	
	
	get autoschedule(){
		
		return (this.__F & 64) != 0;
	}
	
	set autoschedule(value){
		
		value ? ((this.__F |= 64)) : ((this.__F &= ~64));
	}
	
	isRender(){
		
		return true;
	}
	
	isMounting(){
		
		return (this.__F & 16) != 0;
	}
	
	isMounted(){
		
		return (this.__F & 32) != 0;
	}
	
	isAwakened(){
		
		return (this.__F & 8) != 0;
	}
	
	isRendered(){
		
		return (this.__F & 512) != 0;
	}
	
	isRendering(){
		
		return (this.__F & 256) != 0;
	}
	
	isScheduled(){
		
		return (this.__F & 128) != 0;
	}
	
	isHydrated(){
		
		return (this.__F & 2) != 0;
	}
	
	schedule(){
		
		imba.scheduler.listen('render',this);
		this.__F |= 128;
		return this;
	}
	
	unschedule(){
		
		imba.scheduler.unlisten('render',this);
		this.__F &= ~128;
		return this;
	}
	
	end$(){
		
		return this.visit();
	}
	
	connectedCallback(){
		
		let flags = this.__F;
		let inited = flags & 1;
		let awakened = flags & 8;
		
		// return if we are already in the process of mounting - or have mounted
		if (flags & (16 | 32)) {
			
			return;
		}		
		this.__F |= 16;
		
		if (!(inited)) {
			
			this.init$();
		}		
		if (!(flags & 2)) {
			
			this.flags$ext = this.className;
			this.hydrate();
			this.__F |= 2;
			this.commit();
		}		
		if (!(awakened)) {
			
			this.awaken();
			this.__F |= 8;
		}		
		let res = this.mount();
		if (res && (res.then instanceof Function)) {
			
			res.then(imba.commit);
		}		// else
		// if this.render and $EL_RENDERED$
		// 	this.render()
		flags = this.__F = (this.__F | 32) & ~16;
		
		if (flags & 64) {
			
			this.schedule();
		}		
		return this;
	}
	
	disconnectedCallback(){
		
		this.__F = this.__F & (~32 & ~16);
		if (this.__F & 128) { this.unschedule(); }		return this.unmount();
	}
} ImbaElement.init$();

function extend$$1(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}


extend$$1(SVGElement,{
	
	
	flag$(str){
		
		this.className.baseVal = this.flags$ext = str;
		return;
	},
	
	flagSelf$(str){
		var self = this;
		
		// if a tag receives flags from inside <self> we need to
		// redefine the flag-methods to later use both
		this.flag$ = function(str) { return self.flagSync$(self.flags$ext = str); };
		this.flagSelf$ = function(str) { return self.flagSync$(self.flags$own = str); };
		return this.flagSelf$(str);
	},
	
	flagSync$(){
		
		return this.className.baseVal = ((this.flags$ext || '') + ' ' + (this.flags$own || '') + ' ' + (this.$flags || ''));
	},
});

function extend$$2(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}var root$1 = ((typeof window !== 'undefined') ? window : (((typeof globalThis !== 'undefined') ? globalThis : null)));

var imba$1 = {
	version: '2.0.0',
	global: root$1,
	ctx: null,
	document: root$1.document
};

root$1.imba = imba$1;

root$1.customElements || (root$1.customElements = {
	define: function() { return true; },// console.log('no custom elements')
	get: function() { return true; }// console.log('no custom elements')
});

imba$1.setTimeout = function(fn,ms) {
	
	return setTimeout(function() {
		
		fn();
		return imba$1.$commit();
	},ms);
};

imba$1.setInterval = function(fn,ms) {
	
	return setInterval(function() {
		
		fn();
		return imba$1.$commit();
	},ms);
};

imba$1.clearInterval = root$1.clearInterval;
imba$1.clearTimeout = root$1.clearTimeout;

Object.defineProperty(imba$1,'flags',{get: function() { return imba$1.document.documentElement.classList; }});

imba$1.q$ = function (query,ctx){
	
	return ((ctx instanceof Element) ? ctx : document).querySelector(query);
};

imba$1.q$$ = function (query,ctx){
	
	return ((ctx instanceof Element) ? ctx : document).querySelectorAll(query);
};

const VALID_CSS_UNITS = {
	cm: 1,
	mm: 1,
	Q: 1,
	pc: 1,
	pt: 1,
	px: 1,
	em: 1,
	ex: 1,
	ch: 1,
	rem: 1,
	vw: 1,
	vh: 1,
	vmin: 1,
	vmax: 1,
	s: 1,
	ms: 1,
	fr: 1,
	'%': 1,
	in: 1,
	turn: 1,
	grad: 1,
	rad: 1,
	deg: 1,
	Hz: 1,
	kHz: 1
};

const CSS_STR_PROPS = {
	prefix: 1,
	suffix: 1,
	content: 1
};

const CSS_PX_PROPS = /^([xyz])$/;
const CSS_DIM_PROPS = /^([tlbr]|size|[whtlbr]|[mps][tlbrxy]?|[rcxy]?[gs])$/;

imba$1.toStyleValue = function (value,unit,key){
	
	let typ = typeof value;
	if (typ == 'number') {
		
		if (!(unit)) {
			
			if (CSS_PX_PROPS.test(key)) {
				
				unit = 'px';
			} else if (CSS_DIM_PROPS.test(key)) {
				
				unit = 'u';
			} else if (key == 'rotate') {
				
				unit = 'turn';
			}		}		
		if (unit) {
			
			if (VALID_CSS_UNITS[unit]) {
				
				// what if the unit is already set?
				return value + unit;
			} else if (unit == 'u') {
				
				return value * 4 + 'px';
			} else {
				
				return ("calc(var(--u_" + unit + ",1px) * " + value + ")");
			}		}	} else if (typ == 'string' && key) {
		
		if (CSS_STR_PROPS[key] && value[0] != '"' && value[0] != "'") {
			
			if (value.indexOf('"') >= 0) {
				
				if (value.indexOf("'") == -1) {
					
					value = "'" + value + "'";
				}			} else {
				
				value = '"' + value + '"';
			}		}	}	
	return value;
};

imba$1.inlineStyles = function (content,id){
	
	register(content);
	// var el = document.createElement('style')
	// el.textContent = styles
	// document.head.appendChild(el)
	return;
};

var dashRegex = /-./g;

imba$1.toCamelCase = function (str){
	
	if (str.indexOf('-') >= 0) {
		
		return str.replace(dashRegex,function(m) { return m.charAt(1).toUpperCase(); });
	} else {
		
		return str;
		
	}};


// Basic events - move to separate file?
var emit__ = function(event,args,node) {
	
	let prev;
	let cb;
	let ret;
	
	while ((prev = node) && (node = node.next)){
		
		if (cb = node.listener) {
			
			if (node.path && cb[node.path]) {
				
				ret = args ? cb[node.path].apply(cb,args) : cb[node.path]();
			} else {
				
				// check if it is a method?
				ret = args ? cb.apply(node,args) : cb.call(node);
			}		}		
		if (node.times && --node.times <= 0) {
			
			prev.next = node.next;
			node.listener = null;
		}	}	return;
};

// method for registering a listener on object
imba$1.listen = function (obj,event,listener,path){
	
	let cbs;
	let list;
	let tail;
	cbs = obj.__listeners__ || (obj.__listeners__ = {});
	list = cbs[event] || (cbs[event] = {});
	tail = list.tail || (list.tail = (list.next = {}));
	tail.listener = listener;
	tail.path = path;
	list.tail = tail.next = {};
	return tail;
};

// register a listener once
imba$1.once = function (obj,event,listener){
	
	let tail = imba$1.listen(obj,event,listener);
	tail.times = 1;
	return tail;
};

// remove a listener
imba$1.unlisten = function (obj,event,cb,meth){
	
	let node;
	let prev;
	let meta = obj.__listeners__;
	if (!(meta)) { return }	
	if (node = meta[event]) {
		
		while ((prev = node) && (node = node.next)){
			
			if (node == cb || node.listener == cb) {
				
				prev.next = node.next;
				// check for correct path as well?
				node.listener = null;
				break;
			}		}	}	return;
};

// emit event
imba$1.emit = function (obj,event,params){
	var cb;
	
	if (cb = obj.__listeners__) {
		
		if (cb[event]) { emit__(event,params,cb[event]); }		if (cb.all) { emit__(event,[event,params],cb.all); }	}	return;
};

imba$1.scheduler = new Scheduler();
imba$1.$commit = function() { return imba$1.scheduler.add('render'); };

imba$1.commit = function() {
	
	imba$1.scheduler.add('render');
	return imba$1.scheduler.promise;
};

imba$1.tick = function() {
	
	imba$1.commit();
	return imba$1.scheduler.promise;
};

/*
DOM
*/


imba$1.mount = function (mountable,into){
	
	let parent = into || document.body;
	let element = mountable;
	if (mountable instanceof Function) {
		
		let ctx = {_: parent};
		let tick = function() {
			
			imba$1.ctx = ctx;
			return mountable(ctx);
		};
		element = tick();
		imba$1.scheduler.listen('render',tick);
	} else {
		
		// automatic scheduling of element - even before
		// element.__schedule = yes
		element.__F |= 64;
	}	
	return parent.appendChild(element);
};

var proxyHandler = {
	get(target,name){
		
		let ctx = target;
		let val = undefined;
		while (ctx && val == undefined){
			
			if (ctx = ctx.$parent) {
				
				val = ctx[name];
			}		}		return val;
	}
};

extend$$2(Node,{
	
	
	get $context(){
		
		return this.$context_ || (this.$context_ = new Proxy(this,proxyHandler));
	},
	
	get $parent(){
		
		return this.up$ || this.parentNode;
	},
	
	init$(){
		
		return this;
	},
	
	// replace this with something else
	replaceWith$(other){
		
		if (!((other instanceof Node)) && other.replace$) {
			
			other.replace$(this);
		} else {
			
			this.parentNode.replaceChild(other,this);
		}		return other;
	},
	
	insertInto$(parent){
		
		parent.appendChild$(this);
		return this;
	},
	
	insertBefore$(el,prev){
		
		return this.insertBefore(el,prev);
	},
	
	insertBeforeBegin$(other){
		
		return this.parentNode.insertBefore(other,this);
	},
	
	insertAfterEnd$(other){
		
		if (this.nextSibling) {
			
			return this.nextSibling.insertBeforeBegin$(other);
		} else {
			
			return this.parentNode.appendChild(other);
		}	},
	
	insertAfterBegin$(other){
		
		if (this.childNodes[0]) {
			
			return this.childNodes[0].insertBeforeBegin$(other);
		} else {
			
			return this.appendChild(other);
		}	},
});

extend$$2(Comment,{
	
	// replace this with something else
	replaceWith$(other){
		
		if (other && other.joinBefore$) {
			
			other.joinBefore$(this);
		} else {
			
			this.parentNode.insertBefore$(other,this);
		}		// other.insertBeforeBegin$(this)
		this.parentNode.removeChild(this);
		// self.parentNode.replaceChild(other,this)
		return other;
	},
});

// what if this is in a webworker?
extend$$2(Element,{
	
	
	emit(name,detail,o = {bubbles: true}){
		
		if (detail != undefined) { o.detail = detail; }		let event = new CustomEvent(name,o);
		let res = this.dispatchEvent(event);
		return event;
	},
	
	slot$(name,ctx){
		
		return this;
	},
	
	on$(type,mods,scope){
		
		
		let check = 'on$' + type;
		let handler;
		
		// check if a custom handler exists for this type?
		if (this[check] instanceof Function) {
			
			handler = this[check](mods,scope);
		}		
		handler = new EventHandler(mods,scope);
		let capture = mods.capture;
		let passive = mods.passive;
		
		let o = capture;
		
		if (passive) {
			
			o = {passive: passive,capture: capture};
		}		
		if (type == 'touch') {
			
			type = 'pointerdown';
			handler.type = 'touch';
		}		
		this.addEventListener(type,handler,o);
		return handler;
	},
	
	// inline in files or remove all together?
	text$(item){
		
		this.textContent = item;
		return this;
	},
	
	insert$(item,f,prev){
		
		let type = typeof item;
		
		if (type === 'undefined' || item === null) {
			
			// what if the prev value was the same?
			if (prev && (prev instanceof Comment)) {
				
				return prev;
			}			
			let el = document.createComment('');
			prev ? prev.replaceWith$(el) : el.insertInto$(this);
			return el;
		}		
		// dont reinsert again
		if (item === prev) {
			
			return item;
		} else if (type !== 'object') {
			
			let res;
			let txt = item;
			
			if ((f & 128) && (f & 256)) {
				
				// FIXME what if the previous one was not text? Possibly dangerous
				// when we set this on a fragment - it essentially replaces the whole
				// fragment?
				this.textContent = txt;
				return;
			}			
			if (prev) {
				
				if (prev instanceof Text) {
					
					prev.textContent = txt;
					return prev;
				} else {
					
					res = document.createTextNode(txt);
					prev.replaceWith$(res,this);
					return res;
				}			} else {
				
				this.appendChild$(res = document.createTextNode(txt));
				return res;
			}		} else {
			
			prev ? prev.replaceWith$(item,this) : item.insertInto$(this);
			return item;
		}		
	},
	get flags(){
		
		if (!(this.$flags)) {
			
			// unless deopted - we want to first cache the extflags
			this.$flags = new Flags(this);
			if (this.flag$ == Element.prototype.flag$) {
				
				this.flags$ext = this.className;
			}			this.flagDeopt$();
		}		return this.$flags;
	},
	
	flag$(str){
		
		this.className = str;
		return;
		
	},
	flagDeopt$(){
		var self = this;
		
		this.flag$ = function(str) { return self.flagSync$(self.flags$ext = str); };
		this.flagSelf$ = function(str) { return self.flagSync$(self.flags$own = str); };
		return;
	},
	
	flagSelf$(str){
		
		// if a tag receives flags from inside <self> we need to
		// redefine the flag-methods to later use both
		this.flagDeopt$();
		return this.flagSelf$(str);
		
		// let existing = (flags$ext ||= self.className)
		// self.flag$ = do(str) self.flagSync$(flags$ext = str)
		// self.flagSelf$ = do(str) self.flagSync$(flags$own = str)
		// self.className = (existing ? existing + ' ' : '') + (flags$own = str)
		// return
	},
	
	flagSync$(){
		
		return this.className = ((this.flags$ext || '') + ' ' + (this.flags$own || '') + ' ' + (this.$flags || ''));
	},
	
	open$(){
		
		return this;
	},
	
	close$(){
		
		return this;
	},
	
	end$(){
		
		if (this.render) { this.render(); }		return;
	},
	
	css$(key,value,mods){
		
		return this.style[key] = value;
		
	},
	css$var(name,value,unit,key){
		
		let cssval = imba$1.toStyleValue(value,unit,key);
		this.style.setProperty(name,cssval);
		return;
	},
});

Element.prototype.appendChild$ = Element.prototype.appendChild;
Element.prototype.removeChild$ = Element.prototype.removeChild;
Element.prototype.insertBefore$ = Element.prototype.insertBefore;
Element.prototype.replaceChild$ = Element.prototype.replaceChild;
Element.prototype.set$ = Element.prototype.setAttribute;
Element.prototype.setns$ = Element.prototype.setAttributeNS;

ShadowRoot.prototype.insert$ = Element.prototype.insert$;
ShadowRoot.prototype.appendChild$ = Element.prototype.appendChild$;

imba$1.createLiveFragment = createLiveFragment;
imba$1.createIndexedFragment = createIndexedFragment;
imba$1.createKeyedFragment = createKeyedFragment;

const CustomTagConstructors = {};

class ImbaElementRegistry {
	
	
	constructor(){
		
		this.types = {};
	}
	
	lookup(name){
		
		return this.types[name];
	}
	
	get(name,klass){
		
		if (!(name) || name == 'component') { return ImbaElement }		if (this.types[name]) { return this.types[name] }		if (klass && root$1[klass]) { return root$1[klass] }		return root$1.customElements.get(name) || ImbaElement;
	}
	
	create(name){
		
		if (this.types[name]) {
			
			// TODO refactor
			return this.types[name].create$();
		} else {
			
			return document.createElement(name);
		}	}
	
	define(name,klass,options){
		
		this.types[name] = klass;
		klass.nodeName = name;
		
		let proto = klass.prototype;
		
		// if proto.render && proto.end$ == Element.prototype.end$
		// proto.end$ = proto.render
		
		if (options && options.extends) {
			
			CustomTagConstructors[name] = klass;
		} else {
			
			root$1.customElements.define(name,klass);
		}		return klass;
	}
}
imba$1.tags = new ImbaElementRegistry();


// root.customElements.define('imba-element',ImbaElement)

imba$1.createElement = function (name,parent,flags,text){
	
	var el = document.createElement(name);
	
	if (flags) { el.className = flags; }	
	if (text !== null) {
		
		el.text$(text);
	}	
	if (parent && (parent instanceof Node)) {
		
		el.insertInto$(parent);
	}	
	return el;
};

imba$1.createComponent = function (name,parent,flags,text){
	
	// the component could have a different web-components name?
	var el;
	
	if (typeof name != 'string') {
		
		if (name && name.nodeName) {
			
			name = name.nodeName;
		}	}	
	if (CustomTagConstructors[name]) {
		
		el = CustomTagConstructors[name].create$(el);
		el.slot$ = ImbaElement.prototype.slot$;
		el.__slots = {};
	} else {
		
		el = document.createElement(name);
	}	
	el.up$ = parent;
	el.init$();
	
	if (text !== null) {
		
		el.slot$('__').text$(text);
	}	
	// mark the classes as external static flags?
	if (flags) {
		
		el.flag$(flags);
	}	return el;
};

imba$1.createSVGElement = function (name,parent,flags,text){
	
	var el = document.createElementNS("http://www.w3.org/2000/svg",name);
	if (flags) {
		
		{
			
			el.className.baseVal = flags;
		}	}	if (parent && (parent instanceof Node)) {
		
		el.insertInto$(parent);
	}	return el;
};

// import './intersect'

function iter$$3(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }function extend$$3(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}const toBind = {
	INPUT: true,
	SELECT: true,
	TEXTAREA: true,
	BUTTON: true
};

var isGroup = function(obj) {
	
	return (obj instanceof Array) || (obj && (obj.has instanceof Function));
};

var bindHas = function(object,value) {
	
	if (object instanceof Array) {
		
		return object.indexOf(value) >= 0;
	} else if (object && (object.has instanceof Function)) {
		
		return object.has(value);
	} else if (object && (object.contains instanceof Function)) {
		
		return object.contains(value);
	} else if (object == value) {
		
		return true;
	} else {
		
		return false;
	}};

var bindAdd = function(object,value) {
	
	if (object instanceof Array) {
		
		return object.push(value);
	} else if (object && (object.add instanceof Function)) {
		
		return object.add(value);
	}};

var bindRemove = function(object,value) {
	
	if (object instanceof Array) {
		
		let idx = object.indexOf(value);
		if (idx >= 0) { return object.splice(idx,1) }	} else if (object && (object.delete instanceof Function)) {
		
		return object.delete(value);
	}};

function createProxyProperty(target){
	
	function getter(){
		
		return target[0] ? target[0][target[1]] : undefined;
	}	
	function setter(v){
		
		return target[0] ? ((target[0][target[1]] = v)) : null;
	}	
	return {
		get: getter,
		set: setter
	};
}
/*
Data binding
*/

extend$$3(Element,{
	
	getRichValue(){
		
		return this.value;
	},
	
	setRichValue(value){
		
		return this.value = value;
	},
	
	bind$(key,value){
		
		let o = value || [];
		
		if (key == 'data' && !(this.$$bound) && toBind[this.nodeName]) {
			
			this.$$bound = true;
			if (this.change$) {
				
				this.addEventListener('change',this.change$ = this.change$.bind(this));
			}			if (this.input$) {
				
				this.addEventListener('input',this.input$ = this.input$.bind(this),{capture: true});
			}			if (this.click$) {
				
				this.addEventListener('click',this.click$ = this.click$.bind(this),{capture: true});
			}			// this.on$('change',{_change$: true},this) if this.change$
			// this.on$('input',{capture: true,_input$: true},this) if this.input$
		}		
		Object.defineProperty(this,key,(o instanceof Array) ? createProxyProperty(o) : o);
		return o;
	},
});

Object.defineProperty(Element.prototype,'richValue',{
	get(){
		
		return this.getRichValue();
	},
	set(v){
		
		return this.setRichValue(v);
	}
});

extend$$3(HTMLSelectElement,{
	
	
	change$(e){
		
		let model = this.data;
		let prev = this.$$value;
		this.$$value = undefined;
		let values = this.getRichValue();
		
		if (this.multiple) {
			
			if (prev) {
				
				for (let $i = 0, $items = iter$$3(prev), $len = $items.length; $i < $len; $i++) {
					let value = $items[$i];
					if (values.indexOf(value) != -1) { continue; }					
					bindRemove(model,value);
				}			}			
			for (let $i = 0, $items = iter$$3(values), $len = $items.length; $i < $len; $i++) {
				let value = $items[$i];
				
				if (!(prev) || prev.indexOf(value) == -1) {
					
					bindAdd(model,value);
				}			}		} else {
			
			this.data = values[0];
		}		imba.commit();
		return this;
	},
	
	getRichValue(){
		var $res;
		
		if (this.$$value) {
			
			return this.$$value;
		}		
		$res = [];
		for (let $i = 0, $items = iter$$3(this.selectedOptions), $len = $items.length; $i < $len; $i++) {
			let o = $items[$i];
			
			$res.push(o.richValue);
		}		return this.$$value = $res;
	},
	
	syncValue(){
		
		let model = this.data;
		
		if (this.multiple) {
			
			let vals = [];
			for (let i = 0, $items = iter$$3(this.options), $len = $items.length; i < $len; i++) {
				let option = $items[i];
				
				let val = option.richValue;
				let sel = bindHas(model,val);
				option.selected = sel;
				if (sel) { vals.push(val); }			}			this.$$value = vals;
		} else {
			
			for (let i = 0, $items = iter$$3(this.options), $len = $items.length; i < $len; i++) {
				let option = $items[i];
				
				let val = option.richValue;
				if (val == model) {
					
					this.$$value = [val];
					this.selectedIndex = i;break;
				}			}		}		return;
	},
	
	end$(){
		
		return this.syncValue();
	},
});

extend$$3(HTMLOptionElement,{
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
	},
});

extend$$3(HTMLTextAreaElement,{
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
	},
	
	input$(e){
		
		this.data = this.value;
		return imba.commit();
	},
	
	end$(){
		
		if (this.$$bound && this.value != this.data) {
			
			return this.value = this.data;
		}	},
});


extend$$3(HTMLInputElement,{
	
	
	input$(e){
		
		let typ = this.type;
		
		if (typ == 'checkbox' || typ == 'radio') {
			
			return;
		}		
		this.$$value = undefined;
		this.data = this.richValue;
		return imba.commit();
	},
	
	change$(e){
		
		let model = this.data;
		let val = this.richValue;
		
		if (this.type == 'checkbox' || this.type == 'radio') {
			
			let checked = this.checked;
			if (isGroup(model)) {
				
				checked ? bindAdd(model,val) : bindRemove(model,val);
			} else {
				
				this.data = checked ? val : false;
			}		}		return imba.commit();
	},
	
	setRichValue(value){
		
		if (this.$$value !== value) {
			
			this.$$value = value;
			
			if (this.value !== value) {
				
				this.value = value;
			}		}		return;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		
		let value = this.value;
		let typ = this.type;
		
		if (typ == 'range' || typ == 'number') {
			
			value = this.valueAsNumber;
			if (Number.isNaN(value)) { value = null; }		} else if (typ == 'checkbox') {
			
			if (value == undefined || value === 'on') { value = true; }		}		
		return value;
	},
	
	end$(){
		
		if (this.$$bound) {
			
			let typ = this.type;
			if (typ == 'checkbox' || typ == 'radio') {
				
				let val = this.data;
				if (val === true || val === false || val == null) {
					
					this.checked = !(!(val));
				} else {
					
					this.checked = bindHas(val,this.richValue);
				}			} else {
				
				this.richValue = this.data;
			}		}		return;
		
	},
});
extend$$3(HTMLButtonElement,{
	
	
	get checked(){
		
		return this.$checked;
		
	},
	set checked(val){
		
		if (val != this.$checked) {
			
			this.$checked = val;
			this.flags.toggle('checked',!(!(val)));
		}	},
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
		
	},
	click$(e){
		
		let data = this.data;
		let toggled = this.checked;
		let val = this.richValue;
		// if self.type == 'checkbox' or self.type == 'radio'
		if (isGroup(data)) {
			
			toggled ? bindRemove(data,val) : bindAdd(data,val);
		} else {
			
			this.data = toggled ? null : val;
		}		
		return imba.commit();
	},
	
	end$(){
		
		if (this.$$bound) {
			
			let val = this.data;
			if (val === true || val === false || val == null) {
				
				this.checked = !(!(val));
			} else {
				
				this.checked = bindHas(val,this.richValue);
			}		}		return;
	},
});

function iter$$4(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }class Maps extends imba.tags.get('component','ImbaElement') {
	
	
	mount(){
		
		const OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		const OSM_ATTRIB = '&copy;  <a  href="http://openstreetmap.org/copyright">OpenStreetMap</a>  contributors';
		let maps = [];
		
		for (let $i = 0, $items = iter$$4(this.data.aqis), $len = $items.length; $i < $len; $i++) {
			let aqi = $items[$i];
			
			const osmLayer = L.tileLayer(OSM_URL,{attribution: OSM_ATTRIB});
			const WAQI_ATTR = 'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';
			let WAQI_URL = 'https://tiles.waqi.info/tiles/' + aqi.id + '/{z}/{x}/{y}.png?token=' + this.data.token;
			
			let waqiLayer = L.tileLayer(WAQI_URL,{attribution: WAQI_ATTR});
			let map = L.map(aqi.id).setView([48.2,31.3],5);
			map.addLayer(osmLayer).addLayer(waqiLayer);
			maps.push(map);
		}		
		let i = 0;
		var $res = [];while (i < maps.length){
			
			let j = 0;
			while (j < maps.length){
				
				if (i != j) {
					
					maps[i].sync(maps[j]);
				}				j++;
			}			$res.push(i++);
		}return $res;
	}
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $k$1, $c$1, $t$2, $b$2, $d$2, $c$2, $t$3, $v$3;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$t$1 = $c$0.d || ($c$0.d = $t$1 = imba.createIndexedFragment(384,$t$0));
		$k$1 = 0;
		$c$1=$t$1.$;
		for (let $i = 0, $items = iter$$4(this.data.aqis), $len = $items.length; $i < $len; $i++) {
			let aqi = $items[$i];
			
			$t$2 = ($b$2=$d$2=1,$c$1[$k$1]) || ($b$2=$d$2=0,$c$1[$k$1] = $t$2=imba.createElement('div',$t$1,'mapbox',null));
			$b$2||($t$2.up$=$t$1);
			$c$2=$t$2.$e || ($t$2.$e={});
			$t$3 = $c$2.f || ($c$2.f = $t$3=imba.createElement('h2',$t$2,null,null));
			($v$3=aqi.name,($v$3===$c$2.g&&$b$2) || ($c$2.g_ = $t$3.insert$($c$2.g=$v$3,384,$c$2.g_)));
			$b$2 || ($t$3=imba.createElement('div',$t$2,'map',null));
			$b$2 || ($t$3.id=`${aqi.id}`);
			$k$1++;
		}$t$1.end$($k$1);
		$t$0.close$($d$0);
		return $t$0;
	}
	
	
	
	
	
	
	
} imba.tags.define('maps-wchnp7',Maps,{});

imba.inlineStyles("maps-wchnp7:not(#_) {background: hsla(254.37,41.04%,33.92%,100%);\ncolor: hsla(267.57,90.24%,91.96%,100%);\npadding: 16px;\nborder-radius: 12px;}\n\nmaps-wchnp7 .mapbox:not(#_) {display: flex;\nflex-direction: column;}\n\nmaps-wchnp7 .mapbox > div:not(#_) {height: calc(320px + 0rem);\nborder-radius: 8px;}\n\nmaps-wchnp7:not(#_) {width: 96vw;\ndisplay: grid;\ngap: 16px;\n--u_rg: 16px;\n--u_cg: 16px;\ngrid-template-columns: repeat(auto-fit, minmax(420px, 1fr));\ngrid-auto-rows: 340px;\nmargin-bottom: 8vh;}\n\n");
/*
maps-wchnp7:not(#_) {background: hsla(254.37,41.04%,33.92%,100%);
color: hsla(267.57,90.24%,91.96%,100%);
padding: 16px;
border-radius: 12px;}

maps-wchnp7 .mapbox:not(#_) {display: flex;
flex-direction: column;}

maps-wchnp7 .mapbox > div:not(#_) {height: calc(320px + 0rem);
border-radius: 8px;}

maps-wchnp7:not(#_) {width: 96vw;
display: grid;
gap: 16px;
--u_rg: 16px;
--u_cg: 16px;
grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
grid-auto-rows: 340px;
margin-bottom: 8vh;}


*/

function iter$$5(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }class CityWidgets extends imba.tags.get('component','ImbaElement') {
	
	mount(){
		
		let aqiWidgetConfig = [];
		this.data.stations.forEach(function(station) { return aqiWidgetConfig.push({
			container: station.uid,
			city: station.station.url,
			display: "%details"
		}); });
		return window._aqiFeed(aqiWidgetConfig);
	}
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $k$1, $c$1, $t$2, $b$2, $d$2, $c$2, $v$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$t$1 = $c$0.d || ($c$0.d = $t$1 = imba.createIndexedFragment(384,$t$0));
		$k$1 = 0;
		$c$1=$t$1.$;
		for (let $i = 0, $items = iter$$5(this.data.stations), $len = $items.length; $i < $len; $i++) {
			let station = $items[$i];
			
			$t$2 = ($b$2=$d$2=1,$c$1[$k$1]) || ($b$2=$d$2=0,$c$1[$k$1] = $t$2=imba.createElement('a',$t$1,null,null));
			$b$2||($t$2.up$=$t$1);
			$c$2=$t$2.$e || ($t$2.$e={});
			($v$2=station.uid,$v$2===$c$2.f || ($t$2.id=$c$2.f=$v$2));
			$b$2 || ($t$2.target="_blank");
			($v$2="https://aqicn.org/city/" + station.station.url,$v$2===$c$2.g || ($t$2.href=$c$2.g=$v$2));
			$k$1++;
		}$t$1.end$($k$1);
		$t$0.close$($d$0);
		return $t$0;
	}
	
	
	
	
} imba.tags.define('city-widgets-ww4g6j',CityWidgets,{});

imba.inlineStyles("city-widgets-ww4g6j:not(#_) {width: 96vw;\ndisplay: grid;\ngap: 16px;\n--u_rg: 16px;\n--u_cg: 16px;\ngrid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\ngrid-auto-rows: 220px;\ngrid-auto-flow: dense;\nmargin-top: 32px;}\n\ncity-widgets-ww4g6j div:not(#_) {animation: show_up 300ms ease;}\n\n");
/*
city-widgets-ww4g6j:not(#_) {width: 96vw;
display: grid;
gap: 16px;
--u_rg: 16px;
--u_cg: 16px;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
grid-auto-rows: 220px;
grid-auto-flow: dense;
margin-top: 32px;}

city-widgets-ww4g6j div:not(#_) {animation: show_up 300ms ease;}


*/

class Logo extends imba.tags.get('component','ImbaElement') {
	
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $t$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$b$0 || ($t$1=imba.createSVGElement('svg',$t$0,null,null));
		$b$0 || ($t$1.set$('width',"100%"));
		$b$0 || ($t$1.set$('height',"100%"));
		$b$0 || ($t$1.set$('viewBox',"0 0 1402 519"));
		$b$0 || ($t$1.set$('version',"1.1"));
		$b$0 || ($t$1.set$('xmlns',"http://www.w3.org/2000/svg"));
		$b$0 || ($t$1.setns$('xmlns','xlink',"http://www.w3.org/1999/xlink"));
		$b$0 || ($t$1.setns$('xml','space',"preserve"));
		$b$0 || ($t$1.setns$('xmlns','serif',"http://www.serif.com/"));
		$b$0 || ($t$1.set$('style',"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"));
		$b$0 || ($t$2=imba.createSVGElement('path',$t$1,'qvy3dzd',null));
		$b$0 || ($t$2.set$('d',"M517.255,63.07c-15.061,59.297 -150.964,352.842 -155.413,398.842c-3.516,36.354 33.018,71.872 40.497,48.781c22.443,-69.298 108.006,-210.335 136.19,-234.607c-6.121,14.563 -30.705,94.68 -31.983,113.547c-1.934,28.56 34.355,45.038 41.983,22.464c25.895,-76.636 105.733,-168.831 105.733,-168.831c0,0 -23.333,86.869 -23.843,99.638c-1.184,29.588 24.317,51.98 40.345,36.407c15.46,-15.022 56.329,-78.489 74.588,-100.448c52.47,-63.106 95.109,-71.959 111.526,-68.832c1.893,7.24 -15.692,33.967 -24.458,41.046c-31.9,18.357 -64.001,53.544 -69.192,71.158c-5.662,19.212 19.287,42.212 32.941,35.535c39.169,-19.153 81.287,-95.183 83.103,-96.693c19.269,-16.017 65.005,-30.846 65.005,-30.846c-45.199,34.012 -62.066,107.263 -10.149,108.036c11.863,0.177 41.066,-11.817 41.066,-11.817c0.572,0.572 -12.106,27.448 -14.327,35.648c-3.953,14.594 30.161,38.826 31.758,23.354c0.724,-7.025 43.75,-110.666 74.997,-158.901c19.195,-29.63 28.456,-62.614 22.328,-82.455c-4.843,-15.679 -27.988,-37.226 -60.42,-37.344c-30.141,-0.111 -94.186,17.842 -106.701,40.575c-9.826,17.85 8.948,40.837 17.509,34.386c15.918,-11.994 59.018,-35.439 89.725,-35.932c23.84,-0.383 22.751,14.084 22.751,14.084c-53.369,4.534 -155.79,55.079 -155.79,55.079c11.899,-44.904 -52.029,-58.795 -92.35,-32.394c14.2,-20.124 72.442,-119.226 79.362,-145.257c6.458,-24.297 -31.082,-48.368 -38.181,-30.183c-17.071,43.727 -173.77,305.565 -173.77,305.565c0,-3.033 50.447,-119.001 49.924,-127.204c-0.543,-8.525 -30.667,-25.356 -35.55,-22.827c-16.58,8.586 -92.442,87.831 -92.442,87.831c9.743,-26.114 41.852,-93.968 45.058,-98.906c8.471,-13.048 -31.669,-36.243 -38.953,-30.258c-14.614,12.006 -100.034,140.036 -119.014,165.136c-0.089,0.117 80.584,-173.588 81.854,-193.049c1.149,-17.613 -39.593,-54.4 -45.707,-30.328Zm369.083,302.851c27.827,-2.413 49.028,29.217 32.406,33.744c-15.998,4.356 -104.512,16.833 -196.802,39.419c-112.255,27.472 -230.576,65.587 -236.861,67.534c-32.392,10.036 -16.879,-35.911 2.839,-42.691c157.745,-54.24 374.098,-95.897 398.418,-98.006Zm-484.789,-259.494c-8.773,40.076 -94.052,229.342 -104.996,272.23c-7.778,30.477 32.359,68.742 39.066,43.688c19.711,-73.633 107.559,-248.579 112.467,-285.016c4.229,-31.404 -42.252,-50.479 -46.537,-30.902Zm681.017,153.099c5.957,-10.246 17.805,-15.526 29.406,-13.105c28.519,5.927 64.324,8.849 110.97,6.677c32.046,-1.493 -15.299,51.714 -59.441,47.523c-31.168,-2.958 -58.556,-11.97 -75.306,-21.03c-3.41,-1.881 -5.926,-5.049 -6.986,-8.796c-1.06,-3.748 -0.576,-7.764 1.344,-11.153c-0.042,-0.023 -0.042,-0.023 0.013,-0.116Zm-788.021,-14.209c5.357,-1.355 11.016,0.492 14.541,4.747c3.525,4.255 4.289,10.158 1.962,15.17c0.065,0.036 0.063,0.041 0.061,0.046c-7.424,15.987 -22.078,27.434 -39.387,30.766c-9.799,1.861 -20.858,3.408 -33.153,4.575c-44.143,4.191 -91.487,-49.016 -59.441,-47.523c47.704,2.221 85.733,-1.288 115.417,-7.781Zm652.282,50.416c21.238,-1.136 81.696,-66.601 84.629,-87.328c0,0 -79.409,49.957 -84.629,87.328Zm-605.431,-100.409c-4.763,12.017 -15.237,20.841 -27.888,23.493c-58.312,12.226 -142.145,7.468 -183.476,-2.556c-40.175,-9.743 -66.58,-68.204 -40.495,-59.487c60.58,20.246 173.265,26.937 237.043,19.706c4.875,-0.672 9.742,1.292 12.785,5.16c3.044,3.868 3.809,9.059 2.01,13.641c0.033,0.013 0.033,0.013 0.021,0.043Zm771.512,3.722c3.759,-11.64 14.856,-19.314 27.074,-18.722c59.241,2.372 128.887,-8.958 172.551,-23.55c26.085,-8.717 -3.32,49.744 -43.495,59.487c-33.265,8.068 -96.162,11.615 -142.488,4.941c-4.939,-0.775 -9.292,-3.668 -11.919,-7.921c-2.627,-4.253 -3.265,-9.441 -1.747,-14.204c0.013,0.004 0.013,0.004 0.024,-0.031Zm-747.307,-72.314c-3.92,12.888 -15.316,22.073 -28.743,23.165c-117.108,8.424 -267.542,-18.636 -310.992,-63.46c-32.654,-33.687 -30.563,-98.47 -11.993,-77.88c70.369,78.022 243.35,100.48 337.541,99.488c4.641,-0.104 9.05,2.023 11.857,5.72c2.807,3.697 3.671,8.516 2.323,12.958c0.009,0.003 0.009,0.003 0.007,0.009Zm753.823,9.05c-2.173,-6.738 -1.129,-14.101 2.831,-19.97c3.96,-5.868 10.397,-9.591 17.459,-10.098c95.668,-7.542 201.075,-44.593 248.483,-97.157c18.569,-20.59 20.661,44.193 -11.994,77.88c-34.92,36.026 -135.371,60.576 -235.27,64.436c-9.734,0.342 -18.513,-5.818 -21.502,-15.088c-0.006,0 -0.007,-0.002 -0.007,-0.003Z"));
		$t$0.close$($d$0);
		return $t$0;
	}
} imba.tags.define('logo-qvy3dz',Logo,{});

imba.inlineStyles("logo-qvy3dz:not(#_) {width: 200px;\ndisplay: block;\nmargin-top: 2.5rem;\nmargin-bottom: 2.5rem;\n--color: rgb(245, 224, 94);}\n\n.qvy3dzd:not(#_):not(#_) {fill: var(--color);}\n\n");
/*
logo-qvy3dz:not(#_) {width: 200px;
display: block;
margin-top: 2.5rem;
margin-bottom: 2.5rem;
--color: rgb(245, 224, 94);}

.qvy3dzd:not(#_):not(#_) {fill: var(--color);}


*/

var $1 = new WeakMap(), $2 = new WeakMap(), $3 = new WeakMap();
class State {
	static init$(){
		
		return this;
	}
	constructor(){
		
		
	}
	
	set token(value) {
		$1.set(this,value);
	}
	get token() {
		return $1.has(this) ? $1.get(this) : "0cc6c79b8dca4254edf6065e56ec8cbc04cb9014";
	}
	set aqis(value) {
		$2.set(this,value);
	}
	get aqis() {
		if (!$2.has(this)) { $2.set(this,[
			{
				id: 'usepa-aqi',
				name: "AQI"
			},
			{
				id: 'usepa-pm25',
				name: "PM2.5"
			},
			{
				id: 'usepa-pm10',
				name: "PM10"
			},
			{
				id: 'usepa-o3',
				name: "Ozone"
			},
			{
				id: 'usepa-no2',
				name: "Nitrogen Dioxide"
			},
			{
				id: 'usepa-so2',
				name: "Sulfur Dioxide "
			},
			{
				id: 'usepa-co',
				name: "Carbon Monoxide"
			},
			{
				id: 'asean-pm10',
				name: "Asean PM10"
			}
		]); }		return $2.get(this);
	}
	set stations(value) {
		$3.set(this,value);
	}
	get stations() {
		if (!$3.has(this)) { $3.set(this,[]); }		return $3.get(this);
	}
} State.init$();

var $1$1 = new WeakMap();

/* 
Imba has a revolutionary styling syntax. Think of a pre-processor, mixed with a css utility framework like tailwind, mixed with javascript.
Your styles will be compiled at build time, and there are no un-used styles or classes in your build.
The styles below are applied to the root and the body, and they are in the global scope because they are at the root level of the document.
And by the way, closing declarations with colons is optional.
*/



/*
The <app-root> component is explicitly coded into the body of the public/index.html file.
Any component then placed inside of the app-root component, will be injected into the dom.
As you can see we have a <Logo> component and a <Card> component inside of <self> which is the <app-root> component itself.
The <Logo> component is imported from a custom module found in the src/tags directory. 
The <Card> Component is declared lower in this same document to demonstrate that you can create multiple components in a single document.
You could create your entire app in a single document if you preferred. And components don't need to be created in any particular order.
*/


class AppRootComponent extends imba.tags.get('component','ImbaElement') {
	static init$(){
		
		return this;
	}
	init$(){
		super.init$();return undefined;
	}
	
	set state(value) {
		$1$1.set(this,value);
	}
	get state() {
		if (!$1$1.has(this)) { $1$1.set(this,new State); }		return $1$1.get(this);
	}
	
	async mount(){
		
		// Before displaying station it will be good to get the list of Ukrainian stations
		let url = "https://api.waqi.info/search/?keyword=Ukraine&token=" + this.state.token;
		let search_res = await this.loadData(url);
		this.state.stations = search_res.data;
		console.log(this.state.stations.length);
		return imba.commit();
	}
	
	async loadData(url){
		
		let res = await window.fetch(url);
		return res.json();
	}
	
	render(){
		var $c$0$1, $t$0, $c$0, $b$0, $d$0, $t$1, $t$2, $b$2, $d$2, $v$2, $t$3, $b$3, $d$3, $v$3;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$b$0 || ($t$1=imba.createElement('a',$t$0,null,null));
		$b$0 || ($t$1.href="http://v2.imba.io");
		$b$0 || ($t$1.target="_blank");
		$t$2 = ($b$2=$d$2=1,$c$0.e) || ($b$2=$d$2=0,$c$0.e=$t$2=imba.createComponent(Logo,$t$1,null,null));
		$b$2 || !$t$2.setup || $t$2.setup($d$2);
		$t$2.end$($d$2);
		$b$2 || $t$2.insertInto$($t$1);
		$b$0 || ($t$1=imba.createElement('section',$t$0,null,null));
		$b$0 || ($t$2=imba.createElement('h1',$t$1,null,"Карти показників якості повітря"));
		$t$2 = ($b$2=$d$2=1,$c$0.f) || ($b$2=$d$2=0,$c$0.f=$t$2=imba.createComponent(Maps,$t$1,null,null));
		$v$2=$c$0.g || ($c$0.g=$t$2.bind$('data',[null,'state']));
		$v$2[0]=this;
		$b$2 || !$t$2.setup || $t$2.setup($d$2);
		$t$2.end$($d$2);
		$b$2 || $t$2.insertInto$($t$1);
		$c$0$1 = null;if (this.state.stations.length > 0) { $c$0$1 = ($b$2=$d$2=1,$c$0.h) || ($b$2=$d$2=0,$c$0.h=$c$0$1=imba.createElement('section',null,null,null));
		$b$2||($c$0$1.up$=$t$0);
		$b$2 || ($t$3=imba.createElement('h1',$c$0$1,null,"Показники на українських станціях"));
		$t$3 = ($b$3=$d$3=1,$c$0.i) || ($b$3=$d$3=0,$c$0.i=$t$3=imba.createComponent(CityWidgets,$c$0$1,null,null));
		$v$3=$c$0.j || ($c$0.j=$t$3.bind$('data',[null,'state']));
		$v$3[0]=this;
		$b$3 || !$t$3.setup || $t$3.setup($d$3);
		$t$3.end$($d$3);
		$b$3 || $t$3.insertInto$($c$0$1); }
		($c$0.$c$0$1_ = $t$0.insert$($c$0$1,0,$c$0.$c$0$1_));		$t$0.close$($d$0);
		return $t$0;
	}
	
	/*
		Here we have some scoped CSS. Any css declared within a tag component is scoped to that component.
		The style will not trickle down to elements within nested components. 
		Scoped css will spare you a lot of classes and ID's to style what you want to style.
		And by plaing your styles within your component, it will help you separate concerns by components, rather than by technologies.
		All css properties and values are supported in Imba styles, but the most commonly used ones have a short aliases.
		For example: background-color -> bg, flex-direction -> fld, align-items -> ai, etc. 
		`&` is the selector for the component itself. 
		See if you can tell what styles are being applied.
		*/
	
	
	
	
} AppRootComponent.init$(); imba.tags.define('app-root',AppRootComponent,{});

imba.inlineStyles(":root,body {--u_radius: 5px;\npadding: 0rem;\nmargin: 0rem;\nbox-sizing: border-box;}\n\napp-root:not(#_) {display: flex;\nflex-direction: column;\nalign-items: center;\ntext-align: center;\nbackground: hsla(220.00,25.71%,13.73%,100%);\ncolor: hsla(270.00,100.00%,98.04%,100%);\nfont-family: Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;\nmin-height: 100vh;\npadding-bottom: 10vw;}\n\napp-root h1:not(#_) {text-align: left;\ntext-indent: 0.5em;}\n\n");
/*
:root,body {--u_radius: 5px;
padding: 0rem;
margin: 0rem;
box-sizing: border-box;}

app-root:not(#_) {display: flex;
flex-direction: column;
align-items: center;
text-align: center;
background: hsla(220.00,25.71%,13.73%,100%);
color: hsla(270.00,100.00%,98.04%,100%);
font-family: Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
min-height: 100vh;
padding-bottom: 10vw;}

app-root h1:not(#_) {text-align: left;
text-indent: 0.5em;}


*/
//# sourceMappingURL=app.imba.js.map
