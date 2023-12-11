const { AttributeServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");

const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { removeUndefindedObj } = require("../../helpers/NestedObjectParse");

const AttributeController = {
  getAttributes: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await AttributeServices.getAttributes();

      if (!totalItems) {
        return new NotFoundError(404, "No attributes found!").send(res);
      }

      const attributes = await AttributeServices.getAttributesWithPage(
        PAGE_SIZE,
        currentPage
      );

      if (!attributes) {
        return new NotFoundError(404, "No attribute found!").send(res);
      }

      return new GetResponse(200, attributes).send(res, {
        optionName: "pagination",
        data: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getAttributesAvailable: async (req, res) => {
    const query = { public: true };
    try {
      const attributes = await AttributeServices.getAttributes(query);

      if (!attributes) {
        return new NotFoundError(404, "No attributes found!").send(res);
      }

      return new GetResponse(200, attributes).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getAttributeById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const attribute = await AttributeServices.getAttributeById(id);
      if (!attribute) {
        return new NotFoundError(404, "Not found attribute").send(res);
      }

      return new GetResponse(200, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getAttributeByCode: async (req, res) => {
    const { code } = req.params;

    if (!code) {
      return new BadResquestError().send(res);
    }

    try {
      const attribute = await AttributeServices.getAttributeByCode(code);

      if (!attribute) {
        return new NotFoundError(404, "Not found attribute");
      }

      return new GetResponse(200, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  searchAttributes: async (req, res) => {
    const { search, page } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;

    try {
      const totalItems = await AttributeServices.searchTextItems(search);

      if (!totalItems) {
        return new NotFoundError(
          404,
          `No attributes with title ${search}`
        ).send(res);
      }

      const items = await AttributeServices.searchTextWithPage(
        search,
        PAGE_SIZE,
        currentPage
      );

      if (!items) {
        return new NotFoundError(
          404,
          `No attributes with title ${search}`
        ).send(res);
      }

      return new GetResponse(200, items).send(res, {
        optionName: "pagination",
        data: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createAttribute: async (req, res) => {
    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const newAttribute = await AttributeServices.createAttribute(
        payloadParse
      );

      if (!newAttribute) {
        return new BadResquestError(400, "Create attribute failed").send(res);
      }

      return new CreatedResponse(201, newAttribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  addChildInAttribute: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !payload) {
      return new BadResquestError().send(res);
    }

    try {
      const attribute = await AttributeServices.addChildInAttribute(
        id,
        payload
      );

      if (!attribute) {
        return new BadResquestError(400, "Add value in attribute failed").send(
          res
        );
      }

      return new CreatedResponse(201, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateAttribute: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const attribute = await AttributeServices.updateAttribute(
        id,
        payloadParse
      );
      if (!attribute) {
        return new BadResquestError(400, "Update attribute failed");
      }

      return new CreatedResponse(201, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateChildInAttibute: async (req, res) => {
    const { id } = req.params;
    const { children_id, ...payload } = req.body;

    if (!id || !children_id || !payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const attribute = await AttributeServices.updateChildInAttribute(
        id,
        children_id,
        payloadParse
      );

      if (!attribute) {
        return new BadResquestError(400, "Update attribute failed").send(res);
      }

      return new CreatedResponse(201, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteAttribute: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const attribute = await AttributeServices.deleteAttribute(id);

      if (!attribute) {
        return new BadResquestError(400, "Delete attribute failed").send(res);
      }

      return new CreatedResponse(201, attribute).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteChildInAttribute: async (req, res) => {
    const { parent_id, children_id } = req.body;

    if (!parent_id || !children_id) {
      return new BadResquestError().send(res);
    }

    try {
      const attribute = await AttributeServices.deleteChildInAttribute(
        parent_id,
        children_id
      );

      if (!attribute) {
        return new BadResquestError(
          400,
          "Delete value in attribute failed"
        ).send(res);
      }

      return new CreatedResponse(201, attribute).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = AttributeController;
