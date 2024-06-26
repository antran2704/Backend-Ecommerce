const statusRes = {
  GET: 200,
  CREATED: 201,
};

class SuccessResponse {
  constructor(status = statusRes.GE, payload) {
    this.status = status;
    this.payload = payload;
  }

  send(res, options) {
    return res.status(this.status).json({...this, ...options});
  }
}

class GetResponse extends SuccessResponse {
  constructor(status = statusRes.GET, payload) {
    super(status, payload);
  }
}

class CreatedResponse extends SuccessResponse {
  constructor(status = statusRes.CREATED, payload) {
    super(status, payload);
  }
}

module.exports = { GetResponse, CreatedResponse };
