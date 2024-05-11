const { BannerServices, CacheBannerServices } = require("../../services");

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
const getSelect = require("../../helpers/getSelect");
const { isValidObjectId } = require("mongoose");

const BannerController = {
  getBanners: async (req, res) => {
    try {
      const banners = await BannerServices.getBanners();

      return new GetResponse(200, banners).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getBannersWithPage: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await BannerServices.getBanners();

      const banners = await BannerServices.getBannersWithPage(
        PAGE_SIZE,
        currentPage
      );

      return new GetResponse(200, banners).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  uploadImage: async (req, res) => {
    const image = req.file.path;
    return new CreatedResponse(201, image).send(res);
  },
  getBannersWithPageInClient: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = getSelect(req.query);
    const query = { isShow: true };

    const cacheBanners = await CacheBannerServices.getCacheBanner(
      CacheBannerServices.KEY_BANNER
    );

    if (cacheBanners) {
      return new GetResponse(200, cacheBanners).send(res, {
        pagination: {
          totalItems: cacheBanners.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    }

    try {
      const totalItems = await BannerServices.getBanners(select, query);

      if (!totalItems) {
        return new NotFoundError(404, "No banner found!").send(res);
      }

      const banners = await BannerServices.getBannersWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      if (!banners) {
        return new NotFoundError(404, "No banner found!").send(res);
      }

      await CacheBannerServices.setCacheBanner(
        CacheBannerServices.KEY_BANNER,
        banners
      );

      return new GetResponse(200, banners).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getBanner: async (req, res) => {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const banner = await BannerServices.getBanner(id);
      if (!banner) {
        return new NotFoundError(404, "Not found banner").send(res);
      }

      return new GetResponse(200, banner).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createBanner: async (req, res) => {
    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const newBanner = await BannerServices.createBanner(payloadParse);

      if (!newBanner) {
        return new BadResquestError(400, "Create banner failed").send(res);
      }

      return new CreatedResponse(201, newBanner).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateBanner: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !isValidObjectId(id) || !payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const banner = await BannerServices.updateBanner(id, payloadParse);
      if (!banner) {
        return new BadResquestError(400, "Update banner failed");
      }

      return new CreatedResponse(201, banner).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },

  deleteBanner: async (req, res) => {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const banner = await BannerServices.deleteBanner(id);

      if (!banner) {
        return new BadResquestError(400, "Delete banner failed").send(res);
      }

      return new CreatedResponse(201, banner).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = BannerController;
