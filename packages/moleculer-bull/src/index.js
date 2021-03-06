/*
 * moleculer-bull
 * Copyright (c) 2017 Ice Services (https://github.com/ice-services/moleculer-addons)
 * MIT Licensed
 */

"use strict";

let _ 		= require("lodash");
let Queue 	= require("bull");

module.exports = function createService(url, queueOpts) {

	/**
	 * Task queue mixin service for Bull
	 *
	 * @name moleculer-bull
	 * @module Service
	 */
	return {
		name: "bull",

		methods: {
			/**
			 * Create a new job
			 *
			 * @param {String} name
			 * @param {any} payload
			 * @returns {Job}
			 */
			createJob(name, payload) {
				this.getQueue(name).add(payload);
			},

			/**
			 * Get a queue by name
			 *
			 * @param {String} name
			 * @returns {Queue}
			 */
			getQueue(name) {
				if (!this.$queues[name]) {
					this.$queues[name] = Queue(name, url, queueOpts);
				}
				return this.$queues[name];
			}
		},

		created() {
			this.$queues = {};

			if (this.schema.queues) {
				_.forIn(this.schema.queues, (fn, name) => {
					this.getQueue(name).process(fn.bind(this));
				});
			}

			return this.Promise.resolve();
		}
	};
};
