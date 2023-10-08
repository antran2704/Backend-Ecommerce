const errorMessage = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  500: "Error in server",
};

class ErrorResponse {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

class BadResquestError extends ErrorResponse {
  constructor(status = 400, message = errorMessage[400]) {
    super(status, message);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(status = 401, message = errorMessage[401]) {
    super(status, message);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(status = 403, message = errorMessage[403]) {
    super(status, message);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(status = 404, message = errorMessage[404]) {
    super(status, message);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(status = 500, message = errorMessage[500]) {
    super(status, message);
  }
}

module.exports = {
  BadResquestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
