const { VariantServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");

const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");

const VariantController = {
  getVariants: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await VariantServices.getVariants();

      if (!totalItems) {
        return new NotFoundError(404, "No variants found!").send(res);
      }

      const variants = await VariantServices.getVariantsWithPage(
        PAGE_SIZE,
        currentPage
      );

      if (!variants) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, variants).send(res, {
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
  getVariantById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.getVariantById(id);

      if (!variant) {
        return new NotFoundError(404, {
          message: "Not found variant",
        });
      }

      return new GetResponse(200, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getVariantByCode: async (req, res) => {
    const { code } = req.params;

    if (!code) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.getVariantByCode(code);

      if (!variant) {
        return new NotFoundError(404, {
          message: "Not found variant",
        });
      }

      return new GetResponse(200, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createVariant: async (req, res) => {
    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    try {
      const newVariant = await VariantServices.createVariant(payload);

      if (!newVariant) {
        return new BadResquestError(400, {
          message: "Create variant failed",
        }).send(res);
      }

      return new CreatedResponse(201, newVariant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  addChildInVariant: async (req, res) => {
    const { id } = req.params;
    const { payload } = req.body;

    if (!id || !payload) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.addChildInVariant(id, payload);

      if (!variant) {
        return new BadResquestError(400, {
          message: "Add value in variant failed",
        }).send(res);
      }

      return new CreatedResponse(201, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateVariant: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !payload) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.updateVariant(id, payload);
      if (!variant) {
        return new BadResquestError(400, {
          message: "Update variant failed",
        });
      }

      return new CreatedResponse(201, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateChildInVariant: async (req, res) => {
    const { id } = req.params;
    const { children_id, ...payload } = req.body;

    if (!id || !children_id || !payload) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.updateChildInVariant(
        id,
        children_id,
        payload
      );

      if (!variant) {
        return new BadResquestError(400, {
          message: "Update variant failed",
        }).send(res);
      }

      return new CreatedResponse(201, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteVariant: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.deleteVariant(id);
      if (!variant) {
        return new BadResquestError(400, {
          message: "Delete variant failed",
        });
      }

      return new CreatedResponse(201, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteChildInVariant: async (req, res) => {
    const { parent_id, children_id } = req.body;

    if (!parent_id || !children_id) {
      return new BadResquestError().send(res);
    }

    try {
      const variant = await VariantServices.deleteChildInVariant(
        parent_id,
        children_id
      );

      if (!variant) {
        return new BadResquestError(400, {
          message: "Delete value in variant failed",
        }).send(res);
      }

      return new CreatedResponse(201, variant).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = VariantController;
