class Persistence {
  /**
   * Create a KoaResterPersistence
   * @param  {Object} model The ORM native model to be wrapped, in this case as
   * there is no ORM it will be an empty object.
   * @return {Persistence}
   */
  constructor (model) {
    this.data = []
    this.model = model
  }
  /**
   * If id is provided, it tries to get the element with the given id.
   * It will throw an error if no element is found. If no id is provided
   * lists all the stored items.
   *
   * @async
   * @param  {Number} id
   * @return {Promise} Resolved with the object or the array of objects or
   * rejected with an error.
   */
  list (id) {
    if (id) {
      const el = this.data[id]
      if (el) return Promise.resolve(el)
      const err = new Error('Resource not found')
      err.status = 404
      err.data = {}
      return Promise.reject(err)
    }
    return Promise.resolve(this.data)
  }
  /**
   * Creates a new object with the given data.
   *
   * @param  {Object} data
   * @return {Promise} Resolved with the new object or rejected with an error.
   */
  create (data) {
    const err = this.validate(data)
    if (err) return Promise.reject(err)
    this.data.push(data)
    return Promise.resolve(this.data.length - 1)
  }
  /**
   * Updates an existing object with the given data.
   *
   * @param  {Number}  id - The object id
   * @param  {Object}  data - The fields to be updated
   * @return {Promise} Resolved with the old object or rejected with an error.
   */
  async update (id, data) {
    try {
      const el = await this.list(id)
      const err = this.validate({ ...el, ...data })
      if (err) return Promise.reject(err)
      this.data[id] = { ...el, ...data }
      return Promise.resolve(el)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * Replaces an existing object by a new one created with the given data.
   *
   * @param  {Number}  id - The id of the object to be replaced
   * @param  {Object}  data - The new object data
   * @return {Promise} Resolved with the old object or rejected with an error.
   */
  async replace (id, data) {
    try {
      const el = await this.list(id)
      const err = this.validate(data)
      if (err) return Promise.reject(err)
      this.data[id] = data
      return Promise.resolve(el)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * Deletes an existing object.
   *
   * @param  {Number}  id - The id of the object to be deleted
   * @return {Promise} Resolved with the removed object or rejected with an error.
   */
  async delete (id) {
    try {
      const el = await this.list(id)
      this.data.splice(id, 1)
      return Promise.resolve(el)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * Validates the data before creating the object
   *
   * @param  {Object} data
   * @return {Error} An error or null.
   */
  validate (data) {
    if (data.valid) return null
    const err = new Error('Invalid data')
    err.status = 400
    err.data = { valid: 'should be true' }
    return err
  }
}

module.exports = Persistence
