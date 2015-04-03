define(function(){
	/*
	 * context will be used to execute step, condition and callback
	 */
	function Task(context, step, condition, callback){
		this.context = context;
		this.step = step;
		this.condition = condition;
		this.callback = callback;
		this.finished = false;
	};

	Task.prototype.tick = function(){
		if(!this.finished){
			this.step.call(this.context);
			this.finished = this.condition.call(this.context);
		}
	}

	var Scheduler = {
		queue: [],
		running: false,
		focus: null,
		Task: Task
	};

	Scheduler.queue_task = function(task){
		this.queue.push(task);
		if(!this.running){
			this.running = true;
			this.tick();
		}
	};

	Scheduler.set_focus = function(task){
		for(var i = 0; i < this.queue.length; i++){
			if(this.queue[i] === task) {
				//found it
				this.queue.splice(i, 1); //remove from middle
				this.queue.unshift(task); //put in first
				return true;
			}
		}
		return false;
	};

	//internal, do not call directly
	Scheduler.tick = function(){
		this.queue[0].tick();
		if(this.queue[0].finished){
			var done = this.queue.shift();
			if(typeof done.callback === 'function'){
				done.callback.call(done.context);
			}
		}
		
		if(this.queue.length === 0){
			this.running = false;
		} else {
			setTimeout(Scheduler.tick.bind(Scheduler), 0);
		}
	}
	
	return Scheduler;
});