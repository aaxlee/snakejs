class Player {
	constructor(startpos, socket_id, color) {
		this.is_alive = 1;
		this.pos = startpos;
		this.dir = {
			left: false,
			right: false,
			up: false,
			down: false
		};
		this.tail = [

		];
		this.color = color;
		this.socket_id = socket_id;
		this.connected = 1;
		this.entity_type = "player";
	}
	update_snake(step_size) {
		let prev = { ...this.pos, dir: { ...this.dir }, parent_id: this.socket_id, entity_type: "tail" };
		if (this.dir.up) {
			this.pos.y -= step_size;
		} else if (this.dir.down) {
			this.pos.y += step_size
		} else if (this.dir.left) {
			this.pos.x -= step_size;
		} else if (this.dir.right) {
			this.pos.x += step_size;
		}

		if (this.tail.length > 0) {
			for (let j = 0; j < this.tail.length; j++) {
				let next = this.tail[j];
				this.tail[j] = prev;
				prev = next;
			}
		}
	}
	extend_tail(step_size) {
		let end;
		if (this.tail.length > 0) {
			end = this.tail[this.tail.length - 1];
		} else {
			end = { ...this.pos , dir: { ...this.dir }, parent_id: this.socket_id, entity_type: "tail" };
		}
		let new_end = JSON.parse(JSON.stringify(end));
		if (new_end.dir.up) {
			new_end.y += step_size;
		} else if (new_end.dir.down) {
			new_end.y -= step_size;
		} else if (new_end.dir.left) {
			new_end.x += step_size;
		} else if (new_end.dir.right) {
			new_end.x -= step_size;
		}

		this.tail.push(new_end);
	}
	warp(state) {
		if (this.pos.x < 0) {
			this.pos.x = state.width - state.grid_size;
		} else if (this.pos.x > state.width - state.grid_size) {
			this.pos.x = 0;
		} else if (this.pos.y < 0) {
			this.pos.y = state.height - state.grid_size;
		} else if (this.pos.y > state.height - state.grid_size) {
			this.pos.y = 0;
		}
	}
}

module.exports = Player;
