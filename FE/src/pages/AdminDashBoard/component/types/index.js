// Type definitions for Appointment
/**
 * @typedef {Object} Appointment
 * @property {number} id
 * @property {string} status
 * @property {string} location
 * @property {string} resource
 * @property {string} address
 */

/**
 * @typedef {Object} Blockout
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} EventItem
 * @property {Date} [start]
 * @property {Date} [end]
 * @property {Object} [data]
 * @property {Appointment} [data.appointment]
 * @property {Blockout} [data.blockout]
 * @property {boolean} [isDraggable]
 * @property {number} [resourceId]
 */

// Exported types
/**
 * @type {Appointment}
 */
export const Appointment = {
    id: 0,
    status: "",
    location: "",
    resource: "",
    address: "",
  };
  
  /**
   * @type {Blockout}
   */
  export const Blockout = { id: 0, name: "" };
  
  /**
   * @type {EventItem}
   */
  export const EventItem = {
    start: undefined,
    end: undefined,
    data: {},
    isDraggable: false,
    resourceId: undefined,
  };
  