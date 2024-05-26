const { BlogServices, TagBlogServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");

const { GetResponse } = require("../../helpers/successResponse");
const { removeUndefindedObj } = require("../../helpers/NestedObjectParse");
const getSelect = require("../../helpers/getSelect");
const { isValidObjectId } = require("mongoose");

const UserBlogController = {
  getBlogsWithPage: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = {
      title: 1,
      thumbnail: 1,
      slug: 1,
      shortDescription: 1,
      tag: 1,
    };

    const query = {
      public: true,
    };

    try {
      const totalItems = await BlogServices.getBlogs(select, query);

      if (!totalItems) {
        return new NotFoundError(404, "No banner found!").send(res);
      }

      const banners = await BlogServices.getBlogsWithPage(
        PAGE_SIZE,
        currentPage,
        select
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
  getBlog: async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      return new BadResquestError().send(res);
    }

    try {
      const blog = await BlogServices.getBlogBySlug(slug);
      if (!blog) {
        return new NotFoundError(404, "Not found banner").send(res);
      }

      return new GetResponse(200, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getTagsWithPage: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = {
      // title: 1,
      // thumbnail: 1,
      // slug: 1,
    };

    try {
      const totalItems = await TagBlogServices.getTags(select);

      const tags = await TagBlogServices.getTagsWithPage(
        PAGE_SIZE,
        currentPage,
        select
      );

      return new GetResponse(200, tags).send(res, {
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
  getTag: async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      return new BadResquestError().send(res);
    }

    try {
      const tag = await TagBlogServices.getTagBySlug(slug);
      if (!tag || tag.isDeleted) {
        return new NotFoundError(404, "Not found tag blog").send(res);
      }

      return new GetResponse(200, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [SEARCH BLOG]
  searchBlog: async (req, res) => {
    const { search = "", tag, page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? Number(limit) : PAGE_SIZE;

    const select = getSelect(req.query, ["search", "tag"]);

    let query = { public: true };

    if (tag) {
      const listTag = [...tag];
      for (let i = 0; i < listTag.length; i++) {
        if (!isValidObjectId(listTag[i])) {
          return new GetResponse(200, []).send(res, {
            pagination: {
              totalItems: 0,
              currentPage,
              pageSize: limitQuery,
            },
          });
        }
      }

      query = { ...query, tags: { $in: tag } };
    }

    try {
      const totalItems = await BlogServices.searchTextItems(search, query);

      const blogs = await BlogServices.searchTextWithPage(
        search,
        limitQuery,
        currentPage,
        query,
        select
      );

      return new GetResponse(200, blogs).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: limitQuery,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [SEARCH TAG BLOG]
  searchTag: async (req, res) => {
    const { search = "", page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? Number(limit) : PAGE_SIZE;

    const select = getSelect(req.query, ["search"]);
    let query = {};

    try {
      const totalItems = await TagBlogServices.searchTextItems(search, query);

      const tags = await TagBlogServices.searchTextWithPage(
        search,
        limitQuery,
        currentPage,
        query,
        select
      );

      return new GetResponse(200, tags).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: limitQuery,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = UserBlogController;
